import React from 'react';
import { useCart } from '../context/CartContext';

export default function CartDropdown({ open, onClose }) {
  const { cart } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (!open) return null;

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-4 animate-in fade-in slide-in-from-top-2">
      <div className="font-bold text-lg mb-2 text-[#a53973]">Cart</div>
      {cart.length === 0 ? (
        <div className="text-slate-400 text-center py-8">Your cart is empty.</div>
      ) : (
        <div className="space-y-4 max-h-64 overflow-y-auto">
          {cart.map(item => (
            <div key={item.id} className="flex items-center gap-3 border-b border-slate-100 pb-2 last:border-b-0">
              <img src={item.image} alt={item.title} className="w-14 h-14 object-cover rounded-xl border border-slate-100" />
              <div className="flex-1">
                <div className="font-bold text-slate-800 text-sm line-clamp-1">{item.title}</div>
                <div className="text-xs text-slate-400">{item.code}</div>
                <div className="text-xs text-slate-500">Qty: {item.qty}</div>
              </div>
              <div className="font-bold text-[#a53973] text-base">Rs. {(item.price * item.qty).toFixed(2)}</div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-4 flex items-center justify-between font-bold text-slate-700">
        <span>Total:</span>
        <span className="text-[#a53973]">Rs. {total.toFixed(2)}</span>
      </div>
    </div>
  );
}
