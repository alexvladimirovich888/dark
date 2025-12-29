
export interface Token {
  mint: string;
  name: string;
  symbol: string;
  image_uri: string;
  description: string;
  twitter: string | null;
  telegram: string | null;
  website: string | null;
  usd_market_cap: number;
  created_timestamp: number;
  raydium_pool: string | null;
  creator: string;
}

export type ViewState = 'terminal' | 'scan' | 'governance' | 'whitelist';

export interface MarketStats {
  solPrice: number;
  gasPrice: number;
  totalScanned: number;
}
