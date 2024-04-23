const multer = require("multer");
const {v4: uuidv4} = require("uuid");

// For extension of file
const path = require("path");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //   ye image uplaod ho k is path pe jayegi
      cb(null, './public/images/uploads')
    },
    filename: function (req, file, cb) {
      const uniquename = uuidv4();  
      cb(null, uniquename+path.extname(file.originalname));
    }
  })
  
  const upload = multer({ storage: storage })

  module.exports= upload;