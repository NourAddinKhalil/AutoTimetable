import React, { useState, useEffect } from 'react';
import { Typography, Paper, TextField, Button, FormControl, FormHelperText, Grid, InputLabel, Select, MenuItem } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

interface SubjectAssignmentFormData {
  divisionId: string;
  subjectId: string;
  teacherId: string;
  weeklyFrequency: string;
}

const SubjectAssignmentForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState<SubjectAssignmentFormData>({
    divisionId: '',
    subjectId: '',
    teacherId: '',
    weeklyFrequency: ''
  });
  
  const [errors, setErrors] = useState<Partial<SubjectAssignmentFormData>>({});

  // في تطبيق حقيقي، هذه البيانات ستأتي من API
  const mockDivisions = [
    { id: 1, name: 'القسم أ - الصف الأول' },
    { id: 2, name: 'القسم ب - الصف الأول' },
    { id: 3, name: 'القسم أ - الصف الثاني' },
    { id: 4, name: 'القسم ب - الصف الثاني' },
  ];

  const mockSubjects = [
    { id: 1, name: 'الرياضيات' },
    { id: 2, name: 'اللغة العربية' },
    { id: 3, name: 'العلوم' },
    { id: 4, name: 'اللغة الإنجليزية' },
    { id: 5, name: 'التاريخ' },
  ];

  const mockTeachers = [
    { id: 1, name: 'أحمد محمد', specialization: 'الرياضيات' },
    { id: 2, name: 'سارة أحمد', specialization: 'اللغة العربية' },
    { id: 3, name: 'محمد علي', specialization: 'العلوم' },
    { id: 4, name: 'فاطمة حسن', specialization: 'اللغة الإنجليزية' },
    { id: 5, name: 'خالد عبدالله', specialization: 'التاريخ' },
  ];

  useEffect(() => {
    if (isEditMode) {
      // في تطبيق حقيقي، هنا سيتم استدعاء API للحصول على بيانات تعيين المادة
      // هذه بيانات وهمية للعرض فقط
      const mockAssignment = {
        id: parseInt(id as string),
        divisionId: id === '1' ? 1 : id === '2' ? 1 : id === '3' ? 2 : id === '4' ? 2 : 3,
        subjectId: id === '1' ? 1 : id === '2' ? 2 : id === '3' ? 3 : id === '4' ? 4 : 5,
        teacherId: id === '1' ? 1 : id === '2' ? 2 : id === '3' ? 3 : id === '4' ? 4 : 5,
        weeklyFrequency: id === '1' ? 5 : id === '2' ? 6 : id === '3' ? 4 : id === '4' ? 4 : 2
      };
      
      setFormData({
        divisionId: mockAssignment.divisionId.toString(),
        subjectId: mockAssignment.subjectId.toString(),
        teacherId: mockAssignment.teacherId.toString(),
        weeklyFrequency: mockAssignment.weeklyFrequency.toString()
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
    if (errors[name as keyof SubjectAssignmentFormData]) {
      setErrors(prev => ({
        ...prev,
        [name as string]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<SubjectAssignmentFormData> = {};
    
    if (!formData.divisionId) {
      newErrors.divisionId = 'القسم مطلوب';
    }
    
    if (!formData.subjectId) {
      newErrors.subjectId = 'المادة مطلوبة';
    }
    
    if (!formData.teacherId) {
      newErrors.teacherId = 'المعلم مطلوب';
    }
    
    if (!formData.weeklyFrequency.trim()) {
      newErrors.weeklyFrequency = 'عدد الحصص الأسبوعية مطلوب';
    } else if (isNaN(Number(formData.weeklyFrequency)) || Number(formData.weeklyFrequency) <= 0) {
      newErrors.weeklyFrequency = 'يجب أن يكون عدد الحصص الأسبوعية رقماً موجباً';
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
    
    // العودة إلى صفحة قائمة تعيينات المواد
    navigate('/assignments');
  };

  // الحصول على المعلمين المتخصصين في المادة المحددة
  const getSpecializedTeachers = () => {
    if (!formData.subjectId) {
      return mockTeachers;
    }
    
    const selectedSubject = mockSubjects.find(s => s.id === parseInt(formData.subjectId));
    if (!selectedSubject) {
      return mockTeachers;
    }
    
    // في تطبيق حقيقي، هذا التصفية ستكون أكثر دقة
    return mockTeachers.filter(t => t.specialization === selectedSubject.name);
  };

  return (
    <div>
      <Typography variant="h4" className="page-title">
        {isEditMode ? 'تعديل تعيين مادة' : 'إضافة تعيين مادة جديد'}
      </Typography>
      
      <Paper elevation={3} className="form-container">
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.divisionId}>
                <InputLabel>القسم</InputLabel>
                <Select
                  name="divisionId"
                  value={formData.divisionId}
                  onChange={handleChange}
                  label="القسم"
                  required
                >
                  {mockDivisions.map(d => (
                    <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
                  ))}
                </Select>
                {errors.divisionId && <FormHelperText>{errors.divisionId}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.subjectId}>
                <InputLabel>المادة</InputLabel>
                <Select
                  name="subjectId"
                  value={formData.subjectId}
                  onChange={handleChange}
                  label="المادة"
                  required
                >
                  {mockSubjects.map(s => (
                    <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                  ))}
                </Select>
                {errors.subjectId && <FormHelperText>{errors.subjectId}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.teacherId}>
                <InputLabel>المعلم</InputLabel>
                <Select
                  name="teacherId"
                  value={formData.teacherId}
                  onChange={handleChange}
                  label="المعلم"
                  required
                  disabled={!formData.subjectId}
                >
                  {getSpecializedTeachers().map(t => (
                    <MenuItem key={t.id} value={t.id}>{t.name} ({t.specialization})</MenuItem>
                  ))}
                </Select>
                {errors.teacherId && <FormHelperText>{errors.teacherId}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.weeklyFrequency}>
                <TextField
                  label="عدد الحصص الأسبوعية"
                  name="weeklyFrequency"
                  type="number"
                  value={formData.weeklyFrequency}
                  onChange={handleChange}
                  variant="outlined"
                  error={!!errors.weeklyFrequency}
                  required
                  inputProps={{ min: 1 }}
                />
                {errors.weeklyFrequency && <FormHelperText>{errors.weeklyFrequency}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} className="action-buttons">
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
              >
                {isEditMode ? 'حفظ التغييرات' : 'إضافة التعيين'}
              </Button>
              
              <Button 
                variant="outlined" 
                color="secondary" 
                onClick={() => navigate('/assignments')}
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

export default SubjectAssignmentForm;
