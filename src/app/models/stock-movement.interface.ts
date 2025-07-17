export enum StockMovementType {
  IN = 'IN',
  OUT = 'OUT'
}

export interface StockMovement {
  id: number;
  productId: number;
  productName: string;
  productSKU: string;
  type: StockMovementType;
  quantity: number;
  reason: string;
  date: Date;
  createdByUserId: number;
  createdByUserName: string;
}

export interface CreateStockMovementRequest {
  productId: number;
  type: StockMovementType;
  quantity: number;
  reason: string;
}
