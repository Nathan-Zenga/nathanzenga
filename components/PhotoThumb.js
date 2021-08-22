import Link from 'next/link';
import React, { Component } from 'react';

class PhotoThumb extends Component {

  constructor(props) {
    super(props);
    this.state = { image: props.image, index: props.index, imageObjectURL: "" };
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
    const { image, index, imageObjectURL } = this.state;
    const imageContainerClass = "img-container media-container" + this.imageOrientation(index);
    return (
      <div className={imageContainerClass}>
        <Link href={`/gallery/${image.photo_set}/${!isNaN(index) ? index + 1 : ""}`}>
          <a className="inner img"
             id={image.photo_set}
             style={{ backgroundImage: `url(${imageObjectURL})` }}
             onContextMenu={_ => false}>
          </a>
        </Link>
      </div>
    )
  }
}

export default PhotoThumb;
