export interface ProductImage {
  id: number
  name: string
  url: string
  width: number
  height: number
  alternativeText: string | null
}

export interface Pricing {
  mode: 'none' | 'percentage' | 'fixed'
  basePrice: number
  discountPercent: number | null
  salePrice: number | null
}

export interface Badge {
  id: number
  label: string
}

export interface VariationOption {
  id: number
  value: string
  order: number
  discountPercent: number | null
  image: ProductImage | null
}

export interface VariationGroup {
  id: number
  name: string
  order: number
  options: VariationOption[]
}

export interface Product {
  id: number
  documentId: string
  name: string
  size: string
  description: string | null
  order: number
  image: ProductImage
  pricing: Pricing
  badges: Badge[]
  variationGroups: VariationGroup[]
  categories: Category[]
}

export interface Category {
  id: number
  documentId: string
  name: string
  order: number
}

export interface ProductsResponse {
  data: Product[]
}
