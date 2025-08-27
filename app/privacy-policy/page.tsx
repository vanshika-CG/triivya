"use client";
import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-16 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 mb-8">
          <div className="px-8 py-10 md:px-12 md:py-12 border-b border-gray-100">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">
              At <span className="font-semibold text-gray-900">TRIIVYA</span>, we are committed to protecting your privacy. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you visit our e-commerce website. By using our website, you agree to the terms of this Privacy Policy.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="px-8 py-10 md:px-12 md:py-12">
            
            {/* Section 1 - Information Collection */}
            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-blue-600">
                1. Information We Collect
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                We may collect personal information that you voluntarily provide to us when you:
              </p>
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                  <h3 className="font-semibold text-blue-800 mb-2">👤 Create an Account</h3>
                  <p className="text-gray-700">This may include your name, email address, phone number, and password.</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                  <h3 className="font-semibold text-blue-800 mb-2">🛒 Place an Order</h3>
                  <p className="text-gray-700">We collect your shipping address, billing address, payment information (credit card details are processed securely by our payment gateway and not stored on our servers), and contact details.</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                  <h3 className="font-semibold text-blue-800 mb-2">💬 Contact Customer Support</h3>
                  <p className="text-gray-700">We collect information you provide to us during our correspondence.</p>
                </div>
              </div>
            </section>

            {/* Section 2 - How We Use Information */}
            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-green-600">
                2. How We Use Your Information
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                We use the information we collect for various purposes, including to:
              </p>
              <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-600">
                <h3 className="font-semibold text-green-800 mb-3">📦 Process and Fulfill Your Orders</h3>
                <p className="text-gray-700 leading-relaxed">
                  This includes shipping products, sending order confirmations, and providing customer support related to your purchases.
                </p>
              </div>
              
              {/* Additional uses that are commonly included */}
              <div className="mt-6 grid gap-4">
                <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                  <h3 className="font-semibold text-green-800 mb-2">📧 Communication</h3>
                  <p className="text-gray-700">Send you updates about your orders, account information, and promotional offers (with your consent).</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                  <h3 className="font-semibold text-green-800 mb-2">🔧 Website Improvement</h3>
                  <p className="text-gray-700">Analyze website usage to improve our services and user experience.</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                  <h3 className="font-semibold text-green-800 mb-2">🛡️ Security & Fraud Prevention</h3>
                  <p className="text-gray-700">Protect against fraudulent transactions and maintain the security of our platform.</p>
                </div>
              </div>
            </section>

            {/* Section 3 - Information Sharing */}
            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-purple-600">
                3. Sharing Your Information
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties except in the following circumstances:
              </p>
              <div className="space-y-4">
                <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                  <h3 className="font-semibold text-purple-800 mb-2">🤝 Service Providers</h3>
                  <p className="text-gray-700">We may share your information with trusted third-party service providers who assist us in operating our website, conducting our business, or serving our users (e.g., payment processors, shipping companies, marketing agencies). These third parties are obligated to keep your information confidential and use it only for the purposes for which we disclose it to them.</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                  <h3 className="font-semibold text-purple-800 mb-2">⚖️ Legal Requirements</h3>
                  <p className="text-gray-700">We may disclose your information when required by law or to protect our rights, property, or safety, or that of our users or others.</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                  <h3 className="font-semibold text-purple-800 mb-2">🏢 Business Transfers</h3>
                  <p className="text-gray-700">In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction.</p>
                </div>
              </div>
            </section>

            {/* Section 4 - Data Security */}
            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-orange-600">
                4. Data Security
              </h2>
              <div className="bg-orange-50 rounded-lg p-6 border-l-4 border-orange-600">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center">
                    <span className="text-orange-800 font-bold text-sm">🔒</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-orange-800 mb-3">Our Security Measures</h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      We implement a variety of security measures to maintain the safety of your personal information. These measures include using secure servers, encryption of sensitive data (like credit card information), and restricting access to your personal information to authorized personnel only.
                    </p>
                    <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                      <p className="text-amber-800 text-sm">
                        <span className="font-semibold">Important:</span> No method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5 - Your Rights */}
            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-indigo-600">
                5. Your Choices and Rights
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                You have certain rights regarding your personal information:
              </p>
              <div className="space-y-4">
                <div className="bg-indigo-50 rounded-lg p-4 border-l-4 border-indigo-500">
                  <h3 className="font-semibold text-indigo-800 mb-2">📝 Access and Correction</h3>
                  <p className="text-gray-700">You can access and update your account information by logging into your profile.</p>
                </div>
                <div className="bg-indigo-50 rounded-lg p-4 border-l-4 border-indigo-500">
                  <h3 className="font-semibold text-indigo-800 mb-2">🍪 Cookies</h3>
                  <p className="text-gray-700">Most web browsers are set to accept cookies by default. You can usually choose to set your browser to remove or reject browser cookies, but this may affect the functionality of our website.</p>
                </div>
                <div className="bg-indigo-50 rounded-lg p-4 border-l-4 border-indigo-500">
                  <h3 className="font-semibold text-indigo-800 mb-2">📧 Marketing Communications</h3>
                  <p className="text-gray-700">You can opt out of receiving promotional emails by clicking the unsubscribe link in any marketing email or contacting us directly.</p>
                </div>
                <div className="bg-indigo-50 rounded-lg p-4 border-l-4 border-indigo-500">
                  <h3 className="font-semibold text-indigo-800 mb-2">🗑️ Data Deletion</h3>
                  <p className="text-gray-700">You can request deletion of your personal data by contacting our support team, subject to legal and contractual restrictions.</p>
                </div>
              </div>
            </section>

            {/* Section 6 - Contact Information */}
            <section className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-teal-600">
                6. Contact Us
              </h2>
              <div className="pl-4 border-l-4 border-teal-100 space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  If you have any questions about this Privacy Policy or our data practices, please contact us at:
                </p>
                <div className="bg-teal-50 rounded-lg p-6 space-y-3">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-teal-800">Email:</span>
                    <span className="text-blue-600 font-medium">support@triivya.com</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="font-medium text-teal-800">Address:</span>
                    <span className="text-gray-700">B-601, Vedant Antilia, Near Nayara Petrol Pump, New Kosad Road, Amroli-394107, Surat.</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Privacy Commitment */}
            <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg p-6 border border-blue-200">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Our Privacy Commitment</h3>
                <p className="text-gray-700 leading-relaxed">
                  Your privacy is important to us. We are committed to being transparent about how we collect, use, and protect your personal information. This policy may be updated from time to time to reflect changes in our practices or legal requirements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}