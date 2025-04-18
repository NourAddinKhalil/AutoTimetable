import React, { useState, useEffect } from 'react';
import { Typography, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';

// في تطبيق حقيقي، هذه البيانات ستأتي من API
const mockAssignments = [
  { id: 1, divisionName: 'القسم أ - الصف الأول', subjectName: 'الرياضيات', teacherName: 'أحمد محمد', weeklyFrequency: 5 },
  { id: 2, divisionName: 'القسم أ - الصف الأول', subjectName: 'اللغة العربية', teacherName: 'سارة أحمد', weeklyFrequency: 6 },
  { id: 3, divisionName: 'القسم ب - الصف الأول', subjectName: 'العلوم', teacherName: 'محمد علي', weeklyFrequency: 4 },
  { id: 4, divisionName: 'القسم ب - الصف الأول', subjectName: 'اللغة الإنجليزية', teacherName: 'فاطمة حسن', weeklyFrequency: 4 },
  { id: 5, divisionName: 'القسم أ - الصف الثاني', subjectName: 'التاريخ', teacherName: 'خالد عبدالله', weeklyFrequency: 2 },
];

const mockDivisions = [
  { id: 1, name: 'القسم أ - الصف الأول' },
  { id: 2, name: 'القسم ب - الصف الأول' },
  { id: 3, name: 'القسم أ - الصف الثاني' },
  { id: 4, name: 'القسم ب - الصف الثاني' },
];

const SubjectAssignmentsList: React.FC = () => {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [filteredAssignments, setFilteredAssignments] = useState<any[]>([]);
  const [selectedDivision, setSelectedDivision] = useState<string>('');

  useEffect(() => {
    // في تطبيق حقيقي، هنا سيتم استدعاء API
    setAssignments(mockAssignments);
    setFilteredAssignments(mockAssignments);
  }, []);

  const handleDivisionChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const divisionId = e.target.value as string;
    setSelectedDivision(divisionId);
    
    if (divisionId) {
      const division = mockDivisions.find(d => d.id === parseInt(divisionId));
      if (division) {
        setFilteredAssignments(assignments.filter(a => a.divisionName === division.name));
      }
    } else {
      setFilteredAssignments(assignments);
    }
  };

  const handleDelete = (id: number) => {
    // في تطبيق حقيقي، هنا سيتم استدعاء API لحذف تعيين المادة
    const updatedAssignments = assignments.filter(a => a.id !== id);
    setAssignments(updatedAssignments);
    
    if (selectedDivision) {
      const division = mockDivisions.find(d => d.id === parseInt(selectedDivision));
      if (division) {
        setFilteredAssignments(updatedAssignments.filter(a => a.divisionName === division.name));
      }
    } else {
      setFilteredAssignments(updatedAssignments);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" className="page-title">
          تعيين المواد
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          component={Link}
          to="/assignments/add"
        >
          إضافة تعيين جديد
        </Button>
      </div>

      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel>تصفية حسب القسم</InputLabel>
          <Select
            value={selectedDivision}
            onChange={handleDivisionChange}
            label="تصفية حسب القسم"
          >
            <MenuItem value="">جميع الأقسام</MenuItem>
            {mockDivisions.map(d => (
              <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>الرقم</TableCell>
              <TableCell>القسم</TableCell>
              <TableCell>المادة</TableCell>
              <TableCell>المعلم</TableCell>
              <TableCell>عدد الحصص الأسبوعية</TableCell>
              <TableCell>الإجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAssignments.map((assignment) => (
              <TableRow key={assignment.id}>
                <TableCell>{assignment.id}</TableCell>
                <TableCell>{assignment.divisionName}</TableCell>
                <TableCell>{assignment.subjectName}</TableCell>
                <TableCell>{assignment.teacherName}</TableCell>
                <TableCell>{assignment.weeklyFrequency}</TableCell>
                <TableCell>
                  <IconButton 
                    color="primary" 
                    component={Link} 
                    to={`/assignments/edit/${assignment.id}`}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error" 
                    onClick={() => handleDelete(assignment.id)}
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

export default SubjectAssignmentsList;
