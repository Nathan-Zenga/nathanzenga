import Statcounter from '../components/Statcounter';
import Meta from '../components/Meta';
import ImageThumb from '../components/ImageThumb';
import { getPhotos } from '../services/fetchData';
import MediaSetLayout from '../components/MediaSetLayout';

const ArtworkPage = ({ artwork }) => {
  const isGrid = true;
  const { title, ogTitle } = Meta.defaultProps;
  return (
    <>
    <Meta title={`Artwork - ${title}`} ogTitle={`Artwork - ${ogTitle}`} />
    <MediaSetLayout applyGridCSS={isGrid}>
      { artwork.map((img, i) => <ImageThumb key={img._id} image={img} index={i} link="/gallery" gridCSSApplied={isGrid} />) }
    </MediaSetLayout>

    <Statcounter />
    </>
  );
}

export const getStaticProps = async _ => {
  const artwork = await getPhotos({ photo_set: "Artwork", sort: { index: 1 } });
  return { props: { artwork }, revalidate: 60 };
}

export default ArtworkPage;
