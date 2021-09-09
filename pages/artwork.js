import Meta from '../components/Meta';
import ImageThumb from '../components/ImageThumb';
import { getPhotos } from '../services/fetchData';
import MediaSetLayout from '../components/MediaSetLayout';

const ArtworkPage = ({ artwork }) => {
  const { title, ogTitle } = Meta.defaultProps;
  return (
    <>
    <Meta title={`Artwork - ${title}`} ogTitle={`Artwork - ${ogTitle}`} />
    <MediaSetLayout>
      { artwork.map((img, i) => <ImageThumb key={img._id} image={img} index={i} extraImgCSS={{ height: "auto" }} />) }
    </MediaSetLayout>
    </>
  );
}

export const getStaticProps = async _ => {
  const artwork = await getPhotos({ photo_set: "Artwork", sort: '{ "index": 1 }' });
  return { props: { artwork } };
}

export default ArtworkPage;
