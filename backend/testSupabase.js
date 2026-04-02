const supabase = require("./config/Supabase");

async function testSupabase() {
  try {
    const storagePath = `repo-temp/test-${Date.now()}.txt`;
    const buffer = Buffer.from("test upload content");

    console.log("Uploading to Supabase...");
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("VCTRL")
      .upload(storagePath, buffer, { contentType: "text/plain" });

    if (uploadError) {
      console.error("Upload Error:", uploadError);
      return;
    }

    console.log("Generating URL...");
    const { data: urlData, error: urlError } = await supabase
      .storage
      .from("VCTRL")
      .createSignedUrl(storagePath, 3600, { download: "MyCustomFileName.txt" });

    if (urlError) {
      console.error("URL Error:", urlError);
      return;
    }
    console.log("URL Success:", urlData);
  } catch (err) {
    console.error("Caught Exception:", err);
  }
}

testSupabase();
