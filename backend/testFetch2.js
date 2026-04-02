const fs = require('fs');

async function testFetch() {
  const formData = new FormData();
  formData.append('name', 'TestRepo4');
  formData.append('owner', '65f4c541b5161d7b1a201c10');

  const fileBlob = new Blob([fs.readFileSync('package.json')], { type: 'application/json' });
  formData.append('files', fileBlob, 'package.json');

  try {
    const res = await fetch("https://version-control-backend-ssgn.onrender.com/repo/create", {
      method: "POST",
      body: formData
    });
    const text = await res.text();
    const data = JSON.parse(text);
    console.log("DETAILS:", data.details);
    console.log("STACK FIRST LINE:", data.stack.split('\\n')[0]);
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}

testFetch();
