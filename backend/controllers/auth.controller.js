import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/user.model.js";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";

export const signup = async (req,res)=>{
    try {
        const {name, username, email, password} = req.body
        if(!name || !username || !email || !password){
            return res.status(400).json({message: "Please fill in all fields."})
        }
        
        const exitingEmail = await User.findOne({ email })
        if (exitingEmail) {
            return res.status(400).json({message:"Email already exists"})
         }

        const exitingUsername = await User.findOne({ username })
        if (exitingUsername) {
             return res.status(400).json({message:"Username already exists"})
          }

        if(password.length < 6){
            return res.status(400).json({message:"Password must be at least 6 characters long"})
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            username
        })

        await user.save();

        const token =  jwt.sign( { userId : user._id }, process.env.JWT_SECRET , { expiresIn: "3d" } )

        res.cookie("jwt-linkedin", token, {
            httpOnly: true, // Prevents XSS:client-side JavaScript from accessing the cookie
            maxAge: 3 * 24 * 60 * 60 * 1000,
            sameSite: "strict", // Prevents CSRC : the cookie from being sent to other domains
            secure: process.env.NODE_ENV === "production",
        })

        res.status(201).json({  message:"User created successfully" });

        const profileUrl = process.env.CLIENT_URL + '/profile/' + user.username;

        //todo : send verification email
        try {
            await sendWelcomeEmail(user.email, user.name,profileUrl);
        } catch (emailError) {
            console.error("Error Sending Welcome Email", emailError);
        }

    } catch (error) {
        console.log("Error signing up user:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const login = async (req,res)=>{
    try {
        const {username,password} = req.body
        
        const user = await User.findOne({username});
        if(!user){
            return res.status(400).json({message:"Invalid credentials"});
        }

        const isMatch = bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"});
        }

        const token =  jwt.sign( { userId : user._id }, process.env.JWT_SECRET , { expiresIn: "3d" } )

        res.cookie("jwt-linkedin", token, {
            httpOnly: true, // Prevents XSS:client-side JavaScript from accessing the cookie
            maxAge: 3 * 24 * 60 * 60 * 1000,
            sameSite: "strict", // Prevents CSRC : the cookie from being sent to other domains
            secure: process.env.NODE_ENV === "production",
        })

        res.status(201).json({  message:"Logged in successfully" });

    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const logout = (req,res)=>{
    res.clearCookie("jwt-linkedin");
    res.json({message:"Logged out successfully"});
};

export const getCurrentUser = async(req,res) =>{
    try {
        res.json(req.user);
    } catch (error) {
        console.error("Error getCurrentUser controller:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}