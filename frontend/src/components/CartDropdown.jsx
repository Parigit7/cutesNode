import React from 'react';
import { useCart } from '../context/CartContext';
// (no external libs needed here)

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
        <div className="mt-6 flex items-center justify-between font-bold text-slate-700 text-lg w-full">
          <span>Total:</span>
          <span className="text-[#a53973]">Rs. {total.toFixed(2)}</span>
        </div>

        {cart.length > 0 && (
          <button
            className="mt-4 w-full rounded-xl bg-[#25D366] text-white font-bold py-3 flex items-center justify-center gap-2 text-base hover:bg-[#1ebe5d] transition-all"
            onClick={() => {
              const phone = '94707474512';
              let msg = `Cutes.lk Order Details - Total: Rs. ${total.toFixed(2)}\n\n`;
              cart.forEach((item, idx) => {
                msg += `${idx + 1}. ${item.title} (Code: ${item.code}) - Qty: ${item.qty} x Rs. ${item.price.toFixed(2)} = Rs. ${(item.price * item.qty).toFixed(2)}\n`;
              });
              msg += `\nPlease ask for the PDF invoice if you need it.`;
              const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
              window.open(url, '_blank');
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M20.52 3.48A12.07 12.07 0 0012 0C5.37 0 0 5.37 0 12c0 2.11.55 4.16 1.6 5.97L0 24l6.22-1.63A12.07 12.07 0 0012 24c6.63 0 12-5.37 12-12 0-3.21-1.25-6.23-3.48-8.52zM12 22.13c-1.85 0-3.67-.5-5.24-1.44l-.37-.22-3.69.97.99-3.59-.24-.37C2.37 15.67 1.87 13.85 1.87 12 1.87 6.13 6.13 1.87 12 1.87c5.87 0 10.13 4.26 10.13 10.13 0 5.87-4.26 10.13-10.13 10.13zm5.13-7.13c-.23-.12-1.36-.67-1.57-.75-.21-.08-.36-.12-.51.12-.15.23-.58.75-.71.9-.13.15-.26.17-.49.06-.23-.12-.97-.36-1.85-1.13-.68-.6-1.14-1.34-1.28-1.57-.13-.23-.01-.35.1-.46.1-.1.23-.26.34-.39.11-.13.15-.23.23-.38.08-.15.04-.28-.02-.4-.06-.12-.51-1.23-.7-1.68-.18-.44-.37-.38-.51-.39-.13-.01-.28-.01-.43-.01-.15 0-.4.06-.61.28-.21.21-.8.78-.8 1.9 0 1.12.82 2.2.93 2.35.12.15 1.61 2.46 3.91 3.36.55.19.98.3 1.31.39.55.14 1.05.12 1.45.07.44-.07 1.36-.56 1.55-1.1.19-.54.19-1 .13-1.1-.06-.1-.21-.15-.44-.27z" fill="#fff"/>
            </svg>
            Send list via WhatsApp
          </button>
        )}
      </div>
    </div>
  );
}
