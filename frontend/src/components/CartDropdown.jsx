import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { useCart } from '../context/CartContext';
// (no external libs needed here)

export default function CartDropdown({ open, onClose }) {
  const { cart, updateQty, removeFromCart } = useCart();
  const cartRef = useRef(null);
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const targetPhone = '0707474512';
  const waPhone = targetPhone.replace(/^0/, '94');

  const sendWhatsAppTextFallback = () => {
    let msg = `Cutes.lk Order Details - Total: Rs. ${total.toFixed(2)}\n\n`;
    cart.forEach((item, idx) => {
      msg += `${idx + 1}. ${item.title} (Code: ${item.code}) - Qty: ${item.qty} x Rs. ${item.price.toFixed(2)} = Rs. ${(item.price * item.qty).toFixed(2)}\n`;
    });
    msg += `\nPlease ask for the PDF invoice if you need it.`;
    const url = `https://wa.me/${waPhone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  const openWhatsAppConnect = () => {
    const msg = 'Hello i want to place order';
    const url = `https://wa.me/${waPhone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  const handleShareCart = async () => {
    if (!cartRef.current) {
      sendWhatsAppTextFallback();
      return;
    }
    const createCaptureClone = (node) => {
      const clone = node.cloneNode(true);
      // copy computed font styles from original to ensure visual match
      try {
        const comp = window.getComputedStyle(node);
        if (comp && comp.fontFamily) clone.style.fontFamily = comp.fontFamily;
        if (comp && comp.fontSize) clone.style.fontSize = comp.fontSize;
        if (comp && comp.fontWeight) clone.style.fontWeight = comp.fontWeight;
        if (comp && comp.lineHeight) clone.style.lineHeight = comp.lineHeight;
      } catch (e) {
        // ignore
      }
      // Apply container styles for predictable rendering and full height capture
      clone.style.width = '360px';
      clone.style.maxWidth = '360px';
      clone.style.boxSizing = 'border-box';
      clone.style.padding = '16px';
      clone.style.background = '#ffffff';
      clone.style.color = '#111827';
      clone.style.borderRadius = '16px';
      clone.style.overflow = 'visible';
      clone.style.maxHeight = 'none';
      clone.style.height = 'auto';

      // Remove truncation and overflow on text elements to avoid overlap
      const truncates = clone.querySelectorAll('.truncate');
      truncates.forEach(el => {
        el.style.whiteSpace = 'normal';
        el.style.overflow = 'visible';
        el.style.textOverflow = 'clip';
        el.style.display = 'block';
      });

      // Remove any scroll containers and expand their height
      const scrollables = clone.querySelectorAll('.overflow-y-auto, .max-h-100, .max-h-80');
      scrollables.forEach(el => {
        el.style.overflow = 'visible';
        el.style.overflowY = 'visible';
        el.style.maxHeight = 'none';
        el.style.height = 'auto';
      });

      // Ensure images keep aspect ratio
      const imgs = clone.querySelectorAll('img');
      imgs.forEach(img => {
        img.style.width = '56px';
        img.style.height = '56px';
        img.style.objectFit = 'cover';
      });

      // Make rows stack nicely on narrow widths
      const rows = clone.querySelectorAll('.flex.items-center');
      rows.forEach(r => {
        r.style.display = 'flex';
        r.style.flexWrap = 'wrap';
        r.style.alignItems = 'center';
        r.style.gap = '8px';
      });

      // Hide action buttons that should not appear in the screenshot
      const buttons = Array.from(clone.querySelectorAll('button'));
      buttons.forEach(btn => {
        const text = (btn.textContent || '').trim().toLowerCase();
        if (text.includes('connect with our whatsapp') || text.includes('share cart via whatsapp') || text.includes('send list via whatsapp')) {
          btn.style.display = 'none';
        }
      });

      // Hide the instruction block from the screenshot
      const instructions = clone.querySelectorAll('.cart-share-instructions');
      instructions.forEach(el => { el.style.display = 'none'; });

      // Place offscreen to avoid flashing
      const wrapper = document.createElement('div');
      wrapper.style.position = 'fixed';
      wrapper.style.left = '-9999px';
      wrapper.style.top = '0';
      wrapper.style.zIndex = '99999';
      wrapper.appendChild(clone);
      document.body.appendChild(wrapper);

      // helper: wait for images inside clone to load
      const waitForImages = (container) => {
        const images = Array.from(container.querySelectorAll('img'));
        return Promise.all(images.map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise(resolve => { img.onload = img.onerror = () => resolve(); });
        }));
      };

      return { wrapper, clone, waitForImages };
    };

    try {
      // ensure web fonts are loaded so captured text matches on-screen
      if (document.fonts && document.fonts.ready) await document.fonts.ready;

      const created = createCaptureClone(cartRef.current);
      const wrapper = created.wrapper;
      const cloneNode = created.clone;
      // wait for fonts and images to be ready so the screenshot matches rendered cart
      if (created.waitForImages) await created.waitForImages(cloneNode);
      const canvas = await html2canvas(cloneNode, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
      });

      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('Unable to create image from cart.');

      // remove cloned DOM before proceeding
      try { wrapper.remove(); } catch (e) {}

      const file = new File([blob], 'cutes-cart.png', { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] }) && navigator.share) {
        await navigator.share({
          files: [file],
          title: 'Cutes.lk Cart',
          text: `Cutes.lk Order Details - Total: Rs. ${total.toFixed(2)}\n\nChat: https://wa.me/${waPhone}`,
        });
        return;
      }

      if (navigator.share) {
        await navigator.share({
          title: 'Cutes.lk Cart',
          text: `Cutes.lk Order Details - Total: Rs. ${total.toFixed(2)}\n\nChat: https://wa.me/${waPhone}`,
        });
        return;
      }

      // Try clipboard fallback: write image to clipboard then open WhatsApp chat link for the target number.
      if (navigator.clipboard && window.ClipboardItem) {
        try {
          await navigator.clipboard.write([new ClipboardItem({ ['image/png']: blob })]);
          const text = `Cutes.lk Order Details - Total: Rs. ${total.toFixed(2)}\n(If image not pasted automatically, long-press and paste the image into the chat)`;
          const url = `https://wa.me/${waPhone}?text=${encodeURIComponent(text)}`;
          window.open(url, '_blank');
          return;
        } catch (e) {
          console.warn('Clipboard write failed', e);
        }
      }

      // Final fallback: open WhatsApp chat link to the requested number with the textual order details
      sendWhatsAppTextFallback();
    } catch (error) {
      console.error('Cart share failed:', error);
      sendWhatsAppTextFallback();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200" style={{minHeight: '100vh'}} onClick={onClose}>
      <div
        className="relative w-full max-w-md mx-auto bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 md:p-6 animate-in zoom-in-95 duration-200 flex flex-col justify-center items-center"
        ref={cartRef}
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
          <div className="space-y-4 max-h-80 overflow-y-auto">
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
          <span className="text-[#a53973]">Total:</span>
          <span className="text-[#a53973]">Rs. {total.toFixed(2)}</span>
        </div>

     

        {cart.length > 0 && (
          <div className="w-full mt-3 ">
            
            <p className="mb-3 text-sm text-gray-600">
              Online ordering is currently unavailable.  
              Please use WhatsApp to share your cart and place your order.
            </p>
              <p>1. First Click this </p>
              <button
            onClick={openWhatsAppConnect}
            className="mb-1 w-full rounded-lg bg-[#25D366] text-white font-semibold py-3 text-sm flex items-center justify-center hover:bg-[#1ebe5d] transition"
          >
            Connect with our WhatsApp
          </button>
          
          <p>2. Then click this and select our contact</p>
          
          <button
            className="mt-1 w-full rounded-xl bg-[#25D366] text-white font-bold py-3 flex items-center justify-center gap-2 text-base hover:bg-[#1ebe5d] transition-all"
            onClick={handleShareCart}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M20.52 3.48A12.07 12.07 0 0012 0C5.37 0 0 5.37 0 12c0 2.11.55 4.16 1.6 5.97L0 24l6.22-1.63A12.07 12.07 0 0012 24c6.63 0 12-5.37 12-12 0-3.21-1.25-6.23-3.48-8.52zM12 22.13c-1.85 0-3.67-.5-5.24-1.44l-.37-.22-3.69.97.99-3.59-.24-.37C2.37 15.67 1.87 13.85 1.87 12 1.87 6.13 6.13 1.87 12 1.87c5.87 0 10.13 4.26 10.13 10.13 0 5.87-4.26 10.13-10.13 10.13zm5.13-7.13c-.23-.12-1.36-.67-1.57-.75-.21-.08-.36-.12-.51.12-.15.23-.58.75-.71.9-.13.15-.26.17-.49.06-.23-.12-.97-.36-1.85-1.13-.68-.6-1.14-1.34-1.28-1.57-.13-.23-.01-.35.1-.46.1-.1.23-.26.34-.39.11-.13.15-.23.23-.38.08-.15.04-.28-.02-.4-.06-.12-.51-1.23-.7-1.68-.18-.44-.37-.38-.51-.39-.13-.01-.28-.01-.43-.01-.15 0-.4.06-.61.28-.21.21-.8.78-.8 1.9 0 1.12.82 2.2.93 2.35.12.15 1.61 2.46 3.91 3.36.55.19.98.3 1.31.39.55.14 1.05.12 1.45.07.44-.07 1.36-.56 1.55-1.1.19-.54.19-1 .13-1.1-.06-.1-.21-.15-.44-.27z" fill="#fff"/>
            </svg>
            Share cart via WhatsApp
          </button>
          </div>
        )}
      </div>
    </div>
  );
}
