const fs = require('fs');

async function testFetch() {
  const formData = new FormData();
  formData.append('name', 'TestRepo3');
  formData.append('owner', '65f4c541b5161d7b1a201c10');
  
  const fileBlob = new Blob([fs.readFileSync('package.json')], { type: 'application/json' });
  formData.append('files', fileBlob, 'package.json');

  try {
    const res = await fetch("http://localhost:3000/repo/create", {
      method: "POST",
      body: formData
    });
    const text = await res.text();
    console.log("Response:", text);
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}

testFetch();
