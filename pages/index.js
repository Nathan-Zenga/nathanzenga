import PhotoThumb from '../components/PhotoThumb';

const Home = ({ photos }) => {
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
  console.log(_);
  const headers = { "Content-Type": "application/json" };
  const body = JSON.stringify({ photo_set: "Assorted", sort: '{ "index": 1 }' });
  const data = await fetch("http://localhost:5678/api/p", { method: "POST", headers, body });
  return { props: { photos: await data.json() } };
}

export default Home;
