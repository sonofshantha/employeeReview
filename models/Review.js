import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee',required:true},
  revieweeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee',required:true },
  feedback: String,
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  review:String
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
