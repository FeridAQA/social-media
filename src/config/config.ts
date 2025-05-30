import * as dotenv from 'dotenv';
import * as path from 'path';

// dotenv.config({
//     path: path.resolve(__dirname, '../../.env')
// })

 const envPath = path.join(__dirname, '..',"..", '.env');
dotenv.config({ path: envPath });

export default{

    port:process.env.PORT || 3000,

  database: {
    host: process.env.POSTGRES_HOST,
    port: +process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
  },
    

    databaseURL: process.env.DATABASE_URL ,

    jwtSecret: process.env.JWT_SECRET
}
