export interface DynamicField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select';
  placeholder?: string;
  options?: string[];
}

export const CATEGORY_FIELDS: Record<string, DynamicField[]> = {
  "Clothing": [
    { name: "size", label: "Size", type: "select", options: ["S", "M", "L", "XL", "XXL"] },
    { name: "color", label: "Color", type: "text", placeholder: "e.g. Midnight Blue" },
    { name: "material", label: "Material", type: "text", placeholder: "e.g. 100% Cotton" }
  ],
  "Electronics": [
    { name: "brand", label: "Brand", type: "text", placeholder: "e.g. Samsung" },
    { name: "model", label: "Model Number", type: "text", placeholder: "e.g. UN65RU7100" },
    { name: "warranty", label: "Warranty Period", type: "text", placeholder: "e.g. 12 Months" }
  ],
  "Grocery": [
    { name: "weight", label: "Weight/Volume", type: "text", placeholder: "e.g. 1kg or 500ml" },
    { name: "expiryDate", label: "Expiry Date", type: "text", placeholder: "DD/MM/YYYY" }
  ],
  "Home & Kitchen": [
    { name: "dimensions", label: "Dimensions", type: "text", placeholder: "e.g. 10x10x10 cm" },
    { name: "color", label: "Color/Pattern", type: "text", placeholder: "e.g. Oak Wood" }
  ]
};
