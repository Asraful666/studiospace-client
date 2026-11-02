import Link from "next/link";
import { Aperture } from "lucide-react";

export default function Logo() {
  return (
    <Link
      href="/"
      aria-label="StudioSpace home"
      className="inline-flex shrink-0 items-center gap-2.5"
    >
      <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-content">
        <Aperture size={25} strokeWidth={1.8} />
      </span>

      <span className="text-xl font-extrabold tracking-tight">
        Studio<span className="text-primary">Space</span>
      </span>
    </Link>
  );
}