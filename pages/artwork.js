import Script from 'next/script';
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
      { artwork.map((img, i) => <ImageThumb key={img._id} image={img} index={i} gridCSSApplied={isGrid} />) }
    </MediaSetLayout>

    {process.env.NODE_ENV !== "production" && <>
      <Script id="statcounter-config" type="text/javascript" strategy="beforeInteractive" src="/js/statcounter-config.js" />
      <Script id="statcounter-script" type="text/javascript" strategy="beforeInteractive" src="https://www.statcounter.com/counter/counter.js" async />
    </>}
    </>
  );
}

export const getStaticProps = async _ => {
  const artwork = await getPhotos({ photo_set: "Artwork", sort: '{ "index": 1 }' });
  return { props: { artwork }, revalidate: 60 };
}

export default ArtworkPage;
