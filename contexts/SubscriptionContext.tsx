import React, { createContext, useCallback, useState, useEffect } from 'react';
import iapService, { RestoreResult, MOCK_PRODUCT_ID_MONTHLY, MOCK_PRODUCT_ID_ANNUAL, MOCK_PRODUCT_ID_LIFETIME } from '../services/iapService';
import { useUserData } from './UserDataContext';

const PRO_IDS = [MOCK_PRODUCT_ID_MONTHLY, MOCK_PRODUCT_ID_ANNUAL, MOCK_PRODUCT_ID_LIFETIME];

interface SubscriptionContextType {
  isInitializing: boolean;
  isSubscribed: boolean;
  purchaseSubscription: (productId: string) => Promise<void>;
  activateFreeSubscription: (productId: string, durationInMonths?: number) => void;
  restoreSubscription: () => Promise<RestoreResult>;
  unsubscribe: () => void;
}

export const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isUserDataLoading, proAccessExpiresAt, setProAccessExpiresAt } = useUserData();
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // This effect handles the one-time IAP service initialization and sets up listeners.
  // It has a minimal dependency array to ensure it only runs once after user data is loaded.
  useEffect(() => {
    if (isUserDataLoading) return; // Wait for user data to be loaded.

    iapService.initialize().then(() => {
      // Listener for real purchases (new or restored).
      // It sets the state that a purchase has occurred, which triggers a re-evaluation.
      iapService.onPurchaseVerified((productId) => {
        if (PRO_IDS.includes(productId)) {
          // A real purchase takes precedence over any trial. Clear the trial expiration.
          // This state change will cause the main status-checking effect to re-run.
          setProAccessExpiresAt(null);
        }
      });

      // After setup, we can mark the provider as initialized.
      // The other effect will now take over managing the `isSubscribed` state.
      setIsInitializing(false);
    });
  }, [isUserDataLoading, setProAccessExpiresAt]); // setProAccessExpiresAt is stable.

  // This is now the single source of truth for the `isSubscribed` state.
  // It runs after initialization and re-runs whenever the underlying data changes.
  useEffect(() => {
    // Don't determine the subscription state until initialization is complete.
    if (isInitializing) return;

    const hasIapPurchase = iapService._checkHasPurchase();
    const isProViaTrial = proAccessExpiresAt ? proAccessExpiresAt > Date.now() : false;

    setIsSubscribed(hasIapPurchase || isProViaTrial);
  }, [isInitializing, proAccessExpiresAt]); // Re-runs when trial date changes or initialization finishes.

  const grantProAccess = useCallback((productId: string) => {
    iapService._recordPurchase(productId);
    // A real purchase overrides any trial period.
    setProAccessExpiresAt(null);
  }, [setProAccessExpiresAt]);

  const purchaseSubscription = useCallback(async (productId: string) => {
    try {
      const success = await iapService.purchase(productId);
      if (success) {
        grantProAccess(productId);
      } else {
        throw { isCancellation: true, message: 'Purchase cancelled by user.' };
      }
    } catch (error) {
        if (error && (error as any).isCancellation) throw error;
        console.error('Purchase failed unexpectedly:', error);
        throw error;
    }
  }, [grantProAccess]);

  const activateFreeSubscription = useCallback((productId: string, durationInMonths?: number) => {
      if (durationInMonths && durationInMonths > 0) {
        const expirationDate = new Date();
        expirationDate.setMonth(expirationDate.getMonth() + durationInMonths);
        setProAccessExpiresAt(expirationDate.getTime());
      } else {
        // This handles lifetime promos (e.g., 100% off lifetime plan)
        grantProAccess(productId);
      }
  }, [grantProAccess, setProAccessExpiresAt]);

  const restoreSubscription = useCallback(async (): Promise<RestoreResult> => {
    try {
      const result = await iapService.restorePurchases();
      // The onPurchaseVerified listener will handle state updates.
      return result;
    } catch (error) {
      console.error('Restore failed unexpectedly:', error);
      throw error;
    }
  }, []);
  
  const unsubscribe = useCallback(() => {
    localStorage.removeItem('iap_mock_purchased_id');
    setProAccessExpiresAt(null);
    // The useEffect listening to `proAccessExpiresAt` will handle setting isSubscribed to false.
  }, [setProAccessExpiresAt]);

  return (
    <SubscriptionContext.Provider value={{ isInitializing, isSubscribed, purchaseSubscription, activateFreeSubscription, restoreSubscription, unsubscribe }}>
      {children}
    </SubscriptionContext.Provider>
  );
};
