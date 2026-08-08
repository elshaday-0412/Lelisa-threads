import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { PaymentService } from '../services/api.js';
import { FirestoreOrderService } from '../services/firebaseService.js';
import { useApp } from '../context/AppContext.js';
import { Order, PaymentReceipt } from '../types/index.js';
import { CheckCircle2, XCircle, Loader2, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';

export const CheckoutCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const txRef = searchParams.get('tx_ref') || searchParams.get('trx_ref') || searchParams.get('reference');
  const { formatPrice, clearCart, showToast } = useApp();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [receipt, setReceipt] = useState<PaymentReceipt | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function verifyPayment() {
      if (!txRef) {
        if (isMounted) {
          setLoading(false);
          setErrorMsg('Missing transaction reference in callback parameters.');
        }
        return;
      }

      try {
        const res = await PaymentService.verifyChapaTransaction(txRef);
        
        if (!isMounted) return;

        if (res.success && res.verified) {
          setVerified(true);
          if (res.order) setOrder(res.order);
          if (res.receipt) setReceipt(res.receipt);
          
          // Clear cart on successful payment
          clearCart();
          showToast('Payment Verified!', 'Your order has been paid in full via Chapa.', 'success');

          // Ensure Firestore is updated
          if (res.order) {
            await FirestoreOrderService.updateOrderPayment(res.order.id, {
              isPaid: true,
              paymentStatus: 'paid',
              status: 'PROCESSING',
              paymentTimestamp: new Date().toISOString(),
              transactionRef: txRef
            });
          }
        } else {
          setVerified(false);
          setErrorMsg(res.message || 'Payment verification returned incomplete or pending status.');
        }
      } catch (err: any) {
        if (!isMounted) return;
        console.error('Chapa Callback Verification Error:', err);
        setVerified(false);
        setErrorMsg(err.response?.data?.message || err.message || 'Unable to verify payment with Chapa Gateway.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    verifyPayment();

    return () => {
      isMounted = false;
    };
  }, [txRef]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FCFBFA] flex flex-col items-center justify-center px-6 py-20 text-center">
        <Loader2 className="w-12 h-12 text-[#C5A059] animate-spin mb-4" />
        <h2 className="text-2xl font-serif text-[#1A1A1A] mb-2">Verifying Your Payment</h2>
        <p className="text-xs text-gray-500 max-w-md">
          Please wait a moment while we confirm your transaction with Chapa Financial Technologies...
        </p>
      </div>
    );
  }

  if (verified) {
    return (
      <div className="min-h-screen bg-[#FCFBFA] py-16 px-6 md:px-16">
        <div className="max-w-2xl mx-auto bg-white p-8 md:p-12 border border-[#E5E1DA] rounded-sm shadow-xl text-center">
          <div className="w-16 h-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs uppercase tracking-[0.2em] text-[#C5A059] font-bold">
            Chapa Payment Verified
          </span>
          <h1 className="text-3xl md:text-4xl font-serif font-light text-[#1A1A1A] mt-2 mb-3">
            Payment Completed!
          </h1>
          <p className="text-xs md:text-sm text-gray-600 font-light mb-8 max-w-lg mx-auto">
            Your transaction was successfully authorized. Order <strong className="text-black">{order?.orderNumber || 'HT-ONLINE'}</strong> is now being prepared.
          </p>

          <div className="bg-[#FCFBFA] border-2 border-[#C5A059]/40 rounded-sm p-6 mb-8 text-left space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-[#E5E1DA]">
              <span className="text-xs font-bold text-[#1A1A1A] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                Chapa Official Receipt
              </span>
              <span className="text-[10px] uppercase font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-sm">
                Paid in Full
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div>
                <span className="block text-[10px] uppercase text-gray-400 font-semibold">Transaction Ref</span>
                <span className="font-mono text-black font-medium">{txRef}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase text-gray-400 font-semibold">Gateway</span>
                <span className="text-black font-medium">Chapa Hosted Checkout</span>
              </div>
              {order && (
                <>
                  <div>
                    <span className="block text-[10px] uppercase text-gray-400 font-semibold">Order Number</span>
                    <span className="font-serif text-black font-bold">{order.orderNumber}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase text-gray-400 font-semibold">Amount Paid</span>
                    <span className="font-serif text-[#C5A059] font-bold">{formatPrice(order.totalAmount)}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/dashboard"
              className="px-6 py-3.5 bg-[#1A1A1A] hover:bg-[#C5A059] text-white text-xs uppercase tracking-widest font-bold rounded-sm transition-colors flex items-center justify-center gap-2"
            >
              View Orders in Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/shop"
              className="px-6 py-3.5 bg-white border border-[#E5E1DA] hover:border-black text-[#1A1A1A] text-xs uppercase tracking-widest font-bold rounded-sm transition-colors flex items-center justify-center gap-2"
            >
              Continue Shopping <ShoppingBag className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFBFA] py-16 px-6 md:px-16">
      <div className="max-w-2xl mx-auto bg-white p-8 md:p-12 border border-[#E5E1DA] rounded-sm shadow-xl text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10" />
        </div>

        <span className="text-xs uppercase tracking-[0.2em] text-red-600 font-bold">
          Verification Unsuccessful
        </span>
        <h1 className="text-3xl font-serif font-light text-[#1A1A1A] mt-2 mb-3">
          Payment Could Not Be Confirmed
        </h1>
        <p className="text-xs md:text-sm text-gray-600 font-light mb-8 max-w-lg mx-auto">
          {errorMsg || 'Chapa did not confirm payment completion. If you were debited, please contact support with your transaction reference.'}
        </p>

        {txRef && (
          <div className="bg-red-50/50 border border-red-200 rounded-sm p-4 mb-8 text-xs text-red-800 font-mono">
            Transaction Reference: {txRef}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/checkout"
            className="px-6 py-3.5 bg-[#1A1A1A] hover:bg-[#C5A059] text-white text-xs uppercase tracking-widest font-bold rounded-sm transition-colors"
          >
            Return to Bag & Checkout
          </Link>
          <Link
            to="/shop"
            className="px-6 py-3.5 bg-white border border-[#E5E1DA] text-[#1A1A1A] text-xs uppercase tracking-widest font-bold rounded-sm transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};
