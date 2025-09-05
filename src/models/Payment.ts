export interface Payment {
  _id: string;
  jobId: string;
  bidId: string;
  posterId: string;
  providerId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'disputed';
  paymentMethod: 'stripe' | 'paypal' | 'bank_transfer';
  stripePaymentIntentId?: string;
  stripeChargeId?: string;
  escrowStatus: 'not_created' | 'created' | 'held' | 'released' | 'refunded' | 'disputed';
  escrowReleaseDate?: string;
  disputeReason?: string;
  refundReason?: string;
  metadata: {
    jobTitle: string;
    providerName: string;
    posterName: string;
    serviceType: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface EscrowAccount {
  _id: string;
  userId: string;
  stripeAccountId: string;
  accountStatus: 'pending' | 'active' | 'restricted' | 'rejected';
  capabilities: string[];
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMethod {
  _id: string;
  userId: string;
  stripePaymentMethodId: string;
  type: 'card' | 'bank_account';
  last4: string;
  brand?: string;
  expMonth?: number;
  expYear?: number;
  isDefault: boolean;
  createdAt: string;
}

export interface CreatePaymentRequest {
  jobId: string;
  bidId: string;
  amount: number;
  currency?: string;
  paymentMethodId?: string;
}

export interface CreateEscrowAccountRequest {
  userId: string;
  email: string;
  country: string;
  businessType: 'individual' | 'company';
  firstName?: string;
  lastName?: string;
  companyName?: string;
}

export interface ReleaseEscrowRequest {
  paymentId: string;
  amount: number;
  reason: 'job_completed' | 'milestone_reached' | 'manual_release';
}

export interface RefundPaymentRequest {
  paymentId: string;
  amount: number;
  reason: 'job_cancelled' | 'dispute' | 'quality_issue' | 'other';
  description?: string;
}

export interface DisputePaymentRequest {
  paymentId: string;
  reason: 'quality_issue' | 'non_completion' | 'fraud' | 'other';
  description: string;
  evidence?: string[];
}
