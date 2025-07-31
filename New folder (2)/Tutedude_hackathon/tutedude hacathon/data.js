const initialData = {
  vendors: [
    { id: 1, name: 'Rohan Sharma', shopName: 'Rohan Di Chaat', location: 'Delhi' },
    { id: 2, name: 'Priya Singh', shopName: 'Priya\'s Pav Bhaji', location: 'Mumbai' }
  ],
  suppliers: [
      { id: 1, name: 'Gupta Kirana Store', location: 'Delhi', distance: '1.2 km', rating: 4.7 },
      { id: 2, name: 'Delhi Fresh Vegetables', location: 'Delhi', distance: '2.5 km', rating: 4.8 },
      { id: 3, name: 'Anil Spices & Co.', location: 'Delhi', distance: '3.8 km', rating: 4.5 },
      { id: 4, name: 'Capital Oils & Grains', location: 'Delhi', distance: '4.1 km', rating: 4.9 },
      { id: 5, name: 'Mumbai Spice Hub', location: 'Mumbai', distance: '1.8 km', rating: 4.3 },
      { id: 6, name: 'Mumbai Veggie Fresh', location: 'Mumbai', distance: '3.5 km', rating: 4.7 },
      { id: 7, name: 'Deccan Grains', location: 'Mumbai', distance: '5.2 km', rating: 4.6 }
  ],
  products: [
      { id: 1, supplierId: 1, name: 'Besan (Gram Flour)', category: 'Grains', price: 120, stock: 150, minOrder: 10, unit: 'kg' },
      { id: 2, supplierId: 1, name: 'Aashirvaad Atta', category: 'Grains', price: 450, stock: 100, minOrder: 5, unit: '10kg Bag' },
      { id: 3, supplierId: 2, name: 'Fresh Onions', category: 'Vegetables', price: 35, stock: 500, minOrder: 20, unit: 'kg' },
      { id: 4, supplierId: 2, name: 'Tomatoes', category: 'Vegetables', price: 60, stock: 300, minOrder: 10, unit: 'kg' },
      { id: 5, supplierId: 3, name: 'Turmeric Powder', category: 'Spices', price: 250, stock: 70, minOrder: 2, unit: 'kg' },
      { id: 6, supplierId: 3, name: 'Red Chilli Powder', category: 'Spices', price: 300, stock: 65, minOrder: 2, unit: 'kg' },
      { id: 7, supplierId: 4, name: 'Fortune Sunflower Oil', category: 'Oils', price: 1600, stock: 50, minOrder: 1, unit: '10L Can' }
  ],
  orders: [
    { id: 'ORD-001', vendorId: 1, supplierId: 1, items: 'Besan (50kg), Atta (20 bags)', amount: 15000, status: 'Delivered', date: '2025-05-20' },
    { id: 'ORD-002', vendorId: 2, supplierId: 5, items: 'Assorted Spices', amount: 7800, status: 'Delivered', date: '2025-06-11' },
    { id: 'ORD-003', vendorId: 1, supplierId: 2, items: 'Onions (100kg), Tomatoes (50kg)', amount: 6500, status: 'Delivered', date: '2025-06-28' },
    { id: 'ORD-004', vendorId: 1, supplierId: 3, items: 'Turmeric (10kg), Chilli (10kg)', amount: 5500, status: 'In Transit', date: '2025-07-21' },
    { id: 'ORD-005', vendorId: 2, supplierId: 1, items: 'Besan (20kg)', amount: 2400, status: 'Pending', date: '2025-07-24' },
    { id: 'ORD-006', vendorId: 1, supplierId: 4, items: 'Sunflower Oil (5 Cans)', amount: 8000, status: 'Pending', date: '2025-07-25' },
  ]
};

let appData = {};

function initializeData() {
    const storedData = localStorage.getItem('sarathiData');
    if (storedData) {
        appData = JSON.parse(storedData);
    } else {
        appData = JSON.parse(JSON.stringify(initialData));
        localStorage.setItem('sarathiData', JSON.stringify(appData));
    }
}

function saveData() { localStorage.setItem('sarathiData', JSON.stringify(appData)); }
function getOrders() { return appData.orders; }
function getSuppliers() { return appData.suppliers; }
function getProducts() { return appData.products; }
function getVendors() { return appData.vendors; }

function addOrder(orderData) {
    const newOrder = { id: `ORD-${String(appData.orders.length + 1).padStart(3, '0')}`, vendorId: 1, status: 'Pending', date: new Date().toISOString().split('T')[0], ...orderData };
    appData.orders.push(newOrder);
    saveData();
}

function addProduct(productData) {
    const newProduct = { id: `PROD-${String(appData.products.length + 1).padStart(3, '0')}`, supplierId: 1, ...productData };
    appData.products.push(newProduct);
    saveData();
}

function resetData() {
    localStorage.removeItem('sarathiData');
    window.location.reload();
}

initializeData();