'use strict';
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
dotenv.config();
const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
   dialect: process.env.DB_DIALECT,
   host: process.env.DB_HOST,
   port: process.env.DB_PORT,
   define: {
      timestamps: false
  }
});

db.authenticate()
  .then(() => {
    console.log(`[${new Date().toLocaleString()}]   : DB Module : Db connect successfully`);
  })
  .catch((error) => {
    (error instanceof Sequelize.ConnectionError) ? console.error(`[${new Date().toLocaleString()}] : DB module [Service] : Service is unavailable. Retry again ...`) 
                                                 : console.error(`[${new Date().toLocaleString()}] : DB module [Service] : An error occurred during database authentication.\n Reason: Please check your access rules or login credentials`);
    //(error instanceof SequelizeDatabaseError)    ? console.error(`[${new Date().toLocaleString()}] : DB module [Service] : Database not found`) : console.error(`[${new Date().toLocaleString()}] : DB module [Service] : ${error}`);                                            
  });

export default db;
