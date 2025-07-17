export interface Supplier {
  id: number;
  name: string;
  contactName: string;
  phone: string;
  email: string;
  address: string;
  createdOn: Date;
}

export interface CreateSupplierRequest {
  name: string;
  contactName: string;
  phone: string;
  email: string;
  address: string;
}

export interface UpdateSupplierRequest {
  name: string;
  contactName: string;
  phone: string;
  email: string;
  address: string;
}
