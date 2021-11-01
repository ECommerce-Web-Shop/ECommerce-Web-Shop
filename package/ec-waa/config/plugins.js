module.exports = ({ env }) => ({
    email: {
      provider: 'sendgrid',
      providerOptions: {
        apiKey: env('SENDGRID_API_KEY'),
      },
      settings: {
        defaultFrom: '18521251@gm.uit.edu.vn',
        defaultReplyTo: '18521251@gm.uit.edu.vn',
        testAddress: '18521251@gm.uit.edu.vn',
      },
    },
  });