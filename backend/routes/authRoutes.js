const express = require('express');
const { protect } = require('../middleware/authMiddleware');

const {
    registerUser,
    loginUser,
    getUserInfo,
} = require('../controllers/authController');
const upload = require('../middleware/uploadMiddleware'); // Import the upload middleware

const router = express.Router();

// Route for user registration
router.post('/register', registerUser);

// Route for user login
router.post('/login', loginUser);

// Route to get user information (protected route)
router.get('/getUser', protect, getUserInfo);

router.post("/upload-image", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    // You can save the imageUrl to the user's profile or database as needed
    res.status(200).json({ imageUrl });
});

module.exports = router;
