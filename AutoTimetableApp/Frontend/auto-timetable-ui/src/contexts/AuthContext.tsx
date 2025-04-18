import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  schoolName: string;
  subscriptionTier: string;
  subscriptionExpiryDate: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  upgradeSubscription: (tier: string, durationMonths: number) => Promise<void>;
  hasPermission: (feature: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // التحقق من وجود المستخدم في التخزين المحلي عند تحميل التطبيق
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
        
        // إعداد الرمز في رأس الطلبات
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      
      const { token, user } = response.data;
      
      // حفظ البيانات في التخزين المحلي
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // إعداد الرمز في رأس الطلبات
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    setIsLoading(true);
    
    try {
      await axios.post('http://localhost:5000/api/auth/register', userData);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // حذف البيانات من التخزين المحلي
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // حذف الرمز من رأس الطلبات
    delete axios.defaults.headers.common['Authorization'];
    
    setUser(null);
    navigate('/login');
  };

  const upgradeSubscription = async (tier: string, durationMonths: number) => {
    if (!user) {
      throw new Error('المستخدم غير مسجل الدخول');
    }
    
    setIsLoading(true);
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/upgrade-subscription', {
        userId: user.id,
        subscriptionTier: tier,
        durationMonths
      });
      
      // تحديث بيانات المستخدم
      const updatedUser = {
        ...user,
        subscriptionTier: response.data.subscriptionTier,
        subscriptionExpiryDate: response.data.subscriptionExpiryDate
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Subscription upgrade error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // التحقق من صلاحيات المستخدم بناءً على مستوى الاشتراك
  const hasPermission = (feature: string): boolean => {
    if (!user) return false;
    
    const tier = user.subscriptionTier;
    
    // التحقق من صلاحية الاشتراك
    const subscriptionExpired = new Date(user.subscriptionExpiryDate) < new Date();
    if (subscriptionExpired && tier !== 'Free') {
      return hasFeaturePermission('Free', feature);
    }
    
    return hasFeaturePermission(tier, feature);
  };

  // تحديد الصلاحيات حسب مستوى الاشتراك والميزة المطلوبة
  const hasFeaturePermission = (tier: string, feature: string): boolean => {
    const permissions: Record<string, Record<string, boolean | number>> = {
      'Free': {
        'max_classes': 1,
        'max_divisions': 2,
        'max_teachers': 5,
        'max_subjects': 10,
        'max_timetables_per_month': 1,
        'can_export_pdf': false,
        'can_export_excel': false,
        'can_edit_manually': false
      },
      'Basic': {
        'max_classes': 3,
        'max_divisions': 6,
        'max_teachers': 15,
        'max_subjects': 20,
        'max_timetables_per_month': 10,
        'can_export_pdf': true,
        'can_export_excel': false,
        'can_edit_manually': false
      },
      'Premium': {
        'max_classes': 10,
        'max_divisions': 20,
        'max_teachers': 50,
        'max_subjects': 100,
        'max_timetables_per_month': Infinity,
        'can_export_pdf': true,
        'can_export_excel': true,
        'can_edit_manually': true
      },
      'Enterprise': {
        'max_classes': Infinity,
        'max_divisions': Infinity,
        'max_teachers': Infinity,
        'max_subjects': Infinity,
        'max_timetables_per_month': Infinity,
        'can_export_pdf': true,
        'can_export_excel': true,
        'can_edit_manually': true
      }
    };
    
    // التحقق من وجود الميزة في قائمة الصلاحيات
    if (!(feature in permissions[tier])) {
      return false;
    }
    
    const permission = permissions[tier][feature];
    
    // إذا كانت الصلاحية رقمية (حد أقصى)، نعتبرها صالحة إذا كانت أكبر من 0
    if (typeof permission === 'number') {
      return permission > 0;
    }
    
    // إذا كانت الصلاحية منطقية (نعم/لا)
    return permission === true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        upgradeSubscription,
        hasPermission
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
