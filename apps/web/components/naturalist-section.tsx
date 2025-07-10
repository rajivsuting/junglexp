import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const naturalists = [
  {
    id: "1",
    name: "Ravi Sharma",
    description:
      "Expert naturalist with 15+ years of experience in wildlife tracking and bird watching. Fluent in English and Hindi.",
    price: "₹2,000/Day",
    image: "https://iso.500px.com/wp-content/uploads/2014/07/20482.jpg", // Safari photographer with meerkat
  },
  {
    id: "2",
    name: "Priya Singh",
    description:
      "Specializes in flora and fauna of Corbett. Great with kids and educational tours.",
    price: "₹1,800/Day",
    image:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=256&h=256&facepad=2", // Safari woman
  },
  {
    id: "3",
    name: "Amit Verma",
    description:
      "Renowned for his jungle survival workshops and night safaris. Speaks English and local dialects.",
    price: "₹2,200/Day",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=256&h=256&facepad=2", // Wildlife explorer
  },
  {
    id: "4",
    name: "Priya Singh",
    description:
      "Specializes in flora and fauna of Corbett. Great with kids and educational tours.",
    price: "₹1,800/Day",
    image:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=256&h=256&facepad=2", // Safari woman
  },
  {
    id: "5",
    name: "Amit Verma",
    description:
      "Renowned for his jungle survival workshops and night safaris. Speaks English and local dialects.",
    price: "₹2,200/Day",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=256&h=256&facepad=2", // Wildlife explorer
  },
];

export function NaturalistSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Meet Our Naturalists
          </h2>
          <p className="text-lg text-muted-foreground mx-auto">
            Our expert naturalists will make your jungle experience
            unforgettable. Choose your guide for a personalized adventure.
          </p>
        </div>
        <div className="flex gap-6 mb-12 overflow-x-auto px-1 scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent [&::-webkit-scrollbar]:hidden py-3 pb-6">
          {naturalists.map((n) => (
            <div key={n.id} className="w-[24rem] flex-shrink-0">
              <Card className="text-center group hover:shadow-lg transition-all duration-300 h-full flex flex-col pt-0">
                <div className="flex justify-center mt-6 mb-4">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={n.image} alt={n.name} />
                    <AvatarFallback>{n.name[0]}</AvatarFallback>
                  </Avatar>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {n.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                  <p className="text-sm text-muted-foreground">
                    {n.description}
                  </p>
                  <div className="text-2xl font-bold text-primary">
                    {n.price}
                  </div>
                  <Button size="sm" variant="gradient" className="w-full mt-4">
                    Book Naturalist
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Button size="lg" variant="outline">
            See All Naturalists
          </Button>
        </div>
      </div>
    </section>
  );
}
