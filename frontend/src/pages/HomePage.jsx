import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="relative min-h-[calc(100vh-80px)] w-full flex items-center justify-center bg-[#fffafb] overflow-hidden">
      {/* Advanced Mesh Gradient Background Layer */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#a53973]/5 rounded-full blur-[140px] animate-pulse duration-[8000ms]" />
        <div className="absolute bottom-[-15%] right-[-5%] w-[70%] h-[70%] bg-pink-100/40 rounded-full blur-[140px] animate-pulse duration-[10000ms]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0)_0%,rgba(255,255,255,1)_100%)]" />
      </div>

      {/* Decorative Floating Symbols */}
      <div className="absolute top-20 left-[15%] opacity-20 text-brand text-3xl animate-bounce-slow">✨</div>
      <div className="absolute bottom-40 right-[10%] opacity-15 text-brand text-5xl animate-pulse">🌸</div>
      <div className="absolute top-1/3 right-[20%] opacity-10 text-brand text-4xl animate-bounce">💖</div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Content Modern Card Section */}
          <div className="flex flex-col space-y-10 md:space-y-12 text-center lg:text-left order-2 lg:order-1">
            <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/60 backdrop-blur-md border border-brand/10 shadow-sm mx-auto lg:mx-0 w-fit animate-in fade-in slide-in-from-bottom-4">
              <span className="flex h-2 w-2 rounded-full bg-brand animate-ping" />
              <span className="text-[11px] font-black uppercase tracking-[0.4em] text-brand/70">The Art of Gifting</span>
            </div>

            <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
              <h1 className="text-5xl md:text-8xl font-black text-slate-700 leading-[0.9] tracking-tighter">
                Create your <br />
                <span className="bg-gradient-to-r from-brand via-pink-500 to-brand bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                  cute world
                </span> <br />
                <span className="text-slate-400 font-serif italic text-4xl md:text-6xl tracking-tight">with cutes.lk</span>
              </h1>

              <p className="text-lg md:text-2xl text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-bold tracking-tight">
                The ultimate management companion for your charming gift boutique.
                <span className="text-brand/60"> Efficiency meets elegance in every detail.</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5 pt-4 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-200">
              <Link
                className="w-full sm:w-auto group relative inline-flex items-center justify-center px-10 py-5 font-black text-white transition-all duration-500 bg-brand rounded-2xl hover:scale-[1.05] active:scale-95 shadow-[0_25px_50px_-12px_rgba(165,57,115,0.4)] overflow-hidden"
                to="/store"
              >
                <span className="relative z-10 text-base md:text-lg">Explore Store</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </Link>

              <Link
                className="w-full sm:w-auto group relative inline-flex items-center justify-center px-10 py-5 font-black text-brand transition-all duration-500 bg-white/80 backdrop-blur-md border border-brand/20 rounded-2xl hover:bg-white hover:border-brand/40 hover:scale-[1.05] active:scale-95 shadow-[0_10px_30px_-10px_rgba(165,57,115,0.1)] overflow-hidden"
                to="/login"
              >
                <span className="relative z-10 text-base md:text-lg">Management</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </Link>
            </div>
          </div>

          {/* Visual Showcase Section - Hidden on Mobile */}
          <div className="relative order-1 lg:order-2 group animate-in fade-in zoom-in duration-1000 hidden lg:block">
            {/* Glass Frame for Image */}
            <div className="relative z-10 rounded-[3rem] md:rounded-[5rem] overflow-hidden border-[12px] md:border-[16px] border-white shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] lg:rotate-3 group-hover:rotate-0 transition-transform duration-1000 ease-out">
              <img
                src="/home.png"
                alt="Pink Gift Packs"
                className="w-full aspect-[4/5] object-cover scale-105 group-hover:scale-100 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand/10 to-transparent opacity-60 pointer-events-none" />
            </div>

            {/* Floating Status Cards with Glassmorphism */}
            <div className="absolute top-10 -left-10 md:-left-16 z-20 bg-white/80 backdrop-blur-xl p-5 md:p-6 rounded-3xl shadow-2xl border border-white flex items-center gap-4 animate-bounce-slow">
              <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center text-brand text-2xl shadow-inner">💝</div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Curated</p>
                <p className="text-sm md:text-base font-black text-slate-700 tracking-tight">Gift Packages</p>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-4 md:-right-8 z-20 bg-white/80 backdrop-blur-xl p-5 md:p-6 rounded-3xl shadow-2xl border border-white flex items-center gap-4 animate-bounce-slow-delayed">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 text-2xl shadow-inner">✨</div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Premium</p>
                <p className="text-sm md:text-base font-black text-slate-700 tracking-tight">Quality Shop</p>
              </div>
            </div>

            {/* Background Glow Blobs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] bg-brand/10 rounded-full blur-[100px] -z-10 animate-pulse" />
          </div>

        </div>
      </div>
    </div>
  );
}

export default HomePage;
