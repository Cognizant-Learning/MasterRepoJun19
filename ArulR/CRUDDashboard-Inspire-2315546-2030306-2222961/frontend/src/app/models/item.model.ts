export interface Item {
  id?: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
