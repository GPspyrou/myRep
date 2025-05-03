export type House = {
  id: string;
  title: string;
  description: string;
  price: string;
  category: string;
  bedrooms: number;
  bathrooms: number;
  kitchens: string;
  floor: string;
  size: string;
  yearBuilt: string;
  windowType: string;
  energyClass: string;
  hasHeating: string;
  heatingType: string;
  parking: string;
  suitableFor: string;
  specialFeatures: string;
  isFeatured: boolean;
  latitude: number;
  longitude: number;
  rooms:number;
  location: {
    latitude: number;
    longitude: number;
  };
  images: {
    src: string;
    alt: string;
  }[];
  isPublic: boolean;
  allowedUsers: string[];
};