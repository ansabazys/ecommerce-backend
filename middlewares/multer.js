import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = "uploads/others";

    if (req.originalUrl.includes("categories")) {
      folder = "uploads/categories";
    } else if (req.originalUrl.includes("products")) {
      folder = "uploads/products";
    }
    
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
