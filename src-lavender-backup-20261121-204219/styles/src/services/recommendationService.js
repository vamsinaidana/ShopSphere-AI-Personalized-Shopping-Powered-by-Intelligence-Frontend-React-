
import mockRecommendationProvider from '../features/recommendations/providers/mockRecommendationProvider'

const recommendationCache = new Map()

const CACHE_DURATION = 60 * 1000

export const getRecommendations = async ({
  products = [],
  signals = {},
  excludeIds = [],
  limit = 8,
  strategy = 'personalized',
  currentProduct = null,
}) => {
  const cacheKey = JSON.stringify({
    productIds: products.map(product => product.id),
    signals,
    excludeIds,
    limit,
    strategy,
    currentProductId: currentProduct?.id || null,
  })

  const cachedResult = recommendationCache.get(cacheKey)

  if (
    cachedResult &&
    Date.now() - cachedResult.timestamp < CACHE_DURATION
  ) {
    return cachedResult.data
  }

  const recommendations =
    await mockRecommendationProvider.getRecommendations({
      products,
      signals,
      excludeIds,
      limit,
      strategy,
      currentProduct,
    })

  recommendationCache.set(cacheKey, {
    data: recommendations,
    timestamp: Date.now(),
  })

  return recommendations
}

export const clearRecommendationCache = () => {
  recommendationCache.clear()
}
