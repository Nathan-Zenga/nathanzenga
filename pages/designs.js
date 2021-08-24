import { useEffect } from 'react';
import DesignWorkSlide from '../components/DesignWorkSlide';
import Meta from '../components/Meta';
import { getDesignWork } from '../services/fetchData';

const DesignsPage = ({ designs, design_docs }) => {
  useEffect(() => {
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

    $("#designs-carousel").delay(250).fadeTo(400, 1);
    $("#designs-carousel").on("slide.bs.carousel", () => { $("video").trigger("pause") });
    $("#designs-carousel").on("slid.bs.carousel", () => { $(".design-item.active video").trigger("play") });
  }, []);

  const { title, ogTitle } = Meta.defaultProps;
  return (
    <>
    <Meta title={`Designs - ${title}`} ogTitle={`Designs - ${ogTitle}`} />
    <div className="carousel-container container">
      <div id="designs-carousel" className="carousel slide carousel-fade" data-interval="false" style={{ opacity: 0 }}>
        <div className="carousel-inner"> {
          designs.map((item, i) => {
            return <DesignWorkSlide
                    key={item._id}
                    item={item}
                    design_docs={design_docs.filter(d => d.photo_set.includes(item.d_id))}
                    index={i} />
          })
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
    </>
  );
}

export const getStaticProps = async _ => {
  const { designs, design_docs } = await getDesignWork();
  return { props: { designs, design_docs } };
}

export default DesignsPage;
