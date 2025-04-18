import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar: React.FC = () => {
  return (
    <AppBar position="static" className="navbar">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Vibe Coding AI - نظام الجداول الزمنية المدرسية
        </Typography>
        <Button color="inherit">تسجيل الدخول</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
