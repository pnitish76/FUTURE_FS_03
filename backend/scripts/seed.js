import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import connectDB from '../config/db.js';

// Models
import User from '../models/User.js';
import Product from '../models/Product.js';
import Inquiry from '../models/Inquiry.js';
import Gallery from '../models/Gallery.js';
import Testimonial from '../models/Testimonial.js';
import Video from '../models/Video.js';

dotenv.config();

connectDB();

const mapCategory = (title) => {
  const lowerTitle = title.toLowerCase();
  
  // Check if it's a spare part
  const isSparePart = 
    lowerTitle.includes('spare') || 
    lowerTitle.includes('jali') || 
    lowerTitle.includes('filter') || 
    lowerTitle.includes('cloth') || 
    lowerTitle.includes('container') || 
    lowerTitle.includes('ring') || 
    lowerTitle.includes('nob') || 
    lowerTitle.includes('cap') ||
    lowerTitle.includes('circuit') ||
    lowerTitle.includes('device motor') ||
    lowerTitle.includes('motor suitable');
    
  if (
    (lowerTitle.includes('mill') || lowerTitle.includes('atta') || lowerTitle.includes('chakki') || lowerTitle.includes('milcent') || lowerTitle.includes('natraj') || lowerTitle.includes('nataraj') || lowerTitle.includes('microfine') || lowerTitle.includes('jb flour') || lowerTitle.includes('milicent')) &&
    !isSparePart
  ) {
    return 'Automatic Flour Mills';
  }
  
  if (isSparePart) {
    return 'Hardware Accessories';
  }
  
  if (lowerTitle.includes('motor')) {
    return 'Industrial Machinery';
  }
  
  if (lowerTitle.includes('press') || lowerTitle.includes('shearing') || lowerTitle.includes('brake') || lowerTitle.includes('machineries')) {
    return 'Industrial Machinery';
  }
  
  if (lowerTitle.includes('drill') || lowerTitle.includes('grinder') || lowerTitle.includes('cutter') || lowerTitle.includes('saw') || lowerTitle.includes('wrench') || lowerTitle.includes('tool')) {
    return 'Power Tools';
  }
  
  if (lowerTitle.includes('weld') || lowerTitle.includes('torch')) {
    return 'Welding Equipment';
  }
  
  if (lowerTitle.includes('helmet') || lowerTitle.includes('boot') || lowerTitle.includes('glove') || lowerTitle.includes('safety') || lowerTitle.includes('harness')) {
    return 'Safety Equipment';
  }

  // default mapping for Papad, bhujia maker, organizers, etc.
  return 'Hardware Accessories';
};

const mapHsnCode = (title) => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('motor')) return '8501';
  if (lowerTitle.includes('press') || lowerTitle.includes('shearing') || lowerTitle.includes('brake')) return '8462';
  if (lowerTitle.includes('mill') || lowerTitle.includes('jali') || lowerTitle.includes('filter') || lowerTitle.includes('cloth') || lowerTitle.includes('container')) return '8437';
  if (lowerTitle.includes('weld')) return '8515';
  if (lowerTitle.includes('papad')) return '1905';
  return '8467';
};

const mapGstRate = (title) => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('jali') || lowerTitle.includes('filter') || lowerTitle.includes('cloth') || lowerTitle.includes('container')) return 12;
  if (lowerTitle.includes('papad')) return 0;
  return 18;
};

