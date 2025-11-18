const pool = require('../config/database');

exports.getAllProducts = async (req, res) => {
  try {
    const { category, search, featured } = req.query;
    let query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    if (category) {
      query += ` AND c.slug = $${paramCount}`;
      params.push(category);
      paramCount++;
    }

    if (search) {
      query += ` AND (p.name ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    if (featured === 'true') {
      query += ` AND p.is_featured = true`;
    }

    query += ` ORDER BY p.created_at DESC`;

    const result = await pool.query(query, params);

    const products = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      price: parseFloat(row.price),
      imageUrl: row.image_url,
      stock: row.stock,
      isFeatured: row.is_featured,
      botanicalName: row.botanical_name,
      careLevel: row.care_level,
      sunlight: row.sunlight,
      waterNeeds: row.water_needs,
      height: row.height,
      category: row.category_name ? {
        id: row.category_id,
        name: row.category_name,
        slug: row.category_slug,
      } : null,
    }));

    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const result = await pool.query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.slug = $1`,
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const row = result.rows[0];
    const product = {
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      price: parseFloat(row.price),
      imageUrl: row.image_url,
      stock: row.stock,
      isFeatured: row.is_featured,
      botanicalName: row.botanical_name,
      careLevel: row.care_level,
      sunlight: row.sunlight,
      waterNeeds: row.water_needs,
      height: row.height,
      category: row.category_name ? {
        id: row.category_id,
        name: row.category_name,
        slug: row.category_slug,
      } : null,
    };

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, slug, description, image_url FROM categories ORDER BY name'
    );

    const categories = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      imageUrl: row.image_url,
    }));

    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
