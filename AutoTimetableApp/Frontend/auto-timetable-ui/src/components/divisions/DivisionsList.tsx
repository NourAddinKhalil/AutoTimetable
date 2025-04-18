import React, { useState, useEffect } from 'react';
import { Typography, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';

// في تطبيق حقيقي، هذه البيانات ستأتي من API
const mockDivisions = [
  { id: 1, name: 'القسم أ', className: 'الصف الأول', classId: 1 },
  { id: 2, name: 'القسم ب', className: 'الصف الأول', classId: 1 },
  { id: 3, name: 'القسم أ', className: 'الصف الثاني', classId: 2 },
  { id: 4, name: 'القسم ب', className: 'الصف الثاني', classId: 2 },
  { id: 5, name: 'القسم أ', className: 'الصف الثالث', classId: 3 },
];

const mockClasses = [
  { id: 1, name: 'الصف الأول' },
  { id: 2, name: 'الصف الثاني' },
  { id: 3, name: 'الصف الثالث' },
];

const DivisionsList: React.FC = () => {
  const [divisions, setDivisions] = useState<any[]>([]);
  const [filteredDivisions, setFilteredDivisions] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');

  useEffect(() => {
    // في تطبيق حقيقي، هنا سيتم استدعاء API
    setDivisions(mockDivisions);
    setFilteredDivisions(mockDivisions);
  }, []);

  const handleClassChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const classId = e.target.value as string;
    setSelectedClass(classId);
    
    if (classId) {
      setFilteredDivisions(divisions.filter(d => d.classId === parseInt(classId)));
    } else {
      setFilteredDivisions(divisions);
    }
  };

  const handleDelete = (id: number) => {
    // في تطبيق حقيقي، هنا سيتم استدعاء API لحذف القسم
    const updatedDivisions = divisions.filter(d => d.id !== id);
    setDivisions(updatedDivisions);
    
    if (selectedClass) {
      setFilteredDivisions(updatedDivisions.filter(d => d.classId === parseInt(selectedClass)));
    } else {
      setFilteredDivisions(updatedDivisions);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" className="page-title">
          إدارة الأقسام
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          component={Link}
          to="/divisions/add"
        >
          إضافة قسم جديد
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
              <TableCell>اسم القسم</TableCell>
              <TableCell>الصف</TableCell>
              <TableCell>الإجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDivisions.map((division) => (
              <TableRow key={division.id}>
                <TableCell>{division.id}</TableCell>
                <TableCell>{division.name}</TableCell>
                <TableCell>{division.className}</TableCell>
                <TableCell>
                  <IconButton 
                    color="primary" 
                    component={Link} 
                    to={`/divisions/edit/${division.id}`}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error" 
                    onClick={() => handleDelete(division.id)}
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

export default DivisionsList;
