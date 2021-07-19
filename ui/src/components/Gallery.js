import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Statcounter from './Statcounter';

class Gallery extends Component {
  state = {
    photos: null,
    photo_set: (new URL(location.href)).searchParams.get("set")
  };

  async componentDidMount() {
    const { photo_set } = this.state;
    const { index = 0 } = this.props.location.state || {};
    document.title = `${photo_set} - Gallery - Nathan Zenga`;
    document.body.id = "gallery-page";

    if (!photo_set) return;
    const photos = await $.post("/p", { photo_set, sort: '{ "index": 1 }' });
    this.setState({ photos });
    Statcounter();

    photos.forEach((p, i) => {
      const $carousel = $("#gallery-carousel .carousel-inner");
      const activeClass = i == index ? "active" : "";
      const $item = $("<div>").addClass("carousel-item " + activeClass).appendTo($carousel);
      const $image = $("<img>").fadeTo(0, 0).appendTo($item).on("load", e => {
        $(e.target).fadeTo(500, 1);
        URL.revokeObjectURL(e.target.src);
      });

      $("#gallery-carousel .carousel-indicators").append(() => {
        return `<li data-target="#gallery-carousel" data-slide-to="${i}" class="${activeClass}"></li>`;
      });

      fetch(p.photo_url).then(res => res.blob()).then(blob => {
        $image.attr("src", URL.createObjectURL(blob));
      });
    });
  }

  render() {
    if (!this.state.photo_set || this.state.photos != null && !this.state.photos.length) return <Redirect to="/gallery/not-found" />
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
