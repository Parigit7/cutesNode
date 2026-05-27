import React from 'react';
import { useCart } from '../context/CartContext';

export default function CartDropdown({ open, onClose }) {
  const { cart, updateQty, removeFromCart } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200" style={{minHeight: '100vh'}} onClick={onClose}>
      <div
        className="relative w-full max-w-md mx-auto bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 md:p-6 animate-in zoom-in-95 duration-200 flex flex-col justify-center items-center"
        style={{ top: 0, left: 0, transform: 'none', maxHeight: '90vh', minHeight: 'auto', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="font-bold text-lg mb-4 text-[#a53973] text-center">Cart</div>
        {cart.length === 0 ? (
          <div className="text-slate-400 text-center py-12">Your cart is empty.</div>
        ) : (
          <div className="space-y-4 max-h-100 overflow-y-auto">
            {cart.map(item => (
              <div key={item.id} className="flex items-center gap-3 border-b border-slate-100 pb-2 last:border-b-0">
                <img src={item.image} alt={item.title} className="w-14 h-14 object-cover rounded-xl border border-slate-100" />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-800 text-sm truncate">{item.title}</div>
                  <div className="text-xs text-slate-400 truncate">{item.code}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <button
                      className="px-2 py-1 rounded-l bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold"
                      onClick={() => updateQty(item.id, Math.max(1, item.qty - 1))}
                      disabled={item.qty <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={item.qty}
                      onChange={e => updateQty(item.id, Math.max(1, Number(e.target.value) || 1))}
                      className="w-12 text-center border border-slate-200 rounded font-bold text-slate-700 mx-1"
                    />
                    <button
                      className="px-2 py-1 rounded-r bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold"
                      onClick={() => updateQty(item.id, item.qty + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="font-bold text-[#a53973] text-base">Rs. {(item.price * item.qty).toFixed(2)}</div>
                  <button
                    className="text-xs text-rose-500 hover:underline mt-1"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-6 flex items-center justify-between font-bold text-slate-700 text-lg">
          <span>Total:</span>
          <span className="text-[#a53973]">Rs. {total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
