import Link from 'next/link';
import Statcounter from '../../../components/Statcounter';
import Meta from '../../../components/Meta';
import GalleryImage from '../../../components/GalleryCarouselImage';
import { getPhotos } from '../../../services/fetchData';

const Gallery = ({ photo, set, next_image, prev_image }) => {
  const { title, ogTitle } = Meta.defaultProps;

  return (
    <>
    <Meta title={`${set} - ${title}`} ogTitle={`${set} - ${ogTitle}`} />
    <div className="container" style={{ padding: 0 }}>
      <div id="gallery-carousel" className="carousel slide carousel-fade" onContextMenu={() => false}>
        <div className="carousel-inner">
          <GalleryImage active={true} image={photo} />
        </div>

        <Link
          href={`/set/${set.toLowerCase().replace(/ /g, "-")}/${prev_image}`}
          scroll={false}
          className="carousel-control-prev"
          role="button"
          data-slide="prev"
        >
          <span className="carousel-control-prev-icon fal fa-angle-left" aria-hidden="true"></span>
          <span className="sr-only">Previous</span>
        </Link>

        <Link
          href={`/set/${set.toLowerCase().replace(/ /g, "-")}/${next_image}`}
          scroll={false}
          className="carousel-control-next"
          role="button"
          data-slide="next"
        >
          <span className="carousel-control-next-icon fal fa-angle-right" aria-hidden="true"></span>
          <span className="sr-only">Next</span>
        </Link>
      </div>
    </div>

    <Statcounter />
    </>
  );
}

export const getStaticPaths = async _ => {
  const photos = await getPhotos({ photo_set: { $not: /^design-/i }, sort: { photo_set: 1, index: 1 } });
  const paths = photos.map(p => ({
    params: { set: p.photo_set.toLowerCase().replace(/ /g, "-"), image: p.index.toString() }
  }));
  return { paths, fallback: false };
}

export const getStaticProps = async ({ params }) => {
  const photos = await getPhotos({ photo_set: params.set });
  const photo = photos.find(p => p.index == params.image);
  if (!photo) return { notFound: true };
  const next_image = photo.index >= photos.length ? 1 : photo.index+1;
  const prev_image = photo.index <= 1 ? photos.length : photo.index-1;
  return { props: { photo, set: photo.photo_set, next_image, prev_image }, revalidate: 60 };
}

export default Gallery;
