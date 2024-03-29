import Statcounter from '../components/Statcounter';
import MediaSetLayout from '../components/MediaSetLayout';
import Meta from '../components/Meta';
import ImageThumb from '../components/ImageThumb';
import { getPhotos } from '../services/fetchData';

const PhotographyPage = ({ photos }) => {
  const isGrid = true;
  const { title, ogTitle } = Meta.defaultProps;
  return (
    <>
    <Meta title={`Photography - ${title}`} ogTitle={`Photography - ${ogTitle}`} />
    <MediaSetLayout applyGridCSS={isGrid}>
      { photos.map(p => <ImageThumb key={p._id} image={p} label={true} link={`/set/${p.photo_set.toLowerCase().replace(/ /g, "-")}`} gridCSSApplied={isGrid} />) }
    </MediaSetLayout>
    <Statcounter />
    </>
  );
}

export const getStaticProps = async _ => {
  const photos = await getPhotos({ photo_set_cover: true, sort: { photo_set_index: 1 } });
  return { props: { photos }, revalidate: 60 };
}

export default PhotographyPage;
