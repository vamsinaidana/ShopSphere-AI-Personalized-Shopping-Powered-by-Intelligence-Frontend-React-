
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { getRecommendations } from '../../../services/recommendationService'

const readStorage = key => {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]')
  } catch {
    return []
  }
}

const useRecommendations = ({
  products = [],
  excludeIds = [],
  limit = 8,
  strategy = 'personalized',
} = {}) => {
  const cartItems = useSelector(state => state.cart.items)
  const wishlistItems = useSelector(state => state.wishlist.items)

  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const signals = useMemo(() => ({
    recentlyViewed: readStorage('shopsphere_recently_viewed'),
    wishlist: wishlistItems,
    cart: cartItems,
    orders: readStorage('shopsphere_orders'),
    searchHistory: readStorage('shopsphere_search_history'),
  }), [cartItems, wishlistItems])

  const fetchRecommendations = useCallback(async () => {
    if (!products.length) {
      setRecommendations([])
      return
    }

    try {
      setLoading(true)
      setError(null)

      const result = await getRecommendations({
        products,
        signals,
        excludeIds,
        limit,
        strategy,
      })

      setRecommendations(result)
    } catch (err) {
      setError(err.message || 'Unable to load recommendations')
    } finally {
      setLoading(false)
    }
  }, [products, signals, excludeIds, limit, strategy])

  useEffect(() => {
    fetchRecommendations()
  }, [fetchRecommendations])

  return {
    recommendations,
    loading,
    error,
    signals,
    refreshRecommendations: fetchRecommendations,
  }
}

export default useRecommendations
