import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ClassIcon from '@mui/icons-material/Class';
import GroupsIcon from '@mui/icons-material/Groups';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TableChartIcon from '@mui/icons-material/TableChart';
import AutorenewIcon from '@mui/icons-material/Autorenew';

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <List component="nav">
        <ListItem button component={Link} to="/">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="لوحة التحكم" />
        </ListItem>
        
        <Divider sx={{ my: 1 }} />
        
        <ListItem button component={Link} to="/classes">
          <ListItemIcon>
            <ClassIcon />
          </ListItemIcon>
          <ListItemText primary="الصفوف" />
        </ListItem>
        
        <ListItem button component={Link} to="/divisions">
          <ListItemIcon>
            <GroupsIcon />
          </ListItemIcon>
          <ListItemText primary="الأقسام" />
        </ListItem>
        
        <ListItem button component={Link} to="/subjects">
          <ListItemIcon>
            <MenuBookIcon />
          </ListItemIcon>
          <ListItemText primary="المواد" />
        </ListItem>
        
        <ListItem button component={Link} to="/teachers">
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="المعلمين" />
        </ListItem>
        
        <Divider sx={{ my: 1 }} />
        
        <ListItem button component={Link} to="/assignments">
          <ListItemIcon>
            <AssignmentIcon />
          </ListItemIcon>
          <ListItemText primary="تعيين المواد" />
        </ListItem>
        
        <ListItem button component={Link} to="/studydays">
          <ListItemIcon>
            <CalendarTodayIcon />
          </ListItemIcon>
          <ListItemText primary="أيام الدراسة" />
        </ListItem>
        
        <Divider sx={{ my: 1 }} />
        
        <ListItem button component={Link} to="/timetable">
          <ListItemIcon>
            <TableChartIcon />
          </ListItemIcon>
          <ListItemText primary="الجدول الزمني" />
        </ListItem>
        
        <ListItem button component={Link} to="/timetable/generate">
          <ListItemIcon>
            <AutorenewIcon />
          </ListItemIcon>
          <ListItemText primary="إنشاء الجدول الزمني" />
        </ListItem>
      </List>
    </div>
  );
};

export default Sidebar;
