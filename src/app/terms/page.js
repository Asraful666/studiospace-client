import Link from "next/link";

export const metadata = {
  title: "Terms & Platform Notice",
};

const sections = [
  {
    title: "1. About this project",
    text:
      "StudioSpace is an educational demonstration of a creative workspace booking platform. Listings marked Demo are fictional and use illustrative photography. Do not treat a demo booking as a real-world reservation.",
  },
  {
    title: "2. Accounts and listing information",
    text:
      "Use accurate account and studio information. Hosts are responsible for describing their space, equipment, capacity, location, and pricing accurately. Account sign-in does not mean that a person's identity or studio ownership has been independently verified.",
  },
  {
    title: "3. Booking requests",
    text:
      "New requests start as Pending. A time slot is reserved in the application only after the host confirms it. Booking times use Bangladesh time (Asia/Dhaka). A confirmed session can be marked Completed by its host after the scheduled end time.",
  },
  {
    title: "4. Prices and payments",
    text:
      "The quoted total includes the hourly rental amount and security deposit. This version does not collect payments, hold deposits, issue refunds, or process payouts. A booking confirmation or Completed status is not proof of payment.",
  },
  {
    title: "5. Cancellation",
    text:
      "Guests can cancel their own Pending requests. Confirmed booking cancellation and refund processing are not available in this version. Hosts can reject Pending requests.",
  },
  {
    title: "6. Equipment and liability",
    text:
      "This demonstration does not provide insurance, liability coverage, damage compensation, or an equipment protection guarantee. For any real-world use, hosts and guests would need to agree on equipment condition, safe use, access rules, and responsibility before the session.",
  },
  {
    title: "7. Reviews",
    text:
      "Guests can publish one review per Completed booking. The reviewer's name, rating, comment, and publication date are public. Avoid sharing personal contact details, private information, or content unrelated to the session.",
  },
  {
    title: "8. Data used by the application",
    text:
      "The application stores account, studio, booking, and review information needed for its features. Images uploaded through the image upload tool are sent to ImgBB. Hosts can see the guest information attached to bookings for their studios.",
  },
  {
    title: "9. Newsletter interest list",
    text:
      "Submitting the footer form with consent stores your email on a newsletter interest list. Newsletter delivery is not active. This version does not send marketing emails.",
  },
  {
    title: "10. Support availability",
    text:
      "The Creator Support section explains how the application works. A staffed support desk, emergency assistance, and 24/7 host support are not available in this demonstration.",
  },
];

export default function TermsPage() {
  return (
    <section className="site-container section-space">
      <div className="mx-auto max-w-3xl">
        <p className="mb-3 text-sm font-semibold text-primary">
          Platform information
        </p>

        <h1 className="section-title">Terms & platform notice</h1>

        <p className="section-description mt-5">
          Understand how this StudioSpace demonstration handles bookings,
          pricing, reviews, and support.
        </p>

        <div className="mt-8 rounded-2xl border border-base-300 bg-base-200 p-5">
          <p className="text-sm leading-7">
            This notice describes the current educational project. It is
            not a claim of insurance coverage, verified identities, or
            commercial support services.
          </p>
        </div>

        <div className="mt-8 space-y-5">
          {sections.map(({ title, text }) => (
            <section
              key={title}
              className="rounded-2xl border border-base-300 bg-base-100 p-6"
            >
              <h2 className="text-xl font-bold">{title}</h2>
              <p className="mt-4 text-sm leading-7 opacity-75">{text}</p>
            </section>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/studios" className="btn btn-primary">
            Explore studios
          </Link>

          <Link href="/#creator-support" className="btn btn-outline">
            Creator support
          </Link>
        </div>
      </div>
    </section>
  );
}