export interface Phone {
  brand: string;
  model: string;
  release_date: string;
  os: string;
  soc_chip: string;
  display_size_in: number;
  display_type: string;
  refresh_rate_hz: string;
  peak_brightness_nits: string;
  main_camera_mp: number;
  telephoto_optical_zoom: string;
  ultrawide_mp: number | string;
  front_camera_mp: number;
  battery_mAh: number;
  wired_charge_W: string;
  wireless_charge_W: string;
  ram_gb: string;
  storage_gb_options: string;
  ip_rating: string;
  weight_g: number;
  dimensions_mm: string;
  biometrics: string;
  sim: string;
  connectivity: string;
  stylus_support: string;
  storage_expandable: string;
  materials: string;
  warranty_months: number;
  sw_update_years: string;
  security_update_years: string;
  msrp_krw: string;
  street_price_krw: string;
  price_asof: string;
  notable_pros: string;
  notable_cons: string;
  availability_regions: string;
}

export interface UserPreferences {
  priorities: string[];
  previousPhone: string;
}

export interface PreferenceOption {
  id: string;
  label: string;
  description: string;
}

export interface Recommendation {
  brand: string;
  model: string;
  recommendationReason: string;
  keyPros: string;
  priceRange: string;
}

export type ChartType = 'brand' | 'yearly' | 'flagship';
