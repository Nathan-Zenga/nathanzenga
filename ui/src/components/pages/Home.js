import React, { Component } from 'react';

class Home extends Component {
  state = { photos: [] }; mobile;

  async componentDidMount() {
    document.title = "Nathan Zenga";
    document.body.id = "home-page";

    const photos = await $.post('/p', { photo_set: "Assorted", sort: '{ "index": 1 }' });
    this.setState({ photos });

    const galleryRender = () => {
      if (this.mobile === window.innerWidth < 576) { return false; }
      this.mobile = window.innerWidth < 576;
      const $carousel = $("#overview-carousel").children().empty().end();
      this.state.photos.forEach((img, i) => {
        const width = this.mobile ? "100vw" : "auto";
        const height = this.mobile ? "auto" : "100%";
        const $img = $("<img>").addClass("img").fadeTo(0, 0).appendTo($carousel.children()).css({ width, height });

        fetch(img.photo_url).then(res => res.blob()).then(blob => {
          const objURL = URL.createObjectURL(blob);
          $img.attr("src", objURL).on("load", e => {
            URL.revokeObjectURL(objURL);
            $img.delay(i * 200).fadeTo(1000, 1);
          });
        });
      })
    }

    galleryRender(); $(window).off("resize").on("resize", () => galleryRender());

    $("#overview-carousel-controls .control.left").on("click", () => {
      $("#overview-carousel").stop().animate({ scrollLeft: "-=" + ($("#overview-carousel").width() * .75) }, 700);
    });

    $("#overview-carousel-controls .control.right").on("click", () => {
      $("#overview-carousel").stop().animate({ scrollLeft: "+=" + ($("#overview-carousel").width() * .75) }, 700);
    });
  }

  render() {
    return (
      <>
        <div id="overview-carousel-controls">
          <a className="fal fa-angle-left control left"></a>
          <span className="sr-only">Previous</span>

          <a className="fal fa-angle-right control right"></a>
          <span className="sr-only">Next</span>
        </div>

        <div id="overview-carousel">
          <div id="img-container"></div>
        </div>
      </>
    );
  }
}

export default Home;
