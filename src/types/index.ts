export type Restaurant = {
  id: string;
  name: string;
  name_sq: string | null;
  name_en: string | null;
  description_sq: string | null;
  description_en: string | null;
  image_url: string | null;
  address: string | null;
  city: string | null;
  category: string | null;
  delivery_time: string | null;
  rating: number | null;
  is_active: boolean | null;
  created_at: string | null;
};

export type MenuItem = {
  id: string;
  restaurant_id: string;
  name: string | null;
  name_sq: string | null;
  name_en: string | null;
  description: string | null;
  description_sq: string | null;
  description_en: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  is_available: boolean | null;
  created_at: string | null;
};
