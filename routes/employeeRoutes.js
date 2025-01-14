import express from 'express';
import Employee from "../models/Employee.js";
import bcrypt from 'bcryptjs';
import Review from '../models/Review.js';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const router = express.Router();
// Render Registration Page
router.get('/register', (req, res) => {
  res.render('employee/register'); // Renders the registration view
});

// Handle Registration
router.post('/register', async (req, res) => {
  const { name, email, password, admin} = req.body;
  
  // Check if the email already exists
  const existingEmployee = await Employee.findOne({ email });
  if (existingEmployee) {
    return res.status(400).send('Email already in use');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newEmployee = new Employee({ name, email, password: hashedPassword,isAdmin: admin == "admin"?true:false});
  await newEmployee.save();
  res.redirect('/employee/login'); // Redirect to login after registration
});

// Render Login Page
router.get('/login', (req, res) => {
  res.render('employee/login'); // Renders the login view
});

// Handle Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  const employee = await Employee.findOne({ email });
  if (!employee) {
    return res.status(400).send('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, employee.password);
  if (!isMatch) {
    return res.status(400).send('Invalid email or password');
  }
      
  const token = jwt.sign({ id: employee._id, isAdmin: employee.isAdmin }, 'secretKey');
     req.employee = employee
  if(employee.isAdmin){
    res.cookie('token', token).redirect("/admin/reviews")
  }else{
    res.cookie('token', token).redirect('/employee/review'); // Redirect to employee reviews
  }
  
});
router.post("/submit-feedback",async(req, res)=>{
       const {feedback,reviewId} = req.body;
       let reviews = await Review.findById(reviewId)
       reviews.feedback=feedback
       reviews.save();
       res.redirect("/employee/review")
});

router.get('/review', async (req, res) => {
       const decoded = jwt.verify(req.cookies.token, 'secretKey');
      //  let reviews = await Review.find({revieweeId:decoded.id})
       let reviews = await Review.aggregate([
        { $match: { revieweeId: new mongoose.Types.ObjectId(decoded.id) } },
             {
              $lookup:{
                 from:"employees",
                 localField:"reviewerId",
                 foreignField:"_id",
                 as:"reviewerDetails"
              }
            },
            {
              $unwind:{
                path:"$reviewerDetails",
                preserveNullAndEmptyArrays: true
              }
            },
            {
              $project:{
                  _id:1,
                  review:1,
                  'reviewerDetails.name': 1,
                  reviewerId:1,
                  feedback:1
              }
            }
       ])
       console.log('Reviews:', reviews);
       let employee = await Employee.findOne({_id:decoded.id})
       res.render('employee/reviews',{reviews,employee});
})
export { router as employeeRoutes };
