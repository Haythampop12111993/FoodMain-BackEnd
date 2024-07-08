// const multer = require("multer");

// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: {
//     fileSize: 10000000,
//   },
// });

// module.exports = upload;

//
// const multer = require("multer");
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads");
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.fieldname + "-" + Date.now());
//   },
// });
// const upload = multer({ storage: storage });

// module.exports = upload;
/////
const multer = require("multer");
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

module.exports = upload;
