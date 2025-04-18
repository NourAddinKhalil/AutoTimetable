import React, { useState, useEffect } from 'react';
import { Typography, Paper, TextField, Button, FormControl, FormHelperText, Grid } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

interface ClassFormData {
  name: string;
  description: string;
}

const ClassForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState<ClassFormData>({
    name: '',
    description: ''
  });
  
  const [errors, setErrors] = useState<Partial<ClassFormData>>({});

  useEffect(() => {
    if (isEditMode) {
      // في تطبيق حقيقي، هنا سيتم استدعاء API للحصول على بيانات الصف
      // هذه بيانات وهمية للعرض فقط
      const mockClass = {
        id: parseInt(id as string),
        name: `الصف ${id}`,
        description: `المرحلة الابتدائية - الصف ${id}`
      };
      
      setFormData({
        name: mockClass.name,
        description: mockClass.description
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
    if (errors[name as keyof ClassFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ClassFormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'اسم الصف مطلوب';
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
    
    // العودة إلى صفحة قائمة الصفوف
    navigate('/classes');
  };

  return (
    <div>
      <Typography variant="h4" className="page-title">
        {isEditMode ? 'تعديل صف' : 'إضافة صف جديد'}
      </Typography>
      
      <Paper elevation={3} className="form-container">
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.name}>
                <TextField
                  label="اسم الصف"
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
            
            <Grid item xs={12} className="action-buttons">
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
              >
                {isEditMode ? 'حفظ التغييرات' : 'إضافة الصف'}
              </Button>
              
              <Button 
                variant="outlined" 
                color="secondary" 
                onClick={() => navigate('/classes')}
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

export default ClassForm;
