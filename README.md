# Jay Bhagwati Tools & Machinery 

A premium, full-stack MERN (MongoDB, Express, React, Node) e-commerce storefront and industrial tools supply portal. Redesigned to serve as a modern digital showroom for Milcent flour mills, industrial machinery, power tools, and hardware accessories.

---

## 🚀 Key Features

### 1. Interactive Video Showcase
*   **Double-Tier Video Layout**: Features a main demonstration player alongside a vertical playlist for 2 featured full-length demo videos, and a responsive grid of 4 vertical social media reels/shorts below.
*   **Cross-Platform Player support**: Integrated player matching both **YouTube** (standard & shorts) and **Facebook** video links.
*   **Performance Optimized**: Previews load clean thumbnails first and transition into active iframe players only upon click to reduce initial page load times.
*   **Auto-Scroll to Play**: Selecting any reel scrolls the viewport smoothly to the active player and autoplays immediately.

### 2. GST Billing & Invoice Module (Admin Dashboard)
*   **Carbon-Copy Tax Invoice Builder**: Fully interactive Indian GST Bill Book invoice creator that maps categories to correct HSN codes (e.g. `8437` for mills, `8467` for power tools) and performs reverse tax calculations (splitting 18% GST into 9% CGST and 9% SGST inclusive/exclusive models).
*   **A4 Print-Ready PDF Templates**: Supports printing directly to standard A4 sheets with toggles for `ORIGINAL FOR BUYER`, `DUPLICATE FOR TRANSPORTER`, and `TRIPLICATE FOR ASSESSEE` layouts.
*   **Dynamic UPI QR Code**: Autogenerates a scannable payment QR code inside the printed invoice based on the grand total and bank credentials.
*   **Customer & Product Directory Lookup**: Search and select pre-saved corporate customers (with GSTIN, State code) or catalog items to auto-fill rates.
*   **Automatic Inventory Deductions**: Finalizing sales invoices dynamically decrements stock counts.
*   **GSTR Reports & Ledgers**: Export taxable values to CSV, run monthly GSTR audits, and track outstanding customer balances.

### 3. Glassmorphic Shopping Cart Drawer
*   **Seamless Slide Tray**: Glassmorphic Cart slide-out drawer persisting user items using local storage.
*   **Automated WhatsApp Checkout**: Compiles and formats orders (with items, quantities, subtotal, and buyer contact details) and forwards them directly to the seller via WhatsApp.

### 4. Search & Catalogue Navigation
*   **Global Navigation Search Box**: Sleek search input present in both desktop navigation bar and mobile drawer menu for real-time catalog filtering.
*   **Click-Through Category Filters**: Seamless homepage-to-catalogue redirection that automatically pre-selects active product categories.

### 5. Full-Featured Admin Panel
*   **Statistics Metrics Widgets**: Overview cards displaying Sales turnover, total inquiries, and recent orders.
*   **Full CRUD Managers**: Dedicated dashboards to manage catalog products, customer inquiries, showroom gallery files, customer testimonials, and video showcase links.

---

## 🛠️ Technology Stack

*   **Frontend**: React.js, Vite, TailwindCSS (v4), Framer Motion (slideshows/modals), React Router DOM (v7), React Icons.
*   **Backend**: Node.js, Express.js, JWT Auth tokens, Multer (multipart forms), Cloudinary (with local directory fallback).
*   **Database**: MongoDB (Mongoose schemas).

---

## 📁 Project Directory Structure

```text
Task 3/
├── backend/
│   ├── config/             # DB & Cloudinary configuration files
│   ├── controllers/        # REST route handler logics (auth, products, videos, invoices)
│   ├── middleware/         # Admin JWT validation middlewares
│   ├── models/             # Mongoose Schemas (User, Product, Video, Invoice, Inquiry, Testimonial)
│   ├── routes/             # Express API routing endpoints
│   ├── scripts/            # Database seed script
│   ├── uploads/            # Local fallback uploads folder (if Cloudinary is offline)
│   ├── server.js           # Server entrance script
│   └── package.json
├── frontend/
│   ├── public/             # Static public assets (slide banners, category images)
│   ├── src/
│   │   ├── components/     # Layout views (Header, Hero slideshow, Footer, About, HomeView)
│   │   ├── context/        # Global Toast, Authentication, and Cart providers
│   │   ├── pages/          # Storefront views & Invoice templates
│   │   │   └── admin/      # Admin dashboard interfaces (VideoManager, InvoiceForm, Reports)
│   │   ├── utils/          # Axios wrappers
│   │   ├── App.jsx         # Routes registration
│   │   └── main.jsx        # App mounting context
│   └── package.json
└── README.md               # Main instructions readme
```

---

## ⚙️ Installation & Local Setup

### Prerequisites
*   [Node.js](https://nodejs.org/) (v18+ recommended)
*   [MongoDB Community Server](https://www.mongodb.com/try/download/community) running locally on port `27017`

### 1. Setup Backend
1. Navigate to the `backend` folder:
    ```bash
    cd backend
    ```
2. Install npm dependencies:
    ```bash
    npm install
    ```
3. Create a `.env` file in the `backend/` directory:
    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/jaybhagwati
    JWT_SECRET=jay_bhagwati_tools_machinery_secret_key_2026
    CLOUDINARY_CLOUD_NAME=
    CLOUDINARY_API_KEY=
    CLOUDINARY_API_SECRET=
    ```

### 2. Seed the Database
Seed mock inquiries, customer testimonials, ABB/Milcent categories, gallery images, 54 scraped products, and video demo showcases:
```bash
npm run seed
```
*Note: This command runs `node scripts/seed.js` which registers the default admin login credentials below.*

### 3. Run Backend Server
```bash
npm run dev
```
The server will boot up and listen on `http://localhost:5000`.

### 4. Setup Frontend
1. In a separate terminal session, navigate to the `frontend` folder:
    ```bash
    cd ../frontend
    ```
2. Install npm dependencies:
    ```bash
    npm install
    ```
3. Run Vite development server:
    ```bash
    npm run dev
    ```
The frontend will start running and be accessible at `http://localhost:5173`.

---

## 🔑 Default Admin Credentials

To log into the Admin Dashboard (`/admin/login` or via the "Sign In" link in the navbar):

*   **Admin Email**: `admin@jaybhagwati.com`
*   **Admin Password**: `admin123`

---

## 📦 Production Build

To build the client files for deployment, execute:
```bash
cd frontend
npm run build
```
This generates a highly-optimized static asset directory inside `frontend/dist`.
