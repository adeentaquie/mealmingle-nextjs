// src/components/ImageSlideshow.js
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { nextImage } from "../../redux/slices/slideshowSlice";
import Image from "next/image";
import classes from "./ImageSlideShow.module.css";

const images = [
  { src: "/images/burger.jpg", alt: "A delicious, juicy burger" },
  { src: "/images/curry.jpg", alt: "A delicious, spicy curry" },
  { src: "/images/dumplings.jpg", alt: "Steamed dumplings" },
  { src: "/images/macncheese.jpg", alt: "Mac and cheese" },
  { src: "/images/pizza.jpg", alt: "A delicious pizza" },
  { src: "/images/schnitzel.jpg", alt: "A delicious schnitzel" },
  { src: "/images/tomato-salad.jpg", alt: "A delicious tomato salad" },
];

export default function ImageSlideshow() {
  const dispatch = useDispatch();
  const { currentImageIndex } = useSelector((state) => state.slideshow);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(nextImage());
    }, 2000);

    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <div className={classes.slideshow}>
      {images.map((image, index) => (
        <div key={index}>
          {index === currentImageIndex && (
            <Image
              src={image.src}
              alt={image.alt}
              width={800}
              height={400}
              className={`${classes.image} ${classes.active}`}
              priority={true}
            />
          )}
        </div>
      ))}
    </div>
  );
}
