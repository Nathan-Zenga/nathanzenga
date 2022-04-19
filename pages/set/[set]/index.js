import Statcounter from '../../../components/Statcounter';
import MediaSetLayout from '../../../components/MediaSetLayout';
import Meta from '../../../components/Meta';
import ImageThumb from '../../../components/ImageThumb';
import { getPhotos } from '../../../services/fetchData';

const GallerySetPage = ({ photos, set }) => {
  const isGrid = true;
  const { title, ogTitle } = Meta.defaultProps;

  return (
    <>
    <Meta title={`${photos[0].photo_set} - ${title}`} ogTitle={`${photos[0].photo_set} - ${ogTitle}`} />
    <MediaSetLayout applyGridCSS={isGrid}>
      { photos.map((p, i) => <ImageThumb key={p._id} image={p} index={i} link={`/set/${set}/${i+1}`} gridCSSApplied={isGrid} />) }
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
  if (!photos.length) return { notFound: true };
  return { props: { photos, set: params.set }, revalidate: 60 };
}

export default GallerySetPage;
