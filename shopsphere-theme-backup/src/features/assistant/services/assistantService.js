import { parseShoppingIntent } from "../utils/intentParser";

export const searchAssistantProducts = (products = [], intent = {}) => {
  if (!Array.isArray(products) || products.length === 0) {
    return [];
  }

  let results = [...products];

  if (intent.category) {
    const category = intent.category.toLowerCase();

    results = results.filter(
      (product) => product.category?.toLowerCase() === category,
    );
  }

  if (intent.maxPrice !== null && intent.maxPrice !== undefined) {
    results = results.filter((product) => product.price <= intent.maxPrice);
  }

  if (intent.minRating !== null && intent.minRating !== undefined) {
    results = results.filter(
      (product) => (product.rating || 0) >= intent.minRating,
    );
  }

  if (intent.color) {
    results = results.filter((product) => {
      const searchableText = [
        product.title,
        product.description,
        product.color,
        ...(product.tags || []),
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(intent.color);
    });
  }

  if (intent.sortBy === "price-asc") {
    results.sort((a, b) => a.price - b.price);
  } else if (intent.sortBy === "price-desc") {
    results.sort((a, b) => b.price - a.price);
  } else if (intent.sortBy === "rating-desc") {
    results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (intent.sortBy === "rating-asc") {
    results.sort((a, b) => (a.rating || 0) - (b.rating || 0));
  } else {
    results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  return results;
};

export const processShoppingQuery = (products, message) => {
  const intent = parseShoppingIntent(message);

  const hasIntent = Boolean(
    intent.category ||
    intent.maxPrice !== null ||
    intent.minRating !== null ||
    intent.color ||
    intent.sortBy,
  );

  if (!hasIntent) {
    return {
      intent,
      products: [],
      message:
        "I could not understand your shopping request. Could you mention a product category, budget, or rating preference?",
      success: false,
    };
  }

  const results = searchAssistantProducts(products, intent);

  return {
    intent,
    products: results,
    message: results.length
      ? `I found ${results.length} products matching your preferences.`
      : "No products matched those filters. Try increasing your budget or changing your preferences.",
    success: true,
  };
};
