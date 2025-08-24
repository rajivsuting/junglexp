const Map = () => {
	return (
		<section className="py-16 bg-muted">
			<div className="max-w-4xl mx-auto px-4 text-center">
				<h2 className="text-[#9B8B6C] text-3xl font-light mb-8">
					<span className="font-bold">Map of Jim Corbett</span> National Park
				</h2>
				<iframe
					src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3470.7710993065116!2d78.87833978422064!3d29.55215967773444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390a24ffffffffff%3A0x3017b72d3d253fd7!2sJim%20Corbett%20National%20Park!5e0!3m2!1sen!2sus!4v1754038612516!5m2!1sen!2sus"
					className="w-full aspect-video"
					style={{ border: "0" }}
					allowFullScreen={false}
					loading="lazy"
					referrerPolicy="no-referrer-when-downgrade"
				></iframe>
			</div>
		</section>
	);
};

export default Map;
