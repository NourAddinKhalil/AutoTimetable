import React, { useState, useEffect } from 'react';
import { Typography, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';

// في تطبيق حقيقي، هذه البيانات ستأتي من API
const mockClasses = [
  { id: 1, name: 'الصف الأول', description: 'المرحلة الابتدائية - الصف الأول' },
  { id: 2, name: 'الصف الثاني', description: 'المرحلة الابتدائية - الصف الثاني' },
  { id: 3, name: 'الصف الثالث', description: 'المرحلة الابتدائية - الصف الثالث' },
  { id: 4, name: 'الصف الرابع', description: 'المرحلة الابتدائية - الصف الرابع' },
  { id: 5, name: 'الصف الخامس', description: 'المرحلة الابتدائية - الصف الخامس' },
];

const ClassesList: React.FC = () => {
  const [classes, setClasses] = useState<any[]>([]);

  useEffect(() => {
    // في تطبيق حقيقي، هنا سيتم استدعاء API
    setClasses(mockClasses);
  }, []);

  const handleDelete = (id: number) => {
    // في تطبيق حقيقي، هنا سيتم استدعاء API لحذف الصف
    setClasses(classes.filter(c => c.id !== id));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" className="page-title">
          إدارة الصفوف
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          component={Link}
          to="/classes/add"
        >
          إضافة صف جديد
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>الرقم</TableCell>
              <TableCell>اسم الصف</TableCell>
              <TableCell>الوصف</TableCell>
              <TableCell>الإجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {classes.map((classItem) => (
              <TableRow key={classItem.id}>
                <TableCell>{classItem.id}</TableCell>
                <TableCell>{classItem.name}</TableCell>
                <TableCell>{classItem.description}</TableCell>
                <TableCell>
                  <IconButton 
                    color="primary" 
                    component={Link} 
                    to={`/classes/edit/${classItem.id}`}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error" 
                    onClick={() => handleDelete(classItem.id)}
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

export default ClassesList;
