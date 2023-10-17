import dotenv from 'dotenv';
import Minio from 'minio';
dotenv.config();

const storage = new Minio.Client({
      endPoint: process.env.MINIO_SERVER, 
      port: process.env.MINIO_PORT,  
      useSSL: false,  
      accessKey: process.env.MINIO_USER, 
      secretKey: process.env.MINIO_PASSWORD 
 });

 storage.on('error', () => {
    console.error(`[${new Date().toLocaleString()}]   : MinIO module: Connect refused check available service`);
});

export async function connect()
{
    try {
     const connection = await minioClient.ping().then(connection =>{
        `[${new Date().toLocaleString()}]   : MinIO module: Connect refused check available service`
     });

    } catch (error) {
          // Если возникла ошибка, значит, подключение не удалось
          console.error('Ошибка подключения к MinIO:', error);
        }
}
 export async function Create()
 {

 }

 export async function Delete()
 {
    
 }

 export async function Update()
 {
    
 }
