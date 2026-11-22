import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, ShoppingCart, Heart, Star } from "lucide-react";

import { getProductById, getProducts } from "../../services/productService";
import { addToCart } from "../../store/slices/cartSlice";
import { toggleWishlist } from "../../store/slices/wishlistSlice";
import { addRecentlyViewed } from "../../utils/recentlyViewed";

import useRecommendations from "../recommendations/hooks/useRecommendations";
import RecommendationCard from "../recommendations/components/RecommendationCard";

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const wishlist = useSelector((state) => state.wishlist.items);

  // Fetch current product
  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
  });

  // Fetch products for Similar Products recommendations
  const { data: allProductsData } = useQuery({
    queryKey: ["similar-products"],
    queryFn: () => getProducts(100),
  });

  const allProducts = allProductsData?.products || [];

  // Recently Viewed tracking
  useEffect(() => {
    if (product) {
      addRecentlyViewed(product);
    }
  }, [product]);

  // Similar Products recommendation hook
  const { recommendations: similarProducts, loading: similarLoading } =
    useRecommendations({
      products: allProducts,
      currentProduct: product,
      strategy: "similar",
      limit: 4,
    });
  const {
    recommendations: frequentlyBoughtTogether,
    loading: frequentlyBoughtLoading,
  } = useRecommendations({
    products: allProducts,
    currentProduct: product,
    strategy: "frequently-bought-together",
    limit: 4,
  });

  if (isLoading) {
    return <div className="p-10 text-center">Loading product...</div>;
  }

  if (isError || !product) {
    return <div className="p-10 text-center">Unable to load product.</div>;
  }

  const isWishlisted = wishlist.some((item) => item.id === product.id);

  return (
    <div className="min-h-screen bg-orange-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/products"
          className="mb-8 inline-flex items-center gap-2 text-gray-600 hover:text-black"
        >
          <ArrowLeft size={18} />
          Back to Products
        </Link>

        {/* Product Details */}
        <div className="grid gap-10 rounded-2xl bg-white p-6 shadow-sm md:grid-cols-2 md:p-10">
          <div className="flex items-center justify-center rounded-xl bg-gray-100 p-6">
            <img
              src={product.thumbnail}
              alt={product.title}
              className="max-h-96 w-full object-contain"
            />
          </div>

          <div className="flex flex-col justify-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-orange-600">
              {product.category}
            </p>

            <h1 className="mb-4 text-3xl font-bold text-stone-900">
              {product.title}
            </h1>

            <p className="mb-5 leading-7 text-gray-600">
              {product.description}
            </p>

            <div className="mb-5 flex items-center gap-2">
              <Star size={18} className="fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{product.rating}</span>
              <span className="text-gray-500">Customer rating</span>
            </div>

            <div className="mb-3 flex items-center gap-3">
              <span className="text-3xl font-bold text-stone-900">
                ${product.price}
              </span>

              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                {product.discountPercentage}% OFF
              </span>
            </div>

            <p className="mb-6 text-sm text-gray-500">
              Stock available: {product.stock}
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => dispatch(addToCart(product))}
                className="flex items-center gap-2 rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700"
              >
                <ShoppingCart size={19} />
                Add to Cart
              </button>

              <button
                onClick={() => dispatch(toggleWishlist(product))}
                className="flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-100"
              >
                <Heart
                  size={19}
                  className={isWishlisted ? "fill-red-500 text-red-500" : ""}
                />
                {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
              </button>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        <section className="mt-12 rounded-2xl bg-slate-950 p-6 md:p-8">
          <div className="mb-6">
            <p className="mb-2 text-sm font-medium text-orange-400">
              ShopSphere AI
            </p>

            <h2 className="text-2xl font-bold text-white">Similar Products</h2>

            <p className="mt-2 text-sm text-slate-400">
              Products selected based on category, tags and price similarity.
            </p>
          </div>

          {similarLoading && (
            <p className="text-slate-400">Finding similar products...</p>
          )}

          {!similarLoading && similarProducts.length > 0 && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {similarProducts.map((item) => (
                <RecommendationCard key={item.id} product={item} />
              ))}
            </div>
          )}

          {!similarLoading && similarProducts.length === 0 && (
            <p className="text-slate-400">No similar products found.</p>
          )}

          {/* Frequently Bought Together */}
          {frequentlyBoughtTogether.length > 0 && (
            <section className="py-10">
              <div className="mb-6">
                <p className="mb-1 text-sm font-medium text-orange-400">
                  ShopSphere AI
                </p>

                <h2 className="text-2xl font-bold text-white">
                  Frequently Bought Together
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  Products commonly purchased together based on order history.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {frequentlyBoughtTogether.map((item) => (
                  <RecommendationCard key={item.id} product={item} />
                ))}
              </div>
            </section>
          )}
        </section>
      </div>
    </div>
  );
}
