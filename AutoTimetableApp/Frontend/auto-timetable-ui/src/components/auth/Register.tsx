import React, { useState } from 'react';
import { Typography, Paper, TextField, Button, FormControl, FormHelperText, Grid, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    schoolName: ''
  });
  
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // مسح الخطأ عند تغيير القيمة
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
    
    // مسح رسالة الخطأ العامة
    setErrorMessage('');
  };
  
  const validateForm = (): boolean => {
    const newErrors: any = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صالح';
    }
    
    if (!formData.password) {
      newErrors.password = 'كلمة المرور مطلوبة';
    } else if (formData.password.length < 6) {
      newErrors.password = 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'تأكيد كلمة المرور مطلوب';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'كلمات المرور غير متطابقة';
    }
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'الاسم الأول مطلوب';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'الاسم الأخير مطلوب';
    }
    
    if (!formData.schoolName.trim()) {
      newErrors.schoolName = 'اسم المدرسة مطلوب';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');
    setSuccess(false);
    
    try {
      // استبعاد حقل confirmPassword من البيانات المرسلة
      const { confirmPassword, ...registerData } = formData;
      
      await axios.post('http://localhost:5000/api/auth/register', registerData);
      
      setSuccess(true);
      
      // بعد 2 ثانية، الانتقال إلى صفحة تسجيل الدخول
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error: any) {
      console.error('Registration error:', error);
      setErrorMessage(error.response?.data?.message || 'حدث خطأ أثناء إنشاء الحساب');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLoginClick = () => {
    navigate('/login');
  };
  
  return (
    <div className="auth-container">
      <Paper elevation={3} className="auth-paper">
        <Typography variant="h4" className="auth-title">
          إنشاء حساب جديد
        </Typography>
        
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errorMessage}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            تم إنشاء الحساب بنجاح! جاري الانتقال إلى صفحة تسجيل الدخول...
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.firstName}>
                <TextField
                  label="الاسم الأول"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  variant="outlined"
                  error={!!errors.firstName}
                  required
                />
                {errors.firstName && <FormHelperText>{errors.firstName}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.lastName}>
                <TextField
                  label="الاسم الأخير"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  variant="outlined"
                  error={!!errors.lastName}
                  required
                />
                {errors.lastName && <FormHelperText>{errors.lastName}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.email}>
                <TextField
                  label="البريد الإلكتروني"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  variant="outlined"
                  error={!!errors.email}
                  required
                />
                {errors.email && <FormHelperText>{errors.email}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.schoolName}>
                <TextField
                  label="اسم المدرسة"
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleChange}
                  variant="outlined"
                  error={!!errors.schoolName}
                  required
                />
                {errors.schoolName && <FormHelperText>{errors.schoolName}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.password}>
                <TextField
                  label="كلمة المرور"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  variant="outlined"
                  error={!!errors.password}
                  required
                />
                {errors.password && <FormHelperText>{errors.password}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.confirmPassword}>
                <TextField
                  label="تأكيد كلمة المرور"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  variant="outlined"
                  error={!!errors.confirmPassword}
                  required
                />
                {errors.confirmPassword && <FormHelperText>{errors.confirmPassword}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                fullWidth
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {isLoading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
              </Button>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="body2" align="center">
                لديك حساب بالفعل؟{' '}
                <Button 
                  color="primary" 
                  onClick={handleLoginClick}
                  sx={{ p: 0, minWidth: 'auto' }}
                >
                  تسجيل الدخول
                </Button>
              </Typography>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </div>
  );
};

export default Register;
