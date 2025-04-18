import React, { useState, useEffect } from 'react';
import { Typography, Paper, TextField, Button, FormControl, FormHelperText, Grid, InputLabel, Select, MenuItem } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

interface SubjectFormData {
  name: string;
  description: string;
  weeklyHours: string;
}

const SubjectForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState<SubjectFormData>({
    name: '',
    description: '',
    weeklyHours: ''
  });
  
  const [errors, setErrors] = useState<Partial<SubjectFormData>>({});

  useEffect(() => {
    if (isEditMode) {
      // في تطبيق حقيقي، هنا سيتم استدعاء API للحصول على بيانات المادة
      // هذه بيانات وهمية للعرض فقط
      const mockSubject = {
        id: parseInt(id as string),
        name: id === '1' ? 'الرياضيات' : id === '2' ? 'اللغة العربية' : 'العلوم',
        description: `وصف مادة ${id === '1' ? 'الرياضيات' : id === '2' ? 'اللغة العربية' : 'العلوم'} للمرحلة الابتدائية`,
        weeklyHours: id === '1' ? 5 : id === '2' ? 6 : 4
      };
      
      setFormData({
        name: mockSubject.name,
        description: mockSubject.description,
        weeklyHours: mockSubject.weeklyHours.toString()
      });
    }
  }, [id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // مسح الخطأ عند تغيير القيمة
    if (errors[name as keyof SubjectFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<SubjectFormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'اسم المادة مطلوب';
    }
    
    if (!formData.weeklyHours.trim()) {
      newErrors.weeklyHours = 'عدد الساعات الأسبوعية مطلوب';
    } else if (isNaN(Number(formData.weeklyHours)) || Number(formData.weeklyHours) <= 0) {
      newErrors.weeklyHours = 'يجب أن يكون عدد الساعات الأسبوعية رقماً موجباً';
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
    
    // العودة إلى صفحة قائمة المواد
    navigate('/subjects');
  };

  return (
    <div>
      <Typography variant="h4" className="page-title">
        {isEditMode ? 'تعديل مادة' : 'إضافة مادة جديدة'}
      </Typography>
      
      <Paper elevation={3} className="form-container">
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.name}>
                <TextField
                  label="اسم المادة"
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
            
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField
                  label="الوصف"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  variant="outlined"
                  multiline
                  rows={3}
                />
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.weeklyHours}>
                <TextField
                  label="عدد الساعات الأسبوعية"
                  name="weeklyHours"
                  type="number"
                  value={formData.weeklyHours}
                  onChange={handleChange}
                  variant="outlined"
                  error={!!errors.weeklyHours}
                  required
                  inputProps={{ min: 1 }}
                />
                {errors.weeklyHours && <FormHelperText>{errors.weeklyHours}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} className="action-buttons">
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
              >
                {isEditMode ? 'حفظ التغييرات' : 'إضافة المادة'}
              </Button>
              
              <Button 
                variant="outlined" 
                color="secondary" 
                onClick={() => navigate('/subjects')}
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

export default SubjectForm;
