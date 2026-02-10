// ============================================
// DATABASE TYPES - Matching Supabase Schema
// ============================================

export type UnitSystem = 'metric' | 'imperial';
export type FuelUnit = 'liters' | 'gallons';
export type DistanceUnit = 'km' | 'miles';
export type ThemePreference = 'light' | 'dark' | 'system';
export type VehicleType = 'car' | 'motorcycle' | 'scooter' | 'truck' | 'suv' | 'van';
export type FuelType = 'gasoline' | 'diesel' | 'electric' | 'hybrid' | 'plugin_hybrid' | 'cng' | 'lpg';
export type FuelGrade = 'regular' | 'premium' | 'diesel' | 'supreme';
export type TripType = 'city' | 'highway' | 'mixed' | 'unknown';
export type TripCategory = 'business' | 'personal' | 'commute' | 'medical' | 'charity';
export type ServiceCategory = 'routine' | 'repair' | 'upgrade' | 'inspection';
export type ReminderPriority = 'low' | 'medium' | 'high' | 'critical';
export type PriceSource = 'user_reported' | 'api' | 'receipt_ocr';

// ============================================
// PROFILES
// ============================================
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  preferred_units: UnitSystem;
  preferred_currency: string;
  preferred_fuel_unit: FuelUnit;
  preferred_distance_unit: DistanceUnit;
  enable_notifications: boolean;
  enable_location_tracking: boolean;
  theme: ThemePreference;
  total_savings: number;
  eco_score: number;
  achievements: Record<string, unknown>[];
  created_at: string;
  updated_at: string;
}

