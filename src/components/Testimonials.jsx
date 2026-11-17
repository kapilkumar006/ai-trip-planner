function Testimonials() {
  const testimonials = [
    {
      name: "John Doe",
      role: "Traveler",
      message:
        "The best travel experience of my life! Everything was so well organized, and the destinations were amazing. Highly recommend!",
    },
    {
      name: "Jane Smith",
      role: "Explorer",
      message:
        "A fantastic adventure! The service was top-notch, and the accommodations were perfect. Can't wait for the next trip!",
    },
    {
      name: "Michael Lee",
      role: "Adventurer",
      message:
        "An unforgettable journey. The guides were friendly, knowledgeable, and made the trip so much more enjoyable.",
    },
    {
      name: "Emily Green",
      role: "Wanderlust",
      message:
        "From booking to the final day, everything was flawless. I felt completely taken care of throughout the entire trip!",
    },
  ];

  return (
    <section className="testimonials">
      <div className="container">

        <h1 className="text-center Travelers-heading">
          What Our Travelers Say
        </h1>

        <div className="row g-4">

          {testimonials.map((testimonial, index) => (
            <div
              className="col-md-3 Travelers-cards"
              key={index}
            >
              <div className="testimonial text-center p-4 bg-white rounded shadow">

                <p>"{testimonial.message}"</p>

                <h3>{testimonial.name}</h3>

                <p>{testimonial.role}</p>

              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Testimonials;