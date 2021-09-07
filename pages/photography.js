import MediaSetLayout from '../components/MediaSetLayout';
import Meta from '../components/Meta';
import PhotoThumb from '../components/PhotoThumb';
import { getPhotos } from '../services/fetchData';

const PhotographyPage = ({ photos }) => {
  const { title, ogTitle } = Meta.defaultProps;
  return (
    <>
    <Meta title={`Photography - ${title}`} ogTitle={`Photography - ${ogTitle}`} />
    <MediaSetLayout applyGridCSS={true}>
      { photos.map(p => <PhotoThumb key={p._id} image={p} label={true} />) }
    </MediaSetLayout>
    </>
  );
}

export const getStaticProps = async _ => {
  const photos = await getPhotos({ photo_set_cover: true, sort: '{ "photo_set_index": 1 }' });
  return { props: { photos } };
}

export default PhotographyPage;
