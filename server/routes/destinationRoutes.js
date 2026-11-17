import express from "express";

const router = express.Router();

const destinations = [
  {
    id: 0,
    name: "Paris, France",
    image: "/assets/pics/PARIS 2.jpg",
    description:
      "The city of love and home to the Eiffel Tower.",
  },
  {
    id: 1,
    name: "New York, USA",
    image: "/assets/pics/nyc 5.jpg",
    description:
      "The city that never sleeps, featuring Times Square.",
  },
  {
    id: 2,
    name: "Tokyo, Japan",
    image: "/assets/pics/tokyo.avif",
    description:
      "A bustling metropolis blending tradition and modernity.",
  },
  {
    id: 3,
    name: "Swiss Alps, Switzerland",
    image: "/assets/pics/swiss 2.jpg",
    description:
      "Stunning mountain ranges perfect for skiing and hiking.",
  },
  {
    id: 4,
    name: "Dubai, UAE",
    image: "/assets/pics/dubai 2.jpg",
    description:
      "Famous for the Burj Khalifa and luxury lifestyle.",
  },
  {
    id: 5,
    name: "Sydney, Australia",
    image: "/assets/pics/sydney 3.jpg",
    description:
      "Home to the Opera House and stunning beaches.",
  },
  {
    id: 6,
    name: "Rome, Italy",
    image: "/assets/pics/rome.jpg",
    description:
      "The Eternal City with ancient ruins and rich history.",
  },
  {
    id: 7,
    name: "Bali, Indonesia",
    image: "/assets/pics/BALI 2.jpg",
    description:
      "A tropical paradise known for its beaches and temples.",
  },
  {
    id: 8,
    name: "Maldives",
    image: "/assets/pics/maldives 2.jpg",
    description:
      "Idyllic islands famous for luxury resorts and clear waters.",
  },
 
];

router.get("/", (req, res) => {
  res.json({
    success: true,
    destinations
  });
});

export default router;