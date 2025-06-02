export interface OptionItem {
  id: string;
  title: string;
  price?: number;
  pricePerM2?: number;
  description?: string;
  images?: string[];
}

export interface OptionList {
  id: string;
  options: OptionItem[];
}
