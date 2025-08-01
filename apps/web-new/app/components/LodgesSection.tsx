import Image from "next/image";

interface Lodge {
  name: string;
  img: string;
  description?: string;
}

const lodges: Lodge[] = [
  {
    name: "VERNEYS CAMP",
    img: "https://static.wixstatic.com/media/b2fe2e_0d093ad501044a88b7864338fc104905~mv2.jpg/v1/fill/w_577,h_325,q_90,enc_avif,quality_auto/b2fe2e_0d093ad501044a88b7864338fc104905~mv2.jpg",
    description: "Luxury tented safari camp with stunning views",
  },
  {
    name: "DAVISONS CAMP",
    img: "https://static.wixstatic.com/media/b2fe2e_0d093ad501044a88b7864338fc104905~mv2.jpg/v1/fill/w_577,h_325,q_90,enc_avif,quality_auto/b2fe2e_0d093ad501044a88b7864338fc104905~mv2.jpg",
    description: "Classic safari lodge with elephant viewing",
  },
  {
    name: "DETEEMA SPRINGS CAMP",
    img: "https://static.wixstatic.com/media/b2fe2e_0d093ad501044a88b7864338fc104905~mv2.jpg/v1/fill/w_577,h_325,q_90,enc_avif,quality_auto/b2fe2e_0d093ad501044a88b7864338fc104905~mv2.jpg",
    description: "Intimate camp overlooking natural springs",
  },
  // Add more lodges for continuous scrolling effect
  {
    name: "VERNEYS CAMP",
    img: "https://static.wixstatic.com/media/b2fe2e_0d093ad501044a88b7864338fc104905~mv2.jpg/v1/fill/w_577,h_325,q_90,enc_avif,quality_auto/b2fe2e_0d093ad501044a88b7864338fc104905~mv2.jpg",
    description: "Luxury tented safari camp with stunning views",
  },
  {
    name: "DAVISONS CAMP",
    img: "https://static.wixstatic.com/media/b2fe2e_0d093ad501044a88b7864338fc104905~mv2.jpg/v1/fill/w_577,h_325,q_90,enc_avif,quality_auto/b2fe2e_0d093ad501044a88b7864338fc104905~mv2.jpg",
    description: "Classic safari lodge with elephant viewing",
  },
];

export default function LodgesSection() {
  // Double the lodges for seamless infinite scroll
  const allLodges = [...lodges, ...lodges];

  return (
    <section className="py-16 overflow-hidden">
      <div className="mx-auto">
        <h2 className="text-primary text-center text-3xl font-light mb-8">
          PLACES TO STAY IN <span className="font-bold">JIM CORBETT</span>
        </h2>

        <p className="text-center text-primary text-lg mb-16 max-w-4xl mx-auto">
          Jim Corbett National Park offers all types of accommodation to choose
          from depending on budget and taste.
        </p>

        <div className="relative w-full overflow-hidden">
          <div
            className="flex gap-4 animate-[scroll_40s_linear_infinite] hover:[animation-play-state:paused!important]"
            style={{ width: "max-content" }}
          >
            {allLodges.map((lodge, index) => (
              <button
                key={`${lodge.name}-${index}`}
                className="group w-[calc(100vw_-_32px)] md:w-[550px] cursor-pointer flex-shrink-0"
                tabIndex={0}
              >
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image
                    src={lodge.img}
                    alt={lodge.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <h3 className="text-sm py-3 bg-dark-corvid text-white text-center">
                  {lodge.name}
                </h3>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <button className="px-8 py-3 bg-[#2F2F2F] text-white hover:bg-[#444444] transition-colors">
            ALL LODGES
          </button>
        </div>
      </div>
    </section>
  );
}
