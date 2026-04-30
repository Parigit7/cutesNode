import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="relative h-[calc(100vh-180px)] min-h-[600px] flex items-center justify-center bg-white overflow-hidden rounded-[3rem] border border-brand/5 shadow-[0_0_100px_rgba(165,57,115,0.03)]">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-brand/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[30rem] h-[30rem] bg-brand/10 rounded-full blur-[100px]" />

      {/* Floating Sparkles/Hearts */}
      <div className="absolute top-20 left-[20%] animate-bounce-slow opacity-20 text-brand text-2xl">✨</div>
      <div className="absolute bottom-40 left-[10%] animate-pulse opacity-10 text-brand text-4xl">❤️</div>
      <div className="absolute top-40 right-[30%] animate-bounce opacity-20 text-brand text-3xl">✨</div>
      <div className="absolute bottom-20 right-[40%] animate-pulse opacity-15 text-brand text-2xl">💖</div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Content Section */}
          <div className="order-2 lg:order-1 text-center lg:text-left space-y-10">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand/5 border border-brand/10">
              <span className="w-2 h-2 rounded-full bg-brand shadow-[0_0_8px_rgba(165,57,115,0.5)]" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand">The Heart of Gifting</span>
            </div>

            <h1 className="text-5xl lg:text-8xl font-black text-slate-900 leading-[0.95] tracking-tight">
              Create your <br />
              <span className="text-brand relative inline-block">
                cute world
                <svg className="absolute -top-4 -right-8 w-10 h-10 text-yellow-400 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
                </svg>
              </span> <br />
              with <span className="italic font-serif text-brand/80">cutes.lk</span>
            </h1>
            
            <p className="text-xl text-slate-500 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
              The ultimate management companion for your charming gift boutique.
              Efficiency meets elegance in every detail.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5 pt-4">
              <Link
                className="group relative inline-flex items-center justify-center px-10 py-4 font-bold text-white transition-all duration-500 bg-brand rounded-2xl hover:bg-brand/90 hover:scale-[1.03] active:scale-95 shadow-[0_20px_40px_-10px_rgba(165,57,115,0.3)] overflow-hidden"
                to="/login"
              >
                <span className="relative z-10">Enter Management</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </Link>

              <div className="flex flex-col items-start px-6 py-3.5 rounded-2xl bg-white border border-slate-100 shadow-sm transition-transform hover:translate-y-[-2px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">System Live</span>
                </div>
                <p className="text-sm font-bold text-slate-800">Operational & Secure</p>
              </div>
            </div>
          </div>

          {/* Visual Section */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative z-10 rounded-[4rem] overflow-hidden border-[12px] border-white shadow-2xl rotate-2 transition-transform hover:rotate-0 duration-700">
              <img
                src="/cute_gift_hero.png"
                alt="Cute Gift Shop"
                className="w-full aspect-[4/5] object-cover"
              />
              <div className="absolute inset-0 bg-brand/5 mix-blend-multiply" />
            </div>

            {/* Floating Elements */}
            <div className="absolute top-12 -left-8 z-20 bg-white p-5 rounded-2xl shadow-xl border border-slate-50 flex items-center gap-4 animate-bounce-slow">
               <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-brand text-xl">🎁</div>
               <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Live Sync</p>
                  <p className="text-sm font-black text-slate-900 tracking-tight">Orders Active</p>
               </div>
            </div>

            <div className="absolute -bottom-6 -right-4 z-20 bg-white p-5 rounded-2xl shadow-xl border border-slate-50 flex items-center gap-4 animate-bounce-slow-delayed">
               <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 text-xl">🚚</div>
               <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Delivery</p>
                  <p className="text-sm font-black text-slate-900 tracking-tight">Real-time Tracking</p>
               </div>
            </div>

            {/* Background Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-brand/10 rounded-full blur-[80px] -z-10" />
          </div>

        </div>
      </div>
    </div>
  );
}

export default HomePage;
