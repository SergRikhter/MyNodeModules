import dotenv from 'dotenv';
import { createClient } from 'redis';
dotenv.config();

const redis = createClient({
     url: process.env.CONNECTION_URI_REDIS,
  });

redis.on('error', () => {
    console.error(`[${new Date().toLocaleString()}]   : Redis module:[Service] Connect refused check available service`);
});
 redis.on("connect",() =>{
      console.log(`[${new Date().toLocaleString()}]   : Redis module:[Service] Connection successfull`);
 }) 

await redis.connect();

/**
 * Создаёт ключ и значение ключа
 * Create new redis key and set key-value too  
 * @param {*} key 
 * @param {*} object 
 */
export async function RedisSetValue(key,object,timeout=3600)
{
    try {
        await redis.set(key,object,{
            EX:timeout,
            NX:true
        });
    } catch (error) {
        console.error(`[${new Date().toLocaleString()}] : Redis module: [Service Exceptions]: + ${error}`);
        throw error;
    } 
}
/**
 * An current function checking key 
 * Проверяет существует ключ или нет
 * @param {*} key 
 */
export async function RedisExistKey(key)
{
    try{
        const keyRedis= await redis.exists(key);
        if(keyRedis)
        {  
           return true;
        }else{
            console.error(`[${new Date().toLocaleString()}] : Redis module: [RedisGetKey()]: Key not found `);
          return false;  
        }
    }catch(ex){

    }
}
/**
 * An current function removed key 
 * Удаляет ключ
 * @param {*} key 
 * @returns 
 */
export async function RedisDelKey(key)
{
    if(key)
    {
      return (await redis.del(key));
    }else{
        console.error(`[${new Date().toLocaleString()}] : Redis module: [RedisDelKey()]: Empty params `);
    }
}

/**
 * Get key value
 * Получает значение ключа
 * @param {*} key 
 * @returns 
 */

export async function RedisGetValue(key)
{
    try{
        return (await redis.get(key));    
    }catch(ex){
        console.error(`[${new Date().toLocaleString()}] : Redis module: [RedisGetValue()]: ${ex}`);
    }
}

