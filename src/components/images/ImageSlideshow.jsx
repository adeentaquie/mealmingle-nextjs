// src/components/ImageSlideshow.js
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { nextImage } from "../../redux/slices/slideshowSlice";
import Image from "next/image";
import classes from "./ImageSlideShow.module.css";

const images = [
 
  { src: "/images/strawberrysmoothie.jpg", alt: "A delicious schnitzel" },
  { src: "/images/homemadesubwaysub.jpg", alt: "A delicious tomato salad" },
  { src: "/images/nutellacakeslice.jpg", alt: "A delicious, juicy burger" },
  { src: "/images/pasta.jpg", alt: "A delicious, juicy burger" },
  { src: "/images/potatowedges.jpg", alt: "A delicious, juicy burger" },
  { src: "/images/redvelvetcake.jpg", alt: "A delicious, juicy burger" },
  { src: "/images/smokeyhouse.jpg", alt: "A delicious, juicy burger" },

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
              width={600}
              height={400}
              className={`${classes.image} ${classes.active}`}
              priority={index === 0}
              />
          )}
        </div>
      ))}
    </div>
  );
}
