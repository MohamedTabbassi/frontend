export enum BookingStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
    CANCELLED = 'CANCELLED',
    COMPLETED = 'COMPLETED'
  }
  
  export interface Booking {
    _id: string;
    serviceId: any;
    clientId: any;
    bookingDate: string;
    status: BookingStatus;
    notes?: string;
    createdAt: string;
    updatedAt: string;
  }