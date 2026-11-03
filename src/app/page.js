import {
  Search,
  Clock3,
  CalendarCheck,
  Sparkles,
} from "lucide-react";

import HeroSlider from "@/components/HeroSlider";
import FeaturedStudios from "@/components/FeaturedStudios";
import StudioCategories from "@/components/StudioCategories";
import CreatorSupport from "@/components/CreatorSupport";

const steps = [
  {
    icon: Search,
    title: "Discover spaces",
    description: "Find a studio that fits your creative vision.",
  },
  {
    icon: Clock3,
    title: "Select shoot hours",
    description: "Choose your date and the hours you need.",
  },
  {
    icon: CalendarCheck,
    title: "Book your space",
    description: "Send your reservation and track its status.",
  },
  {
    icon: Sparkles,
    title: "Create & produce",
    description: "Bring your ideas, your team, and your talent.",
  },
];

export default function HomePage() {
  return (
    <>
      <HeroSlider />

      <FeaturedStudios />

      <StudioCategories />

      <section
        id="how-it-works"
        className="bg-base-100 section-space"
      >
        <div className="site-container">
          <p className="mb-3 text-sm font-semibold text-primary">
            From inspiration to creation
          </p>

          <h2 className="section-title">
            Make room for your next project.
          </h2>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(({ icon: Icon, title, description }, index) => (
              <article
                key={title}
                className="rounded-2xl border border-base-300 bg-base-200 p-6"
              >
                <div className="flex items-center justify-between">
                  <Icon size={25} className="text-primary" />

                  <span className="text-sm font-bold opacity-40">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="mt-6 text-lg font-bold">
                  {title}
                </h3>

                <p className="mt-3 text-sm leading-7 opacity-65">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
<CreatorSupport />
      <section
        id="about"
        className="site-container section-space"
      >
        <div className="max-w-3xl">
          <p className="mb-3 text-sm font-semibold text-primary">
            Built around creativity
          </p>

          <h2 className="section-title">
            Connecting people with places to create.
          </h2>

          <p className="section-description mt-6">
            StudioSpace brings independent hosts and creative people together.
            Our goal is to make it easier to discover spaces, understand their
            amenities, and plan your next production with clear hourly pricing.
          </p>
        </div>
      </section>
    </>
  );
}