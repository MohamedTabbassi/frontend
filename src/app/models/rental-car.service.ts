export interface RentalCar {
  _id: string;
  make: string;
  model: string;
  year: number;
  category: string;
  price: number;
  priceUnit: string; // 'day', 'week', 'month'
  images: string[];
  features: string[];
  transmission: 'manual' | 'automatic';
  fuelType: string;
  seats: number;
  available: boolean;
  location: string;
  description: string;
  rating?: number;
  reviewCount?: number;
}

export interface RentalCarFilter {
  category?: string;
  priceMin?: number;
  priceMax?: number;
  transmission?: string;
  seats?: number;
  available?: boolean;
  location?: string;
  search?: string;
}