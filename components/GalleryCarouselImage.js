import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";

const GalleryCarouselImage = ({ image, active })  => {

  const [ imageObjectURL, setObjURL ] = useState("");
  const animation = useAnimation();
  const initial = { opacity: 0 };
  const animate = { opacity: 1 };

  useEffect(async () => {
    const img = new Image();
    const blob = await fetch(image.photo_url).then(res => res.blob());
    const objURL = URL.createObjectURL(blob);
    img.onload = e => URL.revokeObjectURL(e.target.src);
    setObjURL(objURL);
    setTimeout(() => { img.src = objURL }, 100);
  }, [image.photo_url]);

  return <div className={`carousel-item${active ? " active" : ""}`}>
    <motion.img
      src={imageObjectURL}
      animate={animation}
      variants={{ initial, animate, transition: { duration: .5 } }}
      exit={initial}
      onLoad={async e => { animation.set(initial); await animation.start(animate) }}
    />
  </div>
}

export default GalleryCarouselImage;
