import GalleryImage from '../../../../components/GalleryCarouselImage';
import { getPhotos } from '../../../../services/fetchData';

const Gallery = ({ photos, position }) => {
  return (
    <div className="container" style={{ padding: 0 }}>
      <div id="gallery-carousel" className="carousel slide carousel-fade" onContextMenu={() => false}>
        <ol className="carousel-indicators"></ol>

        <div className="carousel-inner">{
          photos.map((p, i) => <GalleryImage active={(i+1) === parseInt(position)} key={p._id} image={p} />)
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

export const getStaticProps = async ctx => {
  const photos = await getPhotos({ photo_set: ctx.params.set, sort: '{ "index": 1 }' });
  return { props: { photos, position: ctx.params.position } };
}

export const getStaticPaths = async _ => {
  const photos = await getPhotos({ sort: '{ "photo_set": 1, "index": 1 }' });
  const paths = photos.map(p => ({
    params: { set: p.photo_set.toLowerCase(), position: `${p.index}` }
  }));
  return { paths, fallback: false };
}

export default Gallery;
