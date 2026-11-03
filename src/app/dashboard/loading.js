export default function Loading() {
  return (
    <section
      className="site-container section-space"
      role="status"
      aria-label="Loading page"
    >
      <span className="sr-only">Loading your workspace...</span>

      <div aria-hidden="true">
        <div className="skeleton h-4 w-40" />
        <div className="skeleton mt-4 h-10 w-3/4 max-w-md" />
        <div className="skeleton mt-5 h-5 w-full max-w-xl" />

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-base-300 p-6"
            >
              <div className="skeleton size-12 rounded-xl" />
              <div className="skeleton mt-6 h-6 w-2/3" />
              <div className="skeleton mt-4 h-4 w-full" />
              <div className="skeleton mt-3 h-4 w-4/5" />
              <div className="skeleton mt-7 h-11 w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}