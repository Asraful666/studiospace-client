import Link from "next/link";
import {
  ArrowUpRight,
  Aperture,
  Camera,
  Mic,
  Music2,
  Search,
  Clock3,
  CalendarCheck,
  Sparkles,
} from "lucide-react";

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
      <section className="site-container section-space">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Spaces for your next big idea
            </p>

            <h1 className="text-5xl font-extrabold leading-[1.06] tracking-tight sm:text-6xl lg:text-7xl">
              Your vision.
              <br />
              <span className="text-primary">The right space.</span>
            </h1>

            <p className="section-description mt-6 text-lg">
              From your first podcast to your next production, find a creative
              space that lets you do your best work.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/studios" className="btn btn-primary">
                Explore studios
                <ArrowUpRight size={18} />
              </Link>

              <Link href="/studios" className="btn btn-outline">
                Host your space
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap gap-5 text-sm opacity-65">
              <span className="flex items-center gap-2">
                <Camera size={17} /> Photography
              </span>
              <span className="flex items-center gap-2">
                <Mic size={17} /> Podcasts
              </span>
              <span className="flex items-center gap-2">
                <Music2 size={17} /> Music
              </span>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-base-300 bg-base-100 p-8 sm:p-12">
            <div
              aria-hidden="true"
              className="absolute -right-16 -top-16 size-64 rounded-full bg-primary/10"
            />

            <div className="relative flex min-h-72 flex-col items-center justify-center text-center">
              <div className="mb-7 flex size-28 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                <Aperture size={70} strokeWidth={1} />
              </div>

              <p className="text-xs font-semibold uppercase tracking-[0.25em] opacity-60">
                Room for possibility
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight">
                Great ideas need space.
              </h2>

              <p className="mt-4 max-w-xs text-sm leading-7 opacity-65">
                A quiet room. The perfect light. A fresh perspective.
                Your next chapter starts here.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-base-100 section-space">
        <div className="site-container">
          <p className="mb-3 text-sm font-semibold text-primary">
            From inspiration to creation
          </p>

          <h2 className="section-title">Make room for your next project.</h2>

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

                <h3 className="mt-6 text-lg font-bold">{title}</h3>

                <p className="mt-3 text-sm leading-7 opacity-65">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="site-container section-space">
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