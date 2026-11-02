import ExploreStudios from "@/components/ExploreStudios";

export const metadata = {
  title: "Explore Studios",
};

export default async function StudiosPage({ searchParams }) {
  const params = await searchParams;

  function read(key, fallback = "") {
    return typeof params[key] === "string" ? params[key] : fallback;
  }

  const filters = {
    search: read("search"),
    category: read("category"),
    sort: read("sort", "newest"),
    page: read("page", "1"),
  };

  return (
    <ExploreStudios
      key={JSON.stringify(filters)}
      filters={filters}
    />
  );
}