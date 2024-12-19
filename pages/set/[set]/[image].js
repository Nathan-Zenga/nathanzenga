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

        <CarouselControlLink set={set} image={prev_image} direction="prev" sr_text="Previous" />
        <CarouselControlLink set={set} image={next_image} direction="next" sr_text="Next" />
      </div>
    </div>

    <Statcounter />
    </>
  );
}

const CarouselControlLink = ({ set, image, direction, sr_text }) => {
  return (
    <Link
      href={`/set/${set.toLowerCase().replace(/ /g, "-")}/${image}`}
      scroll={false}
      className={`carousel-control-${direction}`}
      role="button"
      data-slide={direction}
    >
      <span className={`carousel-control-${direction}-icon fal fa-angle-${direction == "prev" ? "left" : "right"}`} aria-hidden="true"></span>
      <span className="sr-only">{sr_text}</span>
    </Link>
  )
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
