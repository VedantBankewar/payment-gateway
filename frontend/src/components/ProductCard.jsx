import React from 'react';
import { Plus } from 'lucide-react';
import api from '../api';

const ProductCard = ({ product, onAddToCart }) => {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(price / 100);
    };

    return (
        <div className="glass-panel" style={{
            padding: '20px',
            transition: 'transform 0.2s',
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
        }}>
            <div style={{
                height: '180px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '64px',
                marginBottom: '16px'
            }}>
                {product.imageUrl}
            </div>

            <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>{product.name}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px', flex: 1 }}>
                {product.description}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <span style={{ fontSize: '20px', fontWeight: 'bold' }}>{formatPrice(product.price)}</span>
                <button
                    onClick={() => onAddToCart(product)}
                    className="btn btn-primary"
                    style={{ padding: '8px 12px' }}
                >
                    <Plus size={18} /> Add
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
