import React, { Component } from 'react';

class Gallery extends Component {
  state = { photos: [] };

  async componentDidMount() {
    const url = new URL(location.href);
    const photo_set = url.searchParams.get("set");
    document.title = `${photo_set} - Gallery - Nathan Zenga`;
    document.body.id = "gallery-page";

    if (!photo_set) return;
    const photos = await $.post("/p", { photo_set, sort: '{ "index": 1 }' });
    this.setState({ photos });

    this.state.photos.forEach((p, i, arr) => {
      const $carousel = $("#gallery-carousel .carousel-inner");
      const $item = $("<div>").addClass("carousel-item" + (i == 0 ? " active" : "")).appendTo($carousel);
      const $image = $("<img>").fadeTo(0, 0).appendTo($item).on("load", e => {
        $(e.target).fadeTo(500, 1);
        URL.revokeObjectURL(e.target.src);
      });

      $("#gallery-carousel .carousel-indicators").append(() => {
        return `<li data-target="#gallery-carousel" data-slide-to="${i}" class="${i == 0 ? "active" : ""}"></li>`;
      });

      fetch(p.photo_url).then(res => res.blob()).then(blob => {
        $image.attr("src", URL.createObjectURL(blob));
      });
    });
  }

  render() {
    return (
      <div className="container" style={{ padding: 0 }}>
        <div id="gallery-carousel" className="carousel slide carousel-fade" onContextMenu={() => false}>
          <ol className="carousel-indicators"></ol>

          <div className="carousel-inner"></div>

          <a className="carousel-control-prev" href="#gallery-carousel" role="button" data-slide="prev">
            <span className="carousel-control-prev-icon fal fa-angle-left" aria-hidden="true"></span>
            <span className="sr-only">Previous</span>
          </a>

          <a className="carousel-control-next" href="#gallery-carousel" role="button" data-slide="next">
            <span className="carousel-control-next-icon fal fa-angle-right" aria-hidden="true"></span>
            <span className="sr-only">Next</span>
          </a>
        </div>
      </div>
    );
  }
}

export default Gallery;
