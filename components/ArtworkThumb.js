import Link from 'next/link';
import React, { Component } from 'react';
import { motion } from "framer-motion";

class ArtworkThumb extends Component {

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

  render() {
    const { image, imageObjectURL, index } = this.state;
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
            <img src={imageObjectURL} style={{ width: "100%" }} />
          </a>
        </Link>
      </motion.div>
    )
  }
}

export default ArtworkThumb;
