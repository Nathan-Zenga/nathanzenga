import Statcounter from '../components/Statcounter';
import { motion } from 'framer-motion';
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

    $(window).on("touchstart", function() {
      $(".design-item.active video").each((i, video) => {
        var playing = video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2;
        if (!playing) video.play();
      });
    });

    return function cleanup() {
      $("#designs-carousel").off("slide.bs.carousel slid.bs.carousel");
      $(window).off("touchstart");
    }
  }, []);

  const { title, ogTitle } = Meta.defaultProps;
  return (
    <>
    <Meta title={`Designs - ${title}`} ogTitle={`Designs - ${ogTitle}`} />
    <motion.div
      className="carousel-container container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: .5 }}
    >
      <div id="designs-carousel" className="carousel slide carousel-fade" data-interval="false" style={{ opacity: 0 }}>
        <div className="carousel-inner"> {
          designs.map((item, i) => {
            const docs = design_docs.filter(d => d.photo_set.includes(item.d_id));
            return <DesignWorkSlide key={item._id} item={item} design_docs={docs} index={i} />
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
    </motion.div>

    <Statcounter />
    </>
  );
}

export const getStaticProps = async _ => {
  const { designs, design_docs } = await getDesignWork({ hidden: false });
  return { props: { designs, design_docs }, revalidate: 60 };
}

export default DesignsPage;
