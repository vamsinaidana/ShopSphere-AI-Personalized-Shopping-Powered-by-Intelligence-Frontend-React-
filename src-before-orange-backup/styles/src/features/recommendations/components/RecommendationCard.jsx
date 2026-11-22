
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { addToCart } from '../../../store/slices/cartSlice'
import { toggleWishlist } from '../../../store/slices/wishlistSlice'

function RecommendationCard({ product }) {
  const dispatch = useDispatch()

  const wishlistItems = useSelector(
    state => state.wishlist.items
  )

  const isWishlisted = wishlistItems.some(
    item => item.id === product.id
  )

  const handleAddToCart = () => {
    dispatch(addToCart(product))
  }

  const handleWishlist = () => {
    dispatch(toggleWishlist(product))
  }

  return (
    <article className="group overflow-hidden rounded-2xl border border-white/10 bg-slate-900 transition duration-300 hover:-translate-y-1 hover:border-violet-500/50">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-slate-800">
        <Link to={`/products/${product.id}`}>
          <img
            src={product.thumbnail || product.images?.[0]}
            alt={product.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
            loading="lazy"
          />
        </Link>

        <button
          type="button"
          onClick={handleWishlist}
          aria-label={
            isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'
          }
          className="absolute right-3 top-3 rounded-full bg-slate-950/80 p-2 text-white transition hover:bg-violet-600"
        >
          <Heart
            size={18}
            fill={isWishlisted ? 'currentColor' : 'none'}
            className={isWishlisted ? 'text-pink-400' : ''}
          />
        </button>

        {product.discountPercentage > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-violet-600 px-3 py-1 text-xs font-semibold text-white">
            {Math.round(product.discountPercentage)}% OFF
          </span>
        )}
      </div>

      {/* Product Information */}
      <div className="p-4">
        <p className="mb-2 text-xs capitalize text-violet-400">
          {product.category}
        </p>

        <Link to={`/products/${product.id}`}>
          <h3 className="mb-2 line-clamp-1 font-semibold text-white transition hover:text-violet-400">
            {product.title}
          </h3>
        </Link>

        <div className="mb-3 flex items-center gap-1 text-sm text-yellow-400">
          <Star size={15} fill="currentColor" />
          <span>{Number(product.rating || 0).toFixed(1)}</span>
          <span className="text-slate-500">/ 5</span>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <span className="text-lg font-bold text-white">
            ${Number(product.price || 0).toFixed(2)}
          </span>

          <span className="text-xs text-slate-400">
            {product.availabilityStatus || 'Available'}
          </span>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
        >
          <ShoppingCart size={17} />
          Add to Cart
        </button>
      </div>
    </article>
  )
}

export default RecommendationCard
