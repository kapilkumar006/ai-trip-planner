import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="home">

      <video
        className="video-slide"
        src="/assets/pics/ocean.mp4"
        autoPlay
        muted
        loop
      />

      <div className="content text-center">
        <h1 className="display-4">
          Your Adventure, Our Plan
        </h1>

        <p className="lead">
          Discover seamless travel, tailored to your dream destinations
        </p>

        <Link
          to="/destinations"
          className="btn btn-primary btn-lg"
        >
          Start Exploring
        </Link>
      </div>

    </section>
  );
}

export default Hero;