import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useSubscription } from '../context/SubscriptionContext';
import { useAuth } from '../context/AuthContext';
import { Check, X, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import './Pricing.css';

const Pricing: React.FC = () => {
  const { plans, getCouponByCode } = useAdmin();
  const { currentPlan, upgradePlan, applyCoupon } = useSubscription();
  const { user } = useAuth();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupons, setAppliedCoupons] = useState<Record<string, any>>({});
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);

  const activePlans = plans.filter(plan => plan.isActive && plan.billingPeriod === billingPeriod);

  const handleApplyCoupon = async (planId: string) => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    try {
      const result = await applyCoupon(couponCode, planId);
      if (result) {
        setAppliedCoupons(prev => ({
          ...prev,
          [planId]: result
        }));
        setCouponCode('');
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
    }
  };

  const handleUpgrade = async (planId: string) => {
    if (!user) {
      toast.error('Please sign in to upgrade your plan');
      return;
    }

    setProcessingPlan(planId);
    try {
      const appliedCoupon = appliedCoupons[planId];
      await upgradePlan(planId, appliedCoupon?.coupon?.id);
      
      // Clear applied coupon after successful upgrade
      setAppliedCoupons(prev => {
        const updated = { ...prev };
        delete updated[planId];
        return updated;
      });
    } catch (error) {
      console.error('Error upgrading plan:', error);
    } finally {
      setProcessingPlan(null);
    }
  };

  const getDisplayPrice = (plan: any) => {
    const appliedCoupon = appliedCoupons[plan.id];
    if (appliedCoupon) {
      return appliedCoupon.discountedPrice;
    }
    return plan.price;
  };

  const getOriginalPrice = (plan: any) => {
    const appliedCoupon = appliedCoupons[plan.id];
    if (appliedCoupon) {
      return plan.price;
    }
    return null;
  };

  const isCurrentPlan = (planId: string) => {
    return currentPlan?.id === planId;
  };

  return (
    <div className="pricing-page">
      <div className="pricing-header">
        <h1 className="pricing-title">Choose Your Plan</h1>
        <p className="pricing-subtitle">
          Select the perfect plan for your creative journey
        </p>
        
        <div className="billing-toggle">
          <button
            className={`billing-button ${billingPeriod === 'monthly' ? 'active' : ''}`}
            onClick={() => setBillingPeriod('monthly')}
          >
            Monthly
          </button>
          <button
            className={`billing-button ${billingPeriod === 'yearly' ? 'active' : ''}`}
            onClick={() => setBillingPeriod('yearly')}
          >
            Yearly
            <span className="savings-badge">Save 20%</span>
          </button>
        </div>
      </div>

      <div className="pricing-grid">
        {activePlans.map(plan => {
          const displayPrice = getDisplayPrice(plan);
          const originalPrice = getOriginalPrice(plan);
          const appliedCoupon = appliedCoupons[plan.id];
          
          return (
            <div key={plan.id} className={`pricing-card ${plan.name === 'Pro' ? 'featured' : ''}`}>
              {plan.name === 'Pro' && (
                <div className="featured-badge">
                  <Zap size={16} />
                  Most Popular
                </div>
              )}
              
              <div className="plan-header">
                <h3 className="plan-name">{plan.name}</h3>
                <p className="plan-description">{plan.description}</p>
              </div>

              <div className="plan-pricing">
                <div className="price-display">
                  {originalPrice && (
                    <span className="original-price">${originalPrice}</span>
                  )}
                  <span className="current-price">${displayPrice}</span>
                  <span className="price-period">/{plan.billingPeriod}</span>
                </div>
                
                {appliedCoupon && (
                  <div className="coupon-applied">
                    <span className="coupon-text">
                      Coupon "{appliedCoupon.coupon.code}" applied! 
                      {appliedCoupon.coupon.discountPercentage}% off
                    </span>
                  </div>
                )}
              </div>

              <div className="plan-features">
                <div className="feature-item">
                  <Check size={16} className="feature-icon" />
                  <span>
                    {plan.features.maxPublishedItems === -1 
                      ? 'Unlimited' 
                      : plan.features.maxPublishedItems} Published Items
                  </span>
                </div>
                
                <div className="feature-item">
                  {plan.features.portfolioEnabled ? (
                    <Check size={16} className="feature-icon enabled" />
                  ) : (
                    <X size={16} className="feature-icon disabled" />
                  )}
                  <span>Portfolio Management</span>
                </div>
                
                <div className="feature-item">
                  {plan.features.todoboardEnabled ? (
                    <Check size={16} className="feature-icon enabled" />
                  ) : (
                    <X size={16} className="feature-icon disabled" />
                  )}
                  <span>Todo Board</span>
                </div>
                
                <div className="feature-item">
                  {plan.features.faceswapEnabled ? (
                    <Check size={16} className="feature-icon enabled" />
                  ) : (
                    <X size={16} className="feature-icon disabled" />
                  )}
                  <span>AI Faceswap</span>
                </div>
                
                <div className="feature-item">
                  {plan.features.customDomain ? (
                    <Check size={16} className="feature-icon enabled" />
                  ) : (
                    <X size={16} className="feature-icon disabled" />
                  )}
                  <span>Custom Domain</span>
                </div>
                
                <div className="feature-item">
                  {plan.features.prioritySupport ? (
                    <Check size={16} className="feature-icon enabled" />
                  ) : (
                    <X size={16} className="feature-icon disabled" />
                  )}
                  <span>Priority Support</span>
                </div>
              </div>

              {!appliedCoupons[plan.id] && (
                <div className="coupon-section">
                  <div className="coupon-input-group">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="coupon-input"
                    />
                    <button
                      className="apply-coupon-button"
                      onClick={() => handleApplyCoupon(plan.id)}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}

              <div className="plan-action">
                {user ? (
                  isCurrentPlan(plan.id) ? (
                    <button className="plan-button current\" disabled>
                      Current Plan
                    </button>
                  ) : (
                    <button
                      className={`plan-button ${plan.name === 'Pro' ? 'primary' : 'secondary'}`}
                      onClick={() => handleUpgrade(plan.id)}
                      disabled={processingPlan === plan.id}
                    >
                      {processingPlan === plan.id ? 'Processing...' : 
                       displayPrice === 0 ? 'Get Started Free' : 'Upgrade Now'}
                    </button>
                  )
                ) : (
                  <Link to="/auth/signup" className={`plan-button ${plan.name === 'Pro' ? 'primary' : 'secondary'}`}>
                    Get Started
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="pricing-faq">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h3>Can I change my plan anytime?</h3>
            <p>Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.</p>
          </div>
          <div className="faq-item">
            <h3>What payment methods do you accept?</h3>
            <p>We accept all major credit cards, PayPal, and various local payment methods through Stripe and Razorpay.</p>
          </div>
          <div className="faq-item">
            <h3>Is there a free trial?</h3>
            <p>Yes! Our Free plan gives you access to core features with no time limit. Upgrade when you're ready for more.</p>
          </div>
          <div className="faq-item">
            <h3>How do coupons work?</h3>
            <p>Enter a valid coupon code during checkout to receive a discount on your subscription. Some coupons may have usage limits or expiry dates.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;