// ============================================
// VEHICLES
// ============================================
export interface Vehicle {
  id: string;
  user_id: string;
  name: string;
  vehicle_type: VehicleType;
  make: string | null;
  model: string | null;
  year: number | null;
  fuel_type: FuelType;
  engine_size: number | null;
  tank_capacity: number | null;
  color: string | null;
  license_plate: string | null;
  photo_url: string | null;
  is_active: boolean;
  is_sold: boolean;
  initial_odometer: number;
  initial_odometer_unit: DistanceUnit;
  purchase_date: string | null;
  purchase_price: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface VehicleInsert {
  name: string;
  vehicle_type: VehicleType;
  fuel_type: FuelType;
  make?: string;
  model?: string;
  year?: number;
  engine_size?: number;
  tank_capacity?: number;
  color?: string;
  license_plate?: string;
  photo_url?: string;
  initial_odometer?: number;
  initial_odometer_unit?: DistanceUnit;
  purchase_date?: string;
  purchase_price?: number;
  notes?: string;
}

// ============================================
// FUEL LOGS
// ============================================
export interface FuelLog {
  id: string;
  vehicle_id: string;
  user_id: string;
  log_date: string;
  odometer: number;
  odometer_unit: DistanceUnit;
  fuel_amount: number;
  fuel_unit: FuelUnit;
  fuel_grade: FuelGrade | null;
  price_per_unit: number | null;
  total_cost: number | null;
  currency: string;
  is_full_tank: boolean;
  missed_previous_fillup: boolean;
  fuel_station_name: string | null;
  fuel_station_brand: string | null;
  fuel_station_address: string | null;
  latitude: number | null;
  longitude: number | null;
  distance_since_last: number | null;
  fuel_efficiency: number | null;
  cost_per_distance: number | null;
  receipt_url: string | null;
  receipt_ocr_data: Record<string, unknown> | null;
  trip_type: TripType | null;
  weather_conditions: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface FuelLogInsert {
  vehicle_id: string;
  log_date?: string;
  odometer: number;
  odometer_unit?: DistanceUnit;
  fuel_amount: number;
  fuel_unit?: FuelUnit;
  fuel_grade?: FuelGrade;
  price_per_unit?: number;
  total_cost?: number;
  currency?: string;
  is_full_tank?: boolean;
  missed_previous_fillup?: boolean;
  fuel_station_name?: string;
  fuel_station_brand?: string;
  fuel_station_address?: string;
  latitude?: number;
  longitude?: number;
  trip_type?: TripType;
  notes?: string;
}

// ============================================
// MAINTENANCE LOGS
// ============================================
export interface MaintenanceLog {
  id: string;
  vehicle_id: string;
  user_id: string;
  service_type: string;
  service_category: ServiceCategory | null;
  service_date: string;
  odometer: number;
  odometer_unit: DistanceUnit;
  labor_cost: number | null;
  parts_cost: number | null;
  total_cost: number | null;
  currency: string;
  service_provider: string | null;
  service_provider_address: string | null;
  service_provider_phone: string | null;
  technician_name: string | null;
  parts_replaced: { name: string; part_number?: string; quantity: number }[] | null;
  warranty_until: string | null;
  invoice_number: string | null;
  invoice_url: string | null;
  description: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface MaintenanceLogInsert {
  vehicle_id: string;
  service_type: string;
  service_category?: ServiceCategory;
  service_date: string;
  odometer: number;
  odometer_unit?: DistanceUnit;
  labor_cost?: number;
  parts_cost?: number;
  total_cost?: number;
  currency?: string;
  service_provider?: string;
  service_provider_address?: string;
  service_provider_phone?: string;
  technician_name?: string;
  parts_replaced?: { name: string; part_number?: string; quantity: number }[];
  warranty_until?: string;
  invoice_number?: string;
  invoice_url?: string;
  description?: string;
  notes?: string;
}

// ============================================
// SERVICE REMINDERS
// ============================================
export interface ServiceReminder {
  id: string;
  vehicle_id: string;
  user_id: string;
  service_type: string;
  service_name: string;
  interval_distance: number | null;
  interval_distance_unit: DistanceUnit;
  interval_months: number | null;
  last_service_date: string | null;
  last_service_odometer: number | null;
  last_service_odometer_unit: DistanceUnit;
  next_service_date: string | null;
  next_service_odometer: number | null;
  alert_distance_before: number;
  alert_days_before: number;
  is_active: boolean;
  is_completed: boolean;
  priority: ReminderPriority;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================
// TRIPS
// ============================================
export interface Trip {
  id: string;
  vehicle_id: string;
  user_id: string;
  trip_date: string;
  start_time: string | null;
  end_time: string | null;
  start_odometer: number;
  end_odometer: number;
  distance: number;
  distance_unit: DistanceUnit;
  start_location: string | null;
  end_location: string | null;
  route_polyline: string | null;
  trip_type: TripCategory;
  purpose: string | null;
  client_name: string | null;
  is_tax_deductible: boolean;
  reimbursement_rate: number | null;
  reimbursement_amount: number | null;
  receipt_urls: string[] | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface TripInsert {
  vehicle_id: string;
  trip_date: string;
  start_time?: string;
  end_time?: string;
  start_odometer: number;
  end_odometer: number;
  distance_unit?: DistanceUnit;
  start_location?: string;
  end_location?: string;
  trip_type: TripCategory;
  purpose?: string;
  client_name?: string;
  is_tax_deductible?: boolean;
  reimbursement_rate?: number;
  notes?: string;
}

// ============================================
// FUEL STATIONS
// ============================================
export interface FuelStation {
  id: string;
  place_id: string | null;
  name: string;
  brand: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postal_code: string | null;
  latitude: number;
  longitude: number;
  amenities: string[] | null;
  fuel_types: string[] | null;
  current_prices: Record<string, number> | null;
  price_last_updated: string | null;
  average_rating: number | null;
  total_reviews: number;
  is_24_hours: boolean;
  opening_hours: Record<string, string> | null;
  times_visited: number;
  created_at: string;
  updated_at: string;
}

// ============================================
// FUEL PRICE HISTORY
// ============================================
export interface FuelPriceHistory {
  id: string;
  fuel_station_id: string | null;
  user_id: string | null;
  fuel_grade: string;
  price_per_unit: number;
  currency: string;
  source: PriceSource | null;
  recorded_at: string;
}

// ============================================
// DASHBOARD STATS
// ============================================
export interface DashboardStats {
  totalDistance: number;
  totalFuelCost: number;
  avgEfficiency: number;
  totalFillups: number;
  lastFillupDate: string | null;
  costPerDistance: number;
  monthlyCost: number;
  monthlyDistance: number;
}
