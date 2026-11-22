const WEIGHTS = {
  categoryMatch: 0.2,
  priceSimilarity: 0.15,
  tagOverlap: 0.15,
  normalizedRating: 0.1,
  recentlyViewedRelation: 0.15,
  wishlistRelation: 0.1,
  cartRelation: 0.15,
};

const getIds = (products) =>
  products.map((item) => Number(item.id)).filter(Boolean);

const getCategories = (products) => [
  ...new Set(products.map((item) => item.category).filter(Boolean)),
];

// Category similarity
export const categoryMatch = (product, signals) => {
  const categories = getCategories(signals);
  return categories.includes(product.category) ? 1 : 0;
};

// Price similarity
export const priceSimilarity = (product, signals) => {
  if (!signals.length) return 0;

  const averagePrice =
    signals.reduce((sum, item) => sum + Number(item.price || 0), 0) /
    signals.length;

  if (!averagePrice || !product.price) return 0;

  const difference = Math.abs(product.price - averagePrice) / averagePrice;

  return Math.max(0, 1 - difference);
};

// Tag overlap
export const tagOverlap = (product, signals) => {
  const productTags = product.tags || [];

  const signalTags = [...new Set(signals.flatMap((item) => item.tags || []))];

  if (!productTags.length || !signalTags.length) return 0;

  const matchingTags = productTags.filter((tag) => signalTags.includes(tag));

  return matchingTags.length / productTags.length;
};

// Rating normalization
export const normalizedRating = (product) =>
  Math.min(Math.max(Number(product.rating || 0) / 5, 0), 1);

// Customer behavior relationships
export const recentlyViewedRelation = (product, signals) =>
  getIds(signals.recentlyViewed || []).includes(Number(product.id)) ? 1 : 0;

export const wishlistRelation = (product, signals) =>
  getIds(signals.wishlist || []).includes(Number(product.id)) ? 1 : 0;

export const cartRelation = (product, signals) =>
  getIds(signals.cart || []).includes(Number(product.id)) ? 1 : 0;

// Personalized recommendation score
export const calculateRecommendationScore = (product, signals = {}) => {
  const behaviorProducts = [
    ...(signals.recentlyViewed || []),
    ...(signals.wishlist || []),
    ...(signals.cart || []),
  ];

  const components = {
    categoryMatch: categoryMatch(product, behaviorProducts),
    priceSimilarity: priceSimilarity(product, behaviorProducts),
    tagOverlap: tagOverlap(product, behaviorProducts),
    normalizedRating: normalizedRating(product),
    recentlyViewedRelation: recentlyViewedRelation(product, signals),
    wishlistRelation: wishlistRelation(product, signals),
    cartRelation: cartRelation(product, signals),
  };

  const score = Object.entries(WEIGHTS).reduce(
    (total, [key, weight]) => total + components[key] * weight,
    0,
  );

  return {
    score: Number(score.toFixed(4)),
    components,
  };
};

// Similar Products score
export const calculateSimilarProductScore = (product, currentProduct) => {
  if (!currentProduct) return 0;

  const categoryScore = product.category === currentProduct.category ? 0.4 : 0;

  const currentTags = currentProduct.tags || [];
  const productTags = product.tags || [];

  const matchingTags = productTags.filter((tag) => currentTags.includes(tag));

  const tagScore = currentTags.length
    ? (matchingTags.length / currentTags.length) * 0.35
    : 0;

  const currentPrice = Number(currentProduct.price || 0);
  const productPrice = Number(product.price || 0);

  const priceScore =
    currentPrice > 0 && productPrice > 0
      ? Math.max(0, 1 - Math.abs(productPrice - currentPrice) / currentPrice) *
        0.25
      : 0;

  return Number((categoryScore + tagScore + priceScore).toFixed(4));
};

// Rank similar products
export const rankSimilarProducts = (products, currentProduct, limit = 8) => {
  if (!currentProduct) return [];

  return products
    .filter((product) => Number(product.id) !== Number(currentProduct.id))
    .map((product) => ({
      ...product,
      recommendationScore: calculateSimilarProductScore(
        product,
        currentProduct,
      ),
    }))
    .filter((product) => product.recommendationScore > 0)
    .sort((a, b) => b.recommendationScore - a.recommendationScore)
    .slice(0, limit);
};

