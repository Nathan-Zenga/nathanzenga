import PhotoThumb from '../components/PhotoThumb';
import { getPhotos } from '../services/fetchData';

const HomePage = ({ photos }) => {
  return (
    <div className="container media-set">
      <div className="grid-container">
        <div className="grid"> {
          photos.map((p, i) => <PhotoThumb key={p._id} image={p} index={i} />)
        } </div>
      </div>
    </div>
  );
}

export const getStaticProps = async _ => {
  const photos = await getPhotos({ photo_set: "Assorted", sort: '{ "index": 1 }' });
  return { props: { photos } };
}

export default HomePage;
