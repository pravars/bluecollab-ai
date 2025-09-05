import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Lock,
  Unlock,
  RefreshCw,
  FileText,
  User,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { Payment } from '../models/Payment';
import { Job, Bid } from '../models/Job';
import stripeService from '../services/StripeService';

interface EscrowManagementProps {
  payment: Payment;
  job: Job;
  bid: Bid;
  onStatusUpdate: (paymentId: string, status: string) => void;
}

export default function EscrowManagement({
  payment,
  job,
  bid,
  onStatusUpdate
}: EscrowManagementProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showReleaseModal, setShowReleaseModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [releaseAmount, setReleaseAmount] = useState(payment.amount);
  const [refundAmount, setRefundAmount] = useState(payment.amount);
  const [releaseReason, setReleaseReason] = useState('job_completed');
  const [refundReason, setRefundReason] = useState('job_cancelled');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'created': return 'bg-blue-100 text-blue-800';
      case 'held': return 'bg-yellow-100 text-yellow-800';
      case 'released': return 'bg-green-100 text-green-800';
      case 'refunded': return 'bg-red-100 text-red-800';
      case 'disputed': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'created': return <Shield className="w-4 h-4" />;
      case 'held': return <Lock className="w-4 h-4" />;
      case 'released': return <Unlock className="w-4 h-4" />;
      case 'refunded': return <RefreshCw className="w-4 h-4" />;
      case 'disputed': return <AlertCircle className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  const handleReleaseEscrow = async () => {
    try {
      setLoading(true);
      setError('');

      await stripeService.releaseEscrow(
        payment._id,
        releaseAmount,
        releaseReason
      );

      onStatusUpdate(payment._id, 'released');
      setShowReleaseModal(false);
    } catch (err: any) {
      setError(err.message || 'Failed to release escrow');
    } finally {
      setLoading(false);
    }
  };

  const handleRefundPayment = async () => {
    try {
      setLoading(true);
      setError('');

      await stripeService.refundPayment(
        payment._id,
        refundAmount,
        refundReason
      );

      onStatusUpdate(payment._id, 'refunded');
      setShowRefundModal(false);
    } catch (err: any) {
      setError(err.message || 'Failed to refund payment');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDispute = async () => {
    try {
      setLoading(true);
      setError('');

      await stripeService.createDispute(
        payment._id,
        'quality_issue',
        'Work quality does not meet expectations',
        []
      );

      onStatusUpdate(payment._id, 'disputed');
    } catch (err: any) {
      setError(err.message || 'Failed to create dispute');
    } finally {
      setLoading(false);
    }
  };

  const canRelease = payment.escrowStatus === 'held' && job.status === 'completed';
  const canRefund = ['created', 'held'].includes(payment.escrowStatus);
  const canDispute = payment.escrowStatus === 'held';

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Escrow Status */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Escrow Status</h3>
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment.escrowStatus)}`}>
            {getStatusIcon(payment.escrowStatus)}
            <span>{payment.escrowStatus.toUpperCase()}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">${payment.amount}</div>
            <div className="text-sm text-gray-500">Escrow Amount</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {payment.escrowReleaseDate ? new Date(payment.escrowReleaseDate).toLocaleDateString() : 'N/A'}
            </div>
            <div className="text-sm text-gray-500">Release Date</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {payment.currency.toUpperCase()}
            </div>
            <div className="text-sm text-gray-500">Currency</div>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Payment ID:</span>
            <span className="text-sm font-mono text-gray-900">{payment._id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Stripe Payment Intent:</span>
            <span className="text-sm font-mono text-gray-900">{payment.stripePaymentIntentId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Payment Method:</span>
            <span className="text-sm text-gray-900 capitalize">{payment.paymentMethod}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Created:</span>
            <span className="text-sm text-gray-900">{new Date(payment.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Job Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Information</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Job Title:</span>
            <span className="text-sm text-gray-900">{job.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Service Provider:</span>
            <span className="text-sm text-gray-900">{bid.bidderInfo?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Service Type:</span>
            <span className="text-sm text-gray-900">{job.serviceType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Job Status:</span>
            <span className="text-sm text-gray-900 capitalize">{job.status.replace('_', ' ')}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Escrow Actions</h3>
        <div className="flex flex-wrap gap-3">
          {canRelease && (
            <button
              onClick={() => setShowReleaseModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Unlock className="w-4 h-4" />
              <span>Release Escrow</span>
            </button>
          )}

          {canRefund && (
            <button
              onClick={() => setShowRefundModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refund Payment</span>
            </button>
          )}

          {canDispute && (
            <button
              onClick={handleCreateDispute}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors"
            >
              <AlertCircle className="w-4 h-4" />
              <span>Create Dispute</span>
            </button>
          )}

          <button
            onClick={() => window.print()}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>

      {/* Release Modal */}
      {showReleaseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Release Escrow</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Release Amount
                </label>
                <input
                  type="number"
                  value={releaseAmount}
                  onChange={(e) => setReleaseAmount(Number(e.target.value))}
                  max={payment.amount}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason
                </label>
                <select
                  value={releaseReason}
                  onChange={(e) => setReleaseReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="job_completed">Job Completed</option>
                  <option value="milestone_reached">Milestone Reached</option>
                  <option value="manual_release">Manual Release</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowReleaseModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReleaseEscrow}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Releasing...' : 'Release'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Refund Modal */}
      {showRefundModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Refund Payment</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Refund Amount
                </label>
                <input
                  type="number"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(Number(e.target.value))}
                  max={payment.amount}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason
                </label>
                <select
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="job_cancelled">Job Cancelled</option>
                  <option value="dispute">Dispute</option>
                  <option value="quality_issue">Quality Issue</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowRefundModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRefundPayment}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? 'Refunding...' : 'Refund'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
