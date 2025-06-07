import * as dotenv from 'dotenv';
import * as path from 'path';

const envPath = path.join(__dirname, '..', "..", '.env');
dotenv.config({ path: envPath });

export default {

  port: process.env.PORT || 3000,

  database: {
    host: process.env.POSTGRES_HOST,
    port: +process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
  },


  // jwt config
  jwtSecret: process.env.JWT_SECRET,

  // smtp config
  smtp: {
    from: process.env.SMTP_FROM,
    host: process.env.SMTP_HOST,
    port: +process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSOWRD,
  },

  // App url
  appUrl: process.env.APP_URL,

}
