import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const souvenirs = [
  {
    id: "1",
    name: "Bamboo Toothbrush",
    description:
      "Eco-friendly, biodegradable bamboo toothbrush for sustainable oral care.",
    price: 99,
    image:
      "https://brownliving.in/cdn/shop/files/sustainable-eco-friendly-travel-case-with-bamboo-charcoal-toothbrush-by-organic-b-at-brownliving-660056.jpg?v=1737470539&width=800",
  },
  {
    id: "3",
    name: "Bamboo Paddle Hair Brush | Bamboo Bristles Detangling Comb | With Cotton Pouch",
    description:
      "Reusable bamboo water bottle, stylish and sustainable for everyday use.",
    price: 499,
    image:
      "https://brownliving.in/cdn/shop/products/bamboo-paddle-hair-brush-bamboo-bristles-detangling-comb-with-cotton-pouch-tbb-89-hair-comb-brown-living-456317.jpg?v=1682960457&width=1000",
  },
  {
    id: "4",
    name: "Bamboo Lamp",
    description:
      "Bamboo Amplifier | Natural Acoustic Speaker | With Cotton Pouch",
    price: 899,
    image:
      "https://brownliving.in/cdn/shop/products/bamboo-amplifier-natural-acoustic-speaker-with-cotton-pouch-tbb-88-indoor-outdoor-play-equipments-872087.jpg?v=1746256825&width=1000",
  },
  {
    id: "5",
    name: "Natural Loofah | Straight & Round Eco Friendly Loofah | Bottle Gourd Exfoliating Loofa Sun Dried",
    description:
      "Lightweight, reusable bamboo cutlery set for eco-conscious dining.",
    price: 299,
    image:
      "https://brownliving.in/cdn/shop/products/natural-loofah-straight-round-eco-friendly-loofah-bottle-gourd-exfoliating-loofa-sun-dried-tbb-43-bath-accessories-brown-living-668720.jpg?v=1682965177&width=800",
  },
];

export function SouvenirsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Souvenirs & Gifts
          </h2>
          <p className="text-lg text-muted-foreground mx-auto">
            Take home a piece of Corbett! Explore our exclusive range of
            souvenirs and gifts.
          </p>
        </div>
        <div className="flex gap-6 mb-12 overflow-x-auto px-1 scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent [&::-webkit-scrollbar]:hidden py-3 pb-6">
          {souvenirs.map((item) => (
            <div key={item.id} className="min-w-[20rem] max-w-xs flex-shrink-0">
              <Card className="text-center group hover:shadow-lg transition-all duration-300 h-full flex flex-col pt-0">
                <div className="relative w-full h-48 mb-4 overflow-hidden rounded-t-lg">
                  <Image
                    unoptimized
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {item.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 flex-1 flex flex-col justify-between">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                  <div className="text-xl font-bold text-primary">
                    ₹{item.price}
                  </div>
                  <Button size="sm" variant="gradient" className="w-full mt-2">
                    Buy Now
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SouvenirsSection;
