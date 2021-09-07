import MediaSetLayout from '../components/MediaSetLayout';
import PhotoThumb from '../components/PhotoThumb';
import { getPhotos } from '../services/fetchData';

const HomePage = ({ photos }) => {
  return (
    <MediaSetLayout applyGridCSS={true}>
      { photos.map((p, i) => <PhotoThumb key={p._id} image={p} index={i} />) }
    </MediaSetLayout>
  );
}

export const getStaticProps = async _ => {
  const photos = await getPhotos({ photo_set: "Assorted", sort: '{ "index": 1 }' });
  return { props: { photos } };
}

export default HomePage;
