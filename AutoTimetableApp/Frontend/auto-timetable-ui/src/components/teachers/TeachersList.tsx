import React, { useState, useEffect } from 'react';
import { Typography, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';

// في تطبيق حقيقي، هذه البيانات ستأتي من API
const mockTeachers = [
  { id: 1, name: 'أحمد محمد', email: 'ahmed@school.com', phone: '0501234567', specialization: 'الرياضيات' },
  { id: 2, name: 'سارة أحمد', email: 'sara@school.com', phone: '0507654321', specialization: 'اللغة العربية' },
  { id: 3, name: 'محمد علي', email: 'mohamed@school.com', phone: '0509876543', specialization: 'العلوم' },
  { id: 4, name: 'فاطمة حسن', email: 'fatima@school.com', phone: '0503456789', specialization: 'اللغة الإنجليزية' },
  { id: 5, name: 'خالد عبدالله', email: 'khaled@school.com', phone: '0508765432', specialization: 'التاريخ' },
];

const TeachersList: React.FC = () => {
  const [teachers, setTeachers] = useState<any[]>([]);

  useEffect(() => {
    // في تطبيق حقيقي، هنا سيتم استدعاء API
    setTeachers(mockTeachers);
  }, []);

  const handleDelete = (id: number) => {
    // في تطبيق حقيقي، هنا سيتم استدعاء API لحذف المعلم
    setTeachers(teachers.filter(t => t.id !== id));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" className="page-title">
          إدارة المعلمين
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          component={Link}
          to="/teachers/add"
        >
          إضافة معلم جديد
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>الرقم</TableCell>
              <TableCell>اسم المعلم</TableCell>
              <TableCell>البريد الإلكتروني</TableCell>
              <TableCell>رقم الهاتف</TableCell>
              <TableCell>التخصص</TableCell>
              <TableCell>الإجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teachers.map((teacher) => (
              <TableRow key={teacher.id}>
                <TableCell>{teacher.id}</TableCell>
                <TableCell>{teacher.name}</TableCell>
                <TableCell>{teacher.email}</TableCell>
                <TableCell>{teacher.phone}</TableCell>
                <TableCell>{teacher.specialization}</TableCell>
                <TableCell>
                  <IconButton 
                    color="primary" 
                    component={Link} 
                    to={`/teachers/edit/${teacher.id}`}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error" 
                    onClick={() => handleDelete(teacher.id)}
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

export default TeachersList;
