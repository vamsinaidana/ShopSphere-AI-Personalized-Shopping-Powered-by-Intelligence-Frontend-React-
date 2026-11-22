
import RecommendationCard from './RecommendationCard'
import useRecommendations from '../hooks/useRecommendations'

function RecommendationRail({
  products = [],
  title = 'Recommended For You',
  description = '',
  strategy = 'personalized',
  excludeIds = [],
  limit = 8,
}) {
  const {
    recommendations,
    loading,
    error,
  } = useRecommendations({
    products,
    strategy,
    excludeIds,
    limit,
  })

  if (loading) {
    return (
      <section className="py-10">
        <h2 className="mb-5 text-2xl font-bold text-white">
          {title}
        </h2>
        <p className="text-slate-400">
          Finding products for you...
        </p>
      </section>
    )
  }

  if (error || !recommendations.length) {
    return null
  }

  return (
    <section className="py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="mb-1 text-sm font-medium text-orange-400">
            ShopSphere AI
          </p>

          <h2 className="text-2xl font-bold text-white">
            {title}
          </h2>

          {description && (
            <p className="mt-2 text-sm text-slate-400">
              {description}
            </p>
          )}
        </div>

        <span className="text-sm text-slate-400">
          {recommendations.length} products
        </span>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {recommendations.map(product => (
          <RecommendationCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </section>
  )
}

export default RecommendationRail
