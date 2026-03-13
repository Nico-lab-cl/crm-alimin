"use client";

import React, { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';

const testimonials = [
  { id: 1, image: '/testimonials/testimonio-1.webp' },
  { id: 2, image: '/testimonials/testimonio-2.webp' },
  { id: 3, image: '/testimonials/testimonio-3.webp' },
  { id: 4, image: '/testimonials/testimonio-4.webp' },
  { id: 5, image: '/testimonials/testimonio-5.webp' },
  { id: 6, image: '/testimonials/testimonio-6.webp' },
];

export const Testimonials = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: true,
    skipSnaps: false,
    dragFree: true,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-[#E0B457]/30" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#36595F]/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#E0B457]/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#36595F]/10 text-[#36595F] font-bold text-sm mb-6 border border-[#36595F]/20 uppercase tracking-widest">
            <Quote className="w-4 h-4 fill-current" />
            Testimonios
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-8 tracking-tight max-w-4xl mx-auto leading-[1.1]">
            Mas de 50 familias han encontrado <span className="text-[#36595F]">su hogar con nosotros</span>
          </h1>
        </div>

        {/* Carousel Container */}
        <div className="relative group max-w-7xl mx-auto">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-4 md:-ml-6">
              {testimonials.map((testimonial) => (
                <div 
                  key={testimonial.id} 
                  className="flex-[0_0_85%] min-w-0 pl-4 md:flex-[0_0_45%] md:pl-6 lg:flex-[0_0_33.333%] transition-all duration-500 ease-out"
                >
                  <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white group/card">
                    <img
                      src={testimonial.image}
                      alt={`Testimonio ${testimonial.id}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                    />
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover/card:opacity-40 transition-opacity duration-500" />
                    
                    {/* Floating Badge */}
                    <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 transform translate-y-2 opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100 transition-all duration-500">
                       <p className="text-white font-bold text-center tracking-wide">Propietario Lomas del Mar</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center mt-12 gap-6">
            <Button
              variant="outline"
              size="icon"
              className="w-14 h-14 rounded-full border-2 border-[#36595F]/20 hover:border-[#36595F] hover:bg-[#36595F] hover:text-white transition-all duration-300 shadow-lg group"
              onClick={scrollPrev}
            >
              <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="w-14 h-14 rounded-full border-2 border-[#36595F]/20 hover:border-[#36595F] hover:bg-[#36595F] hover:text-white transition-all duration-300 shadow-lg group"
              onClick={scrollNext}
            >
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
