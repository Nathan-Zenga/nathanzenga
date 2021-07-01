import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Statcounter from '../Statcounter';

class Artwork extends Component {
  state = { artworks: [] }

  async componentDidMount() {
    document.title = "Artwork - Nathan Zenga";
    document.body.id = "artwork-page";

    const artworks = await $.post('/p', { photo_set: "Artwork", sort: `{ "index": 1 }` });
    this.setState({ artworks });
    Statcounter();

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
      <div className="container media-set"> {
        this.state.artworks.map((a, i) => (
          <div key={a._id} className="img-container media-container col-sm-6 float-left" style={{ display: "none" }}>
            <Link
              className="inner img"
              id={a.photo_set}
              to={{ pathname: "/gallery", search: `?set=Artwork`, state: { index: i } }}
              onContextMenu={() => false}
            ></Link>
          </div>
        ))
      } </div>
    );
  }
}

export default Artwork;
