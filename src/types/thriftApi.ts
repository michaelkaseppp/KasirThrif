// File: src/types/thriftApi.ts
export interface ExternalSupplierProduct {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
}

export interface PromoVoucher {
  code: string;
  discountPercent: number;
  description: string;
}
