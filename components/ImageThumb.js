import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion, useAnimation } from "framer-motion";

const ImageThumb = ({ image, label, index, gridCSSApplied, extraImgCSS }) => {

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
  }, []);

  const imageOrientation = index => {
    var dir = "";
    switch (image.orientation) {
      case "portrait": dir = " vertical"; break;
      case "landscape": dir = index % 2 == 0 ? " horizontal" : ""; break;
      case "square": dir = " square"; break;
    }
    return dir
  }

  const isGrid = gridCSSApplied ? imageOrientation(index) : " col-sm-6 float-left";
  const imageContainerClass = "img-container media-container" + isGrid;
  const idx = !isNaN(index) ? { image: index + 1 } : {};
  const query = { set: image.photo_set.toLowerCase(), ...idx };

  return (
    <motion.div
      className={imageContainerClass}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: .5 }}
    >
      <Link href={{ pathname: "/gallery", query }} scroll={false}>
        <a className="inner img"
            id={image.photo_set}
            onContextMenu={e => false}>
          <motion.img
            src={imageObjectURL}
            style={{ opacity: 0, ...extraImgCSS }}
            animate={animation}
            onLoad={async e => { await animation.start({ opacity: 1 }) }}
          />
        </a>
      </Link>
      { label ? <label>{image.photo_set}</label> : <></> }
    </motion.div>
  )
}

export default ImageThumb;
