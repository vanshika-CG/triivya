'use client';
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Sparkles, Heart, Star, Zap } from 'lucide-react';

export default function FAQPage() {
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const toggleQuestion = (index: number) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  const faqs = [
    {
      question: 'What kind of products does Triivya offer?',
      answer: 'Triivya offers a curated collection of women\'s ethnic wear including Kurtis, Sarees, Gowns, and Chaniya Cholis—blending tradition with modern elegance.',
      icon: 'sparkles',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      question: 'How can I place an order on Triivya?',
      answer: 'Simply browse our collections, choose your desired product, select the size, and click "Add to Cart." Follow the checkout process to complete your order securely.',
      icon: 'heart',
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      question: 'Do you ship all over India?',
      answer: 'Yes, we offer nationwide shipping across India. Your order will be delivered right to your doorstep.',
      icon: 'star',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      question: 'How long does delivery take?',
      answer: 'Delivery usually takes 6-8 business days, depending on your location. In case of delays, we\'ll keep you informed via email or SMS.',
      icon: 'zap',
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept Cash on delivery and Razorpay secure online payment options.',
      icon: 'sparkles',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      question: 'Can I return or exchange a product?',
      answer: 'Yes, we offer a 7-day return or exchange policy if the item is unused, in original condition, and has all tags intact. Please read our Return Policy for full details.',
      icon: 'heart',
      gradient: 'from-violet-500 to-purple-500'
    },
    {
      question: 'What if I receive a damaged or wrong product?',
      answer: 'Please contact us within 48 hours of receiving the item, and we\'ll resolve it through replacement or refund.',
      icon: 'star',
      gradient: 'from-indigo-500 to-blue-500'
    },
    {
      question: 'How can I contact customer support?',
      answer: 'You can reach us via the Contact Us page on our website or email us directly at support@triivya.com. We usually respond within 24 hours.',
      icon: 'zap',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      question: 'Do you offer custom stitching or size options?',
      answer: 'Currently, we offer standard sizes only.',
      icon: 'sparkles',
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      question: 'Are your products ready-to-ship or made on order?',
      answer: 'Most of our items are ready-to-ship. This will be clearly mentioned on the product page.',
      icon: 'heart',
      gradient: 'from-pink-500 to-purple-500'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
        
        {/* Animated Sparkles */}
        <div className="absolute top-32 left-1/4 animate-bounce delay-1000">
          <Sparkles className="w-6 h-6 text-purple-400 opacity-60" />
        </div>
        <div className="absolute top-48 right-1/3 animate-bounce delay-2000">
          <Star className="w-5 h-5 text-pink-400 opacity-60" />
        </div>
        <div className="absolute bottom-32 right-1/4 animate-bounce delay-3000">
          <Heart className="w-4 h-4 text-blue-400 opacity-60" />
        </div>
      </div>

      {/* Dynamic Wave Header */}
      <div className="relative w-full h-32 md:h-40 overflow-hidden">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 160" preserveAspectRatio="none">
          <defs>
            <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="25%" stopColor="#EC4899" />
              <stop offset="50%" stopColor="#3B82F6" />
              <stop offset="75%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
            <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EC4899" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
          </defs>
          <path
            d="M0,80 C300,140 600,20 900,80 C1050,110 1150,50 1200,80 L1200,0 L0,0 Z"
            fill="url(#waveGradient1)"
            className="animate-pulse"
          />
          <path
            d="M0,100 C200,160 400,40 600,100 C800,140 1000,60 1200,100 L1200,0 L0,0 Z"
            fill="url(#waveGradient2)"
            className="animate-pulse delay-1000"
            opacity="0.7"
          />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-16 md:pt-20 pb-16">
        {/* Hero Section */}
        <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            <Sparkles className="w-8 h-8 text-purple-600" />
            <h1 className="text-4xl md:text-6xl font-bold">
              FAQ
            </h1>
            <Sparkles className="w-8 h-8 text-pink-600" />
          </div>
          <p className="text-xl md:text-2xl text-gray-600 font-medium">
            Everything you need to know about 
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold"> Triivya</span>
          </p>
          <div className="mt-8 flex justify-center">
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
          </div>
        </div>

        {/* Desktop View: Enhanced Grid Layout */}
        <div className="hidden md:grid md:grid-cols-2 gap-8">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-white/20 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Gradient Border Effect */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${faq.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10`}></div>
              
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r ${faq.gradient} text-white mb-6 shadow-lg`}>
                {faq.icon === 'sparkles' && <Sparkles className="w-5 h-5" />}
                {faq.icon === 'heart' && <Heart className="w-5 h-5" />}
                {faq.icon === 'star' && <Star className="w-5 h-5" />}
                {faq.icon === 'zap' && <Zap className="w-5 h-5" />}
              </div>
              
              {/* Content */}
              <h3 className="font-bold text-gray-900 mb-4 text-xl group-hover:text-purple-800 transition-colors">
                {faq.question}
              </h3>
              <p className="text-gray-600 leading-relaxed text-base">{faq.answer}</p>
              
              {/* Hover Effect Sparkle */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Sparkles className="w-5 h-5 text-purple-400" />
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View: Enhanced Accordion */}
        <div className="md:hidden space-y-6">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-white/20 transition-all duration-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full flex justify-between items-center p-6 text-left group"
              >
                <div className="flex items-center space-x-4">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r ${faq.gradient} text-white shadow-md`}>
                    {faq.icon === 'sparkles' && <Sparkles className="w-5 h-5" />}
                    {faq.icon === 'heart' && <Heart className="w-5 h-5" />}
                    {faq.icon === 'star' && <Star className="w-5 h-5" />}
                    {faq.icon === 'zap' && <Zap className="w-5 h-5" />}
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg group-hover:text-purple-800 transition-colors">
                    {faq.question}
                  </h3>
                </div>
                <div className={`transform transition-transform duration-300 ${openQuestion === index ? 'rotate-180' : ''}`}>
                  {openQuestion === index ? (
                    <ChevronUp className="w-6 h-6 text-purple-600" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-purple-600" />
                  )}
                </div>
              </button>
              
              <div className={`transition-all duration-300 ease-in-out ${openQuestion === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-6 pb-6">
                  <div className="pl-14 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className={`mt-20 text-center transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Still have questions?
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Our support team is here to help you 24/7
            </p>
            <a href="/contact">
            <button className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300 shadow-lg transform hover:scale-105">
              Contact Support
            </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}