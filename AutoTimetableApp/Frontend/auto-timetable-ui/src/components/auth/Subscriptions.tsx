import React, { useState, useEffect } from 'react';
import { Typography, Paper, Button, Grid, Card, CardContent, CardActions, CardHeader, Divider, Chip, Alert, CircularProgress } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface SubscriptionPlan {
  id: string;
  name: string;
  tier: string;
  price: number;
  duration: number;
  features: string[];
}

const Subscriptions: React.FC = () => {
  const navigate = useNavigate();
  
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // خطط الاشتراك المتاحة
  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: 'free',
      name: 'المجاني',
      tier: 'Free',
      price: 0,
      duration: 0,
      features: [
        'إدارة صف واحد',
        'إدارة قسمين كحد أقصى',
        'إدارة 5 معلمين كحد أقصى',
        'إدارة 10 مواد كحد أقصى',
        'إنشاء جدول زمني واحد شهرياً'
      ]
    },
    {
      id: 'basic',
      name: 'الأساسي',
      tier: 'Basic',
      price: 9.99,
      duration: 1,
      features: [
        'إدارة 3 صفوف',
        'إدارة 6 أقسام',
        'إدارة 15 معلم',
        'إدارة 20 مادة',
        'إنشاء 10 جداول زمنية شهرياً',
        'تصدير الجداول الزمنية بصيغة PDF'
      ]
    },
    {
      id: 'premium',
      name: 'المتميز',
      tier: 'Premium',
      price: 19.99,
      duration: 1,
      features: [
        'إدارة 10 صفوف',
        'إدارة 20 قسم',
        'إدارة 50 معلم',
        'إدارة 100 مادة',
        'إنشاء جداول زمنية غير محدودة',
        'تصدير الجداول الزمنية بصيغة PDF و Excel',
        'تعديل الجداول الزمنية يدوياً',
        'دعم فني متميز'
      ]
    },
    {
      id: 'enterprise',
      name: 'المؤسسات',
      tier: 'Enterprise',
      price: 49.99,
      duration: 1,
      features: [
        'إدارة صفوف غير محدودة',
        'إدارة أقسام غير محدودة',
        'إدارة معلمين غير محدودة',
        'إدارة مواد غير محدودة',
        'إنشاء جداول زمنية غير محدودة',
        'تصدير الجداول الزمنية بجميع الصيغ',
        'تعديل الجداول الزمنية يدوياً',
        'دعم فني متميز على مدار الساعة',
        'تخصيص النظام حسب احتياجات المؤسسة'
      ]
    }
  ];
  
  useEffect(() => {
    // استرجاع بيانات المستخدم من التخزين المحلي
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    } else {
      // إذا لم يكن المستخدم مسجل الدخول، الانتقال إلى صفحة تسجيل الدخول
      navigate('/login');
    }
  }, [navigate]);
  
  const handleUpgradeSubscription = async (plan: SubscriptionPlan) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      // في تطبيق حقيقي، هنا سيتم الانتقال إلى صفحة الدفع أولاً
      // ثم بعد إتمام عملية الدفع بنجاح، سيتم ترقية الاشتراك
      
      // محاكاة لعملية الدفع والترقية
      const response = await axios.post('http://localhost:5000/api/auth/upgrade-subscription', {
        userId: user.id,
        subscriptionTier: plan.tier,
        durationMonths: plan.duration
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // تحديث بيانات المستخدم في التخزين المحلي
      const updatedUser = {
        ...user,
        subscriptionTier: response.data.subscriptionTier,
        subscriptionExpiryDate: response.data.subscriptionExpiryDate
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      setSuccessMessage(`تم ترقية اشتراكك إلى "${plan.name}" بنجاح!`);
    } catch (error: any) {
      console.error('Subscription upgrade error:', error);
      setErrorMessage(error.response?.data?.message || 'حدث خطأ أثناء ترقية الاشتراك');
    } finally {
      setIsLoading(false);
    }
  };
  
  const getCurrentPlanId = (): string => {
    if (!user) return 'free';
    
    switch (user.subscriptionTier) {
      case 'Basic':
        return 'basic';
      case 'Premium':
        return 'premium';
      case 'Enterprise':
        return 'enterprise';
      default:
        return 'free';
    }
  };
  
  const currentPlanId = getCurrentPlanId();
  
  return (
    <div>
      <Typography variant="h4" className="page-title">
        الاشتراكات
      </Typography>
      
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}
      
      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}
      
      {user && (
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            اشتراكك الحالي
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body1">
                <strong>المستوى:</strong> {user.subscriptionTier === 'Free' ? 'المجاني' : 
                                         user.subscriptionTier === 'Basic' ? 'الأساسي' : 
                                         user.subscriptionTier === 'Premium' ? 'المتميز' : 'المؤسسات'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1">
                <strong>تاريخ الانتهاء:</strong> {new Date(user.subscriptionExpiryDate).toLocaleDateString('ar-SA')}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      )}
      
      <Typography variant="h5" gutterBottom>
        خطط الاشتراك المتاحة
      </Typography>
      
      <Grid container spacing={3}>
        {subscriptionPlans.map((plan) => (
          <Grid item xs={12} sm={6} md={3} key={plan.id}>
            <Card 
              elevation={3}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                ...(plan.id === currentPlanId ? { border: '2px solid #4caf50' } : {})
              }}
            >
              <CardHeader
                title={plan.name}
                titleTypographyProps={{ align: 'center', variant: 'h5' }}
                sx={{
                  backgroundColor: plan.id === 'free' ? '#f5f5f5' : 
                                  plan.id === 'basic' ? '#e3f2fd' : 
                                  plan.id === 'premium' ? '#fff8e1' : '#e8f5e9'
                }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                  <Typography component="h2" variant="h3" color="text.primary">
                    {plan.price === 0 ? 'مجاناً' : `$${plan.price}`}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    {plan.price === 0 ? '' : '/شهرياً'}
                  </Typography>
                </div>
                <Divider sx={{ my: 2 }} />
                <ul style={{ paddingLeft: 0, listStyleType: 'none' }}>
                  {plan.features.map((feature) => (
                    <li key={feature} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <CheckIcon color="success" sx={{ mr: 1 }} />
                      <Typography variant="body2" component="span">
                        {feature}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  variant={plan.id === currentPlanId ? 'outlined' : 'contained'}
                  color={plan.id === currentPlanId ? 'success' : 'primary'}
                  disabled={isLoading || plan.id === currentPlanId}
                  onClick={() => handleUpgradeSubscription(plan)}
                >
                  {isLoading ? <CircularProgress size={24} /> : 
                   plan.id === currentPlanId ? 'الاشتراك الحالي' : 
                   plan.id === 'free' ? 'استخدام المجاني' : 'ترقية الاشتراك'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Subscriptions;
