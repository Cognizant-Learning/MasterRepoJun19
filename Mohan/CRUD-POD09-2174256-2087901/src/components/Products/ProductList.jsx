import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api/products';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({}); // { productId: count }

  // Fetch products
  const fetchProducts = () => {
    fetch(API_URL)
      .then(res => res.json())
      .then(setProducts);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add to cart handler
  const handleAdd = (id) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  // Remove from cart handler
  const handleRemove = (id) => {
    setCart((prev) => {
      if (!prev[id]) return prev;
      const updated = { ...prev };
      if (updated[id] === 1) {
        delete updated[id];
      } else {
        updated[id] -= 1;
      }
      return updated;
    });
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 0' }}>
      <h1 style={{ textAlign: 'center' }}>Electronics</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>
        {products.map(product => (
          <div key={product.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 20, width: 260, background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h2 style={{ fontSize: '1.2rem', margin: '0 0 0.5rem 0' }}>{product.name}</h2>
            <div style={{ color: '#888', marginBottom: 8 }}>${product.price}</div>
            <div style={{ minHeight: 48, marginBottom: 12 }}>{product.description}</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8, justifyContent: 'center' }}>
              <button onClick={() => handleAdd(product.id)} style={{ background: '#222', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 12px', cursor: 'pointer' }}>
                Add{cart[product.id] ? ` (${cart[product.id]})` : ''}
              </button>
              {cart[product.id] > 0 && (
                <button onClick={() => handleRemove(product.id)} style={{ background: '#eee', color: '#222', border: 'none', borderRadius: 4, padding: '8px 12px', cursor: 'pointer' }}>
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
