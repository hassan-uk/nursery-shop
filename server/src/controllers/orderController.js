const pool = require('../config/database');

const generateOrderNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `ORD-${timestamp}-${random}`;
};

exports.createOrder = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { shippingAddress, shippingCity, shippingPostalCode, phone, notes } = req.body;

    const cartResult = await client.query(
      `SELECT ci.*, p.name, p.price, p.stock
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = $1`,
      [req.userId]
    );

    if (cartResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Cart is empty' });
    }

    for (const item of cartResult.rows) {
      if (item.stock < item.quantity) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          message: `Insufficient stock for ${item.name}. Available: ${item.stock}, Requested: ${item.quantity}`
        });
      }
    }

    const totalAmount = cartResult.rows.reduce(
      (sum, item) => sum + parseFloat(item.price) * item.quantity,
      0
    );

    const orderNumber = generateOrderNumber();

    const orderResult = await client.query(
      `INSERT INTO orders (user_id, order_number, total_amount, shipping_address, shipping_city, shipping_postal_code, phone, notes, payment_method, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [req.userId, orderNumber, totalAmount, shippingAddress, shippingCity, shippingPostalCode, phone, notes, 'cash_on_delivery', 'pending']
    );

    const order = orderResult.rows[0];

    for (const item of cartResult.rows) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity, subtotal)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [order.id, item.product_id, item.name, item.price, item.quantity, parseFloat(item.price) * item.quantity]
      );

      await client.query(
        'UPDATE products SET stock = stock - $1 WHERE id = $2',
        [item.quantity, item.product_id]
      );
    }

    await client.query('DELETE FROM cart_items WHERE user_id = $1', [req.userId]);

    await client.query('COMMIT');

    res.status(201).json({
      id: order.id,
      orderNumber: order.order_number,
      totalAmount: parseFloat(order.total_amount),
      status: order.status,
      shippingAddress: order.shipping_address,
      shippingCity: order.shipping_city,
      shippingPostalCode: order.shipping_postal_code,
      phone: order.phone,
      paymentMethod: order.payment_method,
      notes: order.notes,
      createdAt: order.created_at,
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  } finally {
    client.release();
  }
};

exports.getOrders = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]
    );

    const orders = result.rows.map(row => ({
      id: row.id,
      orderNumber: row.order_number,
      totalAmount: parseFloat(row.total_amount),
      status: row.status,
      shippingAddress: row.shipping_address,
      shippingCity: row.shipping_city,
      shippingPostalCode: row.shipping_postal_code,
      phone: row.phone,
      paymentMethod: row.payment_method,
      notes: row.notes,
      createdAt: row.created_at,
    }));

    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const orderResult = await pool.query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [id, req.userId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = orderResult.rows[0];

    const itemsResult = await pool.query(
      'SELECT * FROM order_items WHERE order_id = $1',
      [id]
    );

    const items = itemsResult.rows.map(row => ({
      id: row.id,
      productId: row.product_id,
      productName: row.product_name,
      productPrice: parseFloat(row.product_price),
      quantity: row.quantity,
      subtotal: parseFloat(row.subtotal),
    }));

    res.json({
      id: order.id,
      orderNumber: order.order_number,
      totalAmount: parseFloat(order.total_amount),
      status: order.status,
      shippingAddress: order.shipping_address,
      shippingCity: order.shipping_city,
      shippingPostalCode: order.shipping_postal_code,
      phone: order.phone,
      paymentMethod: order.payment_method,
      notes: order.notes,
      createdAt: order.created_at,
      items,
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
