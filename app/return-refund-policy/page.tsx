"use client";
import React from 'react';

export default function ReturnRefundPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-16 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 mb-8">
          <div className="px-8 py-10 md:px-12 md:py-12 border-b border-gray-100">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Return & Refund Policy
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">
              At <span className="font-semibold text-gray-900">TRIIVYA</span>, we want you to be absolutely delighted with your purchase. We understand that sometimes things just don't work out, and we're here to help. If you're not completely satisfied with your order, we offer a <span className="font-semibold text-blue-600">7-day return and refund policy</span> from the date of delivery.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="px-8 py-10 md:px-12 md:py-12">
            
            {/* Policy Overview */}
            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-blue-600">
                Our 7-Day Return & Refund Policy
              </h2>
              <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-600">
                <p className="text-gray-700 leading-relaxed text-lg">
                  You have <span className="font-semibold text-blue-700">7 calendar days</span> from the day you receive your item to initiate a return.
                </p>
              </div>
            </section>

            {/* Eligibility Section */}
            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-green-600">
                Eligibility for Return
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                To be eligible for a return, your item must meet the following conditions:
              </p>
              <div className="grid gap-4">
                <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                  <h3 className="font-semibold text-green-800 mb-2">✓ Unused and Unworn</h3>
                  <p className="text-gray-700">The item must be in its original, unused, and unworn condition.</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                  <h3 className="font-semibold text-green-800 mb-2">✓ Original Packaging</h3>
                  <p className="text-gray-700">The item must be returned in its original packaging, with all tags still attached. This includes any dust bags, hangers, or protective covers that came with the product.</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                  <h3 className="font-semibold text-green-800 mb-2">✓ No Damage</h3>
                  <p className="text-gray-700">The item must not be damaged, altered, or stained in any way.</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                  <h3 className="font-semibold text-green-800 mb-2">✓ Original Condition</h3>
                  <p className="text-gray-700">The item must be free from any odors, pet hair, or signs of wear.</p>
                </div>
              </div>
              <div className="mt-6 bg-amber-50 rounded-lg p-4 border-l-4 border-amber-500">
                <p className="text-amber-800 font-medium">
                  <span className="font-semibold">Please note:</span> Items purchased during special promotions, sales, or marked as "final sale" may not be eligible for return. Please check the product description or promotion terms carefully before purchasing.
                </p>
              </div>
            </section>

            {/* How to Return */}
            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-purple-600">
                How to Initiate a Return
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                To start a return, please follow these simple steps:
              </p>
              <div className="space-y-4">
                <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                  <h3 className="font-semibold text-purple-800 mb-2">Step 1: Contact Us</h3>
                  <p className="text-gray-700">Within 7 days of receiving your order, send an email to support@triivya.com or call us at  +91 7201847262.</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                  <h3 className="font-semibold text-purple-800 mb-2">Step 2: Provide Details</h3>
                  <p className="text-gray-700">In your email or call, please provide your order number, the item(s) you wish to return, and the reason for the return.</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                  <h3 className="font-semibold text-purple-800 mb-2">Step 3: Return Authorization</h3>
                  <p className="text-gray-700">Our customer service team will review your request and, if eligible, provide you with a Return Authorization (RA) number and instructions on how to send back your item. Please do not send back items without an RA number, as they will not be accepted.</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                  <h3 className="font-semibold text-purple-800 mb-2">Step 4: Package Your Item</h3>
                  <p className="text-gray-700">Securely pack the item(s) in their original packaging, ensuring all tags are attached. Clearly write the RA number on the outside of the package.</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                  <h3 className="font-semibold text-purple-800 mb-2">Step 5: Return Shipping Address</h3>
                  <p className="text-gray-700">B-601, Vedant Antilia, Near Nayara Petrol Pump, New Kosad Road, Amroli-394107, Surat.</p>
                </div>
              </div>
            </section>

            {/* Refunds */}
            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-orange-600">
                Refunds
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Once we receive your returned item and inspect it, we will notify you of the approval or rejection of your refund.
              </p>
              <div className="space-y-4">
                <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-500">
                  <h3 className="font-semibold text-orange-800 mb-2">✓ Approved Refunds</h3>
                  <p className="text-gray-700">If your return is approved, your refund will be processed to your original method of payment within 7-10 business days.</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
                  <h3 className="font-semibold text-red-800 mb-2">✗ Rejected Refunds</h3>
                  <p className="text-gray-700">If the item does not meet our return eligibility criteria (e.g., it's used, damaged, or missing tags), your refund may be rejected, and the item may be sent back to you at your expense.</p>
                </div>
              </div>
            </section>

            {/* Exchanges */}
            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-indigo-600">
                Exchanges
              </h2>
              <div className="bg-indigo-50 rounded-lg p-6 border-l-4 border-indigo-600">
                <p className="text-gray-700 leading-relaxed">
                  Currently, we do not offer direct exchanges. If you wish to exchange an item, please follow the return process for a refund and then place a new order for the desired item.
                </p>
              </div>
            </section>

            {/* Damaged Items */}
            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-red-600">
                Damaged or Incorrect Items
              </h2>
              <div className="bg-red-50 rounded-lg p-6 border-l-4 border-red-600">
                <p className="text-gray-700 leading-relaxed">
                  If you receive a damaged or incorrect item, please contact us immediately at <span className="font-semibold text-red-700">support@triivya.com</span> or <span className="font-semibold text-red-700"> +91 7201847262</span> within <span className="font-semibold text-red-700">48 hours</span> of delivery. Please provide your order number and clear photos of the damaged or incorrect item. We will work quickly to resolve the issue for you.
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-teal-600">
                Contact Us
              </h2>
              <div className="pl-4 border-l-4 border-teal-100 space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  If you have any questions about our Return & Refund Policy, please don't hesitate to contact our customer service team:
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

            {/* Customer Service Promise */}
            <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg p-6 border border-blue-200">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Our Customer Service Promise</h3>
                <p className="text-gray-700 leading-relaxed">
                  We're committed to making your shopping experience exceptional. Our team is here to help you every step of the way, from purchase to post-delivery support.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}