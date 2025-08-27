"use client";
import React from 'react';

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-16 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 mb-8">
          <div className="px-8 py-10 md:px-12 md:py-12 border-b border-gray-100">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Terms & Conditions
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">
              Welcome to <span className="font-semibold text-gray-900">TRIIVYA</span>! These Terms & Conditions govern your use of our e-commerce website and the purchase of products from us. By accessing or using our website, you agree to be bound by these Terms.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="px-8 py-10 md:px-12 md:py-12">
            
            {/* Section 1 */}
            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-blue-600">
                1. General Conditions
              </h2>
              <div className="space-y-5">
                <div className="pl-4 border-l-4 border-blue-100">
                  <h3 className="font-semibold text-gray-900 mb-2">Accuracy of Information</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We strive to ensure that all information on our website is accurate, complete, and current. However, we do not warrant that product descriptions, pricing, or other content is entirely error-free. We reserve the right to correct any errors, inaccuracies, or omissions and to change or update information at any time without prior notice.
                  </p>
                </div>
                <div className="pl-4 border-l-4 border-blue-100">
                  <h3 className="font-semibold text-gray-900 mb-2">Website Availability</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We aim to keep the website available 24/7. However, we may occasionally need to restrict access to parts or all of the website for maintenance, updates, or other reasons without notice.
                  </p>
                </div>
                <div className="pl-4 border-l-4 border-blue-100">
                  <h3 className="font-semibold text-gray-900 mb-2">Prohibited Uses</h3>
                  <p className="text-gray-700 leading-relaxed">
                    You agree not to use the website for any unlawful purpose or in any way that could damage, disable, overburden, or impair the website or interfere with any other party's use of the website.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-green-600">
                2. Products & Orders
              </h2>
              <div className="space-y-5">
                <div className="pl-4 border-l-4 border-green-100">
                  <h3 className="font-semibold text-gray-900 mb-2">Product Descriptions</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We make every effort to display the colors, features, specifications, and details of the products available on the website as accurately as possible. However, we cannot guarantee that your device's display of any color will be accurate.
                  </p>
                </div>
                <div className="pl-4 border-l-4 border-green-100">
                  <h3 className="font-semibold text-gray-900 mb-2">Pricing</h3>
                  <p className="text-gray-700 leading-relaxed">
                    All prices displayed on the website are in Indian Rupees (INR) unless otherwise stated. Prices are subject to change without notice. The price charged for a product will be the price in effect at the time your order is placed.
                  </p>
                </div>
                <div className="pl-4 border-l-4 border-green-100">
                  <h3 className="font-semibold text-gray-900 mb-2">Availability</h3>
                  <p className="text-gray-700 leading-relaxed">
                    All products are subject to availability. We reserve the right to limit the quantity of products we supply, or to refuse any order you place with us.
                  </p>
                </div>
                <div className="pl-4 border-l-4 border-green-100">
                  <h3 className="font-semibold text-gray-900 mb-2">Order Acceptance</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Your receipt of an electronic or other form of order confirmation does not signify our acceptance of your order, nor does it constitute confirmation of our offer to sell. We reserve the right at any time after receipt of your order to accept or decline your order for any reason.
                  </p>
                </div>
                <div className="pl-4 border-l-4 border-green-100">
                  <h3 className="font-semibold text-gray-900 mb-2">Payment</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We accept various payment methods as indicated on our website. You agree to provide current, complete, and accurate purchase and account information for all purchases made via the website.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-purple-600">
                3. Shipping & Delivery
              </h2>
              <div className="space-y-5">
                <div className="pl-4 border-l-4 border-purple-100">
                  <h3 className="font-semibold text-gray-900 mb-2">Shipping Areas</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We currently ship to addresses within India.
                  </p>
                </div>
                <div className="pl-4 border-l-4 border-purple-100">
                  <h3 className="font-semibold text-gray-900 mb-2">Shipping Costs</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Shipping costs will be calculated and displayed at checkout.
                  </p>
                </div>
                <div className="pl-4 border-l-4 border-purple-100">
                  <h3 className="font-semibold text-gray-900 mb-2">Delivery Times</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Estimated delivery times are provided for your convenience but are not guaranteed. Delays may occur due to unforeseen circumstances or factors beyond our control.
                  </p>
                </div>
                <div className="pl-4 border-l-4 border-purple-100">
                  <h3 className="font-semibold text-gray-900 mb-2">Risk of Loss</h3>
                  <p className="text-gray-700 leading-relaxed">
                    The risk of loss and title for items purchased from us pass to you upon our delivery to the carrier.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-orange-600">
                4. Returns & Refunds
              </h2>
              <div className="pl-4 border-l-4 border-orange-100">
                <p className="text-gray-700 leading-relaxed">
                  Our Return & Refund Policy governs all returns and refunds. Please review this policy separately on our website for full details. By placing an order, you agree to the terms of our Return & Refund Policy.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-red-600">
                5. Intellectual Property
              </h2>
              <div className="space-y-5">
                <div className="pl-4 border-l-4 border-red-100">
                  <p className="text-gray-700 leading-relaxed">
                    All content on this website, including text, graphics, logos, images, audio clips, video clips, data compilations, and software, is the property of TRIIVYA or its content suppliers and is protected by Indian and international copyright laws.
                  </p>
                </div>
                <div className="pl-4 border-l-4 border-red-100">
                  <p className="text-gray-700 leading-relaxed">
                    You may not reproduce, duplicate, copy, sell, resell, visit, or otherwise exploit for any commercial purpose any part of this website without our express written consent.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-indigo-600">
                6. User Accounts
              </h2>
              <div className="space-y-5">
                <div className="pl-4 border-l-4 border-indigo-100">
                  <p className="text-gray-700 leading-relaxed">
                    If you create an account on our website, you are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer. You agree to accept responsibility for all activities that occur under your account or password.
                  </p>
                </div>
                <div className="pl-4 border-l-4 border-indigo-100">
                  <p className="text-gray-700 leading-relaxed">
                    We reserve the right to refuse service, terminate accounts, remove or edit content, or cancel orders in our sole discretion.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 7 */}
            <section className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-teal-600">
                7. Contact Information
              </h2>
              <div className="pl-4 border-l-4 border-teal-100 space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  If you have any questions about these Terms & Conditions, please contact us at:
                </p>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-gray-900">Email:</span>
                    <span className="text-blue-600">support@triivya.com</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="font-medium text-gray-900">Address:</span>
                    <span className="text-gray-700">B-601, Vedant Antilia, Near Nayara Petrol Pump, New Kosad Road, Amroli-394107, Surat.</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Footer */}
            <div className="pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center">
                Last Updated: June 28, 2025
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}