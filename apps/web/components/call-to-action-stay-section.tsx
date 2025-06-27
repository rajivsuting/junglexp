import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';

export function CallToActionStaySection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden shadow-lg">
          <Image
            src="/malaysian-tiger-8363779_1280.jpg" // Replace with actual cabin image if available
            alt="Cabin in the woods"
            width={1200}
            height={500}
            className="w-full h-[32rem] object-cover"
            priority
          />
          <div className="absolute top-1/2 right-8 -translate-y-1/2 bg-white rounded-2xl shadow-xl p-8 max-w-[320px] w-full flex flex-col items-start gap-4">
            <h3 className="text-3xl font-extrabold text-gray-900">
              Still looking for the perfect stay?
            </h3>
            <p className="text-muted-foreground mb-2">
              Get in touch with us now!
            </p>
            <Button
              className="mt-2 px-6 py-2 text-base font-semibold"
              size="lg"
            >
              Request A Call Back <ArrowUpRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
