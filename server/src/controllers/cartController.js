const pool = require('../config/database');

exports.getCart = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT ci.*, p.name, p.price, p.image_url, p.stock
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = $1`,
      [req.userId]
    );

    const cartItems = result.rows.map(row => ({
      id: row.id,
      productId: row.product_id,
      name: row.name,
      price: parseFloat(row.price),
      imageUrl: row.image_url,
      quantity: row.quantity,
      stock: row.stock,
      subtotal: parseFloat(row.price) * row.quantity,
    }));

    const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

    res.json({ items: cartItems, total });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const productResult = await pool.query(
      'SELECT id, name, price, stock FROM products WHERE id = $1',
      [productId]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = productResult.rows[0];

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    const existingItem = await pool.query(
      'SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2',
      [req.userId, productId]
    );

    if (existingItem.rows.length > 0) {
      const newQuantity = existingItem.rows[0].quantity + quantity;

      if (product.stock < newQuantity) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }

      await pool.query(
        'UPDATE cart_items SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 AND product_id = $3',
        [newQuantity, req.userId, productId]
      );
    } else {
      await pool.query(
        'INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, $3)',
        [req.userId, productId, quantity]
      );
    }

    const cartResult = await pool.query(
      `SELECT ci.*, p.name, p.price, p.image_url, p.stock
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = $1`,
      [req.userId]
    );

    const cartItems = cartResult.rows.map(row => ({
      id: row.id,
      productId: row.product_id,
      name: row.name,
      price: parseFloat(row.price),
      imageUrl: row.image_url,
      quantity: row.quantity,
      stock: row.stock,
      subtotal: parseFloat(row.price) * row.quantity,
    }));

    const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

    res.json({ items: cartItems, total });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    const cartItem = await pool.query(
      'SELECT * FROM cart_items WHERE id = $1 AND user_id = $2',
      [id, req.userId]
    );

    if (cartItem.rows.length === 0) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    const productResult = await pool.query(
      'SELECT stock FROM products WHERE id = $1',
      [cartItem.rows[0].product_id]
    );

    if (productResult.rows[0].stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    await pool.query(
      'UPDATE cart_items SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [quantity, id]
    );

    const cartResult = await pool.query(
      `SELECT ci.*, p.name, p.price, p.image_url, p.stock
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = $1`,
      [req.userId]
    );

    const cartItems = cartResult.rows.map(row => ({
      id: row.id,
      productId: row.product_id,
      name: row.name,
      price: parseFloat(row.price),
      imageUrl: row.image_url,
      quantity: row.quantity,
      stock: row.stock,
      subtotal: parseFloat(row.price) * row.quantity,
    }));

    const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

    res.json({ items: cartItems, total });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM cart_items WHERE id = $1 AND user_id = $2',
      [id, req.userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    const cartResult = await pool.query(
      `SELECT ci.*, p.name, p.price, p.image_url, p.stock
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = $1`,
      [req.userId]
    );

    const cartItems = cartResult.rows.map(row => ({
      id: row.id,
      productId: row.product_id,
      name: row.name,
      price: parseFloat(row.price),
      imageUrl: row.image_url,
      quantity: row.quantity,
      stock: row.stock,
      subtotal: parseFloat(row.price) * row.quantity,
    }));

    const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

    res.json({ items: cartItems, total });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.clearCart = async (req, res) => {
  try {
    await pool.query('DELETE FROM cart_items WHERE user_id = $1', [req.userId]);
    res.json({ items: [], total: 0 });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
