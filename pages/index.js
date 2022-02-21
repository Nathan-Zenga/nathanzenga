import Statcounter from '../components/Statcounter';
import MediaSetLayout from '../components/MediaSetLayout';
import ImageThumb from '../components/ImageThumb';
import { getPhotos } from '../services/fetchData';

const HomePage = ({ photos }) => {
  const isGrid = true;
  return (
    <>
    <MediaSetLayout applyGridCSS={isGrid}>
      { photos.map((p, i) => <ImageThumb key={p._id} image={p} index={i} gridCSSApplied={isGrid} />) }
    </MediaSetLayout>
    <Statcounter />
    </>
  );
}

export const getStaticProps = async _ => {
  const photos = await getPhotos({ photo_set: "Assorted", sort: '{ "index": 1 }' });
  return { props: { photos }, revalidate: 60 };
}

export default HomePage;
