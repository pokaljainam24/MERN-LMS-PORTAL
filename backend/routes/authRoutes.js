const { Router } = require("express");
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const AuthRouter = Router();

AuthRouter.post("/register", registerUser);
AuthRouter.post("/login", loginUser);

AuthRouter.get("/profile", protect, getUserProfile);
AuthRouter.put("/profile", protect, updateUserProfile);

AuthRouter.post("/upload-image", upload, (req, res) => { 
    if(!req.file){
        return res.status(400).json({ message: "No file uploaded" });
    }
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.status(200).json({ message: "Image uploaded successfully", imageUrl });
})



module.exports = AuthRouter;