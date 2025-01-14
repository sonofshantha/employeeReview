import express from 'express';
import {authenticate,isAdmin} from "../middleware/auth.js"

import {getEmployees,addEmployees,removeEmployees,assignReview,getReviews} from '../controllers/admin-controller.js';

const router = express.Router();
router.get('/employees', authenticate, isAdmin, getEmployees);

// Admin can add a new employee
router.post('/add-employee', authenticate, isAdmin, addEmployees);

// Admin can remove an employee
router.post('/remove-employee', authenticate, isAdmin, removeEmployees);

// Admin can assign reviews
router.post('/assign-review', authenticate, isAdmin, assignReview);

// Admin can view reviews
router.get('/reviews', authenticate, isAdmin, getReviews);

export { router as adminRoutes };