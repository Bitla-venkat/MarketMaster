const { google } = require('googleapis');
const base64url = require('base64url');

/**
 * Create an OAuth2 client with the given user's credentials.
 */
const createOAuth2Client = (user) => {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL
  );

  oAuth2Client.setCredentials({
    access_token: user.accessToken,
    refresh_token: user.refreshToken,
  });

  return oAuth2Client;
};

/**
 * Create a base64url-encoded raw email message.
 */
const createEmailBody = ({ from, to, subject, message }) => {
  const emailLines = [
    `From: MarketMaster <${from}>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    'Content-Type: text/plain; charset="UTF-8"',
    '',
    message,
  ];

  const email = emailLines.join('\n');
  return base64url.encode(email);
};

/**
 * Send an email using Gmail API (no nodemailer).
 */
const sendEmail = async (user, to, subject, message) => {
  const auth = createOAuth2Client(user);
  const gmail = google.gmail({ version: 'v1', auth });

  const rawMessage = createEmailBody({
    from: user.email,
    to,
    subject,
    message,
  });

  const result = await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: rawMessage,
    },
  });

  return result.data;
};

module.exports = { sendEmail };
