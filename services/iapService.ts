/**
 * In-App Purchase Service (SIMULATED)
 * 
 * This service mimics the behavior of a real Capacitor In-App Purchase plugin.
 * In a production app, you would replace this with a real plugin like
 * `@capacitor-community/in-app-purchase` and its native counterparts.
 * 
 * The purpose of this file is to provide the necessary structure and logic
 * so the rest of the app can be built as if IAP is fully integrated.
 */

// This would represent a product fetched from the App Store / Google Play
export interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
}

export interface RestoreResult {
    restored: boolean;
    message: string;
}

export const MOCK_PRODUCT_ID_MONTHLY = 'pro_monthly';
export const MOCK_PRODUCT_ID_ANNUAL = 'pro_annual';
export const MOCK_PRODUCT_ID_LIFETIME = 'pro_lifetime';

const PRO_IDS = [MOCK_PRODUCT_ID_MONTHLY, MOCK_PRODUCT_ID_ANNUAL, MOCK_PRODUCT_ID_LIFETIME];

const MOCK_PRODUCTS: Product[] = [
    { id: MOCK_PRODUCT_ID_MONTHLY, title: 'Biohack Pro Monthly', description: 'Unlock all features.', price: '$4.99' },
    { id: MOCK_PRODUCT_ID_ANNUAL, title: 'Biohack Pro Annual', description: 'Unlock all features and save.', price: '$39.99' },
    { id: MOCK_PRODUCT_ID_LIFETIME, title: 'Biohack Pro Lifetime', description: 'Unlock all features forever.', price: '$129' },
];

// --- Listener for purchase state changes ---
// In a real IAP plugin, this listener would be triggered by the native layer
// when a purchase is successfully validated with the store.
let onPurchaseVerifiedCallback: ((productId: string) => void) | null = null;

const iapService = {
    /**
     * Sets up the IAP listener.
     */
    initialize: (): Promise<void> => {
        console.log('[IAP SIMULATOR] Initializing...');
        // In a real app, this would register listeners with the native IAP plugin.
        // We can simulate a delay.
        return new Promise(resolve => setTimeout(() => {
            console.log('[IAP SIMULATOR] Initialization complete.');
            resolve();
        }, 500));
    },

    /**
     * A listener that the app can use to react to successful purchases.
     */
    onPurchaseVerified: (callback: (productId: string) => void) => {
        onPurchaseVerifiedCallback = callback;
    },

    /**
     * Simulates fetching product details from the store.
     */
    getProducts: (productIds: string[]): Promise<Product[]> => {
        console.log(`[IAP SIMULATOR] Fetching products: ${productIds.join(', ')}`);
        return new Promise(resolve => setTimeout(() => {
            const foundProducts = MOCK_PRODUCTS.filter(p => productIds.includes(p.id));
            resolve(foundProducts);
        }, 800));
    },

    /**
     * Simulates initiating a purchase flow.
     * Returns a promise that resolves to `true` on success and `false` on cancellation.
     */
    purchase: (productId: string): Promise<boolean> => {
        console.log(`[IAP SIMULATOR] Initiating purchase for: ${productId}`);
        // This simulates the user seeing a native payment sheet and confirming.
        // We bypass window.confirm as it can be unreliable in some environments.
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log(`[IAP SIMULATOR] AUTOMATICALLY APPROVED purchase for ${productId}.`);
                resolve(true); // Always resolve as successful
            }, 1500);
        });
    },

    /**
     * Simulates restoring previous purchases.
     */
    restorePurchases: (): Promise<RestoreResult> => {
        console.log('[IAP SIMULATOR] Restoring purchases...');
        return new Promise((resolve) => setTimeout(() => {
            // Check a simulated local flag to see if the user "bought" it before.
            const purchasedId = localStorage.getItem('iap_mock_purchased_id');
            
            if (purchasedId && PRO_IDS.includes(purchasedId) && onPurchaseVerifiedCallback) {
                console.log(`[IAP SIMULATOR] Found previous purchase (${purchasedId}). Triggering verification listener.`);
                onPurchaseVerifiedCallback(purchasedId);
                resolve({ restored: true, message: 'Your previous purchase has been restored!' });
            } else {
                 console.log('[IAP SIMULATOR] No previous purchases found to restore.');
                 resolve({ restored: false, message: 'No previous purchases were found to restore.' });
            }
        }, 2000));
    },

    // This is a helper for our simulation to "remember" a purchase
    _recordPurchase: (productId: string) => {
        if(PRO_IDS.includes(productId)) {
            localStorage.setItem('iap_mock_purchased_id', productId);
        }
    },

    _checkHasPurchase: (): boolean => {
         const purchasedId = localStorage.getItem('iap_mock_purchased_id');
         return !!purchasedId && PRO_IDS.includes(purchasedId);
    }
};

export default iapService;