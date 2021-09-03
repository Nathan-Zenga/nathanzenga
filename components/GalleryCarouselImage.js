import React, { Component } from 'react';

class GalleryCarouselImage extends Component {

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
    const { active, imageObjectURL: url } = this.state;
    return (
      <div className={"carousel-item " + (active ? "active" : "")}>
        <img src={url} />
      </div>
    )
  }
}

export default GalleryCarouselImage;
