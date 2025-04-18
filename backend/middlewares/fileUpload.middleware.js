import multer from 'multer';
import { env } from '../env.js';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';

const s3 = new S3Client({
    region: env.MY_AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: env.MY_AWS_BUCKET_ACCESS_KEY,
        secretAccessKey: env.MY_AWS_BUCKET_SECRET_KEY,
    },
});

const storage = multerS3({
    s3: s3,
    bucket: env.MY_AWS_BUCKET_NAME,
    key: (req, file, cb) => {
        const filename =
            `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`.toLowerCase();
        cb(null, `${filename}`);
    },
});

const fileFilter = function (req, file, cb) {
    const allowedTypes = [
        'image/png',
        'image/jpg',
        'image/jpeg',
        'image/webp',
        'video/mp4',
        'video/webm',
        'video/ogg',
        'video/avi'
    ];
    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error('Invalid file type'));
    }
    cb(null, true);
};

const limits = {
    fileSize: 1024 * 1024 * 5,
    fieldNameSize: 100,
};

const upload = multer({
    storage: storage,
    limits: limits,
    fileFilter: fileFilter,
}).fields([{ name: 'file', maxCount: 1 }, { name: 'files', maxCount: 5 }]);

export { upload };
