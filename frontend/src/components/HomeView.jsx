import React, { useState, useEffect } from 'react';
import Hero from './Hero';
import Stats from './Stats';
import { FaArrowRight, FaAward, FaTruck, FaClock, FaPlay, FaYoutube } from 'react-icons/fa';
import api from '../utils/api';

export default function HomeView({ onInquiryClick, setCurrentView }) {
  const [playingVideoId, setPlayingVideoId] = useState(null);

  // Fallback defaults
  const fallbackDemos = [
    {
      id: "p1nNliaVkqY",
      title: "Milcent Atta Chakki With Vacuum Full Demo",
      description: "A detailed unboxing and step-by-step operation guide for the Milcent automatic domestic flour mill featuring the auto-vacuum cleaning module.",
      duration: "8:14"
    },
    {
      id: "kbjYIMkMOKw",
      title: "Milcent Domestic Flour Mill Demo & Features",
      description: "Detailed showcase of Milcent's domestic flour mill operations, highlighting the auto-cleaning mechanism, motor power, and steel grinding chamber.",
      duration: "3:52"
    }
  ];

  const fallbackShorts = [
    {
      id: "HvKeZG_hPWc",
      title: "Milcent TVC",
      description: "Short clip showing the automatic grain feeding mechanism.",
      duration: "0:30"
    },
    {
      id: "yrqTeHpTW-4",
      title: "Milcent Atta Chakki Operations",
      description: "Short showcase of Milcent domestic flour mill operations and grinding quality.",
      duration: "0:45"
    },
    {
      id: "054CtPvbM80",
      title: "Milcent Smart Atta Chakki Reel",
      description: "Quick product review showcasing smart options and design patterns.",
      duration: "0:50"
    },
    {
      id: "481687410304599",
      title: "Milcent Atta Chakki Grinding Guide",
      description: "Facebook video guide showing how easy it is to grind flour at home.",
      duration: "1:15",
      platform: "facebook"
    }
  ];

  const [demoVideos, setDemoVideos] = useState(fallbackDemos);
  const [shortVideos, setShortVideos] = useState(fallbackShorts);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await api.get('/videos');
        if (res.data.success && res.data.videos.length > 0) {
          const dbDemos = res.data.videos.filter(v => v.type === 'demo');
          const dbShorts = res.data.videos.filter(v => v.type === 'short');
          setDemoVideos(dbDemos.length > 0 ? dbDemos : fallbackDemos);
          setShortVideos(dbShorts.length > 0 ? dbShorts : fallbackShorts);
        }
      } catch (error) {
        console.error('Failed to load videos:', error.message);
      }
    };
    fetchVideos();
  }, []);

  const allVideos = [...demoVideos, ...shortVideos];
  const activeVideo = allVideos.find(v => v.id === playingVideoId);

  const handlePlayVideo = (videoId) => {
    setPlayingVideoId(videoId);
    const playerElement = document.getElementById('main-video-player');
    if (playerElement) {
      playerElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const featuredProducts = [
    {
      title: "Milcent Flour Mills",
      image: "https://cdn.dotpe.in/longtail/item_category/7917771/0kT9LTBL.webp",
      description: "Premium jumbo domestic automatic flour mills featuring voice guidance announcement systems, auto-clean, and high-tensile sieves.",
      targetCategory: "Automatic Flour Mills"
    },
    {
      title: "Industrial Machinery & Motors",
      image: "https://cdn.dotpe.in/longtail/item_category/7917771/PriP4O8a.webp",
      description: "Heavy-duty electric induction motors (IE2/IE3) and power presses designed for high-performance fabrication workshops.",
      targetCategory: "Industrial Machinery"
    },
    {
      title: "Flour Mill Spare Parts",
      image: "https://cdn.dotpe.in/longtail/item_category/7917771/scOFSiku.webp",
      description: "Genuine replacement spare parts, cutter blades, filters, brass/steel sieves (jali) suitable for Milcent, Natraj, and local mills.",
      targetCategory: "Hardware Accessories"
    }
  ];

  const handleNavigate = (viewId, state) => {
    setCurrentView(viewId, state);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div>
      {/* 1. Hero Landing Banner */}
      <Hero onInquiryClick={onInquiryClick} setCurrentView={setCurrentView} />

      {/* 2. Welcome Intro Section */}
      <section className="bg-white py-16 px-4 md:px-8 text-center border-b border-slate-100">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-block bg-brand-blue/10 border border-brand-blue/20 text-brand-blue font-heading font-bold text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            Industrial Supply Partner
          </div>
          <h2 className="text-2xl md:text-4xl font-heading font-black text-brand-navy">
            Welcome to Jay Bhagwati Tools & Machinery
          </h2>
          <p className="text-slate-500 text-sm md:text-base leading-relaxed">
            Based in Bhakti Nagar, Rajkot, we are a prominent distributor and trading company of electric motors, home appliances, and precision workshop machinery. Sourcing directly from top manufacturers like ABB and Milcent, we have successfully installed more than 12,840 machines across India.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <button 
              onClick={() => handleNavigate('about')} 
              className="bg-slate-900 hover:bg-brand-red text-white text-xs font-heading font-bold px-6 py-3.5 rounded-xl uppercase tracking-wider transition-colors cursor-pointer"
            >
              Read Our Story
            </button>
            <button 
              onClick={() => handleNavigate('products')} 
              className="bg-brand-blue hover:bg-brand-blue/90 text-white text-xs font-heading font-bold px-6 py-3.5 rounded-xl uppercase tracking-wider transition-colors cursor-pointer"
            >
              Browse Products
            </button>
          </div>
        </div>
      </section>

      {/* 3. About Teaser Grid */}
      <section className="py-16 md:py-20 px-4 md:px-8 bg-brand-gray">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block bg-brand-red/10 border border-brand-red/20 text-brand-red font-heading font-bold text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider">
              About Us Preview
            </div>
            <h3 className="text-2xl md:text-3xl font-heading font-black text-brand-navy">
              Trading High-Test Workshop Machines & Motors
            </h3>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed">
              With over 15 years of industry experience, we specialize in supplying Mechanical Power Presses, Hydraulic Shearing Machines, Press Brakes, Crompton/ABB motors, and domestic flour mill spare parts. Our products are engineered to suit diverse industrial applications.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex gap-3 items-center">
                <FaAward className="text-brand-red text-xl flex-shrink-0" />
                <span className="text-xs font-bold text-slate-700">ISO certified products</span>
              </div>
              <div className="flex gap-3 items-center">
                <FaTruck className="text-brand-blue text-xl flex-shrink-0" />
                <span className="text-xs font-bold text-slate-700">Prompt Rajkot supply</span>
              </div>
            </div>
            <button 
              onClick={() => handleNavigate('about')}
              className="mt-6 text-brand-red hover:text-brand-blue font-heading font-bold text-sm tracking-wider uppercase inline-flex items-center gap-2 group cursor-pointer"
            >
              Learn More About Us <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          
          <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[1.5] border border-slate-100 bg-slate-200">
            <img src="/gallery1.png" alt="Jay Bhagwati Showroom" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* 4. Featured Products Teaser */}
      <section className="py-16 md:py-20 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
            <div className="inline-block bg-brand-blue/10 border border-brand-blue/20 text-brand-blue font-heading font-bold text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider">
              Product Spotlight
            </div>
            <h3 className="text-2xl md:text-3xl font-heading font-black text-brand-navy">
              Featured Categories
            </h3>
            <p className="text-slate-500 text-xs md:text-sm">
              Take a look at some of our most popular tooling categories sourced for high-performance fabrication.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {featuredProducts.map((prod, idx) => (
              <div key={idx} className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all duration-300 flex flex-col h-full">
                <div className="aspect-[1.5] overflow-hidden bg-slate-900">
                  <img src={prod.image} alt={prod.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-heading font-black text-lg text-brand-navy">{prod.title}</h4>
                    <p className="text-slate-500 text-xs leading-relaxed">{prod.description}</p>
                  </div>
                  <button 
                    onClick={() => handleNavigate('products', { category: prod.targetCategory })}
                    className="text-brand-blue hover:text-brand-red text-xs font-heading font-bold uppercase tracking-wider inline-flex items-center gap-1.5 pt-2 cursor-pointer"
                  >
                    View Details <FaArrowRight className="text-[10px]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button 
              onClick={() => handleNavigate('products')}
              className="bg-brand-red hover:bg-brand-blue text-white text-xs font-heading font-bold px-8 py-4 rounded-xl shadow-lg transition-colors duration-300 uppercase tracking-wider cursor-pointer"
            >
              View Full Catalogue
            </button>
          </div>
        </div>
      </section>

      {/* 5. Video Demonstration Section */}
      <section id="main-video-player" className="py-16 md:py-20 px-4 md:px-8 bg-brand-gray border-t border-b border-slate-200/50 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
            <div className="inline-block bg-brand-red/10 border border-brand-red/20 text-brand-red font-heading font-bold text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider animate-pulse">
              Video Showcase
            </div>
            <h3 className="text-2xl md:text-3xl font-heading font-black text-brand-navy">
              Product Demonstrations & Reels
            </h3>
            <p className="text-slate-500 text-xs md:text-sm">
              Watch our domestic flour mills and machinery in action. Explore full unboxings and quick social media reels.
            </p>
          </div>

          {/* Main row: Player + Playlist */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Left: Active Player Card */}
            <div className="lg:col-span-2 space-y-4">
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-xl border border-slate-200/80 bg-slate-950 group">
                {activeVideo ? (
                  activeVideo.platform === 'facebook' ? (
                    <iframe
                      className="w-full h-full animate-fade-in"
                      src={`https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2FMilcentAppliances%2Fvideos%2F${activeVideo.id}%2F&show_text=0&autoplay=1&mute=0`}
                      title={activeVideo.title}
                      frameBorder="0"
                      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <iframe
                      className="w-full h-full animate-fade-in"
                      src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1&rel=0`}
                      title={activeVideo.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  )
                ) : (
                  <>
                    <img
                      src={`https://img.youtube.com/vi/${demoVideos[0].id}/hqdefault.jpg`}
                      alt={demoVideos[0].title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/20 group-hover:via-slate-950/35 transition-all duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        onClick={() => setPlayingVideoId(demoVideos[0].id)}
                        className="w-16 h-16 md:w-20 md:h-20 bg-brand-red hover:bg-brand-blue text-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 cursor-pointer group-hover:shadow-brand-red/20"
                      >
                        <FaPlay className="text-xl md:text-2xl ml-1 text-white animate-pulse" />
                      </button>
                    </div>
                    <div className="absolute bottom-0 inset-x-0 p-6 text-white pointer-events-none">
                      <span className="inline-flex items-center gap-1.5 bg-brand-red text-white text-[10px] font-bold px-2.5 py-1 rounded-md mb-2 uppercase tracking-wide">
                        <FaYoutube className="text-xs" /> Featured Demo
                      </span>
                      <h4 className="font-heading font-black text-lg md:text-xl line-clamp-1">{demoVideos[0].title}</h4>
                      <p className="text-slate-300 text-xs mt-1 max-w-2xl line-clamp-2">{demoVideos[0].description}</p>
                    </div>
                  </>
                )}
                {/* Overlay header if playing */}
                {activeVideo && (
                  <div className="absolute top-4 left-4 z-10 bg-slate-900/90 backdrop-blur-sm px-3.5 py-1.5 rounded-lg border border-slate-800 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-red animate-ping" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">Now Playing: {activeVideo.title}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Interactive Playlist of the 2 main Demo Videos */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 flex flex-col justify-between shadow-sm animate-fade-in">
              <div>
                <h4 className="font-heading font-black text-brand-navy text-xs uppercase tracking-wider border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
                  <span>Featured Demos</span>
                  <span className="text-slate-400 font-semibold text-[10px] bg-slate-100 px-2 py-0.5 rounded-full">{demoVideos.length} Videos</span>
                </h4>
                <div className="space-y-4">
                  {demoVideos.map((video) => {
                    const isCurrent = playingVideoId === video.id;
                    return (
                      <div
                        key={video.id}
                        onClick={() => handlePlayVideo(video.id)}
                        className={`flex gap-3 p-3 rounded-xl border transition-all duration-300 cursor-pointer group ${
                          isCurrent
                            ? 'bg-brand-blue/5 border-brand-blue/40 shadow-sm'
                            : 'bg-slate-50 border-slate-100 hover:border-slate-350 hover:bg-slate-100/50 hover:shadow-xs'
                        }`}
                      >
                        {/* Mini Thumbnail */}
                        <div className="relative w-24 aspect-[16/9] rounded-lg overflow-hidden flex-shrink-0 bg-slate-950">
                          <img
                            src={video.platform === 'facebook' ? '/slide3.jpg' : `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                            <div className="w-7 h-7 bg-brand-red text-white rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
                              <FaPlay className="text-[9px] ml-0.5" />
                            </div>
                          </div>
                        </div>
                        {/* Text Info */}
                        <div className="flex flex-col justify-between min-w-0 flex-grow">
                          <h5 className={`font-heading font-bold text-xs line-clamp-2 leading-tight transition-colors duration-200 ${
                            isCurrent ? 'text-brand-blue font-black' : 'text-brand-navy group-hover:text-brand-red'
                          }`}>
                            {video.title}
                          </h5>
                          <span className="text-[9px] font-bold text-slate-400 self-start bg-white border border-slate-200/60 px-1.5 py-0.5 rounded-md mt-1">
                            {video.duration}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Info Box */}
              <div className="mt-4 pt-4 border-t border-slate-100 text-[11px] text-slate-500 leading-relaxed bg-brand-gray/30 p-3 rounded-xl border border-slate-105">
                <span className="font-bold text-brand-navy block mb-0.5">Need Live Demonstration?</span>
                Visit our showroom in Bhakti Nagar, Rajkot to experience live product operations with various food grains.
              </div>
            </div>
          </div>

          {/* Bottom row: Grid of 4 Short Videos / Quick Guides */}
          <div>
            <h4 className="font-heading font-black text-brand-navy text-sm uppercase tracking-wider mb-6 flex items-center gap-3">
              <span>Featured Shorts & Reels</span>
              <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-ping" />
              <span className="text-slate-400 font-semibold text-xs lowercase">({shortVideos.length} reels)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {shortVideos.map((video) => {
                const isCurrent = playingVideoId === video.id;
                return (
                  <div
                    key={video.id}
                    onClick={() => handlePlayVideo(video.id)}
                    className={`bg-white rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer group flex flex-col justify-between h-full ${
                      isCurrent
                        ? 'border-brand-blue shadow-md bg-brand-blue/5'
                        : 'border-slate-200 hover:border-slate-350 hover:shadow-md'
                    }`}
                  >
                    <div>
                      {/* Thumbnail Container */}
                      <div className="relative aspect-[16/9] bg-slate-950 overflow-hidden">
                        <img
                          src={video.platform === 'facebook' ? '/slide3.jpg' : `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                          alt={video.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-slate-950/30 group-hover:bg-slate-950/20 transition-all duration-300" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-10 h-10 bg-brand-red/90 group-hover:bg-brand-red text-white rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
                            <FaPlay className="text-[11px] ml-0.5" />
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold text-white tracking-wider">
                          {video.duration}
                        </div>
                      </div>
                      {/* Body */}
                      <div className="p-4 space-y-2">
                        <h5 className={`font-heading font-bold text-xs line-clamp-2 leading-snug transition-colors duration-200 ${
                          isCurrent ? 'text-brand-blue font-black' : 'text-brand-navy group-hover:text-brand-red'
                        }`}>
                          {video.title}
                        </h5>
                        <p className="text-slate-500 text-[10px] leading-relaxed line-clamp-2">
                          {video.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Statistics Counters */}
      <Stats />

      {/* 6. Quote CTA Banner */}
      <section className="bg-brand-navy py-20 px-4 md:px-8 text-center relative overflow-hidden">
        {/* Background Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(243,59,74,0.1),transparent_70%)] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <h3 className="text-2xl md:text-4xl font-heading font-black text-white leading-tight">
            Ready to Upgrade Your Industrial Operations?
          </h3>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Contact our sales support team in Rajkot to arrange technical advisory assistance, quick local supply, or custom wholesale bulk quotations.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <button 
              onClick={() => handleNavigate('contact')}
              className="bg-gradient-to-r from-brand-red to-red-600 text-white font-heading font-bold text-sm px-8 py-4 rounded-xl shadow-lg uppercase tracking-wide cursor-pointer"
            >
              Contact Our Office
            </button>
            <button 
              onClick={() => onInquiryClick("Bulk Sourcing Inquiry")}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-heading font-bold text-sm px-8 py-4 rounded-xl transition-all uppercase tracking-wide cursor-pointer"
            >
              Get Custom Quote
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
