'use strict';

import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    define: {
      timestamps: false
    },
    logging: false,  
  }
);


(async () => {
  try {
    await db.authenticate();
    console.log(`[${new Date().toLocaleString()}]   : DB Module : Database connected successfully`);
  } catch (error) {
    const timestamp = `[${new Date().toLocaleString()}]`;

    if (error instanceof Sequelize.ConnectionError) {
      console.error(`${timestamp} : DB module [Service] : Service is unavailable. Retry again ...`);
    } else if (error instanceof Sequelize.DatabaseError) {
      console.error(`${timestamp} : DB module [Service] : Database error: ${error.message}`);
    } else {
      console.error(`${timestamp} : DB module [Service] : Unknown error: ${error.message || error}`);
    }
  }
})();

export default db;
