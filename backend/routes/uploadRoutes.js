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

// const storage = multer.diskStorage({
//     destination: './uploads',
//     filename: (req, file, cb) => {
//       cb(null, `${file.originalname}-${Date.now()}${path.extname(file.originalname)}`);
//     },
//   });


function checkFileType (file, cb) {

    const filetypes = /jpg|jpeg|png/; //regEx
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if(extname && mimetype) { 
        return cb ( null, true); 
        //cb 1st argument is error, so set it as null
    } else {
        // res.setHeader('Contnent=Type', 'text/plain' );
         cb('Images only !');
    }
}

// function checkFileType (req, file, cb) {

//     const filetypes = /jpg|jpeg|png/; //regEx
//     const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

//     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = mimetype.test(file.mimetype);
//     if(extname && mimetype) { 
//          cb ( null, true); 
//         //cb 1st argument is error, so set it as null
//     } else {
//         // res.setHeader('Contnent=Type', 'text/plain' );
//          cb('Images only !');
//     }
// }

const upload  = multer ({
    storage,
    checkFileType
});

// single image upload
router.post('/', upload.single('image'), (req, res) => {
    console.log(req.file);
    res.send({
        message: 'Image Uploaded!',
        image: `/${req.file.path}`,
        
    });
})


//multiple image upload

// router.post('/', upload.array('image', 5), (req, res) => {
//     console.log(req.file);
//     res.send({
//         message: 'Images Uploaded!',
//         images: req/FileSystem.map(file => `/${ file.path }` ),
        
//     });
// })

export default router;