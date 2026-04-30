import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="relative min-h-[calc(100vh-120px)] flex items-center justify-center bg-white overflow-hidden rounded-[2rem] md:rounded-[3rem] border border-brand/5 shadow-[0_0_100px_rgba(165,57,115,0.03)]">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-5%] w-64 md:w-96 h-64 md:h-96 bg-brand/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-5%] w-80 md:w-[30rem] h-80 md:h-[30rem] bg-brand/10 rounded-full blur-[100px]" />

      {/* Floating Sparkles/Hearts */}
      <div className="hidden sm:block absolute top-10 left-[20%] animate-bounce-slow opacity-20 text-brand text-2xl">✨</div>
      <div className="hidden sm:block absolute bottom-20 left-[10%] animate-pulse opacity-10 text-brand text-4xl">❤️</div>
      <div className="hidden sm:block absolute top-20 right-[30%] animate-bounce opacity-20 text-brand text-3xl">✨</div>
      <div className="hidden sm:block absolute bottom-10 right-[40%] animate-pulse opacity-15 text-brand text-2xl">💖</div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 md:px-10 py-10 md:py-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">

          {/* Content Section */}
          <div className="order-2 lg:order-1 text-center lg:text-left space-y-6 md:space-y-10">
            <div className="inline-flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-full bg-brand/5 border border-brand/10 mx-auto lg:mx-0">
              <span className="w-1.5 md:w-2 h-1.5 md:h-2 rounded-full bg-brand shadow-[0_0_8px_rgba(165,57,115,0.5)]" />
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-brand">The Heart of Gifting</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black text-slate-900 leading-[1.1] lg:leading-[0.95] tracking-tight">
              Create your <br />
              <span className="text-brand relative inline-block">
                cute world
                <svg className="absolute -top-2 md:-top-4 -right-4 md:-right-8 w-6 md:w-10 h-6 md:h-10 text-yellow-400 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
                </svg>
              </span> <br />
              with <span className="italic font-serif text-brand/80">cutes.lk</span>
            </h1>

            <p className="text-base md:text-xl text-slate-500 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
              The ultimate management companion for your charming gift boutique.
              Efficiency meets elegance in every detail.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 md:gap-5 pt-2">
              <Link
                className="w-full sm:w-auto group relative inline-flex items-center justify-center px-8 md:px-10 py-3.5 md:py-4 font-bold text-white transition-all duration-500 bg-brand rounded-xl md:rounded-2xl hover:bg-brand/90 hover:scale-[1.03] active:scale-95 shadow-[0_20px_40px_-10px_rgba(165,57,115,0.3)] overflow-hidden"
                to="/login"
              >
                <span className="relative z-10 text-sm md:text-base">Enter Management</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </Link>

              <div className="w-full sm:w-auto flex flex-col items-center sm:items-start px-6 py-3 rounded-xl md:rounded-2xl bg-white border border-slate-100 shadow-sm transition-transform hover:translate-y-[-2px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">System Live</span>
                </div>
                <p className="text-xs md:text-sm font-bold text-slate-800">Operational & Secure</p>
              </div>
            </div>
          </div>

          {/* Visual Section */}
          <div className="order-1 lg:order-2 relative px-4 sm:px-10 lg:px-0 max-w-md lg:max-w-none mx-auto lg:mx-0">
            <div className="relative z-10 rounded-[2.5rem] md:rounded-[4rem] overflow-hidden border-[8px] md:border-[12px] border-white shadow-2xl lg:rotate-2 transition-transform hover:rotate-0 duration-700">
              <img
                src="/home.png"
                alt="Pink Gift Packs"
                className="w-full aspect-[4/5] object-cover"
              />
              <div className="absolute inset-0 bg-brand/5 mix-blend-multiply" />
            </div>

            {/* Floating Elements - Adjusted for responsiveness */}
            <div className="absolute top-6 md:top-12 -left-2 md:-left-8 z-20 bg-white p-3 md:p-5 rounded-xl md:rounded-2xl shadow-xl border border-slate-50 flex items-center gap-2 md:gap-4 animate-bounce-slow">
              <div className="w-8 md:w-10 h-8 md:h-10 rounded-full bg-pink-50 flex items-center justify-center text-brand text-lg md:text-xl">🎁</div>
              <div>
                <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Live Sync</p>
                <p className="text-xs md:text-sm font-black text-slate-900 tracking-tight">Orders Active</p>
              </div>
            </div>

            <div className="absolute -bottom-4 md:-bottom-6 -right-2 md:-right-4 z-20 bg-white p-3 md:p-5 rounded-xl md:rounded-2xl shadow-xl border border-slate-50 flex items-center gap-2 md:gap-4 animate-bounce-slow-delayed">
              <div className="w-8 md:w-10 h-8 md:h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 text-lg md:text-xl">🚚</div>
              <div>
                <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Delivery</p>
                <p className="text-xs md:text-sm font-black text-slate-900 tracking-tight">Real-time Tracking</p>
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
