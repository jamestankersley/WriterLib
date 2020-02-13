const fs = require('fs');
const AWS = require('aws-sdk');
const PdfHandling = require("../pdfsplit"); 
const pdfHandling = new PdfHandling(); 
const ID = process.env.JID;
const SECRET = process.env.JSECRET;
const BUCKET_NAME = process.env.JBUCKET;

const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET,
    bucket: BUCKET_NAME,
});

class AwsHandling{

    upload(fileName, bookId){
        // Setting up S3 upload parameters
        const params = {
            Bucket: BUCKET_NAME,
            Key: `book${bookId}.pdf`, // file name we want to save as in S3
            Body: fileName.data,
            ContentType: "application/pdf"
        };

        //Uploading files to the bucket
        s3.upload(params, function(err, data) {
            if (err) {
                throw err;
            }
            console.log(`File uploaded successfully. ${data.Location}`);
        }); 
    }    
    
    listObjects(){
       
        var params = {
            Bucket: BUCKET_NAME, 
            MaxKeys: 2
           };
           s3.listObjects(params, function(err, data) {
             if (err) console.log(err, err.stack); // an error occurred
             else     console.log(data); 
            }); 
        }   

    retrieveFile(fileName, bookId){

        var params = {
            Bucket: BUCKET_NAME, 
            Key: fileName
        };
    
        s3.getObject(params, function(err, data) {
            if (err) {
                console.log(err, err.stack); // an error occurred
            } else {
                console.log(data); 
                pdfHandling.createTempBookFolder(bookId); 
                fs.writeFileSync(`./tmp/${bookId}/book${bookId}.pdf`, data.Body); 
                console.log(`./tmp/${bookId}/book${bookId}.pdf has been created!`);
            }     
            
        }); 
    }

}

module.exports= AwsHandling; 
