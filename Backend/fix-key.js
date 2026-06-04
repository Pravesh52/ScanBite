const json = require('C:/Users/HP/Downloads/woven-passkey-478214-h1-0bca671fa53d.json');

console.log('=== JSON FILE DATA ===');
console.log('client_email:', json.client_email);
console.log('project_id:', json.project_id);
console.log('private_key_id:', json.private_key_id);
console.log('key starts with:', json.private_key.substring(0, 30));