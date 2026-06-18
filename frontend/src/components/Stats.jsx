import React, { useEffect, useState, useRef } from 'react';
import { FaBoxes, FaUserCheck, FaAward, FaMapMarkedAlt } from 'react-icons/fa';

function AnimatedCounter({ target, duration = 1500, suffix = "" }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) observer.unobserve(elementRef.current);
    };
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    let start = 0;
    const end = parseInt(target, 10);
    if (isNaN(end)) return;
    
    const startTime = performance.now();

    const animateCount = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      // Ease out quad formula
      const easeProgress = progress * (2 - progress);
      const currentVal = Math.floor(easeProgress * end);
      
      if (progress < 1) {
        setCount(currentVal);
        requestAnimationFrame(animateCount);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animateCount);
  }, [hasStarted, target, duration]);

  return (
    <span ref={elementRef} className="font-heading font-black text-4xl md:text-5xl text-white">
      {count}{suffix}
    </span>
  );
}

export default function Stats() {
  const statsList = [
    {
      icon: <FaBoxes className="text-brand-red text-3xl" />,
      target: "12840",
      suffix: "+",
      label: "Machines Installed",
      desc: "Trusted footprint across India"
    },
    {
      icon: <FaUserCheck className="text-brand-blue text-3xl" />,
      target: "300",
      suffix: "+",
      label: "Global Shipments",
      desc: "Machinery installed worldwide"
    },
    {
      icon: <FaAward className="text-brand-red text-3xl" />,
      target: "15",
      suffix: "+ Years",
      label: "Industry Trust",
      desc: "Precision engineering expertise"
    },
    {
      icon: <FaMapMarkedAlt className="text-brand-blue text-3xl" />,
      target: "54",
      suffix: "+ Products",
      label: "Online Catalog",
      desc: "Electric motors & workshop tools"
    }
  ];

  return (
    <section className="relative py-16 bg-brand-navy overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(47,52,126,0.15),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {statsList.map((stat, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center text-center p-6 bg-slate-900/40 rounded-2xl border border-slate-800/80 hover:border-slate-700/80 transition-all duration-300 group"
            >
              {/* Icon Container */}
              <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-4 border border-slate-800 group-hover:scale-105 transition-transform duration-300">
                {stat.icon}
              </div>
              
              {/* Animated Stat Value */}
              <div className="mt-2 tracking-tight">
                <AnimatedCounter target={stat.target} suffix={stat.suffix} />
              </div>
              
              {/* Labels */}
              <h3 className="font-heading font-bold text-base text-slate-200 mt-3">
                {stat.label}
              </h3>
              <p className="text-slate-400 text-xs mt-1 font-medium">
                {stat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
