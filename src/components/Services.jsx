function Services() {
  const services = [
    {
      icon: "fas fa-globe-asia",
      title: "Personalized Travel Planning",
      description:
        "Tailor-made itineraries based on your preferences, budget, and travel style.",
    },
    {
      icon: "fas fa-plane",
      title: "Hassle-Free Trip Booking",
      description:
        "Get recommendations for flights, hotels, and activities—all in one place.",
    },
    {
      icon: "fas fa-sun",
      title: "Weather & Packing Guide",
      description:
        "Stay prepared with weather forecasts and a checklist of essentials to carry.",
    },
    {
      icon: "far fa-credit-card",
      title: "Smart Budget Estimation",
      description:
        "Plan your trip with a clear breakdown of costs for transport, stay, and activities.",
    },
    {
      icon: "fas fa-bullhorn",
      title: "Safety Tips",
      description:
        "Receive health and safety recommendations based on your needs and destination.",
    },
    {
      icon: "fas fa-link",
      title: "Booking Links",
      description:
        "Save, share, or book your travel plan with a single click!",
    },
  ];

  return (
    <section id="services-container" className="bg-light">
      <div className="container">

        <h1 className="text-center Services-heading">
          Services
        </h1>

        <div className="row g-4">

          {services.map((service, index) => (
            <div
              className="col-md-4 Services-cards"
              key={index}
            >
              <div className="box text-center p-4 bg-white rounded shadow">

                <i className={`${service.icon} fa-3x mb-3`}></i>

                <h3>{service.title}</h3>

                <p>{service.description}</p>

              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Services;
