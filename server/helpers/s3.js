const fs = require('fs');
/*const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
});*/


const uploadFileToS3 = async (filename_path) => {
    // get content of file in local
    const file_content = fs.readFileSync(filename_path);

    // Setting up S3 upload parameters
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: filename_path.replace('./server', 'server'),
        Body: file_content
    };

    // Uploading files to the bucket
    await s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }

        // delete it after 5 secs to allow serving local in case they ask inmediatly it is uploaded
        setTimeout(function() {
            if (fs.existsSync(filename_path)) {
                fs.unlinkSync(filename_path);
            }
        }, 5000);
    });
};


const deleteFileFromS3 = async (filename_path) => {

    // Setting up S3 upload parameters
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: filename_path.replace('./server', 'server')
    };

    // Uploading files to the bucket
    await s3.deleteObject(params, function(err, data) {
        if (err) {
            throw err;
        }
        if (fs.existsSync(filename_path)) {
            fs.unlinkSync(filename_path);
        }
    });
};

const readFileFromS3 = (filename_path) => {

    return new Promise((resolve, reject) => {

        // Setting up S3 upload parameters
        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: filename_path.replace('./server', 'server')
        };

        s3.getObject(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};


module.exports = {
    readFileFromS3,
    uploadFileToS3,
    deleteFileFromS3
};
