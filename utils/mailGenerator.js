const fetch = require('node-fetch');
 require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });



const MODEL = 'mistralai/Mistral-7B-Instruct-v0.3';

/**
 * Generate a professional email using Hugging Face (Mistral-7B-Instruct-v0.3).
 * 
 * @param {string} preferredTone - 'friendly', 'formal', 'persuasive', etc.
 * @param {string} message - the core message to include in the email
 * @returns {Promise<{ subject: string, body: string }>}
 */
async function generateEmail(preferredTone, message) {
  const prompt = `
You're an AI email writer. Write a ${preferredTone} email using the following message:
"${message}"

Make sure the email has a clear subject line and a well-structured body.

Format:
Subject: <subject here>
Body:
<body here>
`;

  const response = await fetch(`https://api-inference.huggingface.co/models/${MODEL}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: prompt,
        parameters: {
            max_new_tokens: 512,
            temperature: 0.7,
            return_full_text: false,
            stop: ["\n\nBest regards", "\n\nSincerely", "\n\nThank you"]
        },
    }),
  });

  const result = await response.json();

  if (result.error) {
    throw new Error(result.error);
  }

  const generatedText = result[0]?.generated_text?.trim() || '';

  const subjectMatch = generatedText.match(/Subject:\s*(.*)/i);
  const bodyMatch = generatedText.match(/Body:\s*([\s\S]*)/i);
  console.log("lol");
  return {
    subject: subjectMatch ? subjectMatch[1].trim() : 'No subject found',
    body: bodyMatch ? bodyMatch[1].trim() : generatedText,
  };
}

module.exports = generateEmail;
