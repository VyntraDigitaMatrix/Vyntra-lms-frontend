const fs = require('fs');
const apiPaths = [
  'src/Admin/auth/api.js',
  'src/Instructor/auth/api.js',
  'src/students/auth/api.js'
];
const snippet = `\n\nexport const notificationApi = {
  markAsRead: (notificationId) => api.patch('/api/notifications/read', { notificationId }),
  markAllAsRead: () => api.patch('/api/notifications/read-all'),
  getNotifications: (page = 0, size = 10) => api.get(\`/api/notifications?page=\${page}&size=\${size}\`),
  getUnreadNotifications: (page = 0, size = 10) => api.get(\`/api/notifications/unread?page=\${page}&size=\${size}\`),
  getUnreadCount: () => api.get('/api/notifications/unread-count')
};\n`;

apiPaths.forEach(path => {
  if (fs.existsSync(path)) {
    fs.appendFileSync(path, snippet);
    console.log('Appended to', path);
  } else {
    console.log('Not found:', path);
  }
});
