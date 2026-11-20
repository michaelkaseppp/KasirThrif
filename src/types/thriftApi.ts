// Interface untuk data respon dari API supplier eksternal
export interface ExternalSupplierProduct {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
  thumbnail?: string;
}

// Interface untuk promo voucher
export interface PromoVoucher {
  code: string;
  discountPercent: number;
  description: string;
}
