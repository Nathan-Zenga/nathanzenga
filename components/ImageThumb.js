import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion, useAnimation } from "framer-motion";

const ImageThumb = ({ image, label, index, link, gridCSSApplied, extraImgCSS }) => {

  const [ imageObjectURL, setImageObjectURL ] = useState("");
  const animation = useAnimation();

  useEffect(() => {
    if (imageObjectURL !== "") return;
    fetch(image.photo_url).then(res => res.blob()).then(blob => {
      const img = new Image();
      const objURL = URL.createObjectURL(blob);
      img.onload = e => URL.revokeObjectURL(e.target.src);
      setImageObjectURL(objURL);
      setTimeout(() => { img.src = objURL }, 100);
    });
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
  const imageContainerClass = "img-container" + isGrid;

  return (
    <motion.div
      className={imageContainerClass}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: .5 }}
    >
      <Link
        href={{ pathname: link }}
        scroll={false}
        className="img-anchor"
        data-id={image.photo_set}
        title={image.photo_set}
        onContextMenu={e => false}
      >
        <motion.img
          src={imageObjectURL}
          alt={image.photo_title}
          style={{ opacity: 0, ...extraImgCSS }}
          animate={animation}
          onLoad={async e => { await animation.start({ opacity: 1 }) }}
        />
      </Link>
      { label && (
        <label>
          <Link href={{ pathname: link }} scroll={false}>
            {image.photo_set}
          </Link>
        </label>
      ) }
    </motion.div>
  )
}

export default ImageThumb;
