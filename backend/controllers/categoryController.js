import asyncHandler from '../middleware/asyncHandler.js';
import Category from '../models/CategoryModel.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();

  res.json({ categories });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getCategoryById = asyncHandler(async (req, res) => {
  // NOTE: checking for valid ObjectId to prevent CastError moved to separate
  // middleware. See README for more info.

  const category = await Category.findById(req.params.id);
  if (category) {
    return res.json(category);
  } else {
    // NOTE: this will run if a valid ObjectId but no product was found
    // i.e. product may be null
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
  const category = new Category({
    name: 'Sample name',
    image: { path: '/images/sample.jpg' },
  });

  const createdCategory = await category.save();
  res.status(201).json(createdCategory);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
  const { name, image } = req.body;
  console.log('name :>> ', name, req.params.id, image);
  const category = await Category.findById(req.params.id);

  if (category) {
    category.name = name;
    category.image = image;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    await Category.deleteOne({ _id: category._id });
    res.json({ message: 'Category removed' });
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private

export {
  getCategories,
  getCategoryById,
  updateCategory,
  createCategory,
  deleteCategory,
};
