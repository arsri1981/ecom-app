const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @route   POST api/checkout
// @desc    Proceed to checkout
// @access  Private
exports.checkout = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

    if (!cart) {
      return res.status(404).json({ msg: 'Cart not found' });
    }

    if (cart.items.length === 0) {
      return res.status(400).json({ msg: 'Cart is empty' });
    }

    // Calculate total amount
    let totalAmount = 0;
    for (const item of cart.items) {
      totalAmount += item.product.price * item.quantity;
    }

    // Create new order
    const order = new Order({
      user: req.user.id,
      items: cart.items.map((item) => ({ product: item.product._id, quantity: item.quantity })),
      totalAmount,
    });

    // Update product inventory (decrement the quanity bought)
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      if (product) {
        product.inventory -= item.quantity;
        await product.save();
      }
    }

    await order.save();

    // Clear the cart
    cart.items = [];
    await cart.save();

    res.json({ msg: 'Order created successfully', order });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   GET api/orders
// @desc    Get user's order history
// @access  Private
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('items.product', ['name', 'price', 'imageUrl']);
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   GET api/orders/:orderId
// @desc    Get a specific order
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate('items.product', ['name', 'price', 'imageUrl']);

    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    res.json(order);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Order not found' });
    }
    res.status(500).send('Server Error');
  }
};