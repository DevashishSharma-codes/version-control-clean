const fs = require('fs');
const https = require('https');

const key = "AIzaSyDYNLoP_aDvU1JgkewgTZyffFLOGh8amEQ";
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

https.get(url, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      const models = parsed.models.map(m => m.name);
      console.log("AVAILABLE MODELS:", models);
    } catch (e) {
      console.log(data);
    }
  });
});
