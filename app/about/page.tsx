import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "About Us | TRIIVYA",
  description: "Discover TRIIVYA's journey to empower Indian women with beauty, confidence, and timeless fashion.",
};

export default function AboutPage() {
  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">About TRIIVYA</h1>
        <p className="mt-4 text-lg text-gray-600">
          Empowering every Indian woman with beauty, confidence, and the timeless elegance of Indian fashion.
        </p>
      </div>

      <div className="mt-16 grid gap-16">
        <section className="grid gap-8 md:grid-cols-2 md:items-center">
          <div className="relative aspect-square overflow-hidden rounded-lg shadow-lg">
            <Image src="/images/shop.webp" alt="Our story" fill className="object-cover" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Our Story</h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Born in the vibrant textile hub of Surat, Gujarat, TRIIVYA was founded in 2025 with a singular vision: to
              empower every Indian woman with beauty and confidence through clothing that tells a story. Inspired by the
              skilled hands of artisans and the rich heritage of Indian textiles, we set out to bridge tradition with
              modern aspiration.
            </p>
            <p className="mt-4 text-gray-600 leading-relaxed">
              From the intricate zari of a Banarasi saree to the vibrant embroidery of a Gujarati chaniya choli and the
              effortless elegance of a well-tailored kurti, every TRIIVYA piece is a celebration of craftsmanship and
              cultural pride. We work directly with weavers and artisans to bring you hand-picked designs that embody the
              essence of womanhood, blending timeless tradition with contemporary style.
            </p>
          </div>
        </section>

        <section className="grid gap-8 md:grid-cols-2 md:items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Our Mission</h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              At TRIIVYA, our mission is to empower Indian women by celebrating their unique beauty and individuality
              through fashion. We believe clothing is more than fabric—it's a story of identity, heritage, and confidence.
              Our curated collections of sarees, chaniya cholis, and kurtis are designed to make every woman feel
              extraordinary, whether for a special occasion or everyday elegance.
            </p>
            <p className="mt-4 text-gray-600 leading-relaxed">
              We partner directly with artisans, ensuring ethical practices, fair wages, and the preservation of
              traditional craftsmanship. By connecting these skilled creators with modern women, we aim to keep India's
              sartorial legacy alive while crafting a seamless, joyful shopping experience.
            </p>
          </div>
          <div className="relative aspect-square overflow-hidden rounded-lg shadow-lg order-1 md:order-2">
            <Image src="/images/shop1.webp" alt="Our mission" fill className="object-cover" />
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Our Values</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg bg-purple-50 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Authenticity</h3>
              <p className="mt-2 text-gray-600 leading-relaxed">
                We honor India's rich cultural heritage by curating authentic, handcrafted designs that tell a story of
                tradition and pride.
              </p>
            </div>
            <div className="rounded-lg bg-purple-50 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Empowerment</h3>
              <p className="mt-2 text-gray-600 leading-relaxed">
                We empower women to express their individuality and confidence through unique, meaningful fashion.
              </p>
            </div>
            <div className="rounded-lg bg-purple-50 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M12 2v4"></path>
                  <path d="M12 18v4"></path>
                  <path d="m4.93 4.93 2.83 2.83"></path>
                  <path d="m16.24 16.24 2.83 2.83"></path>
                  <path d="M2 12h4"></path>
                  <path d="M18 12h4"></path>
                  <path d="m4.93 19.07 2.83-2.83"></path>
                  <path d="m16.24 7.76 2.83-2.83"></path>
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Craftsmanship</h3>
              <p className="mt-2 text-gray-600 leading-relaxed">
                We champion the artistry of skilled weavers and artisans, ensuring every piece is a masterpiece of quality
                and tradition.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-center text-white md:p-12 shadow-xl">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Join Our Journey</h2>
          <p className="mx-auto mt-4 max-w-2xl text-purple-100 leading-relaxed">
            Be a part of TRIIVYA's mission to empower Indian women with fashion that celebrates heritage, individuality, and
            timeless beauty. Discover the perfect saree, chaniya choli, or kurti to tell your unique story.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/products">
              <Button className="px-6 py-3 bg-white text-purple-600 font-semibold rounded-lg shadow-md hover:bg-gray-50 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                Shop Our Collections
              </Button>
            </Link>
            <Link href="/contact">
              <Button className="px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-purple-600 transition-all duration-300 transform hover:scale-105">
                Contact Us
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}