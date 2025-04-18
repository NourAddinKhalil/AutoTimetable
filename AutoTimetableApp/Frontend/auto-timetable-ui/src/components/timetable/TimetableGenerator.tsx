import React, { useState, useEffect } from 'react';
import { Typography, Paper, Button, FormControl, InputLabel, Select, MenuItem, FormHelperText, Grid, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { classesApi, divisionsApi, timetableGeneratorApi } from '../../api/api';

interface Class {
  id: number;
  name: string;
}

interface Division {
  id: number;
  name: string;
  classId: number;
}

const TimetableGenerator: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    classId: '',
    divisionId: ''
  });
  
  const [errors, setErrors] = useState<any>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [classes, setClasses] = useState<Class[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [availableDivisions, setAvailableDivisions] = useState<Division[]>([]);

  useEffect(() => {
    // استدعاء API للحصول على قائمة الصفوف
    const fetchClasses = async () => {
      try {
        const response = await classesApi.getAll();
        setClasses(response.data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    // استدعاء API للحصول على قائمة الأقسام
    const fetchDivisions = async () => {
      try {
        const response = await divisionsApi.getAll();
        setDivisions(response.data);
      } catch (error) {
        console.error('Error fetching divisions:', error);
      }
    };

    fetchClasses();
    fetchDivisions();
  }, []);

  useEffect(() => {
    // تحديث الأقسام المتاحة عند تغيير الصف المحدد
    if (formData.classId) {
      const classId = parseInt(formData.classId);
      const filteredDivisions = divisions.filter(d => d.classId === classId);
      setAvailableDivisions(filteredDivisions);
    } else {
      setAvailableDivisions([]);
    }
  }, [formData.classId, divisions]);

  const handleChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value,
      // إذا تم تغيير الصف، إعادة تعيين القسم
      ...(name === 'classId' ? { divisionId: '' } : {})
    }));
    
    // مسح الخطأ عند تغيير القيمة
    if (errors[name as string]) {
      setErrors(prev => ({
        ...prev,
        [name as string]: undefined
      }));
    }

    // مسح رسائل النجاح والخطأ عند تغيير القيم
    setSuccess(false);
    setErrorMessage('');
  };

  const validateForm = (): boolean => {
    const newErrors: any = {};
    
    if (!formData.classId) {
      newErrors.classId = 'الرجاء اختيار الصف';
    }
    
    if (!formData.divisionId) {
      newErrors.divisionId = 'الرجاء اختيار القسم';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsGenerating(true);
    setSuccess(false);
    setErrorMessage('');
    
    try {
      // استدعاء API لإنشاء الجدول الزمني
      await timetableGeneratorApi.generateForDivision(parseInt(formData.divisionId));
      
      setSuccess(true);
      
      // بعد 2 ثانية، الانتقال إلى صفحة عرض الجدول الزمني
      setTimeout(() => {
        navigate('/timetable');
      }, 2000);
    } catch (error: any) {
      console.error('Error generating timetable:', error);
      setErrorMessage(error.response?.data || 'حدث خطأ أثناء إنشاء الجدول الزمني');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      <Typography variant="h4" className="page-title">
        إنشاء الجدول الزمني
      </Typography>
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          تم إنشاء الجدول الزمني بنجاح! جاري الانتقال إلى صفحة عرض الجدول الزمني...
        </Alert>
      )}

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}
      
      <Paper elevation={3} className="form-container">
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.classId}>
                <InputLabel>الصف</InputLabel>
                <Select
                  name="classId"
                  value={formData.classId}
                  onChange={handleChange}
                  label="الصف"
                >
                  {classes.map(c => (
                    <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                  ))}
                </Select>
                {errors.classId && <FormHelperText>{errors.classId}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.divisionId} disabled={!formData.classId}>
                <InputLabel>القسم</InputLabel>
                <Select
                  name="divisionId"
                  value={formData.divisionId}
                  onChange={handleChange}
                  label="القسم"
                >
                  {availableDivisions.map(d => (
                    <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
                  ))}
                </Select>
                {errors.divisionId && <FormHelperText>{errors.divisionId}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="body1" paragraph>
                سيقوم النظام بإنشاء جدول زمني للقسم المحدد بناءً على:
              </Typography>
              <ul>
                <li>المواد المعينة للقسم</li>
                <li>المعلمين المتاحين</li>
                <li>أيام الدراسة المحددة</li>
                <li>عدد الحصص المطلوبة لكل مادة</li>
              </ul>
              <Typography variant="body1" paragraph>
                سيتم إنشاء الجدول الزمني بدون تعارضات، مع مراعاة عدم تعيين معلم لنفس الحصة في صفوف مختلفة.
              </Typography>
            </Grid>
            
            <Grid item xs={12} className="action-buttons">
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                disabled={isGenerating}
                startIcon={isGenerating ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {isGenerating ? 'جاري إنشاء الجدول الزمني...' : 'إنشاء الجدول الزمني'}
              </Button>
              
              <Button 
                variant="outlined" 
                color="secondary" 
                onClick={() => navigate('/timetable')}
                disabled={isGenerating}
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

export default TimetableGenerator;
