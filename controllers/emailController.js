// helper to get the most common tone
function getMostCommonTone(recipients) {
  const toneCounts = {};

  recipients.forEach(({ tone }) => {
    if (!tone) return;
    toneCounts[tone] = (toneCounts[tone] || 0) + 1;
  });

  const sortedTones = Object.entries(toneCounts).sort((a, b) => b[1] - a[1]);
  return sortedTones.length > 0 ? sortedTones[0][0] : null;
}

// simple tone-based email generator
function generateEmail(message, tone, recipientEmail) {
  const name = recipientEmail.split('@')[0];
  let intro = '';

  switch (tone) {
    case 'friendly':
      intro = `Hey ${name}, hope you're doing well!`;
      break;
    case 'professional':
      intro = `Dear ${name}, I hope this message finds you well.`;
      break;
    case 'casual':
      intro = `Hi ${name}, just wanted to reach out quickly.`;
      break;
    case 'humorous':
      intro = `Yo ${name}, ready for something fun in your inbox?`;
      break;
    default:
      intro = `Hello ${name},`;
  }

  return `${intro}\n\n${message}\n\nBest regards,\nMarketMaster Bot`;
}

// controller
const generatePreview = (req, res) => {
  const { message, recipients } = req.body;

  if (!message || !recipients || !Array.isArray(recipients)) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  console.log('Received recipients:', recipients);

  const mostCommonTone = getMostCommonTone(recipients);
  if (!mostCommonTone) {
    return res.status(400).json({ error: 'No common tone found' });
  }

  const sampleRecipient = recipients.find(r => r.tone === mostCommonTone);
  if (!sampleRecipient) {
    return res.status(400).json({ error: 'No recipient matches the most common tone' });
  }

  const preview = generateEmail(message, mostCommonTone, sampleRecipient.email);
  if (!preview) {
    return res.status(500).json({ error: 'Failed to generate preview' });
  }

  res.json({
    toneUsed: mostCommonTone,
    recipient: sampleRecipient.email,
    preview
  });
};


module.exports = {
  generatePreview
};
