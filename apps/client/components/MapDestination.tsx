import type { TNationalParkBase } from "@repo/db/index";

const MapDestination = ({ park }: { park: string }) => {
  return (
    <section
      title="Jim Corbett National Park Maprooms.actions.t"
      className="bg-muted py-16"
    >
      <div className=" mx-auto text-center px-26 max-w-7xl">
        <h2 className="text-[#9B8B6C] text-3xl font-light mb-8">
          Map of <span className="font-bold">{park}</span>
        </h2>
        <iframe
          title="Jim Corbett National Park Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3470.771256530184!2d78.88321069999999!3d29.5521551!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390a24ffffffffff%3A0x3017b72d3d253fd7!2sJim%20Corbett%20National%20Park!5e0!3m2!1sen!2sin!4v1767355037853!5m2!1sen!2sin"
          className="w-full aspect-video"
          style={{ border: "0" }}
          allowFullScreen={false}
          width="600"
          height="500"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </section>
  );
};

export default MapDestination;
