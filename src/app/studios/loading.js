export default function Loading() {
  return (
    <div className="site-container section-space" role="status">
      <span className="sr-only">Opening Explore Studios</span>

      <div className="skeleton mb-5 h-12 w-64" />
      <div className="skeleton mb-10 h-20 w-full" />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            aria-hidden="true"
            className="skeleton h-96 w-full rounded-2xl"
          />
        ))}
      </div>
    </div>
  );
}