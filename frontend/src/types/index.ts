// ==================== Auth ====================
export interface UserRegisterDto {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
}

export interface UserLoginDto {
  email?: string;
  password?: string;
}

export interface MyBookingDTO {
  id: number;
  carTitle: string;
  status: string;
  totalPrice: number;
}

export interface AuthResponse {
  token: string;
  email: string;
  role: string;
  userId: number;
  isLicenseVerified?: boolean;
  isSuspended: boolean;
  canAddCars: boolean;
  canRentCars: boolean;
}

// ==================== Car ====================
export interface CarCreateUpdateDto {
  title?: string;
  description?: string;
  carType?: string;
  brand?: string;
  model?: string;
  year?: number;
  transmission?: string;
  location?: string;
  rentalPrice?: number;
  availabilityCalendar?: string;
}

export interface PendingLicense {
  id: number;
  name: string;
  email: string;
  driverLicenseUrl: string;
  createdAt: string;
}
export interface CarListingDTO {
  id: number;
  ownerName?: string;
  title?: string;
  description?: string;
  carType?: string;
  brand?: string;
  model?: string;
  year: number;
  transmission?: string;
  location?: string;
  rentalPrice?: number;
  rentalStatus?: string;
  mainImageUrl?: string;
}

// ==================== Booking ====================
export interface BookingDto {
  carId: number;
  startDate: string;
  endDate: string;
}

export interface BookingResponse {
  id: number;
  carId: number;
  renterId: number;
  startDate: string;
  endDate: string;
  status: string;
  car?: CarListingDTO;
}

// For owner's rental requests list
export interface OwnerBookingRequestDTO {
  id: number;
  carTitle: string;
  status: string;
  totalPrice: number;
}

// ==================== Admin ====================
export interface PendingOwner {
  id: number;
  name: string;
  email: string;
  registrationDate: string;
}

// ==================== Weather (unused) ====================
export interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary?: string;
}

export interface UserWithPermissions {
  id: number;
  email: string;
  role: string;
  canAddCars: boolean;
  canRentCars: boolean;
  isSuspended: boolean;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    accountStatus: string;
    isLicenseVerified: boolean;
    isSuspended: boolean;
    canAddCars: boolean;
    canRentCars: boolean;
  };
  expiresIn: number;
}