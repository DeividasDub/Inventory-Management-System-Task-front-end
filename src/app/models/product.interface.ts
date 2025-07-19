export interface Product {
  id: number;
  name: string;
  sku: string;
  quantityInStock: number;
  price: number;
  supplierId: number;
  supplierName: string;
  createdOn: Date;
}

export interface CreateProductRequest {
  name: string;
  sku: string;
  quantityInStock: number;
  price: number;
  supplierId: number;
}

export interface UpdateProductRequest {
  name: string;
  sku: string;
  quantityInStock: number;
  price: number;
  supplierId: number;
}

export interface ProductSearchRequest {
  name?: string;
  sku?: string;
  supplierId?: number | null;
  lowStockOnly?: boolean;
  lowStockThreshold?: number;
}
