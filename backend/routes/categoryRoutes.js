import express from 'express';
const router = express.Router();
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from '../controllers/categoryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import checkObjectId from '../middleware/checkObjectId.js';

router.route('/').get(getCategories).post(protect, admin, createCategory);
router
  .route('/:id')
  .get(checkObjectId, getCategoryById)
  .put(protect, admin, checkObjectId, updateCategory)
  .delete(protect, admin, checkObjectId, deleteCategory);

export default router;
