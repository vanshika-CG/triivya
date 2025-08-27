"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Fashion Enthusiast",
    content:
      "I absolutely love the quality and design of Triivya's ethnic wear. The attention to detail is impeccable, and the fabrics are luxurious. I've received countless compliments on my outfits!",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 5,
  },
  {
    id: 2,
    name: "Rahul Mehta",
    role: "Regular Customer",
    content:
      "The men's collection at Triivya offers the perfect blend of traditional and contemporary styles. The quality is exceptional, and the customer service is outstanding. Highly recommended!",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 5,
  },
  {
    id: 3,
    name: "Ananya Patel",
    role: "Stylist",
    content:
      "As a stylist, I'm always looking for unique pieces that stand out. Triivya never disappoints with their innovative designs and premium quality. My clients are always thrilled with their purchases.",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 4,
  },
]

export default function TestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <div className="relative mx-auto max-w-4xl overflow-hidden">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="min-w-full px-4">
            <div className="flex flex-col items-center text-center">
              <div className="relative h-20 w-20 overflow-hidden rounded-full border-4 border-primary/30">
                <Image
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="mt-4 flex">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < testimonial.rating ? "fill-amber-400 text-amber-400" : "fill-gray-400 text-gray-400"
                      }`}
                    />
                  ))}
              </div>
              <blockquote className="mt-6 max-w-2xl text-lg text-white/90">"{testimonial.content}"</blockquote>
              <div className="mt-4">
                <p className="font-semibold text-white">{testimonial.name}</p>
                <p className="text-sm text-white/70">{testimonial.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={prevSlide}
          className="rounded-full border-white/30 text-white hover:bg-primary-foreground/10 hover:text-white"
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Previous</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={nextSlide}
          className="rounded-full border-white/30 text-white hover:bg-primary-foreground/10 hover:text-white"
        >
          <ChevronRight className="h-5 w-5" />
          <span className="sr-only">Next</span>
        </Button>
      </div>
    </div>
  )
}
