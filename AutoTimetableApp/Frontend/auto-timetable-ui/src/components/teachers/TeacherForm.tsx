import React, { useState, useEffect } from 'react';
import { Typography, Paper, TextField, Button, FormControl, FormHelperText, Grid, InputLabel, Select, MenuItem } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

interface TeacherFormData {
  name: string;
  email: string;
  phone: string;
  specialization: string;
}

const TeacherForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState<TeacherFormData>({
    name: '',
    email: '',
    phone: '',
    specialization: ''
  });
  
  const [errors, setErrors] = useState<Partial<TeacherFormData>>({});

  // في تطبيق حقيقي، هذه البيانات ستأتي من API
  const specializations = [
    'الرياضيات',
    'اللغة العربية',
    'العلوم',
    'اللغة الإنجليزية',
    'التاريخ',
    'الجغرافيا',
    'التربية الإسلامية',
    'التربية البدنية',
    'الحاسب الآلي'
  ];

  useEffect(() => {
    if (isEditMode) {
      // في تطبيق حقيقي، هنا سيتم استدعاء API للحصول على بيانات المعلم
      // هذه بيانات وهمية للعرض فقط
      const mockTeacher = {
        id: parseInt(id as string),
        name: id === '1' ? 'أحمد محمد' : id === '2' ? 'سارة أحمد' : 'محمد علي',
        email: id === '1' ? 'ahmed@school.com' : id === '2' ? 'sara@school.com' : 'mohamed@school.com',
        phone: id === '1' ? '0501234567' : id === '2' ? '0507654321' : '0509876543',
        specialization: id === '1' ? 'الرياضيات' : id === '2' ? 'اللغة العربية' : 'العلوم'
      };
      
      setFormData({
        name: mockTeacher.name,
        email: mockTeacher.email,
        phone: mockTeacher.phone,
        specialization: mockTeacher.specialization
      });
    }
  }, [id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value
    }));
    
    // مسح الخطأ عند تغيير القيمة
    if (errors[name as keyof TeacherFormData]) {
      setErrors(prev => ({
        ...prev,
        [name as string]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<TeacherFormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'اسم المعلم مطلوب';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صالح';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'رقم الهاتف مطلوب';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'رقم الهاتف يجب أن يتكون من 10 أرقام';
    }
    
    if (!formData.specialization) {
      newErrors.specialization = 'التخصص مطلوب';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // في تطبيق حقيقي، هنا سيتم استدعاء API لحفظ البيانات
    console.log('Form data submitted:', formData);
    
    // العودة إلى صفحة قائمة المعلمين
    navigate('/teachers');
  };

  return (
    <div>
      <Typography variant="h4" className="page-title">
        {isEditMode ? 'تعديل معلم' : 'إضافة معلم جديد'}
      </Typography>
      
      <Paper elevation={3} className="form-container">
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.name}>
                <TextField
                  label="اسم المعلم"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  variant="outlined"
                  error={!!errors.name}
                  required
                />
                {errors.name && <FormHelperText>{errors.name}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
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
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.phone}>
                <TextField
                  label="رقم الهاتف"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  variant="outlined"
                  error={!!errors.phone}
                  required
                />
                {errors.phone && <FormHelperText>{errors.phone}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.specialization}>
                <InputLabel>التخصص</InputLabel>
                <Select
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  label="التخصص"
                  required
                >
                  {specializations.map(spec => (
                    <MenuItem key={spec} value={spec}>{spec}</MenuItem>
                  ))}
                </Select>
                {errors.specialization && <FormHelperText>{errors.specialization}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} className="action-buttons">
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
              >
                {isEditMode ? 'حفظ التغييرات' : 'إضافة المعلم'}
              </Button>
              
              <Button 
                variant="outlined" 
                color="secondary" 
                onClick={() => navigate('/teachers')}
              >
                إلغاء
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </div>
  );
};

export default TeacherForm;
