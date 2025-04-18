import React, { useState, useEffect } from 'react';
import { Typography, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';

// في تطبيق حقيقي، هذه البيانات ستأتي من API
const mockSubjects = [
  { id: 1, name: 'الرياضيات', description: 'مادة الرياضيات للمرحلة الابتدائية', weeklyHours: 5 },
  { id: 2, name: 'اللغة العربية', description: 'مادة اللغة العربية للمرحلة الابتدائية', weeklyHours: 6 },
  { id: 3, name: 'العلوم', description: 'مادة العلوم للمرحلة الابتدائية', weeklyHours: 4 },
  { id: 4, name: 'اللغة الإنجليزية', description: 'مادة اللغة الإنجليزية للمرحلة الابتدائية', weeklyHours: 4 },
  { id: 5, name: 'التاريخ', description: 'مادة التاريخ للمرحلة الابتدائية', weeklyHours: 2 },
];

const SubjectsList: React.FC = () => {
  const [subjects, setSubjects] = useState<any[]>([]);

  useEffect(() => {
    // في تطبيق حقيقي، هنا سيتم استدعاء API
    setSubjects(mockSubjects);
  }, []);

  const handleDelete = (id: number) => {
    // في تطبيق حقيقي، هنا سيتم استدعاء API لحذف المادة
    setSubjects(subjects.filter(s => s.id !== id));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" className="page-title">
          إدارة المواد الدراسية
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          component={Link}
          to="/subjects/add"
        >
          إضافة مادة جديدة
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>الرقم</TableCell>
              <TableCell>اسم المادة</TableCell>
              <TableCell>الوصف</TableCell>
              <TableCell>الساعات الأسبوعية</TableCell>
              <TableCell>الإجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subjects.map((subject) => (
              <TableRow key={subject.id}>
                <TableCell>{subject.id}</TableCell>
                <TableCell>{subject.name}</TableCell>
                <TableCell>{subject.description}</TableCell>
                <TableCell>{subject.weeklyHours}</TableCell>
                <TableCell>
                  <IconButton 
                    color="primary" 
                    component={Link} 
                    to={`/subjects/edit/${subject.id}`}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error" 
                    onClick={() => handleDelete(subject.id)}
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

export default SubjectsList;
