"use client";

import Image from 'next/image';

const ReviewsSection = () => {
  const reviews = [
    {
      name: "Theo Fumagalli",
      avatar:
        "https://lh3.googleusercontent.com/a/ACg8ocLiDtgaAXCPFHtQqDDwRyugWCPUMP2i9F14N5ngfsI45-mMaQ=s120-c-rp-mo-br100",
      time: "2 months ago",
      text: "I thank Hwange Safaris (Stuart) for impeccable organization. We had ...",
    },
    {
      name: "Elsi Müller",
      avatar:
        "https://lh3.googleusercontent.com/a/ACg8ocLiDtgaAXCPFHtQqDDwRyugWCPUMP2i9F14N5ngfsI45-mMaQ=s120-c-rp-mo-br100",
      time: "3 months ago",
      text: "Hwange Safaris hat wirklich auf unsere Wünsche und...",
    },
    {
      name: "David Newman",
      avatar:
        "https://lh3.googleusercontent.com/a/ACg8ocLiDtgaAXCPFHtQqDDwRyugWCPUMP2i9F14N5ngfsI45-mMaQ=s120-c-rp-mo-br100",
      time: "3 months ago",
      text: "Hwange Safaris planned a splendid trip to Hwange Davison...",
    },
    {
      name: "Joanna Remzi",
      avatar:
        "https://lh3.googleusercontent.com/a/ACg8ocLiDtgaAXCPFHtQqDDwRyugWCPUMP2i9F14N5ngfsI45-mMaQ=s120-c-rp-mo-br100",
      time: "3 months ago",
      text: "Sanja/ Hwange Safaris organised an amazing trip for us in Hwange...",
    },
    {
      name: "Kirsten Bott",
      avatar:
        "https://lh3.googleusercontent.com/a/ACg8ocLiDtgaAXCPFHtQqDDwRyugWCPUMP2i9F14N5ngfsI45-mMaQ=s120-c-rp-mo-br100",
      time: "4 months ago",
      text: "We stayed at Ivory Lodge in October. We had an amazing time...",
    },
    {
      name: "Joanna Remzi",
      avatar:
        "https://lh3.googleusercontent.com/a/ACg8ocLiDtgaAXCPFHtQqDDwRyugWCPUMP2i9F14N5ngfsI45-mMaQ=s120-c-rp-mo-br100",
      time: "3 months ago",
      text: "Sanja/ Hwange Safaris organised an amazing trip for us in Hwange...",
    },
    {
      name: "Kirsten Bott",
      avatar:
        "https://lh3.googleusercontent.com/a/ACg8ocLiDtgaAXCPFHtQqDDwRyugWCPUMP2i9F14N5ngfsI45-mMaQ=s120-c-rp-mo-br100",
      time: "4 months ago",
      text: "We stayed at Ivory Lodge in October. We had an amazing time...",
    },
  ];

  return (
    <div className="self-center w-full">
      <div className="w-full bg-card p-4 font-mono mb-6">
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="w-6 h-6">
            <svg viewBox="0 0 24 24">
              <path
                fill="#2A84FC"
                d="M21.579 12.234c0-.677-.055-1.359-.172-2.025h-9.403v3.839h5.384a4.615 4.615 0 0 1-1.992 3.029v2.49h3.212c1.886-1.736 2.97-4.3 2.97-7.333Z"
              ></path>
              <path
                fill="#00AC47"
                d="M12.004 21.974c2.688 0 4.956-.882 6.608-2.406l-3.213-2.491c-.893.608-2.047.952-3.392.952-2.6 0-4.806-1.754-5.597-4.113H3.095v2.567a9.97 9.97 0 0 0 8.909 5.491Z"
              ></path>
              <path
                fill="#FFBA00"
                d="M6.407 13.916a5.971 5.971 0 0 1 0-3.817V7.531H3.095a9.977 9.977 0 0 0 0 8.953l3.312-2.568Z"
              ></path>
              <path
                fill="#FC2C25"
                d="M12.004 5.982a5.417 5.417 0 0 1 3.824 1.494l2.846-2.846a9.581 9.581 0 0 0-6.67-2.593A9.967 9.967 0 0 0 3.095 7.53l3.312 2.57c.787-2.363 2.996-4.117 5.597-4.117Z"
              ></path>
            </svg>
          </div>
          <span className="text-lg text-primary font-bold">
            Excellent on Google
          </span>
        </div>

        <div className="flex items-center justify-center gap-1 mb-1">
          <span className="text-lg text-primary font-bold">5.0</span>
          <span className="text-sm text-primary">
            out of 5 based on 28 reviews
          </span>
        </div>

        <div className="flex justify-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              className="w-5 h-5 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </div>

      <div className="relative w-full group">
        <div className="overflow-x-auto flex gap-4 snap-x snap-mandatory scrollbar-none scroll-smooth">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="p-6 bg-card flex-none w-full sm:w-[calc(50%-8px)] lg:w-[calc(20%-13px)] snap-start"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-12 h-12">
                  <Image
                    src={review.avatar}
                    alt={review.name}
                    fill
                    className="rounded-full text-sm object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-primary text-start">
                      {review.name}
                    </h3>
                  </div>
                  <p className="text-sm text-start text-primary/70">
                    {review.time}
                  </p>
                </div>
              </div>
              <div className="flex mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-primary text-sm text-start line-clamp-3">
                {review.text}
              </p>
              <button className="float-start text-[rgb(14, 139, 37)] text-sm mt-2">
                Read more
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            const container = document.querySelector(".snap-x");
            container?.scrollBy({
              left: -container.clientWidth,
              behavior: "smooth",
            });
          }}
          className="absolute left-[-12px] top-1/2 -translate-y-1/2 bg-white p-2 shadow-md hover:bg-gray-50 transition-colors z-10 opacity-0 group-hover:opacity-100"
          aria-label="Previous review"
        >
          <svg
            className="w-6 h-6 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          onClick={() => {
            const container = document.querySelector(".snap-x");
            container?.scrollBy({
              left: container.clientWidth,
              behavior: "smooth",
            });
          }}
          className="absolute right-[-12px] top-1/2 -translate-y-1/2 bg-white  p-2 shadow-md hover:bg-gray-50 transition-colors z-10 opacity-0 group-hover:opacity-100"
          aria-label="Next review"
        >
          <svg
            className="w-6 h-6 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        <style jsx>{`
          .scrollbar-none::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-none {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>
    </div>
  );
};

export default ReviewsSection;
