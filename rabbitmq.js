import dotenv from 'dotenv';
import rabbit from 'amqplib';
import {v4 } from 'uuid';
dotenv.config();

let connection =0; 
let channel = 0;
let connectString = process.env.CONNECTION_URI_RABITMQ || 'amqp://user:password@rabbitmq:5672';
let queue = "queue_event";

export async function RabbitMQConnection() 
{
    try{
         connection = await rabbit.connect(connectString);
         channel= await connection.createChannel();
         console.log(`[${new Date().toLocaleString()}]   : RabbitMQ Module : Connection successfully`);
         return true;
    }catch(err){
          console.error(`[${new Date().toLocaleString()}] : RabbitMQ Module : ${err} `);
         return false;
    }
}
export async function SendQuery(redisKey,email, template,username)
{
    try{
         connection = await rabbit.connect(connectString);
         channel= await connection.createChannel();
        await channel.assertQueue(queue, { durable: false });
        const message = {
            To: `${email}`,
            Id: `${redisKey}`,
            Body: JSON.stringify({
               Template: `${template}`,
               Name: `${username}`
            })
          };
        await channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    }catch(err){
        console.log(`[${new Date().toLocaleString()}] : RabbitMQ Module : ${err} `);
    }
}