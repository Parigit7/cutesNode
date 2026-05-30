import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { useCart } from '../context/CartContext';
// (no external libs needed here)

import api from '../services/api';

export default function CartDropdown({ open, onClose }) {
  const { cart, updateQty, removeFromCart } = useCart();
  const cartRef = useRef(null);
  const screenshotTemplateRef = useRef(null);

  const [dbItems, setDbItems] = React.useState([]);

  const total = cart.reduce((sum, item) => {
    const dbItem = dbItems.find(i => i.id === item.id);
    const isSoldOut = dbItems.length > 0 && (!dbItem || !dbItem.colors?.some(c => c.qty > 0));
    if (isSoldOut) {
      return sum;
    }
    return sum + item.price * item.qty;
  }, 0);

  React.useEffect(() => {
    if (open) {
      const fetchFreshStock = async () => {
        try {
          const { data } = await api.get('/items');
          if (Array.isArray(data)) {
            setDbItems(data);
          }
        } catch (err) {
          console.error('Failed to fetch fresh stock info:', err);
        }
      };
      fetchFreshStock();
    }
  }, [open]);

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
    if (!screenshotTemplateRef.current) {
      sendWhatsAppTextFallback();
      return;
    }

    try {
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      // Wait for all images inside the template to load
      const images = Array.from(screenshotTemplateRef.current.querySelectorAll('img'));
      await Promise.all(images.map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
          img.onload = img.onerror = () => resolve();
        });
      }));

      const canvas = await html2canvas(screenshotTemplateRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
      });

      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('Unable to create image from cart.');

      const file = new File([blob], 'cutes-cart.png', { type: 'image/png' });

      // ONLY use native share if the browser fully supports file (image) attachments
      if (navigator.canShare && navigator.canShare({ files: [file] }) && navigator.share) {
        try {
          await navigator.share({
            files: [file],
            title: 'Cutes.lk Cart',
            text: `Cutes.lk Order Details - Total: Rs. ${total.toFixed(2)}\n\nChat with us: https://wa.me/${waPhone}`,
          });
          return;
        } catch (shareError) {
          console.warn('Native file share failed, running fallback...', shareError);
        }
      }

      // FALLBACK when native file sharing is not supported (e.g. desktop Chrome / Firefox)
      // 1. Write the image to the system clipboard so the user can easily Ctrl+V/Paste in WhatsApp
      let clipboardSuccess = false;
      if (navigator.clipboard && window.ClipboardItem) {
        try {
          await navigator.clipboard.write([new ClipboardItem({ ['image/png']: blob })]);
          clipboardSuccess = true;
        } catch (e) {
          console.warn('Clipboard copy failed', e);
        }
      }

      // 2. Automatically download the high-fidelity screenshot so they can manually attach it if paste fails
      try {
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = 'cutes-cart.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(downloadUrl);
      } catch (downloadError) {
        console.warn('Automatic download failed', downloadError);
      }

      // 3. Open WhatsApp with prefilled instructional text based on clipboard status
      let text = ``;
      if (clipboardSuccess) {
        text += `The cart screenshot is COPIED to your clipboard! Copy paste it into our chat!\n\n`;
      } else {
        text += `The cart screenshot has been DOWNLOADED to your device as 'cutes-cart.png'. Please attach it to this chat!)\n\n`;
      }
      text += ``;

      const url = `https://wa.me/${waPhone}?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');

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
            {cart.map(item => {
              const dbItem = dbItems.find(i => i.id === item.id);
              const isSoldOut = dbItems.length > 0 && (!dbItem || !dbItem.colors?.some(c => c.qty > 0));
              return (
                <div key={item.id} className="flex items-center gap-3 border-b border-slate-100 pb-2 last:border-b-0 w-full">
                  {/* Left Column (Image & Info) - Blurred if Sold Out */}
                  <div className={`flex flex-1 items-center gap-3 min-w-0 ${isSoldOut ? 'opacity-40 filter blur-[0.5px] pointer-events-none select-none' : ''}`}>
                    <img src={item.image} alt={item.title} className="w-14 h-14 object-cover rounded-xl border border-slate-100" />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-800 text-sm truncate flex items-center gap-2">
                        {item.title}
                        {isSoldOut && (
                          <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[9px] font-black uppercase text-rose-600">Sold out</span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 truncate">{item.code}</div>
                      
                      {isSoldOut ? (
                        <div className="text-[10px] font-bold text-rose-500 uppercase tracking-wider mt-1.5">Unavailable</div>
                      ) : (
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
                      )}
                    </div>
                  </div>

                  {/* Right Column (Price & Remove Button) - Always clickable */}
                  <div className="flex flex-col items-end gap-1">
                    <div className={`font-bold text-base ${isSoldOut ? 'text-slate-400 line-through' : 'text-[#a53973]'}`}>
                      Rs. {(item.price * item.qty).toFixed(2)}
                    </div>
                    <button
                      className="text-xs text-rose-500 font-bold hover:underline mt-1.5"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
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
              <p>1) First click this to start chat with us </p>
              <button
                onClick={openWhatsAppConnect}
                className="mb-6 w-full rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold py-3 flex items-center justify-center gap-2 text-sm transition-all duration-300 shadow-md shadow-[#25D366]/20 hover:shadow-lg hover:shadow-[#25D366]/30 hover:-translate-y-0.5"
              >
                
                Chat with us
              </button>
          
           
          <p>2) Then click this to share your cart with us </p>
          <button
            className="mt-1 w-full rounded-xl bg-[#25D366] text-white font-bold py-3 flex items-center justify-center gap-2 text-base hover:bg-[#1ebe5d] transition-all"
            onClick={handleShareCart}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M20.52 3.48A12.07 12.07 0 0012 0C5.37 0 0 5.37 0 12c0 2.11.55 4.16 1.6 5.97L0 24l6.22-1.63A12.07 12.07 0 0012 24c6.63 0 12-5.37 12-12 0-3.21-1.25-6.23-3.48-8.52zM12 22.13c-1.85 0-3.67-.5-5.24-1.44l-.37-.22-3.69.97.99-3.59-.24-.37C2.37 15.67 1.87 13.85 1.87 12 1.87 6.13 6.13 1.87 12 1.87c5.87 0 10.13 4.26 10.13 10.13 0 5.87-4.26 10.13-10.13 10.13zm5.13-7.13c-.23-.12-1.36-.67-1.57-.75-.21-.08-.36-.12-.51.12-.15.23-.58.75-.71.9-.13.15-.26.17-.49.06-.23-.12-.97-.36-1.85-1.13-.68-.6-1.14-1.34-1.28-1.57-.13-.23-.01-.35.1-.46.1-.1.23-.26.34-.39.11-.13.15-.23.23-.38.08-.15.04-.28-.02-.4-.06-.12-.51-1.23-.7-1.68-.18-.44-.37-.38-.51-.39-.13-.01-.28-.01-.43-.01-.15 0-.4.06-.61.28-.21.21-.8.78-.8 1.9 0 1.12.82 2.2.93 2.35.12.15 1.61 2.46 3.91 3.36.55.19.98.3 1.31.39.55.14 1.05.12 1.45.07.44-.07 1.36-.56 1.55-1.1.19-.54.19-1 .13-1.1-.06-.1-.21-.15-.44-.27z" fill="#fff"/>
            </svg>
            Share cart via WhatsApp
          </button>

          {/* Hidden Screenshot Template */}
          <div 
            ref={screenshotTemplateRef}
            className="bg-white p-6 rounded-3xl"
            style={{
              position: 'fixed',
              left: '-9999px',
              top: 0,
              width: '380px',
              boxShadow: 'none',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
          >
            {/* Header */}
            <div className="flex flex-col items-center border-b border-slate-100 pb-4 mb-4">
              <img src="/logo.png" alt="Cutes.lk Logo" className="h-16 w-16 object-contain mb-2" />
              
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Cart Summary</p>
            </div>

            {/* Items */}
            <div className="space-y-4 mb-6">
              {cart.map(item => {
                const dbItem = dbItems.find(i => i.id === item.id);
                const isSoldOut = dbItems.length > 0 && (!dbItem || !dbItem.colors?.some(c => c.qty > 0));
                return (
                  <div key={item.id} className={`flex items-center gap-3 border-b border-slate-50 pb-3 last:border-b-0 ${isSoldOut ? 'opacity-40' : ''}`}>
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded-xl border border-slate-100" />
                    ) : (
                      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-300 font-bold">🛒</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-800 text-sm flex items-center gap-2">
                        {item.title}
                        {isSoldOut && (
                          <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[8px] font-bold text-rose-600">Sold out</span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 font-bold">{item.code}</div>
                      <div className="text-xs text-slate-500 mt-1 font-bold">
                        {isSoldOut ? (
                          <span className="text-rose-500 italic">Currently unavailable</span>
                        ) : (
                          `Qty: ${item.qty} × Rs. ${item.price.toFixed(2)}`
                        )}
                      </div>
                    </div>
                    <div className={`font-extrabold text-slate-800 text-sm ${isSoldOut ? 'text-slate-400 line-through' : ''}`}>
                      Rs. {isSoldOut ? '0.00' : (item.price * item.qty).toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-4">
              <div className="flex justify-between items-center text-xs font-bold text-slate-500 mb-2">
                <span>Total Items:</span>
                <span>{cart.reduce((sum, item) => sum + item.qty, 0)}</span>
              </div>
              <div className="flex justify-between items-center font-extrabold text-slate-800">
                <span className="text-[#a53973] text-base">Grand Total:</span>
                <span className="text-[#a53973] text-lg">Rs. {total.toFixed(2)}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-[10px] text-slate-400 font-semibold">
              <p>Thank you for shopping with Cutes.lk!</p>
              <p className="mt-1">Please send this image to complete your order.</p>
            </div>
          </div>
          </div>
        )}
      </div>
    </div>
  );
}
