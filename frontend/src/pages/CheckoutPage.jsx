import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Lock, CreditCard } from 'lucide-react';
import api from '../api';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const sessionId = localStorage.getItem('sessionId');
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        shippingAddress: '',
        city: '',
        pincode: ''
    });

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await api.get(`/cart/${sessionId}`);
                if (!response.data || response.data.items.length === 0) {
                    navigate('/cart');
                }
                setCart(response.data);
            } catch (error) {
                console.error("Failed to fetch cart", error);
            }
        };
        fetchCart();
    }, [sessionId, navigate]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);

        // 1. Load Razorpay SDK
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
            alert('Razorpay SDK failed to load. Are you online?');
            setLoading(false);
            return;
        }

        try {
            // 2. Create Order on Backend
            const orderPayload = {
                sessionId,
                ...formData
            };

            const orderResponse = await api.post('/orders', orderPayload);
            const orderData = orderResponse.data;

            // 3. Initialize Razorpay Checkout
            // Note: We need to fetch the key ID from backend or config. 
            // Ideally backend returns it in order response, but current Order model has razorpayOrderId.
            // Let's assume backend verifies this. For frontend key, we'll fetch it from a health or config endpoint,
            // or we might need it in the Order response.
            // Let's modify OrderService/Controller to return the key or fetch it here.

            // To be safe, let's fetch key from our existing PaymentController create-order response logic, 
            // OR just hardcode the test key if necessary, BUT better:
            // The previous PaymentService.createOrder (legacy) returned the key. 
            // The new OrderService implementation updates the order with Razorpay ID but doesn't return the key explicitly in Order object?
            // Actually OrderResponse legacy class had it.
            // Let's assume we use a hardcoded key from the plan for now or fetch it.
            // The key is public (rzp_test_...).

            const options = {
                key: "rzp_test_Rzly0YEDuqxoJ5", // Using the key from application.properties
                amount: orderData.totalAmount, // Amount in paise
                currency: "INR",
                name: "ShopEase",
                description: "Order #" + orderData.orderId,
                image: "https://example.com/logo.png",
                order_id: orderData.razorpayOrderId,
                handler: async function (response) {
                    try {
                        // 4. Verify Payment
                        const verifyPayload = {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        };

                        const verifyRes = await api.post('/payment/verify', verifyPayload);

                        if (verifyRes.data.success) {
                            // Sync cart (it should be empty now on backend)
                            window.dispatchEvent(new Event('cartUpdated'));

                            // Redirect to Success/History
                            alert('Payment Successful!');
                            navigate('/orders');
                        } else {
                            alert('Payment Verification Failed');
                        }
                    } catch (err) {
                        console.error("Verification error", err);
                        alert('Payment verification failed');
                    }
                },
                prefill: {
                    name: formData.customerName,
                    email: formData.customerEmail,
                    contact: formData.customerPhone
                },
                theme: {
                    color: "#667eea"
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                alert("Payment Failed: " + response.error.description);
            });
            rzp.open();

        } catch (error) {
            console.error("Payment initiation failed", error);
            alert("Something went wrong while initiating payment");
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

    if (!cart) return <div style={{ padding: '40px' }}>Loading...</div>;

    return (
        <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '30px' }}>Secure Checkout</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '40px' }}>
                {/* Form Section */}
                <form onSubmit={handlePayment} className="glass-panel" style={{ padding: '30px' }}>
                    <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-color)' }}>
                        <Lock size={20} />
                        <h3>Contact & Shipping</h3>
                    </div>

                    <div style={{ display: 'grid', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>FULL NAME</label>
                            <input type="text" name="customerName" required className="form-input"
                                value={formData.customerName} onChange={handleInputChange} placeholder="John Doe" />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>EMAIL</label>
                                <input type="email" name="customerEmail" required className="form-input"
                                    value={formData.customerEmail} onChange={handleInputChange} placeholder="john@example.com" />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>PHONE</label>
                                <input type="tel" name="customerPhone" required className="form-input"
                                    value={formData.customerPhone} onChange={handleInputChange} placeholder="+91 9876543210" />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>ADDRESS</label>
                            <input type="text" name="shippingAddress" required className="form-input"
                                value={formData.shippingAddress} onChange={handleInputChange} placeholder="Street address" />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>CITY</label>
                                <input type="text" name="city" required className="form-input"
                                    value={formData.city} onChange={handleInputChange} placeholder="City" />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>PINCODE</label>
                                <input type="text" name="pincode" required className="form-input"
                                    value={formData.pincode} onChange={handleInputChange} placeholder="123456" />
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary"
                        style={{ width: '100%', marginTop: '30px', padding: '16px', fontSize: '16px' }}
                        disabled={loading}>
                        {loading ? 'Processing...' : `Pay ${formatPrice(cart.totalAmount)}`}
                    </button>

                    <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        <Lock size={12} /> Secured by Razorpay
                    </div>
                </form>

                {/* Summary Section */}
                <div>
                    <div className="glass-panel" style={{ padding: '24px' }}>
                        <h3 style={{ marginBottom: '20px', fontSize: '16px' }}>Order Summary</h3>
                        {cart.items.map(item => (
                            <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' }}>
                                <span>{item.quantity}x {item.productName}</span>
                                <span>{formatPrice(item.totalPrice)}</span>
                            </div>
                        ))}
                        <div style={{ borderTop: '1px solid var(--border-color)', margin: '16px 0' }}></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '18px' }}>
                            <span>Total</span>
                            <span>{formatPrice(cart.totalAmount)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
