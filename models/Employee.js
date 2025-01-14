import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;
