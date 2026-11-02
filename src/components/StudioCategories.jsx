import Link from "next/link";
import {
  Camera,
  Clapperboard,
  Mic,
  Music2,
  Palette,
  ArrowUpRight,
} from "lucide-react";

const categories = [
  {
    name: "Photo Studios",
    value: "Photo Studio",
    description: "Find your perfect light",
    icon: Camera,
  },
  {
    name: "Sound Stages",
    value: "Film Stage",
    description: "Set your story in motion",
    icon: Clapperboard,
  },
  {
    name: "Podcast Rooms",
    value: "Podcast Lounge",
    description: "Start a conversation",
    icon: Mic,
  },
  {
    name: "Music Suites",
    value: "Music Suite",
    description: "Shape your next sound",
    icon: Music2,
  },
  {
    name: "Art Workshops",
    value: "Workshop",
    description: "Make something by hand",
    icon: Palette,
  },
];

export default function StudioCategories() {
  return (
    <section
      aria-labelledby="categories-heading"
      className="border-y border-base-300 bg-base-100"
    >
      <div className="site-container section-space">
        <div className="mb-9">
          <p className="mb-3 text-sm font-semibold text-primary">
            A space for every kind of creator
          </p>

          <h2 id="categories-heading" className="section-title">
            What will you create?
          </h2>

          <p className="section-description mt-4">
            Start with your craft. Discover a space that fits.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map(({ name, value, description, icon: Icon }) => (
            <Link
              key={value}
              href={`/studios?category=${encodeURIComponent(value)}`}
              className="group flex h-full flex-col rounded-2xl border border-base-300 bg-base-200 p-6 transition-colors hover:border-primary hover:bg-primary/5"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon size={25} strokeWidth={1.7} />
                </span>

                <ArrowUpRight
                  size={18}
                  className="opacity-40 group-hover:text-primary group-hover:opacity-100"
                />
              </div>

              <h3 className="mt-6 text-lg font-bold">{name}</h3>

              <p className="mt-2 text-sm leading-6 opacity-65">
                {description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}