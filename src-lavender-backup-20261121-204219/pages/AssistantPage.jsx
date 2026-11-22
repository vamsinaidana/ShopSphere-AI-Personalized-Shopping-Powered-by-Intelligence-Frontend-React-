import { useQuery } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import AssistantChat from "../features/assistant/components/AssistantChat";
import { getProducts } from "../services/productService";

function AssistantPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["assistant-products"],
    queryFn: () => getProducts(100),
  });

  const products = data?.products || [];

  return (
    <main className="min-h-screen bg-orange-50 px-4 py-12 dark:bg-[#FFF7ED]">
      <div className="mx-auto mb-10 max-w-4xl text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700 dark:bg-orange-950 dark:text-orange-300">
          <Sparkles size={16} />
          Intelligent Shopping Experience
        </div>

        <h1 className="text-3xl font-bold text-stone-900 dark:text-white sm:text-5xl">
          Meet Your AI Shopping Assistant
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-slate-600 dark:text-slate-400">
          Tell us what you need. Discover products based on your category,
          budget, ratings and preferences.
        </p>
      </div>

      {isLoading ? (
        <p className="py-12 text-center text-slate-500">Loading products...</p>
      ) : isError ? (
        <p className="py-12 text-center text-red-500">
          Unable to load products. Please try again.
        </p>
      ) : (
        <AssistantChat products={products} />
      )}
    </main>
  );
}

export default AssistantPage;
