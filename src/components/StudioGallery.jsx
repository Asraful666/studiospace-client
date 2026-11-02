"use client";

import { useState } from "react";
import { Camera, ChevronLeft, ChevronRight } from "lucide-react";

export default function StudioGallery({ images = [], title }) {
  const [active, setActive] = useState(0);
  const [failedImages, setFailedImages] = useState([]);

  const gallery = [...new Set(images)].filter(
    (image) => typeof image === "string" && image.trim()
  );

  const currentImage = gallery[active];
  const unavailable =
    !currentImage || failedImages.includes(currentImage);

  function changeImage(direction) {
    setActive((value) => (
      value + direction + gallery.length
    ) % gallery.length);
  }

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-base-300 sm:aspect-video">
        {unavailable ? (
          <div
            role="img"
            aria-label="Studio image unavailable"
            className="flex h-full flex-col items-center justify-center gap-3 opacity-50"
          >
            <Camera size={48} />
            <span>Image unavailable</span>
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={currentImage}
            alt={`${title} — image ${active + 1}`}
            width={1200}
            height={800}
            onError={() => {
              setFailedImages((previous) => [
                ...previous,
                currentImage,
              ]);
            }}
            className="h-full w-full object-cover"
          />
        )}

        {gallery.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => changeImage(-1)}
              aria-label="Previous studio image"
              className="btn btn-circle absolute left-3 top-1/2 -translate-y-1/2 border-none bg-base-100"
            >
              <ChevronLeft size={22} />
            </button>

            <button
              type="button"
              onClick={() => changeImage(1)}
              aria-label="Next studio image"
              className="btn btn-circle absolute right-3 top-1/2 -translate-y-1/2 border-none bg-base-100"
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}

        {gallery.length > 0 && (
          <span
            aria-live="polite"
            className="absolute bottom-4 right-4 rounded-full bg-black/65 px-3 py-1.5 text-xs text-white"
          >
            {active + 1} / {gallery.length}
          </span>
        )}
      </div>

      {gallery.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {gallery.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show image ${index + 1}`}
              aria-pressed={active === index}
              className={`size-20 shrink-0 overflow-hidden rounded-xl border-2 ${
                active === index
                  ? "border-primary"
                  : "border-transparent"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt=""
                width={80}
                height={80}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}