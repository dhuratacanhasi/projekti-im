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
