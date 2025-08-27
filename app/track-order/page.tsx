'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { cn } from '@/lib/utils';

// Mock API function to simulate tracking data
const mockTrackOrder = async (orderId: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock response
  if (orderId === '123456') {
    return {
      success: true,
      data: {
        orderId,
        status: 'In Transit',
        estimatedDelivery: 'July 15, 2025',
        lastUpdate: 'July 8, 2025, 8:00 PM IST',
        trackingDetails: [
          { status: 'Order Placed', date: 'July 6, 2025', location: 'Mumbai, IN' },
          { status: 'Processing', date: 'July 7, 2025', location: 'Mumbai, IN' },
          { status: 'Shipped', date: 'July 8, 2025', location: 'Delhi, IN' },
        ],
      },
    };
  } else {
    throw new Error('Order not found. Please check your order ID.');
  }
};

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [trackingData, setTrackingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setTrackingData(null);

    try {
      // Replace with your actual API call, e.g., api.get(`/orders/track/${orderId}`)
      const response = await mockTrackOrder(orderId);
      if (response.success) {
        setTrackingData(response.data);
        toast.success('Order tracking information retrieved!');
      }
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg border border-gray-200">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
              <Package className="h-8 w-8 text-primary" />
              <span style={{ fontFamily: "'Dancing Script', cursive" }}>
                Track Your Order
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTrackOrder} className="space-y-6">
              <div>
                <label
                  htmlFor="orderId"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Enter Order ID
                </label>
                <Input
                  id="orderId"
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value.trim())}
                  placeholder="e.g., 123456"
                  className="w-full border-gray-300 focus:border-primary focus:ring-primary"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Tracking...</span>
                  </>
                ) : (
                  <>
                    <Package className="h-5 w-5" />
                    <span>Track Order</span>
                  </>
                )}
              </Button>
            </form>

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md text-center">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {trackingData && (
              <div className="mt-8 space-y-6">
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900">Order Details</h3>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Order ID:</span> {trackingData.orderId}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Status:</span> {trackingData.status}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Estimated Delivery:</span>{' '}
                      {trackingData.estimatedDelivery}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Last Update:</span>{' '}
                      {trackingData.lastUpdate}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900">Tracking History</h3>
                  <ul className="mt-4 space-y-4">
                    {trackingData.trackingDetails.map((detail: any, index: number) => (
                      <li
                        key={index}
                        className="flex items-start gap-4 p-4 bg-white rounded-md border border-gray-200 shadow-sm"
                      >
                        <div className="flex-shrink-0">
                          <div className={cn(
                            'h-3 w-3 rounded-full mt-1',
                            detail.status === 'Order Placed' ? 'bg-blue-500' :
                            detail.status === 'Processing' ? 'bg-yellow-500' :
                            detail.status === 'Shipped' ? 'bg-green-500' : 'bg-gray-500'
                          )}></div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{detail.status}</p>
                          <p className="text-xs text-gray-500">{detail.date}</p>
                          <p className="text-xs text-gray-500">{detail.location}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
      `}</style>
    </div>
  );
}