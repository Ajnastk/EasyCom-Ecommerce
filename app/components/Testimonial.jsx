"use client";

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Testimonial = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      quote: "Hey order just arrived wanted to say that the scrunchies were in good condition and the fabric is so good that even my sister couldn't believe that they are that affordable",
      author: "Shivani",
      location: "from Jammu and Kashmir"
    },
    {
      quote: "The quality of the products exceeded my expectations. The customer service was exceptional and delivery was quick!",
      author: "Rahul",
      location: "from Mumbai"
    },
    {
      quote: "I've been a regular customer for months now. The consistency in quality and service is remarkable. Highly recommended!",
      author: "Priya",
      location: "from Bangalore"
    }
  ];

  // Auto-switch testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Switch every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="bg-[#1a2649] text-white py-20 overflow-x-hidden">
      <div className="max-w-4xl mx-auto px-4 relative">
        {/* Quote mark */}
        <div className="text-6xl font-serif text-center mb-8">"</div>
        
        {/* Testimonial content */}
        <div className="relative min-h-[200px]">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`absolute w-full transition-all duration-500 ease-in-out ${
                index === currentIndex 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 translate-x-full'
              }`}
              style={{ transform: index === currentIndex ? 'none' : `translateX(${(index - currentIndex) * 100}%)` }}
            >
              <p className="text-center text-xl md:text-2xl mb-8 px-4">
                {testimonial.quote}
              </p>
              <div className="text-center">
                <p className="font-medium">{testimonial.author}</p>
                <p className="text-sm opacity-75">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation buttons */}
        <button 
          onClick={handlePrevious}
          className="absolute left-0 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-full transition-colors"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-full transition-colors"
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-white w-8' : 'bg-white/50'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonial;