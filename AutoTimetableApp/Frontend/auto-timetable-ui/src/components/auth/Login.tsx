import React, { useState } from 'react';
import { Typography, Paper, TextField, Button, FormControl, FormHelperText, Grid, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
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
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      // حفظ رمز المصادقة في التخزين المحلي
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // الانتقال إلى لوحة التحكم
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      setErrorMessage(error.response?.data?.message || 'حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRegisterClick = () => {
    navigate('/register');
  };
  
  return (
    <div className="auth-container">
      <Paper elevation={3} className="auth-paper">
        <Typography variant="h4" className="auth-title">
          تسجيل الدخول
        </Typography>
        
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errorMessage}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
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
            
            <Grid item xs={12}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                fullWidth
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
              </Button>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="body2" align="center">
                ليس لديك حساب؟{' '}
                <Button 
                  color="primary" 
                  onClick={handleRegisterClick}
                  sx={{ p: 0, minWidth: 'auto' }}
                >
                  إنشاء حساب جديد
                </Button>
              </Typography>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </div>
  );
};

export default Login;
