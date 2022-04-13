import Statcounter from '../../components/Statcounter';
import MediaSetLayout from '../../components/MediaSetLayout';
import Meta from '../../components/Meta';
import ImageThumb from '../../components/ImageThumb';
import { getPhotos } from '../../services/fetchData';

const GallerySetPage = ({ photos }) => {
  const isGrid = true;
  const { title, ogTitle } = Meta.defaultProps;
  const photo_set = photos[0]?.photo_set || "Gallery Not Found";
  return (
    <>
    <Meta title={`${photo_set} - ${title}`} ogTitle={`${photo_set} - ${ogTitle}`} />
    <MediaSetLayout applyGridCSS={isGrid}>
      { photos.map((p, i) => <ImageThumb key={p._id} image={p} index={i} link="/gallery" gridCSSApplied={isGrid} />) }
    </MediaSetLayout>
    <Statcounter />
    </>
  );
}

export const getStaticPaths = async _ => {
  const photos = await getPhotos({ photo_set_cover: true, sort: { photo_set_index: 1 } });
  const paths = photos.map(p => ({ params: { set: p.photo_set.toLowerCase().replace(/ /g, "-") } }));
  return { paths, fallback: false };
}

export const getStaticProps = async ({ params }) => {
  const photos = await getPhotos({ photo_set: params.set, sort: { index: 1 } });
  return { props: { photos }, revalidate: 60 };
}

export default GallerySetPage;
