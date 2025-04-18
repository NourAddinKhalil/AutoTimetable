import React from 'react';
import { Typography, Grid, Paper, Box } from '@mui/material';
import ClassIcon from '@mui/icons-material/Class';
import GroupsIcon from '@mui/icons-material/Groups';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PersonIcon from '@mui/icons-material/Person';
import TableChartIcon from '@mui/icons-material/TableChart';

const Dashboard: React.FC = () => {
  // في تطبيق حقيقي، هذه البيانات ستأتي من API
  const stats = {
    classes: 5,
    divisions: 12,
    subjects: 8,
    teachers: 15,
    timetables: 12
  };

  return (
    <div>
      <Typography variant="h4" className="page-title">
        لوحة التحكم
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
            <Box sx={{ bgcolor: '#e3f2fd', p: 2, borderRadius: '50%', mr: 2 }}>
              <ClassIcon fontSize="large" color="primary" />
            </Box>
            <div>
              <Typography variant="h4">{stats.classes}</Typography>
              <Typography variant="subtitle1">الصفوف</Typography>
            </div>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
            <Box sx={{ bgcolor: '#e8f5e9', p: 2, borderRadius: '50%', mr: 2 }}>
              <GroupsIcon fontSize="large" color="success" />
            </Box>
            <div>
              <Typography variant="h4">{stats.divisions}</Typography>
              <Typography variant="subtitle1">الأقسام</Typography>
            </div>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
            <Box sx={{ bgcolor: '#fff8e1', p: 2, borderRadius: '50%', mr: 2 }}>
              <MenuBookIcon fontSize="large" color="warning" />
            </Box>
            <div>
              <Typography variant="h4">{stats.subjects}</Typography>
              <Typography variant="subtitle1">المواد</Typography>
            </div>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <Paper elevation={3} sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
            <Box sx={{ bgcolor: '#fce4ec', p: 2, borderRadius: '50%', mr: 2 }}>
              <PersonIcon fontSize="large" sx={{ color: '#d81b60' }} />
            </Box>
            <div>
              <Typography variant="h4">{stats.teachers}</Typography>
              <Typography variant="subtitle1">المعلمين</Typography>
            </div>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <Paper elevation={3} sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
            <Box sx={{ bgcolor: '#e8eaf6', p: 2, borderRadius: '50%', mr: 2 }}>
              <TableChartIcon fontSize="large" sx={{ color: '#3f51b5' }} />
            </Box>
            <div>
              <Typography variant="h4">{stats.timetables}</Typography>
              <Typography variant="subtitle1">الجداول الزمنية</Typography>
            </div>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              مرحباً بك في نظام الجداول الزمنية المدرسية
            </Typography>
            <Typography variant="body1" paragraph>
              هذا النظام يساعدك على إنشاء وإدارة الجداول الزمنية للمدارس بطريقة سهلة وفعالة.
            </Typography>
            <Typography variant="body1" paragraph>
              يمكنك إدارة الصفوف والأقسام والمواد والمعلمين، وتعيين المواد للأقسام، وتحديد أيام الدراسة، ثم إنشاء الجداول الزمنية آلياً بدون تعارضات.
            </Typography>
            <Typography variant="body1">
              استخدم القائمة الجانبية للتنقل بين صفحات النظام المختلفة.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
