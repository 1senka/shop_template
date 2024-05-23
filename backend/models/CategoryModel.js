import mongoose from 'mongoose';

const imageSchema = mongoose.Schema({
  path: { type: String, required: true },
});
const categorySchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    image: imageSchema,
  },
  {
    timestamps: true,
  }
);
const Category = mongoose.model('Category', categorySchema);
export default Category;
