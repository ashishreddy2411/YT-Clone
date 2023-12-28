import express from 'express';
import {asyncHandler} from '../utils/asyncHandler.js';

const registerUser= asyncHandler(async (req, res) => {
    const { username, fullname, email, password } = req.body;
    console.log("Username: ", username);
   // const user = await User.create({ username, fullname, email, password });
    res.status(200).json({ message: 'OK' });
});


export { registerUser}