// Rank personalized products
export const rankProducts = (products, signals = {}, excludeIds = []) => {
  return products
    .filter((product) => !excludeIds.includes(Number(product.id)))
    .map((product) => {
      const result = calculateRecommendationScore(product, signals);

      return {
        ...product,
        recommendationScore: result.score,
        recommendationSignals: result.components,
      };
    })
    .sort((a, b) => b.recommendationScore - a.recommendationScore);
};

export { WEIGHTS };

// Category-Based Recommendations
export const rankCategoryProducts = (products, signals = {}, limit = 8) => {
  const viewedProducts = signals.recentlyViewed || [];
  const wishlistProducts = signals.wishlist || [];
  const cartProducts = signals.cart || [];

  const allSignals = [...viewedProducts, ...wishlistProducts, ...cartProducts];

  if (!allSignals.length) return [];

  // Count category activity
  const categoryCounts = {};

  allSignals.forEach((product) => {
    if (!product.category) return;

    categoryCounts[product.category] =
      (categoryCounts[product.category] || 0) + 1;
  });

  const preferredCategory = Object.entries(categoryCounts).sort(
    (a, b) => b[1] - a[1],
  )[0]?.[0];

  if (!preferredCategory) return [];

  // Rank products from the preferred category
  return products
    .filter(
      (product) =>
        product.category === preferredCategory &&
        !allSignals.some((item) => Number(item.id) === Number(product.id)),
    )
    .map((product) => ({
      ...product,
      recommendationScore: Number((Number(product.rating || 0) / 5).toFixed(4)),
    }))
    .sort((a, b) => b.recommendationScore - a.recommendationScore)
    .slice(0, limit);
};

// Price-Based Recommendations
export const rankPriceProducts = (
  products,
  signals = {},
  excludeIds = [],
  limit = 8,
) => {
  const interactedProducts = [
    ...(signals.recentlyViewed || []),
    ...(signals.wishlist || []),
    ...(signals.cart || []),
    ...(signals.orders || []),
  ];

  if (!interactedProducts.length) return [];

  const prices = interactedProducts
    .map((product) => Number(product.price))
    .filter((price) => Number.isFinite(price) && price > 0);

  if (!prices.length) return [];

  // Calculate customer's typical price
  const averagePrice =
    prices.reduce((total, price) => total + price, 0) / prices.length;

  // Rank products by price similarity
  return products
    .filter(
      (product) =>
        !excludeIds.includes(product.id) &&
        !interactedProducts.some(
          (item) => Number(item.id) === Number(product.id),
        ),
    )
    .map((product) => {
      const price = Number(product.price);

      const score =
        price > 0
          ? Math.max(0, 1 - Math.abs(price - averagePrice) / averagePrice)
          : 0;

      return {
        ...product,
        recommendationScore: Number(score.toFixed(4)),
      };
    })
    .filter((product) => product.recommendationScore > 0)
    .sort((a, b) => b.recommendationScore - a.recommendationScore)
    .slice(0, limit);
};

// Wishlist-Based Recommendations
export const rankWishlistProducts = (products, signals = {}, limit = 8) => {
  const wishlistProducts = signals.wishlist || [];

  if (!wishlistProducts.length) return [];

  const excludeIds = wishlistProducts.map((product) => Number(product.id));

  const wishlistCategories = wishlistProducts
    .map((product) => product.category)
    .filter(Boolean);

  const wishlistTags = wishlistProducts.flatMap(
    (product) => product.tags || [],
  );

  const averagePrice =
    wishlistProducts.reduce(
      (total, product) => total + Number(product.price || 0),
      0,
    ) / wishlistProducts.length;

  return products
    .filter((product) => !excludeIds.includes(Number(product.id)))
    .map((product) => {
      const categoryScore = wishlistCategories.includes(product.category)
        ? 0.5
        : 0;

      const matchingTags = (product.tags || []).filter((tag) =>
        wishlistTags.includes(tag),
      );

      const tagScore = wishlistTags.length
        ? matchingTags.length / wishlistTags.length
        : 0;

      const price = Number(product.price || 0);

      const priceScore =
        averagePrice > 0
          ? Math.max(0, 1 - Math.abs(price - averagePrice) / averagePrice)
          : 0;

      const score = categoryScore + tagScore * 0.3 + priceScore * 0.2;

      return {
        ...product,
        recommendationScore: Number(score.toFixed(4)),
      };
    })
    .filter((product) => product.recommendationScore > 0)
    .sort((a, b) => b.recommendationScore - a.recommendationScore)
    .slice(0, limit);
};

