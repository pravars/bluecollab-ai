import React, { useState, useEffect } from 'react';
import { 
  X, 
  CreditCard, 
  Shield, 
  Lock, 
  CheckCircle, 
  AlertCircle,
  DollarSign,
  Clock,
  User,
  Mail,
  Phone,
  Building,
  MapPin
} from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Job, Bid } from '../models/Job';
import { Payment } from '../models/Payment';
import stripeService from '../services/StripeService';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_...');

interface PaymentModalProps {
  job: Job;
  bid: Bid;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (payment: Payment) => void;
}

function PaymentForm({ job, bid, onPaymentSuccess, onClose }: Omit<PaymentModalProps, 'isOpen'>) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'saved'>('card');
  const [savedPaymentMethods, setSavedPaymentMethods] = useState<any[]>([]);

  useEffect(() => {
    if (stripe) {
      loadSavedPaymentMethods();
    }
  }, [stripe]);

  const loadSavedPaymentMethods = async () => {
    try {
      // In a real app, this would fetch from your API
      const mockMethods = [
        {
          id: 'pm_1234567890',
          type: 'card',
          card: { brand: 'visa', last4: '4242', exp_month: 12, exp_year: 2025 }
        }
      ];
      setSavedPaymentMethods(mockMethods);
    } catch (err) {
      console.error('Error loading payment methods:', err);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      let paymentMethodId: string;

      if (paymentMethod === 'saved') {
        // Use saved payment method
        const selectedMethod = savedPaymentMethods.find(m => m.id);
        if (!selectedMethod) {
          throw new Error('Please select a saved payment method');
        }
        paymentMethodId = selectedMethod.id;
      } else {
        // Create new payment method
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          throw new Error('Card element not found');
        }

        const { error, paymentMethod: newPaymentMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
        });

        if (error) {
          throw new Error(error.message);
        }

        paymentMethodId = newPaymentMethod!.id;
      }

      // Create payment intent
      const clientSecret = await stripeService.createPaymentIntent(
        bid.amount,
        'usd',
        {
          jobId: job._id,
          bidId: bid._id,
          posterId: job.posterId,
          providerId: bid.bidderId,
          jobTitle: job.title,
          providerName: bid.bidderInfo?.name || 'Service Provider'
        }
      );

      // Confirm payment
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethodId,
      });

      if (confirmError) {
        throw new Error(confirmError.message);
      }

      if (paymentIntent?.status === 'succeeded') {
        // Create payment record
        const payment: Payment = {
          _id: paymentIntent.id,
          jobId: job._id,
          bidId: bid._id,
          posterId: job.posterId,
          providerId: bid.bidderId,
          amount: bid.amount,
          currency: 'usd',
          status: 'completed',
          paymentMethod: 'stripe',
          stripePaymentIntentId: paymentIntent.id,
          stripeChargeId: paymentIntent.latest_charge as string,
          escrowStatus: 'created',
          metadata: {
            jobTitle: job.title,
            providerName: bid.bidderInfo?.name || 'Service Provider',
            posterName: job.posterInfo?.name || 'Job Poster',
            serviceType: job.serviceType
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        onPaymentSuccess(payment);
      }
    } catch (err: any) {
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Method Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Payment Method
        </label>
        <div className="space-y-3">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={(e) => setPaymentMethod(e.target.value as 'card')}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
            />
            <CreditCard className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">New Card</span>
          </label>
          
          {savedPaymentMethods.length > 0 && (
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="saved"
                checked={paymentMethod === 'saved'}
                onChange={(e) => setPaymentMethod(e.target.value as 'saved')}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
              />
              <CreditCard className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Saved Payment Method</span>
            </label>
          )}
        </div>
      </div>

      {/* Card Element */}
      {paymentMethod === 'card' && (
        <div className="border border-gray-300 rounded-lg p-4">
          <CardElement options={cardElementOptions} />
        </div>
      )}

      {/* Saved Payment Methods */}
      {paymentMethod === 'saved' && savedPaymentMethods.length > 0 && (
        <div className="space-y-2">
          {savedPaymentMethods.map((method) => (
            <div key={method.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {method.card.brand.toUpperCase()} •••• {method.card.last4}
                  </p>
                  <p className="text-xs text-gray-500">
                    Expires {method.card.exp_month}/{method.card.exp_year}
                  </p>
                </div>
              </div>
              <input
                type="radio"
                name="savedMethod"
                value={method.id}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
              />
            </div>
          ))}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Payment Summary */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">Payment Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Service:</span>
            <span className="text-sm font-medium">{job.serviceType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Provider:</span>
            <span className="text-sm font-medium">{bid.bidderInfo?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Amount:</span>
            <span className="text-sm font-medium">${bid.amount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Platform Fee (5%):</span>
            <span className="text-sm font-medium">${(bid.amount * 0.05).toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-200 pt-2">
            <div className="flex justify-between">
              <span className="text-base font-semibold text-gray-900">Total:</span>
              <span className="text-base font-semibold text-gray-900">${(bid.amount * 1.05).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Escrow Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-blue-900">Secure Escrow Protection</h4>
            <p className="text-sm text-blue-700 mt-1">
              Your payment is held securely in escrow until the work is completed and you're satisfied. 
              Funds are only released to the service provider after job completion.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              <span>Pay Securely</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default function PaymentModal({
  job,
  bid,
  isOpen,
  onClose,
  onPaymentSuccess
}: PaymentModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Secure Payment</h2>
              <p className="text-purple-100 mt-1">{job.title}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <Elements stripe={stripePromise}>
            <PaymentForm
              job={job}
              bid={bid}
              onPaymentSuccess={onPaymentSuccess}
              onClose={onClose}
            />
          </Elements>
        </div>
      </div>
    </div>
  );
}
