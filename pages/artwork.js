import Meta from '../components/Meta';
import ArtworkThumb from '../components/ArtworkThumb';
import { getPhotos } from '../services/fetchData';
import MediaSetLayout from '../components/MediaSetLayout';

const ArtworkPage = ({ artwork }) => {
  const { title, ogTitle } = Meta.defaultProps;
  return (
    <>
    <Meta title={`Artwork - ${title}`} ogTitle={`Artwork - ${ogTitle}`} />
    <MediaSetLayout>
      { artwork.map((img, i) => <ArtworkThumb key={img._id} image={img} index={i} />) }
    </MediaSetLayout>
    </>
  );
}

export const getStaticProps = async _ => {
  const artwork = await getPhotos({ photo_set: "Artwork", sort: '{ "index": 1 }' });
  return { props: { artwork } };
}

export default ArtworkPage;
