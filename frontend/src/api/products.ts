import type { ProductsResponse } from '../types/product'

const API_URL = 'http://localhost:1337'

export async function getProducts(): Promise<ProductsResponse> {
  const response = await fetch(
    `${API_URL}/api/products?populate[image]=true&populate[pricing]=true&populate[badges]=true&populate[variationGroups][populate][options][populate][image]=true&sort=order:asc`
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status}`)
  }

  return response.json()
}