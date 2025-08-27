import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function NewsletterSignup() {
  return (
    <section className="bg-gradient-to-r from-primary to-primary/80 py-16 px-4 text-white md:px-6">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Subscribe to Our Newsletter</h2>
          <p className="mt-4 text-lg text-white/80">
            Stay updated with our latest collections, exclusive offers, and style tips.
          </p>
          <form className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 border-primary/30 bg-white/10 text-white placeholder:text-white/60 focus-visible:ring-amber-500"
              required
            />
            <Button className="bg-white text-primary hover:bg-white/90">Subscribe</Button>
          </form>
          <p className="mt-3 text-xs text-white/70">
            By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
          </p>
        </div>
      </div>
    </section>
  )
}
