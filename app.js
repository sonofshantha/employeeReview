import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import path from 'path';
import { adminRoutes } from './routes/adminRoutes.js';
import { employeeRoutes } from './routes/employeeRoutes.js';

const app = express();

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/performanceFeedback', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(path.resolve(), 'views'));
app.use(cookieParser());

// Static files (for styling)
app.use(express.static(path.join(path.resolve(), 'public')));

// Routes
app.use('/admin', adminRoutes);
app.use('/employee', employeeRoutes);

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
