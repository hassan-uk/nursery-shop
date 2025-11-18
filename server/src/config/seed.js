const pool = require('./database');

const categories = [
  {
    name: 'Indoor Plants',
    slug: 'indoor-plants',
    description: 'Beautiful plants perfect for indoor spaces',
    image_url: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?w=400'
  },
  {
    name: 'Outdoor Plants',
    slug: 'outdoor-plants',
    description: 'Hardy plants for your garden and outdoor areas',
    image_url: 'https://images.unsplash.com/photo-1466781783364-36c955e42a7f?w=400'
  },
  {
    name: 'Succulents',
    slug: 'succulents',
    description: 'Low-maintenance succulents and cacti',
    image_url: 'https://images.unsplash.com/photo-1459156212016-c812468e2115?w=400'
  },
  {
    name: 'Flowering Plants',
    slug: 'flowering-plants',
    description: 'Colorful flowering plants to brighten your space',
    image_url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400'
  },
  {
    name: 'Herbs',
    slug: 'herbs',
    description: 'Fresh herbs for cooking and wellness',
    image_url: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400'
  },
  {
    name: 'Plant Care',
    slug: 'plant-care',
    description: 'Tools and supplies for plant maintenance',
    image_url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400'
  }
];

const products = [
  {
    category: 'indoor-plants',
    name: 'Monstera Deliciosa',
    slug: 'monstera-deliciosa',
    description: 'The iconic Swiss Cheese Plant with stunning split leaves. Perfect for adding a tropical touch to any room.',
    price: 45.99,
    image_url: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=500',
    stock: 25,
    is_featured: true,
    botanical_name: 'Monstera deliciosa',
    care_level: 'Easy',
    sunlight: 'Bright indirect light',
    water_needs: 'Moderate',
    height: '2-8 feet'
  },
  {
    category: 'indoor-plants',
    name: 'Fiddle Leaf Fig',
    slug: 'fiddle-leaf-fig',
    description: 'A popular indoor tree with large, violin-shaped leaves. Makes a bold statement in any space.',
    price: 89.99,
    image_url: 'https://images.unsplash.com/photo-1598880940371-c756e015faf4?w=500',
    stock: 15,
    is_featured: true,
    botanical_name: 'Ficus lyrata',
    care_level: 'Moderate',
    sunlight: 'Bright indirect light',
    water_needs: 'Moderate',
    height: '3-10 feet'
  },
  {
    category: 'indoor-plants',
    name: 'Snake Plant',
    slug: 'snake-plant',
    description: 'Nearly indestructible and perfect for beginners. Purifies air and thrives on neglect.',
    price: 29.99,
    image_url: 'https://images.unsplash.com/photo-1593482892290-f54927ae1bb4?w=500',
    stock: 40,
    is_featured: false,
    botanical_name: 'Sansevieria trifasciata',
    care_level: 'Easy',
    sunlight: 'Low to bright light',
    water_needs: 'Low',
    height: '1-4 feet'
  },
  {
    category: 'indoor-plants',
    name: 'Pothos',
    slug: 'pothos',
    description: 'Trailing vine with heart-shaped leaves. Great for hanging baskets or shelves.',
    price: 24.99,
    image_url: 'https://images.unsplash.com/photo-1572688484438-313a6e50c333?w=500',
    stock: 50,
    is_featured: true,
    botanical_name: 'Epipremnum aureum',
    care_level: 'Easy',
    sunlight: 'Low to bright indirect light',
    water_needs: 'Moderate',
    height: '6-10 feet (trailing)'
  },
  {
    category: 'indoor-plants',
    name: 'Peace Lily',
    slug: 'peace-lily',
    description: 'Elegant white flowers and glossy green leaves. Excellent air purifier.',
    price: 34.99,
    image_url: 'https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?w=500',
    stock: 30,
    is_featured: false,
    botanical_name: 'Spathiphyllum',
    care_level: 'Easy',
    sunlight: 'Low to medium light',
    water_needs: 'Moderate to high',
    height: '1-4 feet'
  },
  {
    category: 'succulents',
    name: 'Aloe Vera',
    slug: 'aloe-vera',
    description: 'Medicinal succulent with soothing gel. Low maintenance and drought tolerant.',
    price: 19.99,
    image_url: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=500',
    stock: 45,
    is_featured: false,
    botanical_name: 'Aloe barbadensis miller',
    care_level: 'Easy',
    sunlight: 'Bright indirect light',
    water_needs: 'Low',
    height: '1-2 feet'
  },
  {
    category: 'succulents',
    name: 'Echeveria Collection',
    slug: 'echeveria-collection',
    description: 'Set of 3 colorful rosette-shaped succulents. Perfect for desks and windowsills.',
    price: 27.99,
    image_url: 'https://images.unsplash.com/photo-1459156212016-c812468e2115?w=500',
    stock: 35,
    is_featured: true,
    botanical_name: 'Echeveria spp.',
    care_level: 'Easy',
    sunlight: 'Bright light',
    water_needs: 'Low',
    height: '2-8 inches'
  },
  {
    category: 'outdoor-plants',
    name: 'Lavender',
    slug: 'lavender',
    description: 'Fragrant purple flowers perfect for gardens. Attracts pollinators and repels pests.',
    price: 22.99,
    image_url: 'https://images.unsplash.com/photo-1611419010196-860cc6d5cf81?w=500',
    stock: 40,
    is_featured: false,
    botanical_name: 'Lavandula',
    care_level: 'Easy',
    sunlight: 'Full sun',
    water_needs: 'Low',
    height: '1-3 feet'
  },
  {
    category: 'outdoor-plants',
    name: 'Japanese Maple',
    slug: 'japanese-maple',
    description: 'Stunning ornamental tree with vibrant foliage. Beautiful year-round interest.',
    price: 129.99,
    image_url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=500',
    stock: 10,
    is_featured: true,
    botanical_name: 'Acer palmatum',
    care_level: 'Moderate',
    sunlight: 'Partial shade',
    water_needs: 'Moderate',
    height: '6-25 feet'
  },
  {
    category: 'flowering-plants',
    name: 'Orchid',
    slug: 'orchid',
    description: 'Elegant flowering plant with long-lasting blooms. Available in multiple colors.',
    price: 39.99,
    image_url: 'https://images.unsplash.com/photo-1551854838-4815a9adce09?w=500',
    stock: 20,
    is_featured: true,
    botanical_name: 'Phalaenopsis',
    care_level: 'Moderate',
    sunlight: 'Bright indirect light',
    water_needs: 'Low to moderate',
    height: '1-3 feet'
  },
  {
    category: 'flowering-plants',
    name: 'African Violet',
    slug: 'african-violet',
    description: 'Compact flowering plant with velvety leaves. Blooms year-round indoors.',
    price: 16.99,
    image_url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=500',
    stock: 30,
    is_featured: false,
    botanical_name: 'Saintpaulia',
    care_level: 'Moderate',
    sunlight: 'Bright indirect light',
    water_needs: 'Moderate',
    height: '6-8 inches'
  },
  {
    category: 'herbs',
    name: 'Basil',
    slug: 'basil',
    description: 'Fresh aromatic herb perfect for cooking. Easy to grow indoors or outdoors.',
    price: 12.99,
    image_url: 'https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=500',
    stock: 50,
    is_featured: false,
    botanical_name: 'Ocimum basilicum',
    care_level: 'Easy',
    sunlight: 'Full sun',
    water_needs: 'Moderate',
    height: '1-2 feet'
  },
  {
    category: 'herbs',
    name: 'Mint',
    slug: 'mint',
    description: 'Refreshing herb for teas and cooking. Fast-growing and aromatic.',
    price: 11.99,
    image_url: 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=500',
    stock: 45,
    is_featured: false,
    botanical_name: 'Mentha',
    care_level: 'Easy',
    sunlight: 'Partial shade',
    water_needs: 'High',
    height: '1-2 feet'
  },
  {
    category: 'herbs',
    name: 'Rosemary',
    slug: 'rosemary',
    description: 'Woody, fragrant herb perfect for culinary use. Drought tolerant.',
    price: 14.99,
    image_url: 'https://images.unsplash.com/photo-1584279386268-8e0d600a3ae5?w=500',
    stock: 35,
    is_featured: false,
    botanical_name: 'Rosmarinus officinalis',
    care_level: 'Easy',
    sunlight: 'Full sun',
    water_needs: 'Low',
    height: '2-6 feet'
  },
  {
    category: 'plant-care',
    name: 'Premium Potting Mix',
    slug: 'premium-potting-mix',
    description: 'High-quality organic potting soil. Perfect for all indoor and outdoor plants.',
    price: 18.99,
    image_url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500',
    stock: 100,
    is_featured: false,
    botanical_name: null,
    care_level: null,
    sunlight: null,
    water_needs: null,
    height: null
  },
  {
    category: 'plant-care',
    name: 'Ceramic Plant Pot Set',
    slug: 'ceramic-plant-pot-set',
    description: 'Set of 3 modern ceramic pots with drainage holes and saucers.',
    price: 32.99,
    image_url: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500',
    stock: 60,
    is_featured: false,
    botanical_name: null,
    care_level: null,
    sunlight: null,
    water_needs: null,
    height: null
  }
];

async function seed() {
  const client = await pool.connect();
  try {
    console.log('Seeding database...');

    for (const category of categories) {
      await client.query(
        'INSERT INTO categories (name, slug, description, image_url) VALUES ($1, $2, $3, $4)',
        [category.name, category.slug, category.description, category.image_url]
      );
    }
    console.log('Categories seeded!');

    for (const product of products) {
      const categoryResult = await client.query(
        'SELECT id FROM categories WHERE slug = $1',
        [product.category]
      );
      const categoryId = categoryResult.rows[0]?.id;

      await client.query(
        `INSERT INTO products (
          category_id, name, slug, description, price, image_url, stock, is_featured,
          botanical_name, care_level, sunlight, water_needs, height
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [
          categoryId, product.name, product.slug, product.description, product.price,
          product.image_url, product.stock, product.is_featured, product.botanical_name,
          product.care_level, product.sunlight, product.water_needs, product.height
        ]
      );
    }
    console.log('Products seeded!');
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Seeding error:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
