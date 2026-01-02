const Map = () => {
  return (
    <section
      title="Jim Corbett National Park Maprooms.actions.t"
      className="bg-muted"
    >
      <div className="w-full mx-auto text-center">
        {/* <h2 className="text-[#9B8B6C] text-3xl font-light mb-8">
          <span className="font-bold">Map of Jim Corbett</span> National Park
        </h2> */}
        <iframe
          title="Jim Corbett National Park Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.3430375589974!2d77.267275!3d28.5594601!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce394cc555555%3A0xe9dd4fecd5f93dd4!2sTribhuvan%20Complex!5e0!3m2!1sen!2sin!4v1767351814948!5m2!1sen!2sin"
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

export default Map;
