import { create } from 'zustand';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'AUD' | 'CAD' | 'NPR';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rateAgainstUSD: number;
  label: string;
  flag: string;
}

export const SUPPORTED_CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: {
    code: 'USD',
    symbol: '$',
    rateAgainstUSD: 1.0,
    label: 'USD ($)',
    flag: '🇺🇸',
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    rateAgainstUSD: 0.92,
    label: 'EUR (€)',
    flag: '🇪🇺',
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    rateAgainstUSD: 0.79,
    label: 'GBP (£)',
    flag: '🇬🇧',
  },
  AUD: {
    code: 'AUD',
    symbol: 'A$',
    rateAgainstUSD: 1.52,
    label: 'AUD (A$)',
    flag: '🇦🇺',
  },
  CAD: {
    code: 'CAD',
    symbol: 'C$',
    rateAgainstUSD: 1.38,
    label: 'CAD (C$)',
    flag: '🇨🇦',
  },
  NPR: {
    code: 'NPR',
    symbol: 'रू ',
    rateAgainstUSD: 134.5,
    label: 'NPR (रू)',
    flag: '🇳🇵',
  },
};

interface CurrencyStore {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  convertPrice: (usdAmount: number) => number;
  formatPrice: (usdAmount: number, includeDecimals?: boolean) => string;
}

const STORAGE_KEY = 'into_nepal_preferred_currency';

export const useCurrencyStore = create<CurrencyStore>((set, get) => {
  const saved = (typeof window !== 'undefined'
    ? localStorage.getItem(STORAGE_KEY)
    : 'USD') as CurrencyCode;
  const initialCurrency = SUPPORTED_CURRENCIES[saved] ? saved : 'USD';

  return {
    currency: initialCurrency,
    setCurrency: (code: CurrencyCode) => {
      if (SUPPORTED_CURRENCIES[code]) {
        try {
          localStorage.setItem(STORAGE_KEY, code);
        } catch (e) {
          // ignore storage error
        }
        set({ currency: code });
      }
    },
    convertPrice: (usdAmount: number) => {
      const cfg = SUPPORTED_CURRENCIES[get().currency] || SUPPORTED_CURRENCIES.USD;
      return usdAmount * cfg.rateAgainstUSD;
    },
    formatPrice: (usdAmount: number, includeDecimals?: boolean) => {
      const cfg = SUPPORTED_CURRENCIES[get().currency] || SUPPORTED_CURRENCIES.USD;
      const converted = usdAmount * cfg.rateAgainstUSD;

      if (cfg.code === 'NPR') {
        return `${cfg.symbol}${Math.round(converted).toLocaleString('en-IN')}`;
      }

      if (includeDecimals ?? (converted % 1 !== 0)) {
        return `${cfg.symbol}${converted.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
      }

      return `${cfg.symbol}${Math.round(converted).toLocaleString('en-US')}`;
    },
  };
});
