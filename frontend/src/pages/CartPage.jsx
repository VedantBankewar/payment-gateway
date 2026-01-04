import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import api from '../api';

const CartPage = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const sessionId = localStorage.getItem('sessionId');
    const navigate = useNavigate();

    const fetchCart = async () => {
        try {
            const response = await api.get(`/cart/${sessionId}`);
            setCart(response.data);
            // Sync navbar count
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (error) {
            console.error("Failed to fetch cart", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [sessionId]);

    const updateQuantity = async (productId, delta) => {
        const item = cart.items.find(i => i.productId === productId);
        if (!item) return;

        const newQty = item.quantity + delta;

        try {
            if (newQty <= 0) {
                await api.delete(`/cart/${sessionId}/remove/${productId}`);
            } else {
                await api.put(`/cart/${sessionId}/update`, {
                    productId,
                    quantity: newQty
                });
            }
            fetchCart();
        } catch (error) {
            console.error("Failed to update cart", error);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(price / 100);
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading cart...</div>;

    if (!cart || cart.items.length === 0) {
        return (
            <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', margin: '40px auto', maxWidth: '600px' }}>
                <div style={{ fontSize: '64px', marginBottom: '20px' }}>🛒</div>
                <h2>Your cart is empty</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
                    Looks like you haven't added anything yet.
                </p>
                <Link to="/" className="btn btn-primary">Start Shopping</Link>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <h1 style={{ marginBottom: '24px' }}>Shopping Cart</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '30px', alignItems: 'start' }}>
                {/* Cart Items List */}
                <div className="glass-panel" style={{ padding: '20px' }}>
                    {cart.items.map(item => (
                        <div key={item.productId} style={{
                            display: 'flex',
                            gap: '20px',
                            padding: '20px 0',
                            borderBottom: '1px solid var(--border-color)'
                        }}>
                            <div style={{
                                width: '80px', height: '80px',
                                background: 'rgba(255,255,255,0.05)',
                                borderRadius: '8px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '32px'
                            }}>
                                {item.imageUrl}
                            </div>

                            <div style={{ flex: 1 }}>
                                <h3 style={{ marginBottom: '4px' }}>{item.productName}</h3>
                                <div style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>
                                    {formatPrice(item.price)}
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <button className="btn btn-secondary" style={{ padding: '6px' }}
                                    onClick={() => updateQuantity(item.productId, -1)}>
                                    <Minus size={16} />
                                </button>
                                <span style={{ width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                                <button className="btn btn-secondary" style={{ padding: '6px' }}
                                    onClick={() => updateQuantity(item.productId, 1)}>
                                    <Plus size={16} />
                                </button>
                            </div>

                            <button className="btn btn-danger" style={{ padding: '8px', height: 'fit-content' }}
                                onClick={() => updateQuantity(item.productId, -100)}>
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="glass-panel" style={{ padding: '24px', position: 'sticky', top: '100px' }}>
                    <h2 style={{ fontSize: '18px', marginBottom: '20px' }}>Order Summary</h2>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                        <span>{formatPrice(cart.totalAmount)}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Shipping</span>
                        <span style={{ color: 'var(--success-color)' }}>Free</span>
                    </div>

                    <div style={{
                        borderTop: '1px solid var(--border-color)',
                        paddingTop: '20px',
                        marginTop: '10px',
                        marginBottom: '24px',
                        display: 'flex', justifyContent: 'space-between',
                        fontSize: '18px', fontWeight: 'bold'
                    }}>
                        <span>Total</span>
                        <span>{formatPrice(cart.totalAmount)}</span>
                    </div>

                    <Link to="/checkout" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                        Proceed to Checkout <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
