import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = "uploads";
    
    cb(null, folder)

  },
  filename: function(req, file, cb) {
    cb(null, file.originalname)
  }
});


const upload = multer({
    storage
})

export default upload;
