import axios from 'axios';

// تكوين الإعدادات الأساسية لـ axios
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// إضافة معترض للطلبات لإضافة رمز المصادقة إذا كان موجوداً
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// واجهات برمجة التطبيق للصفوف
export const classesApi = {
  getAll: () => apiClient.get('/classes'),
  getById: (id) => apiClient.get(`/classes/${id}`),
  create: (data) => apiClient.post('/classes', data),
  update: (id, data) => apiClient.put(`/classes/${id}`, data),
  delete: (id) => apiClient.delete(`/classes/${id}`)
};

// واجهات برمجة التطبيق للأقسام
export const divisionsApi = {
  getAll: () => apiClient.get('/divisions'),
  getByClass: (classId) => apiClient.get(`/divisions/class/${classId}`),
  getById: (id) => apiClient.get(`/divisions/${id}`),
  create: (data) => apiClient.post('/divisions', data),
  update: (id, data) => apiClient.put(`/divisions/${id}`, data),
  delete: (id) => apiClient.delete(`/divisions/${id}`)
};

// واجهات برمجة التطبيق للمواد
export const subjectsApi = {
  getAll: () => apiClient.get('/subjects'),
  getById: (id) => apiClient.get(`/subjects/${id}`),
  create: (data) => apiClient.post('/subjects', data),
  update: (id, data) => apiClient.put(`/subjects/${id}`, data),
  delete: (id) => apiClient.delete(`/subjects/${id}`)
};

// واجهات برمجة التطبيق للمعلمين
export const teachersApi = {
  getAll: () => apiClient.get('/teachers'),
  getById: (id) => apiClient.get(`/teachers/${id}`),
  create: (data) => apiClient.post('/teachers', data),
  update: (id, data) => apiClient.put(`/teachers/${id}`, data),
  delete: (id) => apiClient.delete(`/teachers/${id}`)
};

// واجهات برمجة التطبيق لتعيينات المواد
export const subjectAssignmentsApi = {
  getAll: () => apiClient.get('/subjectassignments'),
  getByDivision: (divisionId) => apiClient.get(`/subjectassignments/division/${divisionId}`),
  getById: (id) => apiClient.get(`/subjectassignments/${id}`),
  create: (data) => apiClient.post('/subjectassignments', data),
  update: (id, data) => apiClient.put(`/subjectassignments/${id}`, data),
  delete: (id) => apiClient.delete(`/subjectassignments/${id}`)
};

// واجهات برمجة التطبيق لأيام الدراسة
export const studyDaysApi = {
  getAll: () => apiClient.get('/studydays'),
  getByClass: (classId) => apiClient.get(`/studydays/class/${classId}`),
  getById: (id) => apiClient.get(`/studydays/${id}`),
  create: (data) => apiClient.post('/studydays', data),
  update: (id, data) => apiClient.put(`/studydays/${id}`, data),
  delete: (id) => apiClient.delete(`/studydays/${id}`)
};

// واجهات برمجة التطبيق لحصص الجدول الزمني
export const timetableSessionsApi = {
  getAll: () => apiClient.get('/timetablesessions'),
  getByDivision: (divisionId) => apiClient.get(`/timetablesessions/division/${divisionId}`),
  getByTeacher: (teacherId) => apiClient.get(`/timetablesessions/teacher/${teacherId}`),
  getById: (id) => apiClient.get(`/timetablesessions/${id}`),
  create: (data) => apiClient.post('/timetablesessions', data),
  update: (id, data) => apiClient.put(`/timetablesessions/${id}`, data),
  delete: (id) => apiClient.delete(`/timetablesessions/${id}`)
};

// واجهة برمجة التطبيق لإنشاء الجدول الزمني
export const timetableGeneratorApi = {
  generateForDivision: (divisionId) => apiClient.post(`/timetablegenerator/generate/division/${divisionId}`),
  generateForClass: (classId) => apiClient.post(`/timetablegenerator/generate/class/${classId}`)
};

export default apiClient;
