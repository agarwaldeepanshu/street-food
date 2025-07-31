// --- CHART RENDERING FUNCTIONS ---
let vendorChartInstance = null;
let supplierChartInstance = null;

function initVendorChart(orders) {
    const ctx = document.getElementById('vendorSpendChart').getContext('2d');
    if (vendorChartInstance) vendorChartInstance.destroy();
    const monthlySpend = orders.reduce((acc, order) => { const month = new Date(order.date).toLocaleString('default', { month: 'short' }); acc[month] = (acc[month] || 0) + order.amount; return acc; }, {});
    const labels = Object.keys(monthlySpend).sort((a,b) => new Date(`1-${a}-2025`) - new Date(`1-${b}-2025`));
    const data = labels.map(label => monthlySpend[label]);
    vendorChartInstance = new Chart(ctx, { type: 'line', data: { labels, datasets: [{ label: 'Monthly Spend (₹)', data, borderColor: 'rgba(249, 115, 22, 1)', backgroundColor: 'rgba(249, 115, 22, 0.1)', fill: true, tension: 0.4 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', align: 'end' } }, scales: { y: { beginAtZero: true } } } });
}

function initSupplierChart(orders) {
    const ctx = document.getElementById('supplierRevenueChart').getContext('2d');
    if (supplierChartInstance) supplierChartInstance.destroy();
    const monthlyRevenue = orders.reduce((acc, order) => { const month = new Date(order.date).toLocaleString('default', { month: 'short' }); acc[month] = (acc[month] || 0) + order.amount; return acc; }, {});
    const labels = Object.keys(monthlyRevenue).sort((a,b) => new Date(`1-${a}-2025`) - new Date(`1-${b}-2025`));
    const data = labels.map(label => monthlyRevenue[label]);
    supplierChartInstance = new Chart(ctx, { type: 'line', data: { labels, datasets: [{ label: 'Monthly Revenue (₹)', data, borderColor: 'rgba(59, 130, 246, 1)', backgroundColor: 'rgba(59, 130, 246, 0.1)', fill: true, tension: 0.4 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', align: 'end' } }, scales: { y: { beginAtZero: true } } } });
}

document.addEventListener('DOMContentLoaded', () => {
    const isVendorDashboard = !!document.querySelector('title')?.textContent.includes('Vendor Dashboard');
    const isSupplierDashboard = !!document.querySelector('title')?.textContent.includes('Supplier Dashboard');
    
    // --- SPECIFIC RENDER FUNCTIONS ---
    function renderVendorOverview() {
        const orders = getOrders().filter(o => o.vendorId === 1);
        document.getElementById('vendor-total-orders').textContent = orders.length;
        document.getElementById('vendor-pending-orders').textContent = orders.filter(o => o.status === 'Pending').length;
        document.getElementById('vendor-total-spent').textContent = `₹${orders.reduce((sum, o) => sum + o.amount, 0).toLocaleString()}`;
        if (document.getElementById('vendorSpendChart')) initVendorChart(orders);
    }
    
    function renderVendorOrders() {
        const orders = getOrders().filter(o => o.vendorId === 1);
        const ordersTable = document.getElementById('vendor-orders-table');
        if(!ordersTable) return;
        ordersTable.innerHTML = '';
        orders.slice().reverse().forEach(order => {
            const supplier = getSuppliers().find(s => s.id === order.supplierId);
            ordersTable.innerHTML += `<tr><td data-label="ID">${order.id}</td><td data-label="Supplier">${supplier.name}</td><td data-label="Items">${order.items}</td><td data-label="Amount">₹${order.amount.toLocaleString()}</td><td data-label="Date">${order.date}</td><td data-label="Status"><span class="status ${order.status.replace(' ', '.')}">${order.status}</span></td></tr>`;
        });
    }

    function renderVendorSuppliers() {
        const location = document.getElementById('location-filter').value;
        const suppliersTable = document.getElementById('vendor-suppliers-table');
        if (!suppliersTable) return;
        suppliersTable.innerHTML = '';
        getSuppliers().filter(s => s.location === location).forEach(s => {
            suppliersTable.innerHTML += `<tr><td data-label="Name">${s.name}</td><td data-label="Location">${s.location}</td><td data-label="Distance">${s.distance}</td><td data-label="Rating">${s.rating} ★</td><td data-label="Action"><button class="btn btn-primary btn-sm modal-trigger" data-modal="create-order-modal" data-supplier-id="${s.id}" data-supplier-name="${s.name}">Place Order</button></td></tr>`;
        });
    }

    function renderSupplierOverview() {
        const orders = getOrders().filter(o => o.supplierId === 1);
        document.getElementById('supplier-total-orders').textContent = orders.length;
        document.getElementById('supplier-pending-orders').textContent = orders.filter(o => o.status === 'Pending').length;
        document.getElementById('supplier-total-revenue').textContent = `₹${orders.reduce((sum, o) => sum + o.amount, 0).toLocaleString()}`;
        if (document.getElementById('supplierRevenueChart')) initSupplierChart(orders);
    }
    
    function renderSupplierOrders() {
        const orders = getOrders().filter(o => o.supplierId === 1);
        const ordersTable = document.getElementById('supplier-orders-table');
        if(!ordersTable) return;
        ordersTable.innerHTML = '';
        orders.slice().reverse().forEach(order => {
            const vendor = getVendors().find(v => v.id === order.vendorId);
             ordersTable.innerHTML += `<tr><td data-label="ID">${order.id}</td><td data-label="Vendor">${vendor ? vendor.shopName : 'N/A'}</td><td data-label="Items">${order.items}</td><td data-label="Amount">₹${order.amount.toLocaleString()}</td><td data-label="Date">${order.date}</td><td data-label="Status"><span class="status ${order.status.replace(' ', '.')}">${order.status}</span></td></tr>`;
        });
    }
    
    function renderSupplierProducts() {
        const productsTable = document.getElementById('supplier-products-table');
        if(!productsTable) return;
        productsTable.innerHTML = '';
        getProducts().filter(p => p.supplierId === 1).forEach(p => {
            productsTable.innerHTML += `<tr><td data-label="Name">${p.name}</td><td data-label="Category">${p.category}</td><td data-label="Price/Unit">₹${p.price}/${p.unit}</td><td data-label="Stock">${p.stock} ${p.unit}</td></tr>`;
        });
    }
    
    const dashNavLinks = document.querySelectorAll('.dash-nav-link');
    const dashPages = document.querySelectorAll('.dashboard-page');
    const breadcrumbs = document.getElementById('dashboard-breadcrumbs');
    const menuToggle = document.getElementById('menu-toggle-btn');
    const sidebarClose = document.getElementById('sidebar-close-btn');
    const overlay = document.querySelector('.overlay');

    function navigate(targetId, targetText) {
        if (!document.getElementById(targetId)) return;
        dashNavLinks.forEach(l => l.classList.remove('active'));
        const activeLink = document.querySelector(`a[href="#${targetId}"]`);
        if (activeLink) activeLink.classList.add('active');
        dashPages.forEach(p => p.classList.remove('active'));
        document.getElementById(targetId).classList.add('active');
        if (breadcrumbs) breadcrumbs.textContent = `सारथि / ${targetText}`;
        const renderMap = { 'vendor-overview': renderVendorOverview, 'vendor-orders': renderVendorOrders, 'vendor-suppliers': renderVendorSuppliers, 'supplier-overview': renderSupplierOverview, 'supplier-orders': renderSupplierOrders, 'supplier-products': renderSupplierProducts };
        if(renderMap[targetId]) renderMap[targetId]();
    }

    dashNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navigate(link.getAttribute('href').substring(1), link.querySelector('span').textContent);
            document.body.classList.remove('sidebar-open');
        });
    });

    if (menuToggle) menuToggle.addEventListener('click', () => document.body.classList.add('sidebar-open'));
    if (sidebarClose) sidebarClose.addEventListener('click', () => document.body.classList.remove('sidebar-open'));
    if (overlay) overlay.addEventListener('click', () => document.body.classList.remove('sidebar-open'));
    
    let currentOrderCart = [];
    const createOrderForm = document.getElementById('create-order-form');
    const addProductForm = document.getElementById('add-product-form');

    function updateCartSummary() {
        const cartSummaryEl = document.getElementById('order-cart-summary');
        if (currentOrderCart.length === 0) { cartSummaryEl.innerHTML = '<p>Your cart is empty.</p>'; return; }
        let totalAmount = 0;
        let summaryHTML = currentOrderCart.map(item => { const itemTotal = item.product.price * item.quantity; totalAmount += itemTotal; return `<div class="product-order-item"><span>${item.product.name} (x${item.quantity})</span> <strong>₹${itemTotal.toLocaleString()}</strong></div>`; }).join('');
        summaryHTML += `<div class="cart-total">Total: ₹${totalAmount.toLocaleString()}</div>`;
        cartSummaryEl.innerHTML = summaryHTML;
    }
    
    function handleQuantityChange(productId, quantity) {
        const product = getProducts().find(p => p.id === productId);
        const existingItemIndex = currentOrderCart.findIndex(item => item.product.id === productId);
        if (quantity > 0) { if (existingItemIndex > -1) { currentOrderCart[existingItemIndex].quantity = quantity; } else { currentOrderCart.push({ product, quantity }); } } else { if (existingItemIndex > -1) currentOrderCart.splice(existingItemIndex, 1); }
        updateCartSummary();
    }
    
    document.addEventListener('click', (e) => {
        if (e.target.matches('.modal-trigger')) {
            const modal = document.getElementById(e.target.dataset.modal);
            if(modal) {
                if(e.target.dataset.modal === 'create-order-modal') {
                    const supplierId = parseInt(e.target.dataset.supplierId);
                    const supplier = getSuppliers().find(s => s.id === supplierId);
                    document.getElementById('order-supplier-name').textContent = supplier.name;
                    document.getElementById('order-supplier-id').value = supplierId;
                    const productListEl = document.getElementById('supplier-product-list');
                    const supplierProducts = getProducts().filter(p => p.supplierId === supplierId);
                    productListEl.innerHTML = supplierProducts.map(p => `<div class="product-order-item"><div class="product-order-item-info"><strong>${p.name}</strong><br><span>₹${p.price}/${p.unit}</span></div><div class="form-group"><input type="number" class="order-quantity-input" data-product-id="${p.id}" min="0" placeholder="Qty"></div></div>`).join('');
                    currentOrderCart = [];
                    updateCartSummary();
                }
                modal.style.display = 'flex';
            }
        }
        if (e.target.matches('.modal-close, .modal-close-btn')) { e.target.closest('.modal').style.display = 'none'; }
    });

    document.addEventListener('input', (e) => { if (e.target.matches('.order-quantity-input')) { handleQuantityChange(parseInt(e.target.dataset.productId), parseInt(e.target.value) || 0); } });

    if(createOrderForm) {
        createOrderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (currentOrderCart.length === 0) { alert('Your cart is empty.'); return; }
            const orderItems = currentOrderCart.map(item => `${item.product.name} (x${item.quantity})`).join(', ');
            const totalAmount = currentOrderCart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
            addOrder({ supplierId: parseInt(document.getElementById('order-supplier-id').value), items: orderItems, amount: totalAmount });
            createOrderForm.closest('.modal').style.display = 'none';
            alert('Order Placed Successfully!');
            const activePage = document.querySelector('.dashboard-page.active')?.id || 'vendor-overview';
            const activeLink = document.querySelector('.dash-nav-link.active');
            navigate(activePage, activeLink.textContent);
        });
    }

    if (addProductForm) {
        addProductForm.addEventListener('submit', (e) => {
            e.preventDefault();
            addProduct({ name: document.getElementById('product-name').value, category: document.getElementById('product-category').value, price: parseFloat(document.getElementById('product-price').value), unit: document.getElementById('product-unit').value, stock: parseInt(document.getElementById('product-stock').value), minOrder: parseInt(document.getElementById('product-min-order').value) });
            addProductForm.reset();
            addProductForm.closest('.modal').style.display = 'none';
            renderSupplierProducts();
            alert('Product Added Successfully!');
        });
    }
    
    if(isVendorDashboard) {
        navigate('vendor-overview', 'Dashboard');
        const locationFilter = document.getElementById('location-filter');
        if (locationFilter) locationFilter.addEventListener('change', renderVendorSuppliers);
    }
    if(isSupplierDashboard) {
        navigate('supplier-overview', 'Dashboard');
    }
    
    const resetButton = document.getElementById('reset-data-btn');
    if (resetButton) {
        resetButton.addEventListener('click', () => { if (confirm('Are you sure you want to reset all prototype data?')) { resetData(); } });
    }
});