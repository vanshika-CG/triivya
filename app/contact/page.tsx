import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export const metadata = {
  title: "Contact Us | Triivya",
  description: "Get in touch with our team for any questions or support.",
}

export default function ContactPage() {
  return (
    <div className="bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section with Brand Colors */}
      <div className="bg-[#8c4d64] text-white py-16">
        <div className="container px-4 md:px-6 max-w-6xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Connect With Us</h1>
            <div className="flex justify-center mt-4">
              <div className="h-1 w-24 bg-yellow-400"></div>
            </div>
            <p className="mt-6 text-lg text-white/90">
              We'd love to hear from you. Our team is ready to assist with any questions about our collections.
            </p>
          </div>
        </div>
      </div>

      <div className="container px-4 py-12 md:px-6 md:py-16 max-w-6xl mx-auto">
        <div className="grid gap-12 md:grid-cols-2">
          {/* Contact Form with Elegant Styling */}
          <div>
            <div className="rounded-lg bg-white p-8 shadow-md border-t-4 border-yellow-400">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Send Us a Message</h2>
              <p className="text-gray-600 mb-6">We aim to respond to all inquiries within 24 hours.</p>
              
              <form className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="first-name" className="text-gray-700 font-medium">First Name</Label>
                    <Input 
                      id="first-name" 
                      placeholder="Enter your first name" 
                      required 
                      className="border-gray-300 focus:border-[#8c4d64] focus:ring-[#8c4d64]/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name" className="text-gray-700 font-medium">Last Name</Label>
                    <Input 
                      id="last-name" 
                      placeholder="Enter your last name" 
                      required 
                      className="border-gray-300 focus:border-[#8c4d64] focus:ring-[#8c4d64]/10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Enter your email address" 
                    required 
                    className="border-gray-300 focus:border-[#8c4d64] focus:ring-[#8c4d64]/10"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-700 font-medium">Phone Number</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    placeholder="Enter your phone number" 
                    className="border-gray-300 focus:border-[#8c4d64] focus:ring-[#8c4d64]/10"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-gray-700 font-medium">Subject</Label>
                  <Input 
                    id="subject" 
                    placeholder="Enter message subject" 
                    required 
                    className="border-gray-300 focus:border-[#8c4d64] focus:ring-[#8c4d64]/10"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-gray-700 font-medium">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Enter your message here"
                    rows={5}
                    className="resize-none border-gray-300 focus:border-[#8c4d64] focus:ring-[#8c4d64]/10"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-[#8c4d64] hover:bg-[#6d3d4e] text-white font-medium py-2.5 transition duration-200"
                >
                  Send Message
                </Button>
              </form>
            </div>
          </div>

          {/* Contact Information with Elegant Styling */}
          <div className="space-y-8">
            <div className="rounded-lg bg-white p-8 shadow-md border-t-4 border-yellow-400">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-5">
                  <div className="rounded-full bg-[#8c4d64]/10 p-3 text-[#8c4d64]">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">Our Flagship Store</h3>
                    <p className="mt-2 text-gray-600 leading-relaxed">
                      B-601 Vedant Antilia, Near Nayara Petrol Pump
                      <br />
                      New Kosad Road, Amaroli, Surat 394107
                      <br />
                      India
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-5">
                  <div className="rounded-full bg-[#8c4d64]/10 p-3 text-[#8c4d64]">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">Phone</h3>
                    <p className="mt-2 text-gray-600 leading-relaxed">
                      Customer Support: +91 7201847262
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-5">
                  <div className="rounded-full bg-[#8c4d64]/10 p-3 text-[#8c4d64]">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">Email</h3>
                    <p className="mt-2 text-gray-600 leading-relaxed">
                      Customer Support: <a href="mailto:support@triivya.com" className="text-[#8c4d64] hover:underline">support@triivya.com</a>
                      <br />
                      Sales Inquiries: <a href="mailto:sales@triivya.com" className="text-[#8c4d64] hover:underline">sales@triivya.com</a>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-5">
                  <div className="rounded-full bg-[#8c4d64]/10 p-3 text-[#8c4d64]">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">Business Hours</h3>
                    <p className="mt-2 text-gray-600 leading-relaxed">
                      Monday - Saturday: 10:00 AM - 8:00 PM
                      <br />
                      Sunday: 11:00 AM - 6:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="rounded-lg bg-white p-8 shadow-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Follow Our Journey</h2>
              <p className="text-gray-600">
                Stay connected with us on social media for the latest collections, styling tips, and exclusive offers.
              </p>
              <div className="mt-6 flex space-x-4">
                <a
                  href="#"
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-[#8c4d64]/10 text-[#8c4d64] transition-colors hover:bg-[#8c4d64] hover:text-white"
                  aria-label="Facebook"
                >
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
                    className="h-5 w-5"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-[#8c4d64]/10 text-[#8c4d64] transition-colors hover:bg-[#8c4d64] hover:text-white"
                  aria-label="Instagram"
                >
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
                    className="h-5 w-5"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a
                  href="#"
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-[#8c4d64]/10 text-[#8c4d64] transition-colors hover:bg-[#8c4d64] hover:text-white"
                  aria-label="Twitter"
                >
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
                    className="h-5 w-5"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-[#8c4d64]/10 text-[#8c4d64] transition-colors hover:bg-[#8c4d64] hover:text-white"
                  aria-label="LinkedIn"
                >
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
                    className="h-5 w-5"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
              </div>
            </div>

            {/* FAQs Panel */}
            <div className="rounded-lg bg-white p-8 shadow-md">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-yellow-400/20 flex items-center justify-center">
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
                    className="h-6 w-6 text-yellow-600"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Have Questions?</h2>
                  <p className="text-gray-600 mt-1">
                    Find answers in our frequently asked questions section.
                  </p>
                </div>
              </div>
              <a href="/faq">
                <Button className="mt-6 bg-[#8c4d64] hover:bg-[#6d3d4e] text-white">Visit FAQs</Button>
              </a>
            </div>
          </div>
        </div>

        {/* Map Section with Google Map */}
        <div className="mt-16">
          <div className="mb-6 flex items-center">
            <h2 className="text-2xl font-bold text-gray-900">Visit Our Store</h2>
            <div className="h-px flex-1 bg-gray-200 ml-4"></div>
          </div>
          <div className="rounded-lg overflow-hidden shadow-md border border-gray-200">
            <div className="aspect-[16/9] w-full bg-gray-100 relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3720.149773250893!2d72.87916361485747!3d21.184996985922234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04f3b4d3b4d3b%3A0x4d3b4d3b4d3b4d3b!2sA-602%20Vedant%20Antilia%2C%20Near%20Nayara%20Petrol%20Pump%2C%20New%20Kosad%20Road%2C%20Amaroli%2C%20Surat%2C%20Gujarat%20394107%2C%20India!5e0!3m2!1sen!2sus!4v1697671234567!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Triivya Flagship Store Location"
              ></iframe>
            </div>
            <div className="p-6 bg-white">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-[#8c4d64]/10 flex items-center justify-center mb-4">
                  <MapPin className="h-8 w-8 text-[#8c4d64]" />
                </div>
                <p className="text-gray-600 max-w-md mx-auto">
                  Our flagship store is located in the heart of Surat's vibrant shopping area. 
                  Experience our collections in person and receive personalized styling advice.
                </p>
                <div className="mt-4">
                  <a 
                    href="https://www.google.com/maps/dir/?api=1&destination=A-602+Vedant+Antilia,+Near+Nayara+Petrol+Pump,+New+Kosad+Road,+Amaroli,+Surat,+Gujarat+394107,+India"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-md bg-[#8c4d64] px-4 py-2 text-sm font-medium text-white hover:bg-[#6d3d4e] transition duration-200"
                  >
                    Get Directions
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Final CTA Section */}
      <div className="bg-[#8c4d64]/5 py-12 mt-16">
        <div className="container px-4 md:px-6 max-w-6xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Join the TRIIVYA Community</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Subscribe to our newsletter for exclusive updates, styling tips, and special offers.
          </p>
          <div className="mt-6 max-w-md mx-auto flex gap-2">
            <Input 
              placeholder="Enter your email" 
              type="email"
              className="border-gray-300 focus:border-[#8c4d64] focus:ring-[#8c4d64]/10" 
            />
            <Button className="bg-[#8c4d64] hover:bg-[#6d3d4e] text-white px-6 whitespace-nowrap">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}