import { loadStripe, Stripe } from '@stripe/stripe-js';

// Initialize Stripe
let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_...');
  }
  return stripePromise;
};

export class StripeService {
  private static instance: StripeService;
  private stripe: Stripe | null = null;

  private constructor() {}

  public static getInstance(): StripeService {
    if (!StripeService.instance) {
      StripeService.instance = new StripeService();
    }
    return StripeService.instance;
  }

  public async initialize(): Promise<void> {
    this.stripe = await getStripe();
  }

  public async createPaymentIntent(amount: number, currency: string = 'usd', metadata: any = {}): Promise<any> {
    if (!this.stripe) {
      throw new Error('Stripe not initialized');
    }

    try {
      const response = await fetch('/api/payments/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents
          currency,
          metadata
        }),
      });

      const { clientSecret } = await response.json();
      return clientSecret;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  public async confirmPayment(clientSecret: string, paymentMethodId: string): Promise<any> {
    if (!this.stripe) {
      throw new Error('Stripe not initialized');
    }

    try {
      const { error, paymentIntent } = await this.stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethodId,
      });

      if (error) {
        throw new Error(error.message);
      }

      return paymentIntent;
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw error;
    }
  }

  public async createSetupIntent(customerId: string): Promise<string> {
    if (!this.stripe) {
      throw new Error('Stripe not initialized');
    }

    try {
      const response = await fetch('/api/payments/create-setup-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId }),
      });

      const { clientSecret } = await response.json();
      return clientSecret;
    } catch (error) {
      console.error('Error creating setup intent:', error);
      throw error;
    }
  }

  public async attachPaymentMethod(paymentMethodId: string, customerId: string): Promise<any> {
    if (!this.stripe) {
      throw new Error('Stripe not initialized');
    }

    try {
      const response = await fetch('/api/payments/attach-payment-method', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentMethodId, customerId }),
      });

      return await response.json();
    } catch (error) {
      console.error('Error attaching payment method:', error);
      throw error;
    }
  }

  public async createCustomer(email: string, name: string, metadata: any = {}): Promise<any> {
    try {
      const response = await fetch('/api/payments/create-customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name,
          metadata
        }),
      });

      return await response.json();
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  }

  public async getPaymentMethods(customerId: string): Promise<any[]> {
    try {
      const response = await fetch(`/api/payments/payment-methods/${customerId}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      throw error;
    }
  }

  public async createEscrowAccount(userData: any): Promise<any> {
    try {
      const response = await fetch('/api/payments/create-escrow-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      return await response.json();
    } catch (error) {
      console.error('Error creating escrow account:', error);
      throw error;
    }
  }

  public async releaseEscrow(paymentId: string, amount: number, reason: string): Promise<any> {
    try {
      const response = await fetch('/api/payments/release-escrow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId,
          amount,
          reason
        }),
      });

      return await response.json();
    } catch (error) {
      console.error('Error releasing escrow:', error);
      throw error;
    }
  }

  public async refundPayment(paymentId: string, amount: number, reason: string): Promise<any> {
    try {
      const response = await fetch('/api/payments/refund-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId,
          amount,
          reason
        }),
      });

      return await response.json();
    } catch (error) {
      console.error('Error refunding payment:', error);
      throw error;
    }
  }

  public async createDispute(paymentId: string, reason: string, description: string, evidence: string[] = []): Promise<any> {
    try {
      const response = await fetch('/api/payments/create-dispute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId,
          reason,
          description,
          evidence
        }),
      });

      return await response.json();
    } catch (error) {
      console.error('Error creating dispute:', error);
      throw error;
    }
  }

  public async getPaymentStatus(paymentId: string): Promise<any> {
    try {
      const response = await fetch(`/api/payments/status/${paymentId}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching payment status:', error);
      throw error;
    }
  }
}

export default StripeService.getInstance();
