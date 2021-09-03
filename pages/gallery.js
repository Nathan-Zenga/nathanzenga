import GalleryImage from '../components/GalleryCarouselImage';
import { getPhotos } from '../services/fetchData';

const Gallery = ({ photos, position }) => {
  return (
    <div className="container" style={{ padding: 0 }}>
      <div id="gallery-carousel" className="carousel slide carousel-fade" onContextMenu={() => false}>
        <ol className="carousel-indicators">{
          photos.map((p, i) => {
            const active = (i+1) === parseInt(position) ? "active" : "";
            return <li key={"image-" + i} data-target="#gallery-carousel" data-slide-to={i} className={active}></li>
          })
        }</ol>

        <div className="carousel-inner">{
          photos.map((p, i) => <GalleryImage key={p._id} active={(i+1) === parseInt(position)} image={p} />)
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
    </div>
  );
}

export const getServerSideProps = async ctx => {
  const photos = await getPhotos({ photo_set: ctx.query.set, sort: '{ "index": 1 }' });
  return { props: { photos, position: ctx.query.image || 1 } };
}

export default Gallery;
