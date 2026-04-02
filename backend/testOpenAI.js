const OpenAI = require("openai");
require("dotenv").config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function testOpenAI() {
  try {
    const aiResp = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a code reviewer. Review the contents of the file."
        },
        { role: "user", content: "console.log('test');" }
      ],
    });

    console.log("Success AI:", aiResp.choices[0].message.content);
  } catch (err) {
    console.error("AI check error thrown:", err);
  }
}

testOpenAI();
