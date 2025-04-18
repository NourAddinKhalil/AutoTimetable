import React, { useState, useEffect } from 'react';
import { Typography, Paper, TextField, Button, FormControl, FormHelperText, Grid, InputLabel, Select, MenuItem } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

interface DivisionFormData {
  name: string;
  classId: string;
}

const DivisionForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState<DivisionFormData>({
    name: '',
    classId: ''
  });
  
  const [errors, setErrors] = useState<Partial<DivisionFormData>>({});

  // في تطبيق حقيقي، هذه البيانات ستأتي من API
  const mockClasses = [
    { id: 1, name: 'الصف الأول' },
    { id: 2, name: 'الصف الثاني' },
    { id: 3, name: 'الصف الثالث' },
  ];

  useEffect(() => {
    if (isEditMode) {
      // في تطبيق حقيقي، هنا سيتم استدعاء API للحصول على بيانات القسم
      // هذه بيانات وهمية للعرض فقط
      const mockDivision = {
        id: parseInt(id as string),
        name: `القسم ${id === '1' ? 'أ' : 'ب'}`,
        classId: id === '1' || id === '2' ? 1 : 2
      };
      
      setFormData({
        name: mockDivision.name,
        classId: mockDivision.classId.toString()
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
    if (errors[name as keyof DivisionFormData]) {
      setErrors(prev => ({
        ...prev,
        [name as string]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<DivisionFormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'اسم القسم مطلوب';
    }
    
    if (!formData.classId) {
      newErrors.classId = 'الصف مطلوب';
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
    
    // العودة إلى صفحة قائمة الأقسام
    navigate('/divisions');
  };

  return (
    <div>
      <Typography variant="h4" className="page-title">
        {isEditMode ? 'تعديل قسم' : 'إضافة قسم جديد'}
      </Typography>
      
      <Paper elevation={3} className="form-container">
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.name}>
                <TextField
                  label="اسم القسم"
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
              <FormControl fullWidth error={!!errors.classId}>
                <InputLabel>الصف</InputLabel>
                <Select
                  name="classId"
                  value={formData.classId}
                  onChange={handleChange}
                  label="الصف"
                  required
                >
                  {mockClasses.map(c => (
                    <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                  ))}
                </Select>
                {errors.classId && <FormHelperText>{errors.classId}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} className="action-buttons">
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
              >
                {isEditMode ? 'حفظ التغييرات' : 'إضافة القسم'}
              </Button>
              
              <Button 
                variant="outlined" 
                color="secondary" 
                onClick={() => navigate('/divisions')}
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

export default DivisionForm;
