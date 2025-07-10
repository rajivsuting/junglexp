import Image from "next/image";

const aboutImage = "/tiger-close-up-walking-in-a-dense-forest.png";

export function AboutSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
          {/* Left: Title & Description */}
          <div className="flex-1 mb-8 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Jim Corbett National Park
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl">
              Jim Corbett National Park is one of India’s oldest and most
              prestigious wildlife reserves, renowned for its rich biodiversity
              and as the birthplace of Project Tiger. Nestled in the foothills
              of Uttarakhand, it offers breathtaking landscapes, thrilling
              safaris, and a sanctuary for endangered species, especially the
              majestic Royal Bengal Tiger.
            </p>
          </div>
          {/* Right: Image */}
          <div className="flex-1 flex justify-center">
            <div className="w-full max-w-md rounded-3xl overflow-hidden shadow-lg border-4 border-yellow-200">
              <Image
                src={aboutImage}
                alt="Jim Corbett National Park Tiger"
                width={500}
                height={400}
                className="object-cover w-full h-72 md:h-96"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
