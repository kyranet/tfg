require('dotenv').config();
const path = require('path');
const { emptyS3Directory, s3CopyFolder } = require('./helpers');

process.env.DEBUG = 'mongo-seeding';
const { Seeder } = require('mongo-seeding');
const config = { database: process.env.DB_CONNECTION, dropDatabase: false };

// drop db
const MongoClient = require('mongodb').MongoClient;
MongoClient.connect(process.env.DB_CONNECTION, { useUnifiedTopology: true }, function(err, db) {
  if (err) throw err;
  var dbo = db.db("portalaps");
  dbo.dropDatabase(function(err, dropped) {
    if (err) { throw err; }
    if (dropped) { console.log("Database dropped"); }
    db.close();
  });
});

// reset s3
emptyS3Directory(process.env.S3_BUCKET_NAME, 'server/').then( () => {
  console.log('Director server de S3 borrado');
  s3CopyFolder(process.env.S3_BUCKET_NAME, 'demo/', 'server/').then( () => {
    console.log('Director demo de server de S3 copiado a directorio server');

    // import
    const seeder = new Seeder(config);
    const collections = seeder.readCollectionsFromPath(path.resolve(__dirname + '/data'));
    seeder
      .import(collections)
      .then(() => { console.info('database seeded'); process.exit(0); })
      .catch(err => { console.error(err); process.exit(1); });

  }).catch(err => console.error(err));
}).catch(err => console.error(err));
