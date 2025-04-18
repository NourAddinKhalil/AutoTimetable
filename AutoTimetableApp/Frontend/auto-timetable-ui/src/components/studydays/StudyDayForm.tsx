import React, { useState, useEffect } from 'react';
import { Typography, Paper, TextField, Button, FormControl, FormHelperText, Grid, InputLabel, Select, MenuItem } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

interface StudyDayFormData {
  classId: string;
  dayOfWeek: string;
  sessionsCount: string;
}

const StudyDayForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState<StudyDayFormData>({
    classId: '',
    dayOfWeek: '',
    sessionsCount: ''
  });
  
  const [errors, setErrors] = useState<Partial<StudyDayFormData>>({});

  // في تطبيق حقيقي، هذه البيانات ستأتي من API
  const mockClasses = [
    { id: 1, name: 'الصف الأول' },
    { id: 2, name: 'الصف الثاني' },
    { id: 3, name: 'الصف الثالث' },
  ];

  const daysOfWeek = [
    'الأحد',
    'الاثنين',
    'الثلاثاء',
    'الأربعاء',
    'الخميس',
    'الجمعة',
    'السبت'
  ];

  useEffect(() => {
    if (isEditMode) {
      // في تطبيق حقيقي، هنا سيتم استدعاء API للحصول على بيانات يوم الدراسة
      // هذه بيانات وهمية للعرض فقط
      const mockStudyDay = {
        id: parseInt(id as string),
        classId: id === '1' || id === '2' || id === '3' || id === '4' || id === '5' ? 1 : 2,
        dayOfWeek: id === '1' ? 'الأحد' : id === '2' ? 'الاثنين' : id === '3' ? 'الثلاثاء' : id === '4' ? 'الأربعاء' : id === '5' ? 'الخميس' : id === '6' ? 'الأحد' : id === '7' ? 'الاثنين' : id === '8' ? 'الثلاثاء' : id === '9' ? 'الأربعاء' : 'الخميس',
        sessionsCount: id === '1' || id === '2' || id === '3' || id === '4' ? 6 : id === '5' ? 5 : id === '6' || id === '7' || id === '8' || id === '9' ? 7 : 6
      };
      
      setFormData({
        classId: mockStudyDay.classId.toString(),
        dayOfWeek: mockStudyDay.dayOfWeek,
        sessionsCount: mockStudyDay.sessionsCount.toString()
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
    if (errors[name as keyof StudyDayFormData]) {
      setErrors(prev => ({
        ...prev,
        [name as string]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<StudyDayFormData> = {};
    
    if (!formData.classId) {
      newErrors.classId = 'الصف مطلوب';
    }
    
    if (!formData.dayOfWeek) {
      newErrors.dayOfWeek = 'يوم الدراسة مطلوب';
    }
    
    if (!formData.sessionsCount.trim()) {
      newErrors.sessionsCount = 'عدد الحصص مطلوب';
    } else if (isNaN(Number(formData.sessionsCount)) || Number(formData.sessionsCount) <= 0) {
      newErrors.sessionsCount = 'يجب أن يكون عدد الحصص رقماً موجباً';
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
    
    // العودة إلى صفحة قائمة أيام الدراسة
    navigate('/studydays');
  };

  return (
    <div>
      <Typography variant="h4" className="page-title">
        {isEditMode ? 'تعديل يوم دراسة' : 'إضافة يوم دراسة جديد'}
      </Typography>
      
      <Paper elevation={3} className="form-container">
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
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
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.dayOfWeek}>
                <InputLabel>يوم الدراسة</InputLabel>
                <Select
                  name="dayOfWeek"
                  value={formData.dayOfWeek}
                  onChange={handleChange}
                  label="يوم الدراسة"
                  required
                >
                  {daysOfWeek.map(day => (
                    <MenuItem key={day} value={day}>{day}</MenuItem>
                  ))}
                </Select>
                {errors.dayOfWeek && <FormHelperText>{errors.dayOfWeek}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.sessionsCount}>
                <TextField
                  label="عدد الحصص"
                  name="sessionsCount"
                  type="number"
                  value={formData.sessionsCount}
                  onChange={handleChange}
                  variant="outlined"
                  error={!!errors.sessionsCount}
                  required
                  inputProps={{ min: 1, max: 10 }}
                />
                {errors.sessionsCount && <FormHelperText>{errors.sessionsCount}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} className="action-buttons">
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
              >
                {isEditMode ? 'حفظ التغييرات' : 'إضافة يوم الدراسة'}
              </Button>
              
              <Button 
                variant="outlined" 
                color="secondary" 
                onClick={() => navigate('/studydays')}
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

export default StudyDayForm;
