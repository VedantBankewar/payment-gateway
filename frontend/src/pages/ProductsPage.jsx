import React, { useState, useEffect } from 'react';
import api from '../api';
import ProductCard from '../components/ProductCard';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const sessionId = localStorage.getItem('sessionId');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/products');
                setProducts(response.data);
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleAddToCart = async (product) => {
        try {
            await api.post(`/cart/${sessionId}/add`, {
                productId: product.id,
                quantity: 1
            });

            // Dispatch event to update navbar cart count
            window.dispatchEvent(new Event('cartUpdated'));

            // Optional: Show toast notification
            alert(`Added ${product.name} to cart!`);
        } catch (error) {
            console.error("Failed to add to cart", error);
            alert("Failed to add item to cart");
        }
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading products...</div>;

    return (
        <div className="animate-fade-in">
            <header style={{ marginBottom: '32px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '32px', marginBottom: '12px' }}>Discover Premium Gear</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Curated collection of high-quality tech essentials</p>
            </header>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '24px'
            }}>
                {products.map(product => (
                    <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                ))}
            </div>
        </div>
    );
};

export default ProductsPage;
