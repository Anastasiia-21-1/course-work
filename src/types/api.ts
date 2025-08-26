export interface User {
  id: string;
  name?: string;
  email: string;
  first_name: string;
  last_name: string;
  image?: string;
  emailVerified?: string;
}

export interface City {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
  icon?: string;
}

export interface Lost {
  id: string;
  title?: string;
  description?: string;
  photo?: string;
  time?: string;
  location?: string;
  user_id?: string;
  city_id?: number;
  category_id?: number;
  user?: User;
  city?: City;
  category?: Category;
}

export interface Find {
  id: string;
  title?: string;
  description?: string;
  photo?: string;
  time?: string;
  location?: string;
  user_id?: string;
  city_id?: number;
  category_id?: number;
  user?: User;
  city?: City;
  category?: Category;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface VerifyPasswordResponse {
  isValid: boolean;
}
