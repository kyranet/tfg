// general
const { getObjectId, getObjectIds } = require('mongo-seeding');
const uuid = require("uuid");
const faker = require('faker');
faker.locale = 'es';

//db
const { dbConnection } = require('./../../database/config');
dbConnection();

// models
const Upload = require('../../models/upload.model');

// s3
const fs = require('fs');
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
});


const mapToEntities = (names) => {
  return names.map((name) => {
    const id = getObjectId(name);

    return {
      id,
      name,
    };
  });
};


// helper obtenido de stack overflow
async function emptyS3Directory(bucket, dir) {
    const listParams = {
        Bucket: bucket,
        Prefix: dir
    };

    const listedObjects = await s3.listObjectsV2(listParams).promise();

    if (listedObjects.Contents.length === 0) return;

    const deleteParams = {
        Bucket: bucket,
        Delete: { Objects: [] }
    };

    listedObjects.Contents.forEach(({ Key }) => {
        deleteParams.Delete.Objects.push({ Key });
    });

    await s3.deleteObjects(deleteParams).promise();

    if (listedObjects.IsTruncated) await emptyS3Directory(bucket, dir);
}


// helper obtenido de stack overflow
async function s3CopyFolder(bucket, source, dest) {
  // sanity check: source and dest must end with '/'
  if (!source.endsWith('/') || !dest.endsWith('/')) {
    return Promise.reject(new Error('source or dest must ends with fwd slash'));
  }

  const s3 = new AWS.S3();

  // plan, list through the source, if got continuation token, recursive
  const listResponse = await s3.listObjectsV2({
    Bucket: bucket,
    Prefix: source,
    Delimiter: '/',
  }).promise();

  // copy objects
  await Promise.all(
    listResponse.Contents.map(async (file) => {
      await s3.copyObject({
        Bucket: bucket,
        CopySource: `${bucket}/${file.Key}`,
        Key: `${dest}${file.Key.replace(listResponse.Prefix, '')}`,
      }).promise();
    }),
  );

  // recursive copy sub-folders
  await Promise.all(
    listResponse.CommonPrefixes.map(async (folder) => {
      await s3CopyFolder(
        bucket,
        `${folder.Prefix}`,
        `${dest}${folder.Prefix.replace(listResponse.Prefix, '')}`,
      );
    }),
  );

  return Promise.resolve('ok');
}



async function s3CopyFile(bucket, source, dest) {

  const s3 = new AWS.S3();

  await s3.copyObject({
    Bucket: bucket,
    CopySource: `${bucket}/${source}`,
    Key: `${dest}`,
  }).promise();

  return Promise.resolve('ok');
}


function generateRandomFile(subrandom_folder, subrandom_ending, max_random, subfolder, tipo_id, creador) {
    const random_name = `${ uuid.v4() }.jpg`;
    const random_fullname = `server/uploads/${subfolder}/${ random_name }`;
    const random_demo_name = `${ Math.floor(Math.random() * max_random) + 1   }-${ subrandom_ending }`;
    s3CopyFile(process.env.S3_BUCKET_NAME, `random/${ subrandom_folder }/${ random_demo_name }`, random_fullname);

    const upload = new Upload;
    upload._id = getObjectId(random_fullname);
    upload.almacenamiento = "s3";
    upload.campo = "default";
    upload.tipo = subfolder;
    upload.tipo_id = tipo_id;
    upload.path =  './' + random_fullname;
    upload.client_name =  random_demo_name;
    upload.nombre =  random_name;
    upload.creador =  creador;
    createdAt = new Date();
    updatedAt = new Date();
    upload.save(function (err, results) {
      if(err) {console.log(err)}
    });

    return getObjectId(random_fullname);
}

function generateRandomImage(subfolder, tipo_id, creador) {
  return generateRandomFile('imagenes', 'demo.jpg', 30, subfolder, tipo_id, creador);
}

function generateRandomDocument(subfolder, tipo_id, creador) {
  return generateRandomFile('documentos', 'demo.pdf', 5, subfolder, tipo_id, creador);
}

function generateMessages(nombre, apellidos, email, rol, texto) {

   let date = faker.date.recent();

  return {
      texto: texto,
      uid: getObjectId(email),
      email: email,
      nombre: nombre,
      apellidos: apellidos,
      rol: rol,
      fecha: date,
    };
}

function sortMessages(messages) {
  return messages;
}

module.exports = {
  mapToEntities,
  getObjectId,
  getObjectIds,
  emptyS3Directory,
  s3CopyFolder,
  s3CopyFile,
  generateRandomImage,
  generateRandomDocument,
  generateMessages,
  sortMessages
};



