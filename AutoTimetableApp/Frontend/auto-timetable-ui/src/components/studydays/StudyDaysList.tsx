import React, { useState, useEffect } from 'react';
import { Typography, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';

// في تطبيق حقيقي، هذه البيانات ستأتي من API
const mockStudyDays = [
  { id: 1, className: 'الصف الأول', dayOfWeek: 'الأحد', sessionsCount: 6 },
  { id: 2, className: 'الصف الأول', dayOfWeek: 'الاثنين', sessionsCount: 6 },
  { id: 3, className: 'الصف الأول', dayOfWeek: 'الثلاثاء', sessionsCount: 6 },
  { id: 4, className: 'الصف الأول', dayOfWeek: 'الأربعاء', sessionsCount: 6 },
  { id: 5, className: 'الصف الأول', dayOfWeek: 'الخميس', sessionsCount: 5 },
  { id: 6, className: 'الصف الثاني', dayOfWeek: 'الأحد', sessionsCount: 7 },
  { id: 7, className: 'الصف الثاني', dayOfWeek: 'الاثنين', sessionsCount: 7 },
  { id: 8, className: 'الصف الثاني', dayOfWeek: 'الثلاثاء', sessionsCount: 7 },
  { id: 9, className: 'الصف الثاني', dayOfWeek: 'الأربعاء', sessionsCount: 7 },
  { id: 10, className: 'الصف الثاني', dayOfWeek: 'الخميس', sessionsCount: 6 },
];

const mockClasses = [
  { id: 1, name: 'الصف الأول' },
  { id: 2, name: 'الصف الثاني' },
  { id: 3, name: 'الصف الثالث' },
];

const StudyDaysList: React.FC = () => {
  const [studyDays, setStudyDays] = useState<any[]>([]);
  const [filteredStudyDays, setFilteredStudyDays] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');

  useEffect(() => {
    // في تطبيق حقيقي، هنا سيتم استدعاء API
    setStudyDays(mockStudyDays);
    setFilteredStudyDays(mockStudyDays);
  }, []);

  const handleClassChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const classId = e.target.value as string;
    setSelectedClass(classId);
    
    if (classId) {
      const classEntity = mockClasses.find(c => c.id === parseInt(classId));
      if (classEntity) {
        setFilteredStudyDays(studyDays.filter(d => d.className === classEntity.name));
      }
    } else {
      setFilteredStudyDays(studyDays);
    }
  };

  const handleDelete = (id: number) => {
    // في تطبيق حقيقي، هنا سيتم استدعاء API لحذف يوم الدراسة
    const updatedStudyDays = studyDays.filter(d => d.id !== id);
    setStudyDays(updatedStudyDays);
    
    if (selectedClass) {
      const classEntity = mockClasses.find(c => c.id === parseInt(selectedClass));
      if (classEntity) {
        setFilteredStudyDays(updatedStudyDays.filter(d => d.className === classEntity.name));
      }
    } else {
      setFilteredStudyDays(updatedStudyDays);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" className="page-title">
          أيام الدراسة
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          component={Link}
          to="/studydays/add"
        >
          إضافة يوم دراسة جديد
        </Button>
      </div>

      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel>تصفية حسب الصف</InputLabel>
          <Select
            value={selectedClass}
            onChange={handleClassChange}
            label="تصفية حسب الصف"
          >
            <MenuItem value="">جميع الصفوف</MenuItem>
            {mockClasses.map(c => (
              <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>الرقم</TableCell>
              <TableCell>الصف</TableCell>
              <TableCell>يوم الدراسة</TableCell>
              <TableCell>عدد الحصص</TableCell>
              <TableCell>الإجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudyDays.map((day) => (
              <TableRow key={day.id}>
                <TableCell>{day.id}</TableCell>
                <TableCell>{day.className}</TableCell>
                <TableCell>{day.dayOfWeek}</TableCell>
                <TableCell>{day.sessionsCount}</TableCell>
                <TableCell>
                  <IconButton 
                    color="primary" 
                    component={Link} 
                    to={`/studydays/edit/${day.id}`}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error" 
                    onClick={() => handleDelete(day.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default StudyDaysList;
