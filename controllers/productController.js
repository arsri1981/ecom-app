const Product = require('../models/Product');

// @route   GET api/products
// @desc    Get all products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    //res.json(products);
    // Render the view
    res.render('productList', { products: products });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   GET api/products/:id
// @desc    Get product by ID
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');    
  }
};

// @route   POST api/auth/register
// @desc    c user
// @access  Public

exports.createProduct = async (req, res) => {
  const { name, description, price,  inventory} = req.body;

  try {
    // Check if user exists
    let product = await Product.findOne({ name });

    if (product) {
      return res.status(400).json({ msg: 'Product already exists' });
    }

    product = new Product({
      name,
      description,
      price,
      inventory,
    });

    await product.save();
    return res.status(200).json({ msg: 'Product created.' });
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};