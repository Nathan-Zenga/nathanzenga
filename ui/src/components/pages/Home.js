import React, { Component } from 'react';
import { Link } from 'react-router-dom'

class Home extends Component {
  state = { photos: [] }; mobile;

  async componentDidMount() {
    document.title = "Nathan Zenga";
    document.body.id = "home-page";

    const photos = await $.post('/p', { photo_set: "Assorted", sort: '{ "index": 1 }' });
    this.setState({ photos });

    const $imgContainer = $("#home-page .img-container");
    if ($imgContainer.length) {
      if (!("grid" in document.body.style)) {
        $imgContainer.unwrap(".grid");
        $imgContainer.closest(".row").removeClass("grid-container");
        $imgContainer.addClass("col-sm-6 float-left").find(".inner.img").css("padding-top", "100%");
      } else {
        $(".grid-container").removeClass("row");
      }

      if ($(".horizontal:last").offset().top > $imgContainer.last().offset().top) {
        $(".horizontal:last").removeClass("horizontal");
      }
    }

    this.state.photos.forEach((p, i) => {
      const $img = $(".inner.img").eq(i);
      const image = new Image();
      image.onload = e => URL.revokeObjectURL(e.target.src);
      fetch(p.photo_url).then(res => res.blob()).then(blob => {
        const objURL = URL.createObjectURL(blob);
        $($img).css("background-image", "url("+objURL+")").closest(".img-container").delay(i * 200).fadeTo(500, 1);
        setTimeout(() => { image.src = objURL }, 100);
      });
    });
  }

  render() {
    return (
      <div className="container media-set">
        <div className="grid-container row">
          <div className="grid"> {
            this.state.photos.map((p, i) => {
              switch (p.orientation) {
                case "portrait": var dir = " vertical"; break;
                case "landscape": var dir = i % 2 == 0 ? " horizontal" : ""; break;
              }

              return (
                <div key={p._id} className={"img-container media-container" + dir} style={{ opacity: 0 }}>
                  <Link
                    className="inner img"
                    id={p.photo_set}
                    to={{ pathname: "/gallery", search: `?set=${p.photo_set}`, state: { index: i } }}
                    onContextMenu={() => false}
                  ></Link>
                </div>
              )
            })
          } </div>
        </div>
      </div>
    );
  }
}

export default Home;
