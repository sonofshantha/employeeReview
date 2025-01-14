import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import Employee from '../models/Employee.js';
import Review from '../models/Review.js';
import jwt from 'jsonwebtoken';
export async function getEmployees(req,res){
    const employees = await Employee.find();
    res.render('admin/employees', { employees });
}

export async function addEmployees(req,res){
    const { name, email, password,employeeId,isAdmin} = req.body;
    const employee = await Employee.findOne({_id:employeeId});
    if(employee){
       employee.name = name;
       employee.email = email;
       employee.isAdmin = isAdmin;
       employee.save()
    }else{
 const hashedPassword = await bcrypt.hash(password, 10);
 const newEmployee = new Employee({ name, email, password: hashedPassword });
 await newEmployee.save();
}
 res.redirect('/admin/employees');
}

export async function removeEmployees(req,res){
    const { employeeId } = req.body;
    await Employee.findByIdAndDelete(employeeId);
    res.redirect('/admin/employees');
}

export async function assignReview(req,res){
    if(req.body.reviewId){
        let review = await Review.findById(req.body.reviewId)
        review.review = req.body.review;
        review.status = "done"
        await review.save();
        res.redirect('/admin/reviews');
    }else{
  const { reviewerId, revieweeId } = req.body;
  const newReview = new Review({ reviewerId, revieweeId });
  await newReview.save();
  res.redirect('/admin/reviews');
}
}

export async function getReviews(req,res){
    const decoded = jwt.verify(req.cookies.token, 'secretKey');
    const reviews = await Review.aggregate([
      {
        $match: { reviewerId: new mongoose.Types.ObjectId(decoded.id) }  // Ensure reviewerId is an ObjectId
      },
      {
        $lookup: {
          from: 'employees',  // Ensure this is the correct collection
          localField: 'reviewerId',  // Field from the Review collection
          foreignField: '_id',  // Field from the Employee collection
          as: 'reviewerDetails'  // Output array of reviewer details
        }
      },
      {
        $unwind: { 
          path: '$reviewerDetails', // Unwind the reviewerDetails array into a single object
          preserveNullAndEmptyArrays: true // Prevent errors if no matching reviewer is found
        }
      },
      {
        $lookup: {
          from: 'employees',  // The collection to join (same as before)
          localField: 'revieweeId',  // Field from the Review collection
          foreignField: '_id',  // Field from the Employee collection
          as: 'revieweeDetails'  // Output array of reviewee details
        }
      },
      {
        $unwind: { 
          path: '$revieweeDetails', // Unwind the revieweeDetails array into a single object
          preserveNullAndEmptyArrays: true // Prevent errors if no matching reviewee is found
        }
      },
      {
        $project: {  // Select the fields you want to return
          _id: 1,
          review:1,
          'reviewerDetails.name': 1,
          'reviewerDetails._id': 1,
          'revieweeDetails.name': 1,
          'revieweeDetails._id': 1,
          feedback:1
        }
      }
    ]);
    let employee = await Employee.findOne({_id:decoded.id})
    let employees = await Employee.find()
   res.render('admin/reviews', { employees,curemployee:employee,reviews});
}