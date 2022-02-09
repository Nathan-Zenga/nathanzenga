import Script from 'next/script';
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
    {process.env.NODE_ENV !== "production" && <>
      <Script id="statcounter-config" type="text/javascript" strategy="beforeInteractive" src="/js/statcounter-config.js" />
      <Script id="statcounter-script" type="text/javascript" strategy="beforeInteractive" src="https://www.statcounter.com/counter/counter.js" async />
    </>}
    </>
  );
}

export const getStaticProps = async _ => {
  const photos = await getPhotos({ photo_set: "Assorted", sort: '{ "index": 1 }' });
  return { props: { photos }, revalidate: 60 };
}

export default HomePage;
