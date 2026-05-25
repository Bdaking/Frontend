import React from "react";
import CARD_2 from "../../assets/images/card2.png";
import { LuTrendingUpDown, LuShieldCheck } from "react-icons/lu";

const AuthLayout = ({ children }) => {
  return (
    // Background: Updated to the Clean Glassmorphism gradient
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-r from-[#e0c3fc] to-[#8ec5fc] font-sans antialiased">
      {/* Left side: Form content inside a Glass Frame */}
      <div className="w-full md:w-[50vw] flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-[450px]">
          {/* THE FRAME: Updated with bg-white/80, backdrop-blur, and subtle border */}
          <div className="bg-white/80 backdrop-blur-lg p-10 md:p-14 shadow-2xl flex flex-col min-h-[650px] rounded-none border border-white/20">
            {/* Branding section removed as requested. 
                The form content (children) starts here. 
            */}
            <div className="flex-1 flex flex-col pt-4">{children}</div>
          </div>
        </div>
      </div>

      {/* Right side: Mockup Section with sharp elements */}
      <div className="hidden md:flex md:w-[50vw] relative items-center justify-center p-12">
        <div className="relative w-full max-w-lg">
          {/* Floating Stat Card */}
          <div className="absolute -top-10 -left-10 z-20 animate-bounce-slow">
            <div className="flex items-center gap-5 bg-white p-6 shadow-2xl border border-slate-50 min-w-[240px] rounded-none">
              <div className="w-14 h-14 flex items-center justify-center text-2xl bg-purple-50 rounded-none">
                <LuTrendingUpDown className="text-purple-600" />
              </div>
              <div>
                <h6 className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">
                  MONTHLY SAVINGS
                </h6>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-800">
                    ₹4,30,000
                  </span>
                  <span className="text-[11px] font-bold text-green-500 bg-green-50 px-2 py-0.5">
                    +12.5%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Image with Glass Frame */}
          <div className="relative z-10 bg-white/20 backdrop-blur-xl p-4 border border-white/30 shadow-2xl rounded-none">
            <img
              src={CARD_2}
              alt="Dashboard Preview"
              className="w-full h-auto rounded-none"
            />
          </div>

          {/* Security Badge */}
          <div className="absolute -bottom-10 -right-4 z-20 bg-white p-5 shadow-2xl flex items-center gap-4 border border-slate-50 rounded-none">
            <div className="w-12 h-12 bg-green-50 rounded-none flex items-center justify-center text-green-500">
              <LuShieldCheck size={24} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-extrabold">
                Security
              </p>
              <p className="text-sm font-bold text-slate-700">
                Bank-level Encryption
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
