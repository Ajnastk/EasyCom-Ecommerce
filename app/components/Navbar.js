
"use client"
import { useState, useEffect, useCallback } from "react";
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [click, setClick] = useState(false);
  const [visible, setVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [activeLink, setActiveLink] = useState("home");
  
  const navLinks = ["Home", "About", "Services", "Projects", "Fact", "Contact"];
  
  const handleClick = () => setClick(!click);

  // Throttle scroll handler using useCallback
  const handleScroll = useCallback(() => {
    const currentScrollPos = window.scrollY;
    const isVisible = prevScrollPos > currentScrollPos || currentScrollPos < 10;
    
    if (isVisible !== visible) {
      setVisible(isVisible);
    }
    setPrevScrollPos(currentScrollPos);
  }, [prevScrollPos, visible]);

  useEffect(() => {
    const throttledScroll = throttle(handleScroll, 100);
    window.addEventListener('scroll', throttledScroll);
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [handleScroll]);

  // Intersection Observer for active section detection
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const section = entry.target.id;
          const isTop = window.scrollY < 100;
          setActiveLink(isTop ? 'home' : section);
        }
      });
    }, observerOptions);

    // Observe all valid sections
    navLinks.forEach(link => {
      const section = document.getElementById(link.toLowerCase());
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const handleLinkClick = useCallback((linkName) => {
    const formattedLink = linkName.toLowerCase();
    setActiveLink(formattedLink);
    setClick(false);
    window.history.replaceState(null, '', `#${formattedLink}`);
  }, []);

  const scrollToSection = useCallback((id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="w-full px-4 pt-3 fixed top-0 left-0 z-[999]">
      <nav className={`text-white p-4 bg-gray-900/80 backdrop-blur-md rounded-xl max-w-7xl mx-auto shadow-md transition-transform duration-300 ${visible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="container mx-auto flex justify-between items-center px-6">
          <div className="text-3xl font-bold">SDEC</div>

          <button 
            className="sm:hidden"
            onClick={handleClick}
            aria-label="Toggle Menu"
            aria-expanded={click}
            aria-controls="mobile-menu"
          >
            {click ? <X size={30} /> : <Menu size={30} />}
          </button>

          <ul className="hidden sm:flex space-x-6 text-lg">
            {navLinks.map((item) => {
              const linkId = item.toLowerCase();
              return (
                <li key={item}>
                  <a 
                    href={`#${linkId}`} 
                    onClick={(e) => { 
                      e.preventDefault();
                      scrollToSection(linkId);
                      handleLinkClick(linkId);
                    }}
                    className={`transition-colors duration-300 hover:text-blue-400 ${activeLink === linkId ? 'text-blue-400 font-medium' : ''}`}
                    aria-current={activeLink === linkId ? 'page' : undefined}
                  >
                    {item}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        {click && (
          <ul 
            id="mobile-menu"
            className="sm:hidden flex flex-col items-center bg-gray-900/80 backdrop-blur-md text-lg py-4 space-y-3 mt-2 rounded-lg"
          >
            {navLinks.map((item) => {
              const linkId = item.toLowerCase();
              return (
                <li key={item}>
                  <a 
                    href={`#${linkId}`} 
                    onClick={(e) => { 
                      e.preventDefault();
                      scrollToSection(linkId);
                      handleLinkClick(linkId);
                    }}
                    className={`block py-2 px-4 transition-colors duration-300 hover:text-blue-400 ${activeLink === linkId ? 'text-blue-400 font-medium' : ''}`}
                    aria-current={activeLink === linkId ? 'page' : undefined}
                  >
                    {item}
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </nav>
    </div>
  );
}

// Utility function for throttling
function throttle(func, limit) {
  let lastFunc;
  let lastRan;
  return function(...args) {
    if (!lastRan) {
      func.apply(this, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(this, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}