const seedData = async () => {
  try {
    // 1. Clear Existing DB
    console.log('Clearing existing collections...');
    await User.deleteMany();
    await Product.deleteMany();
    await Inquiry.deleteMany();
    await Gallery.deleteMany();
    await Testimonial.deleteMany();
    await Video.deleteMany();

    // 2. Create Default Admin User
    console.log('Registering default Admin account...');
    await User.create({
      name: 'System Admin',
      email: 'admin@jaybhagwati.com',
      password: 'admin123', // hashed by userSchema pre-save hook
      role: 'admin'
    });
    console.log('Admin account created successfully (Credentials: admin@jaybhagwati.com / admin123).');

    // 3. Load scraped products if available
    let productsList = [];
    const scrapedFilePath = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\e7867970-ddab-41d0-bba5-365d25cfb93f\\scratch\\scraped_product_details.json';

    if (fs.existsSync(scrapedFilePath)) {
      console.log('Found scraped products JSON. Loading same to same website products...');
      const scrapedData = JSON.parse(fs.readFileSync(scrapedFilePath, 'utf-8'));
      
      productsList = scrapedData.map(p => {
        // Map category dynamically based on rules to align with existing storefront filters
        const category = mapCategory(p.title);
        const hsnCode = mapHsnCode(p.title);
        const gstRate = mapGstRate(p.title);
        
        return {
          title: p.title,
          category: category,
          description: p.description || `${p.title} - High quality tool/accessory supplied by Jay Bhagwati Tools & Machinery.`,
          price: p.price || 999,
          stock: 100,
          image: p.image || '/power-tools.png',
          hsnCode: hsnCode,
          gstRate: gstRate
        };
      });
      console.log(`Successfully mapped ${productsList.length} scraped products from website.`);
    } else {
      console.log('Scraped products file not found. Falling back to default curated catalog...');
      productsList = [
        {
          title: 'Milcent Dynamic Plus Flour Mill (Butterfly)',
          category: 'Automatic Flour Mills',
          description: 'Milcent Dynamic Plus domestic automatic atta chakki with high-gloss butterfly design door. Equipped with auto-clean, auto-sensor, and 1HP heavy-duty induction motor.',
          price: 22500,
          stock: 50,
          image: '/slide4.jpg',
          hsnCode: '8437',
          gstRate: 18
        },
        {
          title: 'Milcent Talky Premium Atta Chakki',
          category: 'Automatic Flour Mills',
          description: 'Milcent Talky domestic automatic flour mill featuring voice announcement guides, auto-clean, kid safety lock, and premium MDF laminate wood grain finish cabinet.',
          price: 25800,
          stock: 50,
          image: '/slide2.jpg',
          hsnCode: '8437',
          gstRate: 18
        },
        {
          title: 'Milcent Neo Automatic Flour Mill',
          category: 'Automatic Flour Mills',
          description: 'Milcent Neo automatic domestic atta chakki with smart auto-feeding sensors, low noise design, energy saving mode, and high-tensile grinding chamber.',
          price: 19500,
          stock: 50,
          image: '/slide3.jpg',
          hsnCode: '8437',
          gstRate: 18
        },
        {
          title: 'Milcent Classic Domestic Atta Chakki',
          category: 'Automatic Flour Mills',
          description: 'Milcent Classic domestic automatic flour mill machine, trusted by families for generations. Efficiently grinds wheat, rice, bajra, besan, and kitchen masalas.',
          price: 17900,
          stock: 50,
          image: '/slide1.jpg',
          hsnCode: '8437',
          gstRate: 18
        },
        {
          title: 'Power Tools Suite',
          category: 'Power Tools',
          description: 'High-performance cordless drills, angle grinders, circular saws, and impact wrenches built for rigorous industrial use.',
          price: 3850,
          stock: 50,
          image: '/power-tools.png',
          hsnCode: '8467',
          gstRate: 18
        },
        {
          title: 'Industrial Hand Tools',
          category: 'Hand Tools',
          description: 'Premium spanners, socket sets, heavy-duty pliers, screwdrivers, and torque wrenches engineered with chrome vanadium steel.',
          price: 1200,
          stock: 50,
          image: '/hand-tools.png',
          hsnCode: '8467',
          gstRate: 18
        },
        {
          title: 'Milling & Lathe Machinery',
          category: 'Industrial Machinery',
          description: 'Heavy-duty lathe machines, pillar drill presses, band saws, and CNC machinery customized for engineering workshops.',
          price: 125000,
          stock: 50,
          image: '/machinery.png',
          hsnCode: '8462',
          gstRate: 18
        },
        {
          title: 'IGBT Inverter Welders',
          category: 'Welding Equipment',
          description: 'Advanced IGBT inverter welding machines, TIG/MIG torches, welding rods, safety screens, and high-frequency cutters.',
          price: 8500,
          stock: 50,
          image: '/welding.png',
          hsnCode: '8515',
          gstRate: 18
        },
        {
          title: 'Certified PPE Gear',
          category: 'Safety Equipment',
          description: 'Certified personal protective equipment (PPE) including safety helmets, steel-toe boots, heavy gloves, and safety harnesses.',
          price: 1450,
          stock: 50,
          image: '/safety.png',
          hsnCode: '6210',
          gstRate: 18
        },
        {
          title: 'High-Tensile Fasteners',
          category: 'Hardware Accessories',
          description: 'High-tensile fasteners, expansion anchor bolts, industrial structural washers, rivets, and specialty tool fixtures.',
          price: 450,
          stock: 50,
          image: '/hardware.png',
          hsnCode: '7318',
          gstRate: 18
        }
      ];
    }

    await Product.insertMany(productsList);
    console.log(`Seeded ${productsList.length} products to database.`);

    // 4. Seed Gallery
    console.log('Seeding gallery files...');
    const galleryList = [
      { image: 'https://cdn.dotpe.in/longtail/store-logo/7917771/po5DmFWX.webp', title: 'Jay Bhagwati Showroom Entrance' },
      { image: 'https://cdn.dotpe.in/longtail/item_category/7917771/0kT9LTBL.webp', title: 'Milcent Flour Mill Demo Section' },
      { image: 'https://cdn.dotpe.in/longtail/item_category/7917771/PriP4O8a.webp', title: 'ABB Electric Motors Display' },
      { image: 'https://cdn.dotpe.in/longtail/item_category/7917771/z1qknA41.webp', title: 'Industrial Machinery Workshop' },
      { image: 'https://cdn.dotpe.in/longtail/item_category/7917771/nGKMK0oc.webp', title: 'Microfine Atta Chakkis Stock' },
      { image: 'https://cdn.dotpe.in/longtail/item_category/7917771/scOFSiku.webp', title: 'Original Spares Display' }
    ];
    await Gallery.insertMany(galleryList);

    // 5. Seed Testimonials
    console.log('Seeding customer reviews...');
    const testimonialsList = [
      {
        customerName: 'Ramesh Patel (MD, Patel Fabrication)',
        review: 'We have been sourcing heavy-duty power tools and welding gear from Jay Bhagwati for the last 5 years. Their products are incredibly reliable, their pricing is unbeatable, and they stand behind their warranties. A trusted supplier in every sense.',
        rating: 5
      },
      {
        customerName: 'Sanjay Shah (Purchase Mgr, Apex Castings)',
        review: 'Their expertise is what separates them. When we needed specialized fasteners and precision machinery, they spent time analyzing our specs and delivered the perfect solutions. Highly recommended for wholesale purchases.',
        rating: 5
      },
      {
        customerName: 'Haresh Savaliya (Owner, Savaliya Infra)',
        review: 'In civil construction, equipment breakdown means huge losses. Jay Bhagwati Tools has always supplied us with quality machinery and safety gears instantly. Their logistics are extremely fast in Gujarat.',
        rating: 5
      }
    ];
    await Testimonial.insertMany(testimonialsList);

    // 6. Seed Videos
    console.log('Seeding video catalogue...');
    const videosList = [
      {
        id: "p1nNliaVkqY",
        title: "Milcent Atta Chakki With Vacuum Full Demo",
        description: "A detailed unboxing and step-by-step operation guide for the Milcent automatic domestic flour mill featuring the auto-vacuum cleaning module.",
        duration: "8:14",
        type: "demo"
      },
      {
        id: "kbjYIMkMOKw",
        title: "Milcent Domestic Flour Mill Demo & Features",
        description: "Detailed showcase of Milcent's domestic flour mill operations, highlighting the auto-cleaning mechanism, motor power, and steel grinding chamber.",
        duration: "3:52",
        type: "demo"
      },
      {
        id: "HvKeZG_hPWc",
        title: "Flour Mill Hopper Operations",
        description: "Short clip showing the automatic grain feeding mechanism.",
        duration: "0:30",
        type: "short"
      },
      {
        id: "yrqTeHpTW-4",
        title: "Milcent Atta Chakki Operations",
        description: "Short showcase of Milcent domestic flour mill operations and grinding quality.",
        duration: "0:45",
        type: "short"
      },
      {
        id: "054CtPvbM80",
        title: "Milcent Smart Atta Chakki Reel",
        description: "Quick product review showcasing smart options and design patterns.",
        duration: "0:50",
        type: "short"
      },
      {
        id: "481687410304599",
        title: "Milcent Atta Chakki Grinding Guide",
        description: "Facebook video guide showing how easy it is to grind flour at home.",
        duration: "1:15",
        type: "short",
        platform: "facebook"
      }
    ];
    await Video.insertMany(videosList);

    // 7. Seed Mock Inquiries for Admin Dashboard testing
    console.log('Seeding mock customer inquiries...');
    const inquiriesList = [
      {
        name: 'Kirit Savaliya',
        phone: '9876543210',
        productRequirement: 'Power Tools',
        message: 'Looking for a bulk quote of 15 heavy-duty cordless impact drills (20V) for our assembly workshop in Rajkot. Please share specifications and discounts.',
        status: 'unread'
      },
      {
        name: 'Amit Mehta',
        phone: '9988776655',
        productRequirement: 'Industrial Machinery',
        message: 'Do you supply radial drilling press machines? Need specifications for a 50mm drilling capacity model. Let us know the delivery time to Metoda GIDC.',
        status: 'unread'
      }
    ];
    await Inquiry.insertMany(inquiriesList);

    console.log('Database Seeding successfully completed!');
    process.exit(0);
  } catch (error) {
    console.error(`Database Seeding Failed: ${error.message}`);
    process.exit(1);
  }
};

seedData();
