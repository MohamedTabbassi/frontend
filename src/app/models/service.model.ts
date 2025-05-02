export enum ServiceCategory {
    REMORQUAGE = "REMORQUAGE",
    MECANIQUE = "MECANIQUE",
    PIECE_AUTO = "PIECE_AUTO",
    LOCATION_VOITURE = "LOCATION_VOITURE",
  }
  
  export interface Service {
    _id: string;
    title: string;
    description: string;
    category: ServiceCategory;
    location: string;
    price: number;
    image?: string;
    userId: string;
    available: boolean;
    createdAt?: Date;
  }
  
  // Service subtype interfaces
  export interface Remorquage extends Service {
    vehicleType: string;
    distance: number;
    urgency: string;
  }
  
  export interface PieceAuto extends Service {
    brand: string;
    model: string;
    year: number;
    partNumber: string;
  }
  
  export interface Mecanique extends Service {
    repairType: string;
    estimatedTime: string;
    toolsRequired: string;
  }
  
  export interface LocationVoiture extends Service {
    carBrand: string;
    carModel: string;
    year: number;
    fuelType: string;
    transmission: string;
    rentalDuration: string;
  }