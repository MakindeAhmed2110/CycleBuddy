'use client';

export default function SimpleLandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-pink-200 rounded-full opacity-30 blur-xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-pink-300 rounded-full opacity-20 blur-lg"></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-pink-100 rounded-full opacity-25 blur-2xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-2xl font-bold text-pink-600">CycleBuddy</span>
          </div>

          {/* Connect Wallet Button */}
          <button className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full font-medium transition-colors flex items-center space-x-2">
            <span>🔗</span>
            <span>Connect Wallet</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column - Text Content */}
            <div className="space-y-8">
              {/* Social Proof */}
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-pink-400 text-xl">⭐</span>
                  ))}
                </div>
                <span className="text-gray-600 text-sm">Over 50,000+ users earning crypto daily¹</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                CycleBuddy, the app that helps teens & women manage their periods while earning crypto for doing so{' '}
                <span className="text-pink-500">💫</span>
              </h1>

              {/* Description */}
              <p className="text-xl text-gray-600 leading-relaxed">
                Join thousands around the world using CycleBuddy to track their periods, ovulation, and pregnancy, 
                and earn B3TR crypto for their health journey. Your health data is valuable - get rewarded for it!
              </p>

              {/* App Store Badges */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-black text-white px-6 py-3 rounded-xl flex items-center space-x-3 hover:bg-gray-800 transition-colors">
                  <span className="text-2xl">🍎</span>
                  <div className="text-left">
                    <div className="text-xs">Download on the</div>
                    <div className="text-lg font-semibold">App Store</div>
                  </div>
                </button>
                <button className="bg-black text-white px-6 py-3 rounded-xl flex items-center space-x-3 hover:bg-gray-800 transition-colors">
                  <span className="text-2xl">📱</span>
                  <div className="text-left">
                    <div className="text-xs">GET IT ON</div>
                    <div className="text-lg font-semibold">Google Play</div>
                  </div>
                </button>
              </div>

              {/* Handwritten Note */}
              <div className="relative">
                <div className="bg-pink-100 border-2 border-pink-300 rounded-2xl p-4 transform rotate-2 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <span className="text-pink-600 text-2xl">🏆</span>
                    <div>
                      <div className="font-bold text-pink-700">#1 Crypto-Rewarded Period Tracker</div>
                      <div className="text-pink-600 text-sm">Earn B3TR tokens for your health data</div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-pink-300 rounded-full"></div>
              </div>
            </div>

            {/* Right Column - Mobile App Mockups */}
            <div className="relative">
              {/* Main Phone Mockup */}
              <div className="relative mx-auto w-80 h-[600px] bg-white rounded-[3rem] shadow-2xl p-2">
                <div className="w-full h-full bg-gray-50 rounded-[2.5rem] overflow-hidden relative">
                  
                  {/* Phone Header */}
                  <div className="bg-pink-500 text-white p-4 rounded-t-[2.5rem]">
                    <div className="flex items-center justify-between">
                      <span className="font-bold">CycleBuddy</span>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* Main Calendar Screen */}
                  <div className="p-4 space-y-4">
                    <div className="text-center">
                      <h3 className="font-bold text-gray-800">December 17</h3>
                      <div className="bg-pink-100 rounded-full px-4 py-2 mt-2 inline-block">
                        <span className="text-pink-700 font-semibold">TODAY 17</span>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm border border-pink-100">
                      <div className="text-sm text-gray-600">Period in 5 days</div>
                      <div className="text-xs text-gray-500">Low chances of getting pregnant</div>
                      <button className="bg-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium mt-3 w-full">
                        Log period
                      </button>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-800">My daily insights • Today</h4>
                      
                      <div className="bg-white rounded-lg p-3 shadow-sm border border-pink-50">
                        <div className="flex items-center space-x-2">
                          <span className="text-pink-500">📊</span>
                          <span className="text-sm font-medium">Log your symptoms</span>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-3 shadow-sm border border-pink-50">
                        <div className="flex items-center space-x-2">
                          <span className="text-pink-500">🔮</span>
                          <span className="text-sm font-medium">Symptoms to expect</span>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-3 shadow-sm border border-pink-50">
                        <div className="flex items-center space-x-2">
                          <span className="text-pink-500">📅</span>
                          <span className="text-sm font-medium">Cycle day 25</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Crypto Rewards Section */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl p-3 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs opacity-90">B3TR Earned Today</div>
                          <div className="font-bold">2.5 B3TR</div>
                        </div>
                        <div className="text-2xl">💰</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="relative z-10 py-16 px-6 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Earn Crypto for Your Health Journey</h2>
            <p className="text-xl text-gray-600">Track your cycle and get rewarded with B3TR tokens</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📅</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Period Logging</h3>
              <p className="text-gray-600 text-sm">Log start/end dates and earn 1 B3TR</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">😊</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Symptom Tracking</h3>
              <p className="text-gray-600 text-sm">Track pain, mood, flow intensity for 1 B3TR</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💭</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Mood Check-ins</h3>
              <p className="text-gray-600 text-sm">Daily emotional well-being tracking for 1 B3TR</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💊</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Medication Reminders</h3>
              <p className="text-gray-600 text-sm">Track birth control, pain relief for 1 B3TR</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
