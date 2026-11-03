import Link from "next/link";
import {
  BadgeDollarSign,
  CalendarCheck,
  ClipboardCheck,
  CircleHelp,
  ArrowUpRight,
} from "lucide-react";

const features = [
  {
    icon: BadgeDollarSign,
    title: "Know your costs",
    description:
      "Review the hourly rate, session duration, and security deposit before submitting your request.",
  },
  {
    icon: CalendarCheck,
    title: "Follow every request",
    description:
      "Track Pending, Confirmed, Completed, Rejected, and Cancelled bookings from your dashboard.",
  },
  {
    icon: ClipboardCheck,
    title: "Hosts review each request",
    description:
      "Hosts confirm requests before the time slot is reserved. Overlapping confirmed sessions are blocked.",
  },
];

const safeguards = [
  {
    title: "Liability protection",
    description:
      "Insurance and damage compensation are not provided in this demo. For real sessions, clarify coverage and responsibilities before booking.",
  },
  {
    title: "Profile verification",
    description:
      "Users sign in to manage bookings, but independent identity and studio ownership verification are not available.",
  },
  {
    title: "Equipment safety",
    description:
      "Review the listed amenities and agree on equipment condition, operating instructions, and safe handling before any real session.",
  },
  {
    title: "Host support",
    description:
      "Our FAQs explain the booking process. A staffed 24/7 support service is not available in this demonstration.",
  },
];

const questions = [
  {
    question: "When is my booking confirmed?",
    answer:
      "Your request starts as Pending. It becomes Confirmed when the host accepts it. Check My Bookings for the latest status.",
  },
  {
    question: "Can I cancel my request?",
    answer:
      "You can cancel a Pending request from My Bookings. Confirmed bookings cannot currently be cancelled through the app.",
  },
  {
    question: "When can I write a review?",
    answer:
      "After the session ends and the host marks your booking Completed, you can write one review from My Bookings.",
  },
  {
    question: "Does StudioSpace collect payment?",
    answer:
      "Online payment is not available in this version. The quoted total includes rental and security deposit, but submitting a request does not charge you.",
  },
  {
    question: "Which time zone is used?",
    answer:
      "All booking times use Bangladesh time (Asia/Dhaka). Sessions are booked in full hours within one calendar day.",
  },
];

export default function CreatorSupport() {
  return (
    <section
      id="creator-support"
      aria-labelledby="creator-support-title"
      className="section-space scroll-mt-24 border-y border-base-300 bg-base-100"
    >
      <div className="site-container">
        <div className="max-w-3xl">
          <p className="mb-3 text-sm font-semibold text-primary">
            Host guarantee & creator support
          </p>

          <h2 id="creator-support-title" className="section-title">
            Clear expectations for every session.
          </h2>

          <p className="section-description mt-5">
            Understand your booking, the costs, and the limits of this
            demonstration before planning your next project.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="rounded-2xl border border-base-300 bg-base-200 p-6"
            >
              <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon size={24} aria-hidden="true" />
              </span>

              <h3 className="mt-5 text-xl font-bold">{title}</h3>

              <p className="mt-3 text-sm leading-7 opacity-70">
                {description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-base-300 p-6 sm:p-8">
          <h3 className="text-2xl font-bold">
            Protection and support: what to expect
          </h3>

          <p className="mt-3 text-sm leading-7 opacity-70">
            This educational project does not offer a commercial host
            guarantee. The following limits apply to the current version.
          </p>

          <div className="mt-7 grid gap-6 sm:grid-cols-2">
            {safeguards.map(({ title, description }) => (
              <div key={title}>
                <h4 className="font-bold">{title}</h4>
                <p className="mt-2 text-sm leading-7 opacity-70">
                  {description}
                </p>
              </div>
            ))}
          </div>

          <Link href="/terms" className="btn btn-outline mt-7">
            Read platform notice
            <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          <div>
            <CircleHelp
              size={30}
              className="text-primary"
              aria-hidden="true"
            />

            <h3 className="mt-4 text-2xl font-bold">
              Before your first session
            </h3>

            <p className="mt-4 max-w-md text-sm leading-7 opacity-70">
              Learn how requests, cancellations, completed sessions, and
              reviews work.
            </p>

            <Link href="/studios" className="btn btn-primary mt-6">
              Find your space
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>

          <div className="space-y-3">
            {questions.map(({ question, answer }) => (
              <details
                key={question}
                className="rounded-2xl border border-base-300 bg-base-200 p-5"
              >
                <summary className="cursor-pointer font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
                  {question}
                </summary>

                <p className="mt-4 text-sm leading-7 opacity-75">
                  {answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}