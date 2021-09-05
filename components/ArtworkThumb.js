import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion, useAnimation } from "framer-motion";

const ArtworkThumb = ({ image, index }) => {

  const [ imageObjectURL, setImageObjectURL ] = useState("");
  const animation = useAnimation();

  useEffect(async () => {
    if (imageObjectURL !== "") return;
    const img = new Image();
    const blob = await fetch(image.photo_url).then(res => res.blob());
    const objURL = URL.createObjectURL(blob);
    img.onload = e => URL.revokeObjectURL(e.target.src);
    setImageObjectURL(objURL);
    setTimeout(() => { img.src = objURL }, 100);
  }, [imageObjectURL]);

  const imageContainerClass = "img-container media-container col-sm-6 float-left";
  const query = { set: image.photo_set.toLowerCase() };
  if (!isNaN(index)) query.image = index + 1;
  return (
    <motion.div
      className={imageContainerClass}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: .5 }}
    >
      <Link href={{ pathname: "/gallery", query }}>
        <a className="inner img"
            id={image.photo_set}
            onContextMenu={e => false}>
          <motion.img
            src={imageObjectURL}
            style={{ width: "100%", opacity: 0 }}
            animate={animation}
            onLoad={async e => { await animation.start({ opacity: 1 }) }}
          />
        </a>
      </Link>
    </motion.div>
  )
}

export default ArtworkThumb;
