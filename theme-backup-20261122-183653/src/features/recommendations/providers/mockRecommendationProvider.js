import {
  rankProducts,
  rankSimilarProducts,
  rankCategoryProducts,
  rankPriceProducts,
  rankWishlistProducts,
  rankCartProducts,
  rankFrequentlyBoughtTogether,
  rankTrendingProducts,
} from "../../../data/recommendationEngine";

const mockRecommendationProvider = {
  async getRecommendations({
    products = [],
    signals = {},
    excludeIds = [],
    limit = 8,
    strategy = "personalized",
    currentProduct = null,
  }) {
    if (!Array.isArray(products) || products.length === 0) {
      return [];
    }

    if (strategy === "similar") {
      return rankSimilarProducts(products, currentProduct, limit);
    }

    if (strategy === "category") {
      return rankCategoryProducts(products, signals, limit);
    }

    if (strategy === "price") {
      return rankPriceProducts(products, signals, excludeIds, limit);
    }

    if (strategy === "wishlist") {
      return rankWishlistProducts(products, signals, limit);
    }

    if (strategy === "cart") {
      return rankCartProducts(products, signals, limit);
    }

    if (strategy === "frequently-bought-together") {
      return rankFrequentlyBoughtTogether(
        products,
        signals,
        currentProduct,
        limit,
      );
    }
    if (strategy === "trending") {
      return rankTrendingProducts(products, signals, limit);
    }

    const rankedProducts = rankProducts(products, signals, excludeIds);

    return rankedProducts.slice(0, limit);
  },
};

export default mockRecommendationProvider;
