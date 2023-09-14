import path from 'path';
import express from 'express';
import multer from 'multer';
const router = express.Router();

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
        //image-date-extension
    }
});


function checkFileType (file, cb) {
    const filetypes = /jpg|jpeg|png/; //regEx
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if(extname && mimetype) { 
        return cb ( null, true);  //callback
        //cb 1st argument is error, so set it as null
    } else {
         cb('Images only !');
    }
}

const upload  = multer ({
    storage,
});

router.post('/', upload.single('image'), (req, res) => { //single() contains feild name
    res.send({
        message: 'Image Uploaded!',
        image: `/${req.file.path}`,
        
    })
    console.log(image);
})

export default router;