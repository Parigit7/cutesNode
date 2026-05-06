import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="relative min-h-[calc(100vh-80px)] w-full flex flex-col items-center justify-center bg-[#fffafb] overflow-hidden selection:bg-brand/20 selection:text-brand">
      
      {/* Animated Mesh Gradient Background (No Images) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-brand/10 rounded-full blur-[120px] animate-blob" />
        <div className="absolute bottom-[-15%] right-[-5%] w-[70%] h-[70%] bg-pink-100/40 rounded-full blur-[140px] animate-blob [animation-delay:4s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0)_0%,rgba(255,255,255,1)_100%)]" />
      </div>

      {/* Floating Emojis for Modern Cute Vibe */}
      <div className="absolute top-20 left-[15%] text-6xl animate-float opacity-40">🐰</div>
      <div className="absolute top-[40%] right-[10%] text-7xl animate-float-delayed opacity-30">✨</div>
      <div className="absolute bottom-20 left-[10%] text-5xl animate-float opacity-20">💝</div>
      <div className="absolute bottom-[30%] right-[20%] text-6xl animate-float-delayed opacity-25">🌸</div>
      
      {/* Additional Floating Gifts */}
      <div className="absolute top-[10%] right-[30%] text-5xl animate-float opacity-30 [animation-delay:1s]">🎁</div>
      <div className="absolute top-[60%] left-[20%] text-4xl animate-float-delayed opacity-20 [animation-delay:3s]">🧸</div>
      <div className="absolute bottom-[40%] left-[40%] text-5xl animate-float opacity-25 [animation-delay:2s]">🎀</div>
      <div className="absolute top-[50%] left-[5%] text-4xl animate-float-delayed opacity-15 [animation-delay:5s]">🍫</div>
      <div className="absolute bottom-[10%] right-[40%] text-5xl animate-float opacity-20 [animation-delay:4s]">🍭</div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-12 flex flex-col items-center text-center">
        
        {/* Modern Badge */}
        <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/60 backdrop-blur-md border border-brand/10 shadow-sm mb-12 animate-in fade-in slide-in-from-bottom-4">
          <span className="flex h-2.5 w-2.5 rounded-full bg-brand animate-ping" />
          <span className="text-[12px] font-bold uppercase tracking-[0.3em] text-brand/70">The Art of Gifting</span>
        </div>

        {/* Bubbly Hero Typography (Based on Reference) */}
        <div className="space-y-6 md:space-y-10 mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          <h1 className="text-7xl md:text-[10rem] font-black leading-[0.85] tracking-tight">
            <span className="text-white text-bubbly">Cutes</span> <br />
            <span className="bg-gradient-to-r from-brand via-pink-400 to-brand bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-xy">
              The Boutique
            </span>
          </h1>
          
          <p className="text-xl md:text-3xl text-slate-700 max-w-2xl mx-auto leading-relaxed font-bold tracking-tight px-4 opacity-90">
            Efficiency meets elegance. Your ultimate management companion for a <span className="text-brand">charming gift shop</span> experience.
          </p>
        </div>

        {/* Action Buttons with Modern Glow */}
        <div className="flex flex-col sm:flex-row items-center gap-6 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-200">
          <Link
            className="w-full sm:w-auto group relative inline-flex items-center justify-center px-12 py-5 font-black text-white transition-all duration-500 bg-brand rounded-[2rem] hover:scale-[1.05] active:scale-95 shadow-[0_20px_40px_-12px_rgba(165,57,115,0.4)] overflow-hidden"
            to="/store"
          >
            <span className="relative z-10 text-xl">Explore Store</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </Link>

          <Link
            className="w-full sm:w-auto group relative inline-flex items-center justify-center px-12 py-5 font-black text-brand transition-all duration-500 bg-white/80 backdrop-blur-md border-2 border-brand/20 rounded-[2rem] hover:bg-white hover:border-brand/40 hover:scale-[1.05] active:scale-95 shadow-xl overflow-hidden"
            to="/login"
          >
            <span className="relative z-10 text-xl">Management</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </Link>
        </div>

        {/* Modern Stats Bar (Image-less Visual) */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-4xl border-t border-brand/5 pt-12 animate-in fade-in duration-1000 delay-500">
          <div className="flex flex-col items-center">
            <span className="text-4xl font-black text-brand/80 leading-none">100%</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-2">Cute Factor</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl font-black text-brand/80 leading-none">24/7</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-2">Access</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl font-black text-brand/80 leading-none">Free</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-2">Updates</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl font-black text-brand/80 leading-none">Safe</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-2">Reliable</span>
          </div>
        </div>

      </div>

      {/* Decorative Bottom Wave (CSS only) */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-brand/20 via-pink-400/20 to-brand/20" />
    </div>
  );
}

export default HomePage;
