const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @route   GET api/cart
// @desc    Get user's cart
// @access  Private
exports.getCart = async (req, res) => {
  try {

    console.log("userId"+ req.body.userId);
    const cart = await Cart.findOne({ user: req.body.userId }).populate('items.product', ['name', 'price']);

    if (!cart) {
      return res.status(404).json({ msg: 'Cart not found' });
    }

    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   POST api/cart
// @desc    Add product to cart
// @access  Private
exports.addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    const product = await Product.findById(productId);

    console.log("productId" + productId);

    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    if (product.inventory < quantity) {
      return res.status(400).json({ msg: 'Not enough products in inventory' });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // Create a new cart
      cart = new Cart({
        user: userId,
        items: [{ product: productId, quantity }],
      });
    } else {
      // Cart exists, check if item exists
      const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);

      if (itemIndex > -1) {
        // Item exists, update quantity
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Item does not exist, add it
        cart.items.push({ product: productId, quantity });
      }
    }

    await cart.save();

    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   PUT api/cart/:productId
// @desc    Update quantity of product in cart
// @access  Private
exports.updateCartItem = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ msg: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);

    if (itemIndex === -1) {
      return res.status(404).json({ msg: 'Item not found in cart' });
    }

    cart.items[itemIndex].quantity = quantity;

    await cart.save();

    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   DELETE api/cart/:productId
// @desc    Remove product from cart
// @access  Private
exports.deleteCartItem = async (req, res) => {
  try {

    const { userId, productId } = req.body;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ msg: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);

    if (itemIndex === -1) {
      return res.status(404).json({ msg: 'Item not found in cart' });
    }

    cart.items.splice(itemIndex, 1);

    await cart.save();

    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};