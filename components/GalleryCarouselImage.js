import { useEffect, useState } from "react";

const GalleryCarouselImage = ({ image, active })  => {

  const [ imageObjectURL, setObjURL ] = useState("");

  useEffect(async () => {
    const img = new Image();
    const blob = await fetch(image.photo_url).then(res => res.blob());
    const objURL = URL.createObjectURL(blob);
    img.onload = e => URL.revokeObjectURL(e.target.src);
    setObjURL(objURL);
    setTimeout(() => { img.src = objURL }, 100);
  }, []);

  return <div className={`carousel-item${active ? " active" : ""}`}><img src={imageObjectURL} /></div>
}

export default GalleryCarouselImage;
