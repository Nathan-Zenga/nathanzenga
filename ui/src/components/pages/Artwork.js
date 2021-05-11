import React, { Component } from 'react';

class Artwork extends Component {
  state = { artworks: [] }

  async componentDidMount() {
    document.title = "Artwork - Nathan Zenga";
    document.body.id = "artwork-page";

    const artworks = await $.post('/p', { photo_set: "Artwork", sort: `{ "index": 1 }` });
    this.setState({ artworks });
    this.state.artworks.forEach((a, i) => {
      const $img = $("<img>").css("width", "100%").appendTo($(".inner.img").eq(i));
      fetch(a.photo_url).then(res => res.blob()).then(blob => {
        const objURL = URL.createObjectURL(blob);
        $img.attr("src", objURL).one("load", () => {
          URL.revokeObjectURL(objURL);
          $img.closest(".img-container").delay(i * 200).fadeIn(500);
        });
      });
    })
  }

  render() {
    return (
      <div className="container content img-set"> {
        this.state.artworks.map(a => (
          <div key={a._id} className="img-container media-container col-sm-6 float-left" style={{ display: "none" }}>
            <div className="inner img" id={a.photo_set} onContextMenu={() => false}></div>
          </div>
        ))
      } </div>
    );
  }
}

export default Artwork;
