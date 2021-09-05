import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from "framer-motion";
import Meta from '../components/Meta';
import GalleryImage from '../components/GalleryCarouselImage';
import { getPhotos } from '../services/fetchData';

const Gallery = ({ photos, position }) => {
  const { title, ogTitle } = Meta.defaultProps;
  const set = photos.length ? photos[0].photo_set : "Missing Gallery";
  const router = useRouter();

  useEffect(() => { photos.length || router.replace("/404") }, [photos]);

  const showFirst = (index, array) => {
    let pos = !isNaN(position) ? parseInt(position) : 0;
    let showFirst = (index+1) === pos;
    showFirst = showFirst || (index == 0 && pos < 1);
    showFirst = showFirst || (index == array.length-1 && pos > array.length);
    return showFirst;
  }

  return (
    <>
    <Meta title={`${set} - ${title}`} ogTitle={`${set} - ${ogTitle}`} />
    <motion.div
      className="container"
      style={{ padding: 0 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: .5 }}
    >
      <div id="gallery-carousel" className="carousel slide carousel-fade" onContextMenu={() => false}>
        <ol className="carousel-indicators">{
          photos.map((p, i, a) => {
            const active = showFirst(i, a) ? "active" : "";
            return <li key={"image-" + i} data-target="#gallery-carousel" data-slide-to={i} className={active}></li>
          })
        }</ol>

        <div className="carousel-inner">{
          photos.map((p, i, a) => <GalleryImage key={p._id} active={showFirst(i, a)} image={p} />)
        }</div>

        <a className="carousel-control-prev" href="#gallery-carousel" role="button" data-slide="prev">
          <span className="carousel-control-prev-icon fal fa-angle-left" aria-hidden="true"></span>
          <span className="sr-only">Previous</span>
        </a>

        <a className="carousel-control-next" href="#gallery-carousel" role="button" data-slide="next">
          <span className="carousel-control-next-icon fal fa-angle-right" aria-hidden="true"></span>
          <span className="sr-only">Next</span>
        </a>
      </div>
    </motion.div>
    </>
  );
}

export const getServerSideProps = async ctx => {
  const photos = await getPhotos({ photo_set: ctx.query.set, sort: '{ "index": 1 }' });
  return { props: { photos, position: ctx.query.image || 1 } };
}

export default Gallery;
