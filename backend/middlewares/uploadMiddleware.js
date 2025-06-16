const multer = require("multer")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});


// File Filter
const fileFilter = (req, file, cb) => {
    // Accept image files only
    const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
    if (allowedTypes.includes(file.mimetype)) {
        cd(null, true);
    } else {
        cd(null, false);
    }
}

const upload = multer({ storage: storage }).single("image");

module.exports = upload;