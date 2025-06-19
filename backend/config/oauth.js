// Configuration for OAuth providers (Google)
module.exports = {
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    scope: ['profile', 'email'], // What data we request from Google
    prompt: 'select_account' // Optional: Forces account selection
  },
};