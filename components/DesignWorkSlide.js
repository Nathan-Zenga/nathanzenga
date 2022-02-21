const DesignWorkSlide = ({ item, design_sets, index: i }) => {

  return <div className={`carousel-item design-item${i == 0 ? " active" : ""}`} id={item.d_id}>
    <div className="design-img-dt-container">
      <div className="container">
        <div className="design-img-dt slideshow">{
          design_sets.map(d => d.orientation === "landscape" ? <SlideMedia key={d._id} doc={d} /> : null)
        }</div>
      </div>
    </div>

    <div className="design-img-mb-container">
      <div className="container">
        <div className="row">
          <div className="col-5 order-last">
            <div className="design-img-mb slideshow">{
              design_sets.map(d => d.orientation === "portrait" ? <SlideMedia key={d._id} doc={d} /> : null)
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
}

const SlideMedia = ({ doc }) => {
  const img = <img className="img" src={doc.photo_url} alt={doc.photo_title} />;
  const video = <video className="img" playsInline autoPlay muted loop src={doc.photo_url} />;
  return (doc.r_type === "image") ? img : (doc.r_type === "video") ? video : null;
}

export default DesignWorkSlide;
