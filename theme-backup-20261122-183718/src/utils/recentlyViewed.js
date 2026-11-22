const STORAGE_KEY = "shopsphere_recently_viewed";
const MAX_HISTORY = 10;

export const getRecentlyViewed = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};

export const addRecentlyViewed = (product) => {
  if (!product?.id) return;

  const previousProducts = getRecentlyViewed();

  // Remove duplicate product before adding it to the top
  const updatedProducts = [
    product,
    ...previousProducts.filter((item) => item.id !== product.id),
  ].slice(0, MAX_HISTORY);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts));

  return updatedProducts;
};
