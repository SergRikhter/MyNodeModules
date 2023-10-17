import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
 
let decrypt =""; 
/***
 * Create new JWT key 
 * Создаёт JWT ключ
 */
export async function createJWT(user){
    try{
        if(user)
        {
            let encrypt=jwt.sign(JSON.parse(JSON.stringify(user)), process.env.JWT_SECRET);
            return encrypt;
        }
    }catch(err){   
            return err 
    }
}
/**
 * Декодирует текущий JWT 
 * Decode JWT currently 
 * @param {*} token 
 * @returns 
 */
export async function decodeJWT(token)
{
  if(token)
  {
      decrypt =  jwt.verify(token, process.env.JWT_SECRET);
      return decrypt;
  }else{
      console.error("Token is missing");
  }
}