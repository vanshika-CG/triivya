import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function CategoryShowcase() {
  return (
    <section className="py-16 px-4 md:px-6">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="relative overflow-hidden rounded-xl">
            <Image
              src="/placeholder.svg?height=600&width=800"
              alt="Women's Collection"
              width={800}
              height={600}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/70 to-transparent" />
            <div className="absolute inset-0 flex flex-col items-start justify-center p-8 text-white">
              <span className="mb-2 rounded-full bg-amber-500 px-3 py-1 text-xs font-medium uppercase">New Season</span>
              <h3 className="mb-2 text-3xl font-bold">Women's Ethnic</h3>
              <p className="mb-6 max-w-xs text-white/90">
                Discover our exquisite collection of traditional and contemporary ethnic wear.
              </p>
              <Button className="bg-white text-primary hover:bg-white/90">Shop Collection</Button>
            </div>
          </div>
          <div className="grid gap-8">
            <div className="relative overflow-hidden rounded-xl">
              <Image
                src="/placeholder.svg?height=280&width=600"
                alt="Men's Collection"
                width={600}
                height={280}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/70 to-transparent" />
              <div className="absolute inset-0 flex flex-col items-start justify-center p-6 text-white">
                <h3 className="mb-2 text-2xl font-bold">Men's Collection</h3>
                <p className="mb-4 max-w-xs text-sm text-white/90">Elevate your style with our premium men's wear.</p>
                <Button size="sm" className="bg-white text-primary hover:bg-white/90">
                  Explore
                </Button>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-xl">
              <Image
                src="/placeholder.svg?height=280&width=600"
                alt="Accessories"
                width={600}
                height={280}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/70 to-transparent" />
              <div className="absolute inset-0 flex flex-col items-start justify-center p-6 text-white">
                <h3 className="mb-2 text-2xl font-bold">Accessories</h3>
                <p className="mb-4 max-w-xs text-sm text-white/90">Complete your look with our stunning accessories.</p>
                <Button size="sm" className="bg-white text-primary hover:bg-white/90">
                  Discover
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
