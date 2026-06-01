/* ===== SINDHI ZAIKA ACHAAR - Global Script ===== */

const PRODUCTS = [
  { id:1, name:'Raw Mango Achaar', cat:'mango', image:'mango-achaar.png', price:250, weight:'500g', desc:'Tangy raw mango pickle with mustard seeds and traditional Sindhi spices. Slow sun-cured for that authentic home-style depth of flavour.', badge:'hot', stock:50 },
  { id:2, name:'Lemon Achaar', cat:'lemon', image:'lemon-achaar.png', price:200, weight:'400g', desc:'Zesty lemon pickle with whole spices, slow-sun-dried to perfection. A perfect balance of tart and spice.', badge:'new', stock:40 },
  { id:3, name:'Red Chilli Achaar', cat:'chilli', image:'red_chilli.png', price:180, weight:'300g', desc:'Fiery red chilli pickle for those who love bold heat in every bite. Made with fresh Sindhi red chillies.', badge:'', stock:35 },
  { id:4, name:'Mixed Vegetable Achaar', cat:'mixed', image:'Mixed_Vegetable_Achaar.png', price:280, weight:'600g', desc:'A medley of seasonal vegetables pickled in mustard oil and Sindhi masala. Rich, tangy, and deeply flavourful.', badge:'', stock:30 },
  { id:5, name:'Sweet Mango Achaar', cat:'mango', image:'Sweet_Mango_Achaar.png', price:270, weight:'500g', desc:'A sweeter take on the classic Sindhi mango pickle. Perfect with paratha, roti, or plain rice.', badge:'new', stock:45 },
  { id:6, name:'Garlic Chilli Achaar', cat:'chilli', image:'chilli-achaar.png', price:220, weight:'350g', desc:'Roasted garlic blended with green chillies, slow-pickled in spiced mustard oil. Addictive and aromatic.', badge:'', stock:28 },
  { id:7, name:'Karonda Achaar', cat:'mixed', image:'Karonda Achaar.png', price:300, weight:'400g', desc:'Rare Sindhi Karonda berry pickle. Sweet, sour and utterly unique. A true taste of rural Sindh.', badge:'hot', stock:20 },
  { id:8, name:'Green Mango Achaar', cat:'mango', image:'mango-achaar.png', price:230, weight:'500g', desc:'Extra tangy young mango pickled with nigella seeds and chilli flakes. Crisp texture, intense flavour.', badge:'', stock:38 },
];

// ===== CART UTILITIES =====
function getCart() { return JSON.parse(localStorage.getItem('cart') || '[]'); }
function saveCart(cart) { localStorage.setItem('cart', JSON.stringify(cart)); }
function getCartTotal() { return getCart().reduce((s,i) => s + i.qty, 0); }
function updateCartCount() {
  document.querySelectorAll('#cartCount, .cart-count-badge').forEach(el => {
    el.textContent = getCartTotal();
  });
}
function addToCart(event, id) {
  if (event) event.stopPropagation();
  const cart = getCart();
  const idx = cart.findIndex(i => i.id === id);
  if (idx > -1) cart[idx].qty++;
  else { const p = PRODUCTS.find(x => x.id === id); if (p) cart.push({...p, qty:1}); }
  saveCart(cart);
  updateCartCount();
  if (event && event.target) {
    const btn = event.target;
    const orig = btn.textContent;
    btn.textContent = 'Added!';
    btn.style.background = '#2C5F2E';
    setTimeout(() => { btn.textContent = orig; btn.style.background = ''; }, 1200);
  }
}
function removeFromCart(id) {
  const cart = getCart().filter(i => i.id !== id);
  saveCart(cart);
  updateCartCount();
}
function updateQty(id, delta) {
  const cart = getCart();
  const idx = cart.findIndex(i => i.id === id);
  if (idx > -1) {
    cart[idx].qty += delta;
    if (cart[idx].qty <= 0) cart.splice(idx, 1);
  }
  saveCart(cart);
  updateCartCount();
}

// ===== AUTH UTILITIES =====
function getUsers() { return JSON.parse(localStorage.getItem('users') || '[]'); }
function saveUsers(u) { localStorage.setItem('users', JSON.stringify(u)); }
function getCurrentUser() { return JSON.parse(localStorage.getItem('currentUser') || 'null'); }
function setCurrentUser(u) { localStorage.setItem('currentUser', JSON.stringify(u)); }
function logout() { localStorage.removeItem('currentUser'); window.location.href = 'login.html'; }
function isAdmin() { const u = getCurrentUser(); return u && u.role === 'admin'; }

// ===== ORDER UTILITIES =====
function getOrders() { return JSON.parse(localStorage.getItem('orders') || '[]'); }
function saveOrders(o) { localStorage.setItem('orders', JSON.stringify(o)); }
function generateOrderId() { return 'SZA-' + Date.now().toString(36).toUpperCase(); }

// ===== PRODUCT CARD GENERATOR =====
function generateProductCard(p) {
  return `
  <div class="product-card fade-in" onclick="window.location='product-detail.html?id=${p.id}'">
    <div class="product-thumb">
      <img src="${p.image}" alt="${p.name}" loading="lazy">
      ${p.badge === 'hot' ? '<span class="badge-hot">Hot</span>' : p.badge === 'new' ? '<span class="badge-new">New</span>' : ''}
    </div>
    <div class="product-info">
      <div class="category">${p.cat} achaar</div>
      <h3>${p.name}</h3>
      <p class="desc">${p.desc}</p>
      <div class="product-footer">
        <div class="price">PKR ${p.price} <span>/ ${p.weight}</span></div>
        <button class="btn btn-primary btn-sm" onclick="addToCart(event,${p.id})">Add to Cart</button>
      </div>
    </div>
  </div>`;
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  localStorage.setItem('products', JSON.stringify(PRODUCTS));
  // Seed demo admin if not exists
  const users = getUsers();
  if (!users.find(u => u.email === 'admin@sindhizaika.pk')) {
    users.push({ id: 'admin', name: 'Admin', email: 'admin@sindhizaika.pk', password: 'admin123', role: 'admin' });
    saveUsers(users);
  }
  // Seed demo orders
  if (!localStorage.getItem('ordersSeeded')) {
    const demoOrders = [
      { id:'SZA-ABC123', customer:'Ali Hassan', email:'ali@example.com', phone:'03001234567', city:'Karachi', address:'House 5, Block B, Gulshan', items:[{...PRODUCTS[0],qty:2},{...PRODUCTS[1],qty:1}], total:700, shipping:150, grandTotal:850, status:'delivered', payment:'easypaisa', date:'2026-04-15', notes:'' },
      { id:'SZA-DEF456', customer:'Sara Malik', email:'sara@example.com', phone:'03111234567', city:'Lahore', address:'Plot 12, DHA Phase 5', items:[{...PRODUCTS[3],qty:1}], total:280, shipping:150, grandTotal:430, status:'shipped', payment:'jazzcash', date:'2026-04-28', notes:'' },
      { id:'SZA-GHI789', customer:'Tariq Memon', email:'tariq@example.com', phone:'03211234567', city:'Hyderabad', address:'Near Hali Road', items:[{...PRODUCTS[0],qty:1},{...PRODUCTS[2],qty:2}], total:610, shipping:150, grandTotal:760, status:'processing', payment:'cod', date:'2026-05-01', notes:'' },
    ];
    saveOrders(demoOrders);
    localStorage.setItem('ordersSeeded', '1');
  }
});