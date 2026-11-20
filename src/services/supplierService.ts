import { ExternalSupplierProduct } from "../types/thriftApi";

// Fungsi async untuk mengambil data stok pakaian pria dari REST API eksternal
export async function fetchExternalSupplierStock(): Promise<
  ExternalSupplierProduct[]
> {
  try {
    const response = await fetch(
      "https://dummyjson.com/products/category/mens-shirts",
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.products as ExternalSupplierProduct[];
  } catch (error) {
    console.error(
      "Gagal mengambil data dari server supplier eksternal:",
      error,
    );
    return [];
  }
}
