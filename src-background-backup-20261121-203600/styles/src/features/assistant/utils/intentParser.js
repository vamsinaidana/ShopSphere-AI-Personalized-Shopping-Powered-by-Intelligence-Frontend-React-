
const CATEGORY_KEYWORDS = {
  smartphones: ['smartphone', 'smartphones', 'mobile', 'mobiles', 'phone', 'phones'],
  laptops: ['laptop', 'laptops', 'notebook'],
  tablets: ['tablet', 'tablets', 'ipad'],
  fragrances: ['fragrance', 'fragrances', 'perfume', 'perfumes'],
  skincare: ['skincare', 'skin care', 'face cream'],
  furniture: ['furniture', 'sofa', 'chair', 'table'],
  groceries: ['grocery', 'groceries', 'food'],
  'home-decoration': ['home decor', 'decoration', 'decor'],
  'mens-shirts': ['men shirts', 'mens shirts', 'shirts for men'],
  'womens-dresses': ['women dresses', 'womens dresses', 'dresses'],
  'womens-bags': ['women bags', 'handbags', 'womens bags'],
  'mens-shoes': ['men shoes', 'mens shoes', 'shoes for men'],
}

const extractCategory = text => {
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return category
    }
  }
  return null
}

const extractMaxPrice = text => {
  const match = text.match(
    /(?:under|below|less than|within|max(?:imum)?|budget of)\s*[$₹]?\s*(\d+(?:,\d{3})*(?:\.\d+)?)/i
  )

  if (!match) return null

  return Number(match[1].replace(/,/g, ''))
}

const extractMinRating = text => {
  if (/excellent|top rated|best rated|highly rated/i.test(text)) {
    return 4
  }

  const match = text.match(
    /(?:rating|rated)\s*(?:above|over|at least)?\s*(\d(?:\.\d+)?)/i
  )

  return match ? Number(match[1]) : null
}

const extractColor = text => {
  const colors = [
    'black', 'white', 'red', 'blue', 'green',
    'yellow', 'pink', 'orange', 'brown', 'gray',
    'grey', 'orange',
  ]

  return colors.find(color =>
    new RegExp(`\\b${color}\\b`, 'i').test(text)
  ) || null
}

const extractSortBy = text => {
  if (/cheaper|cheapest|lowest price|low price|less expensive/i.test(text)) {
    return 'price-asc'
  }

  if (/expensive|costliest|highest price|high price/i.test(text)) {
    return 'price-desc'
  }

  if (/best rated|top rated|highest rated|better rated/i.test(text)) {
    return 'rating-desc'
  }

  if (/lowest rated|worst rated/i.test(text)) {
    return 'rating-asc'
  }

  return null
}

export const parseShoppingIntent = input => {
  const text = input.toLowerCase().trim()

  return {
    category: extractCategory(text),
    maxPrice: extractMaxPrice(text),
    minRating: extractMinRating(text),
    color: extractColor(text),
    sortBy: extractSortBy(text),
    originalQuery: input,
  }
}
