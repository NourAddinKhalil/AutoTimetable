import React, { useState, useEffect } from 'react';
import { Typography, Paper, FormControl, InputLabel, Select, MenuItem, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, CircularProgress, Alert } from '@mui/material';
import { classesApi, divisionsApi, timetableSessionsApi } from '../../api/api';
import { useNavigate } from 'react-router-dom';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import EditIcon from '@mui/icons-material/Edit';

interface Class {
  id: number;
  name: string;
}

interface Division {
  id: number;
  name: string;
  classId: number;
}

interface TimetableSession {
  id: number;
  divisionId: number;
  dayOfWeek: string;
  sessionNumber: number;
  subjectName: string;
  teacherName: string;
}

const TimetableView: React.FC = () => {
  const navigate = useNavigate();
  
  const [classes, setClasses] = useState<Class[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [availableDivisions, setAvailableDivisions] = useState<Division[]>([]);
  const [timetableSessions, setTimetableSessions] = useState<TimetableSession[]>([]);
  
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const daysOfWeek = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
  const maxSessions = 8; // أقصى عدد للحصص في اليوم

  useEffect(() => {
    // استدعاء API للحصول على قائمة الصفوف
    const fetchClasses = async () => {
      try {
        const response = await classesApi.getAll();
        setClasses(response.data);
      } catch (error) {
        console.error('Error fetching classes:', error);
        setError('حدث خطأ أثناء تحميل بيانات الصفوف');
      }
    };

    // استدعاء API للحصول على قائمة الأقسام
    const fetchDivisions = async () => {
      try {
        const response = await divisionsApi.getAll();
        setDivisions(response.data);
      } catch (error) {
        console.error('Error fetching divisions:', error);
        setError('حدث خطأ أثناء تحميل بيانات الأقسام');
      }
    };

    fetchClasses();
    fetchDivisions();
  }, []);

  useEffect(() => {
    // تحديث الأقسام المتاحة عند تغيير الصف المحدد
    if (selectedClass) {
      const classId = parseInt(selectedClass);
      const filteredDivisions = divisions.filter(d => d.classId === classId);
      setAvailableDivisions(filteredDivisions);
      
      // إعادة تعيين القسم المحدد إذا لم يعد متاحاً
      if (selectedDivision && !filteredDivisions.some(d => d.id === parseInt(selectedDivision))) {
        setSelectedDivision('');
        setTimetableSessions([]);
      }
    } else {
      setAvailableDivisions([]);
      setSelectedDivision('');
      setTimetableSessions([]);
    }
  }, [selectedClass, divisions, selectedDivision]);

  useEffect(() => {
    // استدعاء API للحصول على الجدول الزمني للقسم المحدد
    const fetchTimetable = async () => {
      if (!selectedDivision) return;
      
      setLoading(true);
      setError('');
      
      try {
        const response = await timetableSessionsApi.getByDivision(parseInt(selectedDivision));
        setTimetableSessions(response.data);
      } catch (error) {
        console.error('Error fetching timetable:', error);
        setError('حدث خطأ أثناء تحميل بيانات الجدول الزمني');
        setTimetableSessions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, [selectedDivision]);

  const handleClassChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedClass(e.target.value as string);
  };

  const handleDivisionChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedDivision(e.target.value as string);
  };

  // تنظيم حصص الجدول الزمني في مصفوفة ثنائية الأبعاد [يوم][حصة]
  const getTimetableGrid = () => {
    const grid: (TimetableSession | null)[][] = [];
    
    // تهيئة المصفوفة بقيم فارغة
    for (let i = 0; i < daysOfWeek.length; i++) {
      grid[i] = [];
      for (let j = 0; j < maxSessions; j++) {
        grid[i][j] = null;
      }
    }
    
    // ملء المصفوفة بالحصص
    timetableSessions.forEach(session => {
      const dayIndex = daysOfWeek.indexOf(session.dayOfWeek);
      if (dayIndex !== -1 && session.sessionNumber > 0 && session.sessionNumber <= maxSessions) {
        grid[dayIndex][session.sessionNumber - 1] = session;
      }
    });
    
    return grid;
  };

  const handleGenerateNew = () => {
    navigate('/timetable/generate');
  };

  const handleExportToPDF = () => {
    // في تطبيق حقيقي، هنا سيتم تنفيذ تصدير الجدول الزمني إلى PDF
    console.log('Export to PDF');
  };

  const handleExportToExcel = () => {
    // في تطبيق حقيقي، هنا سيتم تنفيذ تصدير الجدول الزمني إلى Excel
    console.log('Export to Excel');
  };

  const handleEditTimetable = () => {
    // في تطبيق حقيقي، هنا سيتم الانتقال إلى صفحة تعديل الجدول الزمني
    console.log('Edit timetable');
  };

  const timetableGrid = getTimetableGrid();

  return (
    <div>
      <Typography variant="h4" className="page-title">
        عرض الجدول الزمني
      </Typography>
      
      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>الصف</InputLabel>
              <Select
                value={selectedClass}
                onChange={handleClassChange}
                label="الصف"
              >
                <MenuItem value="">
                  <em>اختر الصف</em>
                </MenuItem>
                {classes.map(c => (
                  <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth disabled={!selectedClass || availableDivisions.length === 0}>
              <InputLabel>القسم</InputLabel>
              <Select
                value={selectedDivision}
                onChange={handleDivisionChange}
                label="القسم"
              >
                <MenuItem value="">
                  <em>اختر القسم</em>
                </MenuItem>
                {availableDivisions.map(d => (
                  <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
          <CircularProgress />
        </div>
      ) : selectedDivision && timetableSessions.length > 0 ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginBottom: '1rem' }}>
            <Button
              variant="outlined"
              startIcon={<FileDownloadIcon />}
              onClick={handleExportToPDF}
            >
              تصدير PDF
            </Button>
            <Button
              variant="outlined"
              startIcon={<FileDownloadIcon />}
              onClick={handleExportToExcel}
            >
              تصدير Excel
            </Button>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={handleEditTimetable}
            >
              تعديل الجدول
            </Button>
          </div>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>اليوم / الحصة</TableCell>
                  {Array.from({ length: maxSessions }, (_, i) => (
                    <TableCell key={i} align="center">الحصة {i + 1}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {daysOfWeek.map((day, dayIndex) => (
                  <TableRow key={day}>
                    <TableCell component="th" scope="row">
                      {day}
                    </TableCell>
                    {Array.from({ length: maxSessions }, (_, sessionIndex) => {
                      const session = timetableGrid[dayIndex][sessionIndex];
                      return (
                        <TableCell key={sessionIndex} align="center">
                          {session ? (
                            <div>
                              <div><strong>{session.subjectName}</strong></div>
                              <div>{session.teacherName}</div>
                            </div>
                          ) : null}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : selectedDivision ? (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            لا يوجد جدول زمني لهذا القسم
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleGenerateNew}
            sx={{ mt: 2 }}
          >
            إنشاء جدول زمني جديد
          </Button>
        </Paper>
      ) : (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1">
            الرجاء اختيار الصف والقسم لعرض الجدول الزمني
          </Typography>
        </Paper>
      )}
    </div>
  );
};

export default TimetableView;
