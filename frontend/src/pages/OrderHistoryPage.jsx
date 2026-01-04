import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, Package } from 'lucide-react';
import api from '../api';

const OrderHistoryPage = () => {
    const [email, setEmail] = useState('');
    const [orders, setOrders] = useState(null);
    const [loading, setLoading] = useState(false);
    const [expandedOrder, setExpandedOrder] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.get(`/orders/history/${email}`);
            setOrders(response.data);
        } catch (error) {
            console.error("Failed to fetch orders", error);
            alert("Failed to find orders for this email");
        } finally {
            setLoading(false);
        }
    };

    const toggleOrder = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(price / 100);
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '30px' }}>Order History</h1>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="glass-panel" style={{ padding: '24px', marginBottom: '30px', display: 'flex', gap: '16px' }}>
                <input
                    type="email"
                    placeholder="Enter email to retrieve your orders"
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    <Search size={18} /> {loading ? 'Searching...' : 'Find Orders'}
                </button>
            </form>

            {/* Results */}
            {orders && (
                <div>
                    {orders.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                            No orders found for {email}
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '20px' }}>
                            {orders.map(order => (
                                <div key={order.orderId} className="glass-panel" style={{ overflow: 'hidden' }}>
                                    <div
                                        onClick={() => toggleOrder(order.orderId)}
                                        style={{
                                            padding: '20px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            background: 'rgba(255,255,255,0.02)'
                                        }}
                                    >
                                        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                            <div style={{
                                                width: '40px', height: '40px', borderRadius: '50%',
                                                background: 'rgba(102, 126, 234, 0.1)', color: 'var(--accent-color)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}>
                                                <Package size={20} />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '600' }}>#{order.orderId}</div>
                                                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontWeight: 'bold' }}>{formatPrice(order.totalAmount)}</div>
                                                <span style={{
                                                    fontSize: '12px', padding: '2px 8px', borderRadius: '12px',
                                                    background: order.status === 'PAID' ? 'var(--success-color)' : 'var(--bg-secondary)',
                                                    color: order.status === 'PAID' ? '#000' : 'var(--text-secondary)'
                                                }}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            {expandedOrder === order.orderId ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                        </div>
                                    </div>

                                    {expandedOrder === order.orderId && (
                                        <div style={{ padding: '20px', borderTop: '1px solid var(--border-color)', animation: 'fadeIn 0.2s ease' }}>
                                            <h4 style={{ marginBottom: '16px', fontSize: '14px', color: 'var(--text-secondary)' }}>ITEMS</h4>
                                            {order.items.map((item, idx) => (
                                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                                    <span style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                        <span>{item.imageUrl}</span>
                                                        <span>{item.quantity}x {item.productName}</span>
                                                    </span>
                                                    <span>{formatPrice(item.totalPrice)}</span>
                                                </div>
                                            ))}

                                            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                                                <h4 style={{ marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>SHIPPING TO</h4>
                                                <p>{order.customerName}</p>
                                                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                                                    {order.shippingAddress}, {order.city} - {order.pincode}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default OrderHistoryPage;
