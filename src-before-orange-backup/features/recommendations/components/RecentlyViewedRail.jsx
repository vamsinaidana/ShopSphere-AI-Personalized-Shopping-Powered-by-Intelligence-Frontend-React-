import { useEffect, useState } from "react";
import { getRecentlyViewed } from "../../../utils/recentlyViewed";
import RecommendationCard from "./RecommendationCard";

function RecentlyViewedRail() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts(getRecentlyViewed());
  }, []);

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-10">
      <div className="mb-6">
        <p className="mb-1 text-sm font-medium text-violet-400">
          Your Browsing History
        </p>

        <h2 className="text-2xl font-bold text-white">Recently Viewed</h2>

        <p className="mt-2 text-sm text-slate-400">
          Continue exploring products you viewed earlier.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <RecommendationCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default RecentlyViewedRail;
