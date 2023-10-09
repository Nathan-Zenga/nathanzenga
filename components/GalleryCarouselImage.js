import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";

const GalleryCarouselImage = ({ image, active })  => {

  const [ imageObjectURL, setObjURL ] = useState("");
  const animation = useAnimation();
  const initial = { opacity: 0 };

  useEffect(() => {
    fetch(image.photo_url).then(res => res.blob()).then(blob => {
      const img = new Image();
      const objURL = URL.createObjectURL(blob);
      img.onload = e => URL.revokeObjectURL(e.target.src);
      setObjURL(objURL);
      setTimeout(() => { img.src = objURL }, 100);
    });
  }, [image.photo_url]);

  return <div className={`carousel-item${active ? " active" : ""}`}>
    <motion.img
      src={imageObjectURL}
      alt={image.photo_title}
      animate={animation}
      initial={initial}
      exit={initial}
      onLoad={async e => { animation.set(initial); await animation.start({ opacity: 1, transition: { duration: .5 } }) }}
    />
  </div>
}

export default GalleryCarouselImage;
