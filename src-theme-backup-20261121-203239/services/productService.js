
const BASE_URL = 'https://dummyjson.com'

export const getProducts = async (limit = 20) => {
  const response = await fetch(`${BASE_URL}/products?limit=${limit}`)

  if (!response.ok) {
    throw new Error('Unable to fetch products')
  }

  return response.json()
}

export const getProductById = async id => {
  const response = await fetch(`${BASE_URL}/products/${id}`)

  if (!response.ok) {
    throw new Error('Unable to fetch product details')
  }

  return response.json()
}

export const getCategories = async () => {
  const response = await fetch(`${BASE_URL}/products/category-list`)

  if (!response.ok) {
    throw new Error('Unable to fetch categories')
  }

  return response.json()
}
