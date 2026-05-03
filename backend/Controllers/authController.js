import bcrypt from "bcryptjs"
import pool from "../config/db.js"
import jwt from "jsonwebtoken"
import dotenv from 'dotenv'

dotenv.config()

export const register = async (req,res) => {
  try{
    const { username, password} = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const exist = await pool.query(
      "select * from users where username = $1",[username]
    )

    if(exist.rows.length > 0){
      return res.status(400).json({message:"User already exists"});
    }

    const hashed = await bcrypt.hash(password,10);

    await pool.query(
      "INSERT INTO users (username, password) values ($1, $2)",
      [username, hashed]
    );

    res.json({ message : "User created"});
  }catch(error){
    res.status(500).json({message:"Internal server error"});
  }
}


export const login = async (req,res) => {
  try{
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE username=$1",
      [username]
    );

    const user = result.rows[0];
    if(!user) return res.status(400).json({message: "No user"});

    const passwordMatch = await bcrypt.compare(password,user.password);
    if (!passwordMatch){
      return res.status(400).json({message:"Wrong Password"});
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d"}
    );

    res.json({token});
  }catch(error){
    res.status(500).json({message:"Internal server error"});
  }
}