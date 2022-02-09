import Script from 'next/script';
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
      { photos.map(p => <ImageThumb key={p._id} image={p} label={true} gridCSSApplied={isGrid} />) }
    </MediaSetLayout>

    {process.env.NODE_ENV !== "production" && <>
      <Script id="statcounter-config" type="text/javascript" strategy="beforeInteractive" src="/js/statcounter-config.js" />
      <Script id="statcounter-script" type="text/javascript" strategy="beforeInteractive" src="https://www.statcounter.com/counter/counter.js" async />
    </>}
    </>
  );
}

export const getStaticProps = async _ => {
  const photos = await getPhotos({ photo_set_cover: true, sort: '{ "photo_set_index": 1 }' });
  return { props: { photos }, revalidate: 60 };
}

export default PhotographyPage;
