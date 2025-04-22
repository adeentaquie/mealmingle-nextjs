import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { nextImage } from "../../redux/slices/slideshowSlice";
import Image from "next/image";
import classes from "./ImageSlideShow.module.css";

const images = [
  { src: "/images/strawberrysmoothie.jpg", alt: "Strawberry Smoothie" },
  { src: "/images/homemadesubwaysub.jpg", alt: "Homemade Subway Sub" },
  { src: "/images/nutellacakeslice.jpg", alt: "Nutella Cake Slice" },
  { src: "/images/pasta.jpg", alt: "Creamy Pasta" },
  { src: "/images/potatowedges.jpg", alt: "Potato Wedges" },
  { src: "/images/redvelvetcake.jpg", alt: "Red Velvet Cake" },
  { src: "/images/smokeyhouse.jpg", alt: "Smokey House" },
];

export default function ImageSlideshow() {
  const dispatch = useDispatch();
  const { currentImageIndex } = useSelector((state) => state.slideshow);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(nextImage());
    }, 3000);
    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <div className={classes.slideshow}>
      {images.map((image, index) => (
        <div key={index} className={classes.slideWrapper}>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className={`${classes.image} ${
              index === currentImageIndex ? classes.active : ""
            }`}
            priority={index === 0}
          />
          <div
            className={`${classes.caption} ${
              index === currentImageIndex ? classes.captionActive : ""
            }`}
          >
            {image.alt}
          </div>
        </div>
      ))}
    </div>
  );
}
