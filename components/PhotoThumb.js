import Link from 'next/link';
import React, { Component } from 'react';
import { motion } from "framer-motion";

class PhotoThumb extends Component {

  constructor(props) {
    super(props);
    this.state = { ...props, imageObjectURL: "" };
  }

  async componentDidMount() {
    const { image } = this.state;
    const img = new Image();
    const blob = await fetch(image.photo_url).then(res => res.blob());
    const objURL = URL.createObjectURL(blob);
    img.onload = e => URL.revokeObjectURL(e.target.src);
    this.setState({ imageObjectURL: objURL });
    setTimeout(() => { img.src = objURL }, 100);
  }

  imageOrientation(index) {
    var dir = "";
    switch (this.state.image.orientation) {
      case "portrait": dir = " vertical"; break;
      case "landscape": dir = index % 2 == 0 ? " horizontal" : ""; break;
    }
    return dir
  }

  render() {
    const { image, imageObjectURL, label, index } = this.state;
    const imageContainerClass = "img-container media-container" + this.imageOrientation(index);
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
             style={{ backgroundImage: `url(${imageObjectURL})` }}
             onContextMenu={e => false}>
          </a>
        </Link>
        { label ? <label>{image.photo_set}</label> : <></> }
      </motion.div>
    )
  }
}

export default PhotoThumb;
