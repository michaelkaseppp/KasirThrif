// File: src/services/promoService.ts
// Author: Mekell
import { PromoVoucher } from "../types/thriftApi";

// Menggunakan Promise, resolve, dan reject (Rubrik Modul 3)
export function fetchDailyPromo(
  isOnline: boolean = true,
): Promise<PromoVoucher> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (isOnline) {
        resolve({
          code: "THRIFT2026",
          discountPercent: 15,
          description: "Diskon 15% Spesial ThriftKasir",
        });
      } else {
        reject("Gagal mengambil data promo server.");
      }
    }, 1200);
  });
}

// Menggunakan .then() (Rubrik Modul 3)
export function getFormattedPromo(): Promise<string> {
  return fetchDailyPromo(true)
    .then((promo) => `🎉 Promo Hari Ini: ${promo.code} (${promo.description})`)
    .catch((err) => "⚠️ Promo belum tersedia.");
}