// Cart-Based Recommendations
export const rankCartProducts = (products, signals = {}, limit = 8) => {
  const cartProducts = signals.cart || [];

  if (!cartProducts.length) return [];

  const cartIds = cartProducts.map((product) => Number(product.id));

  const cartCategories = cartProducts
    .map((product) => product.category)
    .filter(Boolean);

  const cartTags = cartProducts.flatMap((product) => product.tags || []);

  const averagePrice =
    cartProducts.reduce(
      (total, product) => total + Number(product.price || 0),
      0,
    ) / cartProducts.length;

  return products
    .filter((product) => !cartIds.includes(Number(product.id)))
    .map((product) => {
      const categoryScore = cartCategories.includes(product.category) ? 0.4 : 0;

      const matchingTags = (product.tags || []).filter((tag) =>
        cartTags.includes(tag),
      );

      const tagScore = cartTags.length
        ? matchingTags.length / cartTags.length
        : 0;

      const price = Number(product.price || 0);

      const priceScore =
        averagePrice > 0
          ? Math.max(0, 1 - Math.abs(price - averagePrice) / averagePrice)
          : 0;

      const score = categoryScore + tagScore * 0.4 + priceScore * 0.2;

      return {
        ...product,
        recommendationScore: Number(score.toFixed(4)),
      };
    })
    .filter((product) => product.recommendationScore > 0)
    .sort((a, b) => b.recommendationScore - a.recommendationScore)
    .slice(0, limit);
};

// Frequently Bought Together Recommendations

export const rankFrequentlyBoughtTogether = (
  products,
  signals = {},
  currentProduct = null,
  limit = 4,
) => {
  if (!currentProduct || !Array.isArray(signals.orders)) {
    return [];
  }

  const currentProductId = Number(currentProduct.id);
  const coPurchaseCounts = new Map();

  signals.orders.forEach((order) => {
    const orderItems = order.items || [];

    const hasCurrentProduct = orderItems.some(
      (item) => Number(item.id) === currentProductId,
    );

    if (!hasCurrentProduct) return;

    orderItems.forEach((item) => {
      const productId = Number(item.id);

      if (productId === currentProductId) return;

      coPurchaseCounts.set(
        productId,
        (coPurchaseCounts.get(productId) || 0) + 1,
      );
    });
  });

  return products
    .filter((product) => coPurchaseCounts.has(Number(product.id)))
    .sort((a, b) => {
      const countA = coPurchaseCounts.get(Number(a.id));
      const countB = coPurchaseCounts.get(Number(b.id));

      if (countA !== countB) {
        return countB - countA;
      }

      return (b.rating || 0) - (a.rating || 0);
    })
    .slice(0, limit);
};

// Trending Products Recommendation

export const rankTrendingProducts = (products, signals = {}, limit = 8) => {
  if (!Array.isArray(products) || products.length === 0) {
    return [];
  }

  const purchaseCounts = new Map();

  // Count product purchases from mock order history
  (signals.orders || []).forEach((order) => {
    (order.items || []).forEach((item) => {
      const id = Number(item.id);

      purchaseCounts.set(
        id,
        (purchaseCounts.get(id) || 0) + (item.quantity || 1),
      );
    });
  });

  const maxPurchases = Math.max(1, ...purchaseCounts.values());

  return products
    .map((product) => {
      const purchases = purchaseCounts.get(Number(product.id)) || 0;
      const purchaseScore = purchases / maxPurchases;

      const ratingScore = Math.min(Math.max((product.rating || 0) / 5, 0), 1);

      const reviewScore = Math.min((product.reviews?.length || 0) / 10, 1);

      const trendingScore =
        purchaseScore * 0.5 + ratingScore * 0.35 + reviewScore * 0.15;

      return {
        ...product,
        trendingScore,
      };
    })
    .sort((a, b) => b.trendingScore - a.trendingScore)
    .slice(0, limit);
};
