import React, { useState } from 'react';
import { Search, Receipt, CheckCircle, XCircle } from 'lucide-react';
import api from '../api';

const BillingHistoryPage = () => {
    const [email, setEmail] = useState('');
    const [records, setRecords] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.get(`/billing/${email}`);
            setRecords(response.data);
        } catch (error) {
            console.error("Failed to fetch billing", error);
            alert("Failed to find billing history for this email");
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(price / 100);
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '30px' }}>Billing History</h1>

            <form onSubmit={handleSearch} className="glass-panel" style={{ padding: '24px', marginBottom: '30px', display: 'flex', gap: '16px' }}>
                <input
                    type="email"
                    placeholder="Enter email to retrieve transactions"
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    <Search size={18} /> {loading ? 'Searching...' : 'Find Transactions'}
                </button>
            </form>

            {records && (
                <div>
                    {records.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                            No transactions found for {email}
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '16px' }}>
                            {records.map(record => (
                                <div key={record.transactionId} className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                        <div style={{
                                            width: '48px', height: '48px', borderRadius: '12px',
                                            background: record.status === 'SUCCESS' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                            color: record.status === 'SUCCESS' ? 'var(--success-color)' : 'var(--error-color)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <Receipt size={24} />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                                                {record.status === 'SUCCESS' ? 'Payment Successful' : 'Payment Failed'}
                                            </div>
                                            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', gap: '12px' }}>
                                                <span>{new Date(record.timestamp).toLocaleString()}</span>
                                                <span>•</span>
                                                <span>Method: {record.paymentMethod}</span>
                                            </div>
                                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                                TXN: {record.razorpayPaymentId}
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{formatPrice(record.amount)}</div>
                                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                                            Order #{record.orderId.replace("ORD_", "")}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BillingHistoryPage;
