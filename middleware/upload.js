const multer = require("multer");
const multerS3 = require("multer-s3");
const dotenv=require("dotenv");
dotenv.config();

const { S3Client } = require("@aws-sdk/client-s3");


// S3 CONFIG
const s3 = new S3Client({
    region: process.env.AWS_REGION,

    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY
    }
});


// MULTER CONFIG
const upload = multer({

    storage: multerS3({

        s3: s3,

        bucket: process.env.AWS_BUCKET_NAME,

        metadata: function (req, file, cb) {

            cb(null, {
                fieldName: file.fieldname
            });

        },

        key: function (req, file, cb) {

            let folder = "others/";

            // PROFILE IMAGE
            if (file.fieldname === "profilePic") {
                folder = "profile/";
            }

            // TRIP MEDIA
            if (file.fieldname === "media") {
                folder = "trips/";
            }

            const fileName =
                folder +
                Date.now() +
                "-" +
                file.originalname;

            cb(null, fileName);

        }
    })

});


module.exports = upload;