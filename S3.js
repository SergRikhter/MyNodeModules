import AWS from 'aws-sdk';
import fs from 'fs/promises';

let file={}; 
AWS.config.update({
    accessKeyId: 'AccessKeyId',
    secretAccessKey: 'SecretAccessKeyId',
    region: 'region',
    signatureVersion: 'v4'
});

const s3 = new AWS.S3();

/**
 * Bucket object policy
 * Политика bucket объекта
 */

const bucketPolicy = {
    Bucket: 'mbox-userstorage',
    Policy: JSON.stringify({
        Version: '2012-10-17',
        Statement: [
            {
                Effect: 'Allow',
                Principal: '*',
                Action: 's3:GetObject',
                Resource: `arn:aws:s3:::mbox-userstorage/*`
            }
        ]
    })
};

/**
 * Set bucket object policy
 * Установка политики для Bucket объекта
 */
const setPolicy = async () =>{
    s3.putBucketPolicy(bucketPolicy, (policyErr, policyData) => {
        if (policyErr) {
            console.error('Ошибка при установке политики бакета:', policyErr);
        } else {
            console.log('Политика бакета успешно установлена. Детали:', policyData);
        }
    });
}

/**
 * Generating a file object for S3 storage
 * @param {*} filename 
 * @returns 
 */
const selectFile = async (filename) =>{
    if(filename)
    {
        file={
            Body : await fs.readFile(filename),
            Bucket: "mbox-userstorage",
            Key:filename === undefined ?  undefined : filename
        }
        return file;
    }else{
          console.error("File is missing");
        return false;
    }
}

/**
 * Create new bucket
 * Создание новой корзины
 */

const createBucket = (bucketName) =>{
 if(bucketName)
 {
   s3.createBucket({Bucket: bucketName }, (err,data)=>{
      err ? console.error("Ошибка создания корзины S3" + err) : console.log("Корзина успешно создана: "+ data);
   })
 }else{
    console.error("Empty bucket name");
 }
}

/**
 * Выводит содержимое объекта
 * List object
 * @param {*} object 
 */
const forEachObject =(object) =>{
    if(object){
        Object.entries(object).forEach(items => {
            console.log(items);
          });  
    }else{
        console.error("Empty params");
    }
}

/**
 * Displaying the contents of the current bucket
 * Выводит содержимое текущей корзины 
 * @param {*} bucketName 
 */
const listObject = async (bucketName) =>{
    if(bucketName){
      s3.listObjects({Bucket: bucketName}, (err,data)=>{
            err ? console.log("I can't listing object , because " + err ) : forEachObject(data);
        })
    }else{
        console.error("Empty bucket name");
    }
}

/**
 * Загрузка файлов
 * Load files 
 * @param {*} filename 
 */
const uploadFile = async (filename) => {
    try {
        if(await selectFile(filename) !== false)
        {
            s3.upload(file, (err, data) => {
                err ?  console.error('Ошибка при загрузке файла на S3:', err) :  console.log('Файл успешно загружен на S3. Детали:', data);
            });
            await setPolicy();
        }else{
            console.error("File missing! Abort ...")
        }
    } catch (error) {
        console.error('Ошибка при чтении файла:', error);
    }
};

//await uploadFile(); -- Ошибка
//await uploadFile('src/example.txt');
//createBucket("mbox666");
//await listObject("mbox-userstorage")

