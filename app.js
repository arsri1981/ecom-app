const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const connectDB = require('./config/database');

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
require('dotenv').config();

const app = express();

// Connect to MongoDB
 connectDB();

// Middleware
app.use(bodyParser.json());


// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Tell Express where to find the views

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);


// Static Files (CSS, images)
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));