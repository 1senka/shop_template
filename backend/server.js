import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
dotenv.config();
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import fs from 'fs';
const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.delete('/api/images', (req, res) => {
  if (req.body.path)
    fs.unlink(__dirname + req.body.path, (err) => {
      if (err) {
        res.status(500).send({ message: err.message });
      } else {
        res.status(200).send({ message: 'removed successfuly' });
      }
    });
});
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/categories', categoryRoutes);

// if (process.env.NODE_ENV === 'production') {
//   const __dirname = path.resolve();
//   app.use('/uploads', express.static('/var/data/uploads'));
//   app.use(express.static(path.join(__dirname, '/frontend/build')));

//   app.get('*', (req, res) =>
//     res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
//   );
// } else {
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.get('/', (req, res) => {
  res.send('API is running....');
});
// }

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server running  on port ${5000}`));
