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
      "Track Pending, Confirmed, Rejected, and Cancelled bookings from your personal dashboard.",
  },
  {
    icon: ClipboardCheck,
    title: "Hosts stay in control",
    description:
      "Hosts review requests before confirming. Overlapping confirmed sessions are blocked.",
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
    question: "Does StudioSpace collect payment?",
    answer:
      "Online payment is not available in this version. The displayed total includes the rental amount and security deposit, but submitting a request does not charge you.",
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
      className="section-space border-y border-base-300 bg-base-100"
    >
      <div className="site-container">
        <div className="max-w-2xl">
          <p className="mb-3 text-sm font-semibold text-primary">
            Creator support
          </p>

          <h2 id="creator-support-title" className="section-title">
            More clarity. More room to create.
          </h2>

          <p className="section-description mt-5">
            Understand the costs, follow your booking, and plan your
            session with clear expectations.
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
              A few things to know about requests, cancellations, and
              pricing before you book.
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