import Skeleton from "./Skeleton";

export default function ProductSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl border border-orange-100 bg-white p-4"
        >
          <Skeleton className="h-52 w-full rounded-xl" />
          <Skeleton className="mt-5 h-3 w-1/3" />
          <Skeleton className="mt-3 h-5 w-full" />
          <Skeleton className="mt-2 h-5 w-2/3" />
          <div className="mt-5 flex justify-between">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-5 w-14" />
          </div>
          <Skeleton className="mt-5 h-11 w-full rounded-xl" />
          <Skeleton className="mt-3 h-11 w-full rounded-xl" />
        </div>
      ))}
    </div>
  );
}
