module.exports = {
  url: 'http://localhost:8080',
  port: 3000,
  cookieSecret: 'as7aVtnSDxa20LfOXDBzdEII4cSVezdp',
  sessionTime: 1000 * 60 * 60 * 24 * 30, // 30 days
  likes_limit: 3,
  db: {
    engine: 'postgres',
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'qwerty',
    port: 5432,
    logging: false,
  },
  github: {
    client_id: '6f85928125d9b221f454',
    secret: 'd90a841a6f9bbfaecdb605dd9daa1077a1d69b80',
  },
  nodemailer: {
    service: 'gmail',
    auth: {
      user: 'przekootos@gmail.com',
      pass: 'G8L33UKhet2zADnd',
    },
  },
  mail_address: 'przekootos@gmail.com',
};
