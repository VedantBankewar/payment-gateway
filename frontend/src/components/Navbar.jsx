import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, ShoppingBag, History, CreditCard } from 'lucide-react';
import api from '../api';

const Navbar = () => {
    const location = useLocation();
    const [cartCount, setCartCount] = useState(0);
    const sessionId = localStorage.getItem('sessionId') || 'session_' + Date.now();

    // Store session ID if not exists
    if (!localStorage.getItem('sessionId')) {
        localStorage.setItem('sessionId', sessionId);
    }

    // Refresh cart count on navigation or custom event
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await api.get(`/cart/${sessionId}`);
                setCartCount(response.data.totalItems || 0);
            } catch (error) {
                console.error("Failed to fetch cart", error);
            }
        };

        fetchCart();

        // Listen for cart updates
        const handleCartUpdate = () => fetchCart();
        window.addEventListener('cartUpdated', handleCartUpdate);

        return () => window.removeEventListener('cartUpdated', handleCartUpdate);
    }, [sessionId, location.pathname]);

    return (
        <nav style={{
            background: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-color)',
            padding: '16px 0',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <div className="main-content" style={{ padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '40px', height: '40px', background: 'var(--accent-gradient)',
                        borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '20px'
                    }}>🛒</div>
                    <span style={{ fontSize: '20px', fontWeight: '700', color: 'white' }}>ShopEase</span>
                </Link>

                <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                    <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                        style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ShoppingBag size={18} />
                        Products
                    </Link>

                    <Link to="/orders" className={`nav-link ${location.pathname === '/orders' ? 'active' : ''}`}
                        style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <History size={18} />
                        Orders
                    </Link>

                    <Link to="/billing" className={`nav-link ${location.pathname === '/billing' ? 'active' : ''}`}
                        style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CreditCard size={18} />
                        Billing
                    </Link>

                    <Link to="/cart" className="btn btn-primary" style={{ padding: '8px 16px', position: 'relative' }}>
                        <ShoppingCart size={20} />
                        <span>Cart</span>
                        {cartCount > 0 && (
                            <span style={{
                                position: 'absolute', top: '-8px', right: '-8px',
                                background: 'var(--error-color)', color: 'white',
                                fontSize: '11px', fontWeight: 'bold',
                                padding: '2px 6px', borderRadius: '10px',
                                border: '2px solid var(--bg-secondary)'
                            }}>
                                {cartCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
            <style>{`
                .nav-link:hover, .nav-link.active {
                    color: white !important;
                }
            `}</style>
        </nav>
    );
};

export default Navbar;
