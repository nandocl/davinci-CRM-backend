import multer from 'multer';
import fs from 'fs';

export class Multer{

    static upload = multer({ storage: multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, 'file')
            },
            filename: function (req, file, cb) {
                cb(null, file.originalname)
            }
        })
    }).single('file');

    static deleteFile(filePath: string){
        fs.unlinkSync(filePath);
    }
}