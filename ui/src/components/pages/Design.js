import React, { Component } from 'react';
import Statcounter from '../Statcounter';

class Design extends Component {
  state = { designs: [], design_docs: [] }

  async componentDidMount() {
    document.title = "Designs - Nathan Zenga";
    document.body.id = "design-page";

    !$().carousel && await $.getScript("https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/js/bootstrap.min.js");

    const { designs, design_docs } = await $.get("/designs/-");
    this.setState({ designs, design_docs });
    Statcounter();

    this.state.designs.forEach((item, i) => {
      this.state.design_docs.forEach(d => {
        if (d.photo_set.includes(item.d_id)) {
          const device = d.orientation === "landscape" ? "dt" : "mb";
          $(".design-img-" + device).eq(i).append(() => {
            const img = `<img class="img" src="${d.photo_url}" alt="${d.photo_title}">`;
            const video = `<video class="img" playsinline autoplay muted loop><source src="${d.photo_url}"></video>`;
            return (d.r_type === "image") ? img : (d.r_type === "video") ? video : "";
          })
        }
      })
    });

    $(".slideshow").each((i, slideshow) => {
      if ($(slideshow).children(".img").length > 1) {
        $(slideshow).children(".img:gt(0)").fadeTo(0, 0);
        setInterval(() => {
          $(slideshow).children('.img:first')
            .fadeTo(500, 0)
            .dequeue()
            .next()
            .trigger($(slideshow).closest(".carousel-item").hasClass("active") ? "play" : "pause")
            .fadeTo(500, 1)
            .end()
            .trigger("pause")
            .appendTo(slideshow);
        }, 4000);
      }
    });

    $("#designs-carousel").on("slide.bs.carousel", () => { $("video").trigger("pause") });
    $("#designs-carousel").on("slid.bs.carousel", () => { $(".design-item.active video").trigger("play") });
    $("#designs-carousel").fadeTo(1000, 1);
  }

  render() {
    return (
      <div className="carousel-container container" style={{ padding: 0 }}>
        <div id="designs-carousel" className="carousel slide carousel-fade" data-interval="false" style={{ opacity: 0 }}>
          <div className="carousel-inner"> {
            this.state.designs.map((item, i) => (
              <div className={"carousel-item design-item" + (i == 0 ? " active" : "")} id={item.photo_set} key={item._id}>
                <div className="design-img-dt-container">
                  <div className="container">
                    <div className="design-img-dt slideshow"></div>
                  </div>
                </div>

                <div className="design-img-mb-container">
                  <div className="container">
                    <div className="row">
                      <div className="col-5 order-last">
                        <div className="design-img-mb slideshow"></div>
                      </div>
                      <div className="col-7 order-first"></div>
                    </div>
                  </div>
                </div>

                <div className="design-info container">
                  <p>{item.text.client}</p>
                  <p><a className="link" href={item.link} target="_blank">View live demo</a></p>
                  <p>{item.text.description}</p>
                </div>
              </div>
            ))
          } </div>

          <a className="carousel-control-prev" href="#designs-carousel" role="button" data-slide="prev">
            <span className="carousel-control-prev-icon fal fa-angle-left" aria-hidden="true"></span>
            <span className="sr-only">Previous</span>
          </a>

          <a className="carousel-control-next" href="#designs-carousel" role="button" data-slide="next">
            <span className="carousel-control-next-icon fal fa-angle-right" aria-hidden="true"></span>
            <span className="sr-only">Next</span>
          </a>
        </div>
      </div>
    );
  }
}

export default Design;
