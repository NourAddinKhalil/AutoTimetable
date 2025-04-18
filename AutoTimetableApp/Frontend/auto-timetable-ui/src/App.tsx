import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// مكونات المصادقة
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Subscriptions from './components/auth/Subscriptions';

// مكونات التخطيط
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './components/Dashboard';

// مكونات إدارة الصفوف
import ClassesList from './components/classes/ClassesList';
import ClassForm from './components/classes/ClassForm';

// مكونات إدارة الأقسام
import DivisionsList from './components/divisions/DivisionsList';
import DivisionForm from './components/divisions/DivisionForm';

// مكونات إدارة المواد
import SubjectsList from './components/subjects/SubjectsList';
import SubjectForm from './components/subjects/SubjectForm';

// مكونات إدارة المعلمين
import TeachersList from './components/teachers/TeachersList';
import TeacherForm from './components/teachers/TeacherForm';

// مكونات تعيين المواد
import SubjectAssignmentsList from './components/assignments/SubjectAssignmentsList';
import SubjectAssignmentForm from './components/assignments/SubjectAssignmentForm';

// مكونات أيام الدراسة
import StudyDaysList from './components/studydays/StudyDaysList';
import StudyDayForm from './components/studydays/StudyDayForm';

// مكونات الجدول الزمني
import TimetableView from './components/timetable/TimetableView';
import TimetableGenerator from './components/timetable/TimetableGenerator';

import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Routes>
            {/* مسارات المصادقة العامة */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* المسارات المحمية التي تتطلب مصادقة */}
            <Route path="/" element={
              <ProtectedRoute>
                <div className="app-container">
                  <Navbar />
                  <div className="content-container">
                    <Sidebar />
                    <div className="main-content">
                      <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        
                        {/* مسارات إدارة الصفوف */}
                        <Route path="/classes" element={<ClassesList />} />
                        <Route path="/classes/add" element={
                          <ProtectedRoute requiredFeature="max_classes">
                            <ClassForm />
                          </ProtectedRoute>
                        } />
                        <Route path="/classes/edit/:id" element={<ClassForm />} />
                        
                        {/* مسارات إدارة الأقسام */}
                        <Route path="/divisions" element={<DivisionsList />} />
                        <Route path="/divisions/add" element={
                          <ProtectedRoute requiredFeature="max_divisions">
                            <DivisionForm />
                          </ProtectedRoute>
                        } />
                        <Route path="/divisions/edit/:id" element={<DivisionForm />} />
                        
                        {/* مسارات إدارة المواد */}
                        <Route path="/subjects" element={<SubjectsList />} />
                        <Route path="/subjects/add" element={
                          <ProtectedRoute requiredFeature="max_subjects">
                            <SubjectForm />
                          </ProtectedRoute>
                        } />
                        <Route path="/subjects/edit/:id" element={<SubjectForm />} />
                        
                        {/* مسارات إدارة المعلمين */}
                        <Route path="/teachers" element={<TeachersList />} />
                        <Route path="/teachers/add" element={
                          <ProtectedRoute requiredFeature="max_teachers">
                            <TeacherForm />
                          </ProtectedRoute>
                        } />
                        <Route path="/teachers/edit/:id" element={<TeacherForm />} />
                        
                        {/* مسارات تعيين المواد */}
                        <Route path="/assignments" element={<SubjectAssignmentsList />} />
                        <Route path="/assignments/add" element={<SubjectAssignmentForm />} />
                        <Route path="/assignments/edit/:id" element={<SubjectAssignmentForm />} />
                        
                        {/* مسارات أيام الدراسة */}
                        <Route path="/studydays" element={<StudyDaysList />} />
                        <Route path="/studydays/add" element={<StudyDayForm />} />
                        <Route path="/studydays/edit/:id" element={<StudyDayForm />} />
                        
                        {/* مسارات الجدول الزمني */}
                        <Route path="/timetable" element={<TimetableView />} />
                        <Route path="/timetable/generate" element={
                          <ProtectedRoute requiredFeature="max_timetables_per_month">
                            <TimetableGenerator />
                          </ProtectedRoute>
                        } />
                        
                        {/* مسار الاشتراكات */}
                        <Route path="/subscriptions" element={<Subscriptions />} />
                      </Routes>
                    </div>
                  </div>
                </div>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
