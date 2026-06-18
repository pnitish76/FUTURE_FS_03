import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useToast } from '../../context/ToastContext';
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaUpload, FaTimes, FaSearch, FaBoxes } from 'react-icons/fa';

export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    category: 'Power Tools',
    description: '',
    price: '',
    stock: '',
    hsnCode: '8437',
    gstRate: '18',
    image: null
  });
  const [imagePreview, setImagePreview] = useState('');
  const { showToast } = useToast();

  const categories = [
    'Power Tools',
    'Hand Tools',
    'Industrial Machinery',
    'Welding Equipment',
    'Safety Equipment',
    'Hardware Accessories'
  ];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products');
      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (error) {
      showToast('Failed to load products from database.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      title: '',
      category: 'Power Tools',
      description: '',
      price: '',
      stock: '',
      hsnCode: '8437',
      gstRate: '18',
      image: null
    });
    setImagePreview('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      category: product.category,
      description: product.description,
      price: product.price !== undefined ? product.price : '',
      stock: product.stock !== undefined ? product.stock : '',
      hsnCode: product.hsnCode || '8437',
      gstRate: product.gstRate !== undefined ? product.gstRate : '18',
      image: null // keeps image as null unless they want to upload a new one
    });
    setImagePreview(product.image);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim() || formData.price === '' || formData.stock === '' || !formData.hsnCode.trim() || formData.gstRate === '') {
      showToast('Please enter all required fields.', 'error');
      return;
    }

    setSubmitting(true);
    
    // Construct Multi-part FormData
    const data = new FormData();
    data.append('title', formData.title);
    data.append('category', formData.category);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('stock', formData.stock);
    data.append('hsnCode', formData.hsnCode);
    data.append('gstRate', formData.gstRate);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      if (editingProduct) {
        // Update product route
        const res = await api.put(`/products/${editingProduct._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (res.data.success) {
          showToast('Product updated successfully.', 'success');
          fetchProducts();
          handleCloseModal();
        }
      } else {
        // Add product route
        if (!formData.image) {
          showToast('Please upload a product image file.', 'error');
          setSubmitting(false);
          return;
        }
        const res = await api.post('/products', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (res.data.success) {
          showToast('Product added successfully.', 'success');
          fetchProducts();
          handleCloseModal();
        }
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Error occurred while saving product.';
      showToast(errMsg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await api.delete(`/products/${id}`);
      if (res.data.success) {
        showToast('Product deleted successfully.', 'success');
        fetchProducts();
      }
    } catch (error) {
      showToast('Failed to delete product.', 'error');
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                          p.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {/* Search box */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <FaSearch className="text-xs" />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full sm:w-64 pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold placeholder-slate-400 outline-none focus:ring-2 focus:ring-brand-blue/20"
            />
          </div>
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 outline-none bg-white cursor-pointer"
          >
            <option value="All">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        
        {/* Add Product Button */}
        <button
          onClick={handleOpenAddModal}
          className="w-full sm:w-auto px-5 py-2.5 bg-brand-red hover:bg-red-700 text-white rounded-xl font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow transition-colors cursor-pointer"
        >
          <FaPlus /> Add Product
        </button>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <FaSpinner className="animate-spin text-3xl text-brand-red" />
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between group">
              {/* Product Image */}
              <div className="aspect-[1.5] relative overflow-hidden bg-slate-900 border-b border-slate-100">
                <img 
                  src={product.image.startsWith('http') || product.image.startsWith('/') ? product.image : `http://localhost:5000${product.image}`} 
                  alt={product.title} 
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-4 left-4 bg-slate-900/90 text-white border border-slate-800 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                  {product.category}
                </span>
              </div>
              {/* Card info */}
              <div className="p-5 flex-grow space-y-3">
                <h4 className="font-heading font-black text-slate-800 text-base truncate">{product.title}</h4>
                <p className="text-slate-500 text-xs leading-relaxed line-clamp-3 font-medium">{product.description}</p>
                <div className="flex items-center justify-between text-xs font-bold pt-2 border-t border-slate-100">
                  <span className="text-brand-red">₹{product.price ? product.price.toLocaleString('en-IN') : '0'}</span>
                  {product.stock <= 0 ? (
                    <span className="text-red-655 bg-red-50 border border-red-100 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">Out of Stock</span>
                  ) : (
                    <span className="text-slate-655">Stock: <span className="text-brand-navy">{product.stock}</span></span>
                  )}
                </div>
                <div className="flex justify-between text-[10px] font-semibold text-slate-400 pt-1">
                  <span>HSN: {product.hsnCode || '8437'}</span>
                  <span>GST: {product.gstRate !== undefined ? product.gstRate : '18'}%</span>
                </div>
              </div>
              {/* Footer actions */}
              <div className="p-4 border-t border-slate-100 flex gap-2.5 bg-slate-50/50">
                <button
                  onClick={() => handleOpenEditModal(product)}
                  className="flex-grow py-2 bg-slate-100 hover:bg-slate-205 text-slate-700 hover:text-slate-900 rounded-xl font-heading font-bold text-[10px] uppercase tracking-wider border border-slate-200 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => handleDeleteProduct(product._id)}
                  className="py-2 px-3 bg-red-50 hover:bg-red-100 text-red-650 rounded-xl border border-red-100 flex items-center justify-center cursor-pointer transition-colors"
                  title="Delete Product"
                >
                  <FaTrash className="text-xs" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white py-16 text-center rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center gap-3">
          <FaBoxes className="text-4xl text-slate-300" />
          <p className="text-sm font-semibold text-slate-450">No products found matching your criteria.</p>
        </div>
      )}

      {/* Add/Edit Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={handleCloseModal} className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs" />
          
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative z-10 border border-slate-100 animate-scale-up">
            {/* Header */}
            <div className="bg-brand-navy p-5 text-white flex justify-between items-center border-b border-slate-800">
              <h3 className="font-heading font-black text-base uppercase tracking-wider">
                {editingProduct ? 'Edit Product Details' : 'Add New Product'}
              </h3>
              <button 
                onClick={handleCloseModal}
                className="p-1.5 bg-slate-900 border border-slate-800 rounded-lg hover:bg-brand-red text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <FaTimes className="text-sm" />
              </button>
            </div>
            
            {/* Form body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Product Title */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Product Name / Title
                </label>
                <input
                  type="text"
                  required
                  name="title"
                  value={formData.title}
                  onChange={handleTextChange}
                  placeholder="e.g. Cordless Hammer Drill 20V"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20"
                />
              </div>

              {/* Product Category dropdown */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleTextChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 outline-none focus:bg-white cursor-pointer"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Description / Features
                </label>
                <textarea
                  required
                  name="description"
                  value={formData.description}
                  onChange={handleTextChange}
                  rows="3"
                  placeholder="Detail technical specifications, sizes, brand details..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20"
                />
              </div>

              {/* Price & Stock Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    name="price"
                    value={formData.price}
                    onChange={handleTextChange}
                    placeholder="e.g. 2500"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Stock Count *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    name="stock"
                    value={formData.stock}
                    onChange={handleTextChange}
                    placeholder="e.g. 50"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20"
                  />
                </div>
              </div>

              {/* HSN & GST Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    HSN/SAC Code *
                  </label>
                  <input
                    type="text"
                    required
                    name="hsnCode"
                    value={formData.hsnCode}
                    onChange={handleTextChange}
                    placeholder="e.g. 8437"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    GST Rate (%) *
                  </label>
                  <select
                    name="gstRate"
                    value={formData.gstRate}
                    onChange={handleTextChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-650 outline-none focus:bg-white cursor-pointer"
                  >
                    <option value="0">0%</option>
                    <option value="5">5%</option>
                    <option value="12">12%</option>
                    <option value="18">18%</option>
                    <option value="28">28%</option>
                  </select>
                </div>
              </div>

              {/* Image upload */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Product Image
                </label>
                <div className="flex gap-4 items-center">
                  <label className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-650 rounded-xl border border-slate-200 font-heading font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors flex-shrink-0">
                    <FaUpload /> Upload Image
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      className="hidden" 
                    />
                  </label>
                  <span className="text-[10px] text-slate-400 font-semibold truncate flex-grow">
                    {formData.image ? formData.image.name : 'Select file (JPG, PNG, WEBP max 5MB)'}
                  </span>
                </div>
                {imagePreview && (
                  <div className="mt-4 w-28 h-20 rounded-lg border border-slate-200 overflow-hidden bg-slate-100">
                    <img 
                      src={imagePreview.startsWith('blob') || imagePreview.startsWith('http') || imagePreview.startsWith('/') ? imagePreview : `http://localhost:5000${imagePreview}`} 
                      alt="Preview" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 font-heading font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-brand-red hover:bg-red-700 text-white rounded-xl font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow transition-colors cursor-pointer disabled:opacity-75"
                >
                  {submitting ? <FaSpinner className="animate-spin" /> : null}
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
