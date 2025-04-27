const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const protectedRoutes = require('./routes/protected-routes');
const jobRoutes = require('./routes/job-routes');
const userRoutes = require('./routes/user-routes');
const authRoutes = require('./routes/auth-routes');
const fileRoutes = require('./routes/upload-routes');
const HttpError = require('./models/http-error');
const checkAuth = require('./middleware/check-auth');

const app = express();

app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ------------------ PUBLIC ROUTES (no authentication needed) ------------------
app.use('/api/auth', authRoutes);  // login/signup
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));  // file uploads

// ------------------ PROTECTED ROUTES (authentication needed) ------------------
app.use(checkAuth); // <- Apply authentication middleware after public routes

app.use('/api/jobs', jobRoutes);   // jobs routes
app.use('/api/users', userRoutes); // users routes
app.use('/api', fileRoutes);       // other protected API routes

// ------------------ Serve React Frontend (after API routes) ------------------
app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// ------------------ Global Error Handling ------------------
app.use((req, res, next) => {
  throw new HttpError('Could not find this route.', 404);
});

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }
  console.error(error);
  res.status(error.code || 500).json({ message: error.message || 'An unknown error occurred!' });
});

// ------------------ Connect to MongoDB and Start Server ------------------
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(5000, () => console.log('✅ Server running on http://localhost:5000'));
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));
