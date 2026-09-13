import fs from 'fs';
let content = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf-8');
console.log(JSON.stringify(content.substring(content.indexOf('useEffect(() => {\n    loadAdminData();'), content.indexOf('const handleSaveErpConfig'))));
