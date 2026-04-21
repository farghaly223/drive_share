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

export interface AuthResponse {
  token: string;
  email: string;
  role: string;
  userId: number;
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