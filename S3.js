import AWS from 'aws-sdk';
import aws4 from 'aws4';
import fs from 'fs';

let file={}; 

AWS.config.update({
    accessKeyId: ' ',
    secretAccessKey: ' ',
    region: ' ',
    ACL: ' ',
    signatureVersion: ' '
});

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
                Resource: [`arn:aws:s3:::mbox-userstorage/*`,`arn:aws:s3:::mbox-userstorage`],
            }
        ]
    })
};

const s3 = new AWS.S3();

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

let file = {};

/**
 * Генерация объекта файла для загрузки в S3
 * Generating a file object for S3 storage
 * @param {string} filename - имя файла
 * @param {string} folder - папка в S3
 * @param {string} options - тип файла (текст, изображение, музыка)
 * @returns {Object|false} - объект файла для загрузки или false в случае ошибки
 */
const selectFile = async (filename, folder, options) => {
    if (!filename) {
        console.error("selectFile :: Файл не найден");
        return false;
    }

    const filePath = path.join(folder, filename);  // Используем путь для упрощения

    switch (options) {
        case "text":
            return {
                Body: await fs.promises.readFile(filename),
                Bucket: "mbox-userstorage",
                Key: filePath
            };
        
        case "image":
            return {
                Body: fs.createReadStream(filename),
                Bucket: "mbox-userstorage",
                Key: filePath,
                ContentType: 'image/jpeg'
            };

        case "music":
            // Пример для музыки, если файл был бы реализован
            return {
                Body: fs.createReadStream(filename),
                Bucket: "mbox-userstorage",
                Key: filePath,
                ContentType: 'audio/mp3'
            };

        default:
            console.error("selectFile :: Неверный тип файла");
            return false;
    }
};

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
    console.error("createBucket :: Empty bucket name");
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
        console.error("forEachObject :: Empty params");
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
         console.error("listObject::Empty bucket name");
    }
}

/**
 * Загрузка текстового файла 
 * Load files 
 * @param {*} filename 
 */
const uploadFile = async (filename, location, fileType) => {
    try {
        const currentFile = await selectFile(filename);
        if(await selectFile(filename,location,fileType) !== false)
        {
            s3.upload(file, (err, data) => {
                err ?  console.error('Ошибка при загрузке файла на S3:', err) :  console.log('Файл успешно загружен на S3. Детали:', data );
            });
           //  await setPolicy();
         // await readHeadObject();
        }else{
            console.error("uploadFile :: File missing! Abort ...")
        }
    } catch (error) {
        console.error('Ошибка при чтении файла:', error);
    }
};

const deleteFileStorage = async (filename, location, fileType) =>{
    try{
        /*
        s3.update(await selectFile(filename,location,fileType), (data,err)=>{
            err ? console.error("UpdateFileStorage:: Storage can't updated") : console.log("UpdateFileStorage::Storage updated successfull!");
        }); */
    }catch(err){
        console.error('UpdateFileStorage:: ' + err);
    }
}

const copyFileStorage = async (from, to)=>{

};

const deleteBucket = async(bucketName)=>{

};

/*
const readHeadObject = async (filename) =>{
  try{
    s3.headObject({Bucket:'mbox-userstorage', Key:'1.jpg'}, (data)=>{
         console.log("Head object:" + data);
    })
  }catch(err){
    console.error("Image didn't loaded , because"+err);
  }
}
*/
//await uploadFile(); -- Ошибка
//await uploadFile('src/5.png',"User_Images/Sergey", "image");
//await updateFileStorage('src/2.jpg',"User_Images/Sergey", "image");
//createBucket("mbox666");
//await listObject("mbox-userstorage")
