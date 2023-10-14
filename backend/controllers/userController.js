const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Token = require("../models/tokenModel");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

// Define your JWT secret key
const secretKey = 'JWT_SECRET'; // Replace with your actual secret key

const generateToken = (id) => {
    return jwt.sign({ id }, secretKey, { expiresIn: "1d" });
};

// Register User
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please fill in all required fields");
    }
    if (password.length < 6) {
        res.status(400);
        throw new Error("Password must be at least 6 characters long");
    }

    // Check if user email already exists
    const userExist = await User.findOne({ email });

    if (userExist) {
        res.status(400);
        throw new Error("Email has already been registered");
    }

    // Create a new user
    const user = await User.create({
        name,
        email,
        password,
    });

    // Generate Token
    const token = generateToken(user._id);

    // Send HTTP-only cookie
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), // 1 day
        sameSite: "none",
        secure: true
    });

    if (user) {
        const { _id, name, email, photo, phone, bio } = user;
        res.status(201).json({
            _id,
            name,
            email,
            photo,
            phone,
            bio,
            token,
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
   const {email, password} = req.body

   //validate Request
   if(!email || !password) {
    res.status(400);
    throw new Error("Please add email and password");
   }

   //Check if user exist
   const user = await User.findOne({email})

   if(!user) {
    res.status(400);
    throw new Error("User not found, please signup");
   }

   //User exists, check if password is correct
   const passwordIsCorrect = await bcrypt. compare(password, user.password);

       // Generate Token
       const token = generateToken(user._id);

       // Send HTTP-only cookie
       res.cookie("token", token, {
           path: "/",
           httpOnly: true,
           expires: new Date(Date.now() + 1000 *  86400), // 1 day
           sameSite: "none",
           secure: true
       });
   

   if(user && passwordIsCorrect) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(200).json({
        _id,
        name,
        email,
        photo,
        phone,
        bio,
        token, 
    });
   } else {
    res.status(400);
    throw new Error("Invalid email or password");
   }
});

//Logout User
const logout = asyncHandler (async (req,res) => {
    res.cookie("token", "", {
        path: "/",
        httpOnly: true,
        expires: new Date(0),
        sameSite: "none",
        secure: true
    });
    return res.status(200).json({message: "Successfully Logged Out" })
});

//get user data
const getUser = asyncHandler (async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(200).json({
        _id,
        name,
        email,
        photo,
        phone,
        bio,
    });
} else {
    res.status(400);
    throw new Error("User not found");
}
})
// Get login status
const loginStatus = asyncHandler (async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json(false)
    }
    //verify Token
    const verified = jwt.verify(token, secretKey)
    if (verified) {
        return res.json(true)
    }
    return res.json(false)
    
});
// update user
const updateUser = asyncHandler (async (req, res) => {
    const user = await User.findById(req.user._id)
    if (user) {
        const { name, email, photo, phone, bio } = user;
        user.email = email
        user.name = req.body.name || name;
        user.photo = req.body.photo || photo;
        user.phone = req.body.phone || phone;
        user.bio = req.body.bio || bio;

        const updatedUser = await user.save()
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            photo: updatedUser.photo,
            phone: updatedUser.phone,
            bio: updatedUser.bio,
        })
    } else {
        res.status(404)
        throw new Error("User not found")
    }   
})
// Change password
const changePassword = asyncHandler (async (req, res) => {
    const user = await User.findById(req.user._id);

    const {oldPassword, password} = req.body

    if(!user) {
        res.status(400);
        throw new Error("User not found, please signup")
    }
    //Validate
    if(!oldPassword || !password) {
        res.status(400);
        throw new Error("Please add an old password")
    }

    //check if password matches password in the DB
    const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password)

    //save new password 
    if (user && passwordIsCorrect) {
        user.password = password
        await user.save()
        res.status(200).send("Password change successful")
    } else {
        res.status(400);
        throw new Error("Old password is incorrect")
    }
});
// Forgot Password
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        res.status(404).json({ success: false, message: "User does not exist" });
        return;
      }
      // Delete token if it exist in DB
      let token = await Token.findOne({userId: user._id})
      if (token) {
        await token.deleteOne()
      }
  
      // Create reset token
      let resetToken = crypto.randomBytes(32).toString("hex") + user._id;
      console.log(resetToken);
  
      // Hash token before saving to DB
      const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  
      // Save token to DB with an expiration time (e.g., 30 minutes)
      await Token.create({
        userId: user._id,
        token: hashedToken,
        createdAt: Date.now(),
        expiresAt: Date.now() + 30 * 60 * 1000, // 30 minutes in milliseconds
      });
  
      // Construct reset URL
      const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;
  
      // Reset Email
      const message = `
        <h2>Hello ${user.name}</h2>
        <p>Please use the URL below to reset your password</p>
        <p>This reset link is valid for only 30 minutes.</p>
  
        <a href="${resetUrl}" clicktracking="off">${resetUrl}</a>
  
        <p>Regards....</p>
        <p>Inventory Solutions Team</p>
      `;
  
      const subject = "Password Reset Request";
      const sendTo = user.email;
      const sentFrom = process.env.EMAIL_USER;
  
      // Send the email (assuming you have a sendEmail function)
      await sendEmail(subject, message, sendTo, sentFrom);
  
      res.status(200).json({ success: true, message: "Reset email sent" });
    } catch (error) {
      console.error("Error in forgotPassword:", error);
      res.status(500).json({ success: false, message: "Email not sent, please try again" });
    }
  });
  // Reset Password
  const resetPassword = asyncHandler ( async (req, res) => {
     
    const {password} = req.body
    const {resetToken} = req.params

       // Hash token then compare to token in DB
       const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

       //find token in DB
       const userToken = await Token.findOne({
        token: hashedToken,
        expiresAt: {$gt: Date.now()}
       })

       if (!userToken) {
        res.status(404);
        throw new Error ("invalid or expired token")
       }

       //find user
       const user = await user.findOne({_id: userToken.userId})
       user.password = password
       await user.save();
       res.status(200).json({
        message: "Password Successful, Please Login"
       });

  });
  
module.exports = {
    registerUser,
    loginUser,
    logout,
    getUser,
    loginStatus,
    updateUser,
    changePassword,
    forgotPassword,
    resetPassword,
};
