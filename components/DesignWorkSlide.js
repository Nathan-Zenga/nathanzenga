import React, { Component } from 'react';

class DesignWorkSlide extends Component {
  constructor(props) {
      super(props);
      this.state = { ...props }
  }

  render() {
    const { item, design_docs, index: i } = this.state;
    return (
      <div className={"carousel-item design-item" + (i == 0 ? " active" : "")} id={item.d_id}>
        <div className="design-img-dt-container">
          <div className="container">
            <div className="design-img-dt slideshow">{
              design_docs.map(d => d.orientation === "landscape" ? <SlideMedia key={d._id} doc={d} /> : "")
            }</div>
          </div>
        </div>

        <div className="design-img-mb-container">
          <div className="container">
            <div className="row">
              <div className="col-5 order-last">
                <div className="design-img-mb slideshow">{
                  design_docs.map(d => d.orientation === "portrait" ? <SlideMedia key={d._id} doc={d} /> : "")
                }</div>
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
    );
  }
}

class SlideMedia extends Component {
  render() {
    const { doc } = this.props;
    const img = <img className="img" src={doc.photo_url} alt={doc.photo_title} />;
    const video = <video className="img" playsInline autoPlay muted loop><source src={doc.photo_url} /></video>;
    return (doc.r_type === "image") ? img : (doc.r_type === "video") ? video : "";
  }
}

export default DesignWorkSlide;
