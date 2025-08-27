'use client';
import React, { useState } from 'react';
import { Facebook, Instagram, Twitter, Linkedin, ChevronDown, ChevronUp } from 'lucide-react';

export default function GradientWaveFooter() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const sections = [
    { 
      title: 'Shop', 
      items: [
        { name: 'All Products', url: '/products' },
        { name: 'Women\'s Ethnic', url: '/products?category=Women%27s%20Ethnic' },
        { name: 'saree collection', url: '/products?category=Saree' },
        { name: 'designer dresses', url: '/products?category=dresses' },
        { name: 'lehenga sets', url: '/products?category=Lahenga' }
      ]
    },
    { 
      title: 'Account', 
      items: [
        { name: 'My Account', url: '/profile' },
        { name: 'Orders', url: '#' },
        { name: 'Wishlist', url: '/wishlist' },
        { name: 'Cart', url: '/cart' }
      ]
    },
    { 
      title: 'Support', 
      items: [
        { name: 'Contact Us', url: '/contact' },
        { name: 'FAQs', url: '/faq' },
        { name: 'Privacy Policy', url: '/privacy-policy' },
        { name: 'Return & Refund Policy', url: '/return-refund-policy' },
        { name: 'Terms & Conditions', url: '/terms-conditions' }
      ]
    }
  ];

  return (
    <footer className="relative bg-white overflow-hidden">
      {/* Wave SVG */}
      <div className="absolute inset-x-0 top-0">
        <svg className="w-full h-16 md:h-20" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="50%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>
          <path
            d="M0,60 C300,120 600,0 900,60 C1050,90 1150,30 1200,60 L1200,0 L0,0 Z"
            fill="url(#waveGradient)"
            className="animate-pulse"
          />
        </svg>
      </div>

      <div className="relative pt-20 md:pt-24 pb-8 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Triivya
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto text-base md:text-lg">
              Discover curated collections that blend timeless sophistication with contemporary style.
            </p>
          </div>

          {/* Desktop View: Grid Layout */}
          <div className="hidden md:grid md:grid-cols-3 gap-8 mb-12">
            {sections.map((section) => (
              <div key={section.title} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-900 mb-4 text-lg">{section.title}</h3>
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <li key={item.name}>
                      <a href={item.url} className="text-gray-600 hover:text-purple-600 transition-colors text-sm flex items-center group">
                        <span className="w-2 h-2 bg-purple-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Mobile View: Accordion Dropdowns */}
          <div className="md:hidden mb-8">
            {sections.map((section) => (
              <div key={section.title} className="mb-4">
                <button
                  onClick={() => toggleSection(section.title)}
                  className="w-full flex justify-between items-center bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <h3 className="font-semibold text-gray-900 text-base">{section.title}</h3>
                  {openSection === section.title ? (
                    <ChevronUp className="w-5 h-5 text-purple-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-purple-600" />
                  )}
                </button>
                {openSection === section.title && (
                  <ul className="mt-2 bg-white rounded-b-xl p-4 space-y-2 shadow-sm">
                    {section.items.map((item) => (
                      <li key={item.name}>
                        <a href={item.url} className="text-gray-600 hover:text-purple-600 transition-colors text-sm flex items-center group">
                          <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex space-x-4 mb-6 md:mb-0">
              {[Facebook, Instagram, Twitter, Linkedin].map((Icon, index) => (
                <div key={index} className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-lg">
                  <Icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
              ))}
            </div>
            <p className="text-gray-500 text-xs md:text-sm">© 2025 Triivya. Crafted with ❤️</p>
          </div>
        </div>
      </div>
    </footer>
  );
}