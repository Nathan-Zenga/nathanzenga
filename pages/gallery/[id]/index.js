import GalleryImage from '../../../components/GalleryCarouselImage';

const Gallery = ({ photos }) => {
  return (
    <div className="container" style={{ padding: 0 }}>
      <div id="gallery-carousel" className="carousel slide carousel-fade" onContextMenu={() => false}>
        <ol className="carousel-indicators"></ol>

        <div className="carousel-inner">{
          photos.map((p, i) => <GalleryImage active={!i} key={p._id} image={p} index={i} />)
        }</div>

        <a className="carousel-control-prev" href="#gallery-carousel" role="button" data-slide="prev">
          <span className="carousel-control-prev-icon fal fa-angle-left" aria-hidden="true"></span>
          <span className="sr-only">Previous</span>
        </a>

        <a className="carousel-control-next" href="#gallery-carousel" role="button" data-slide="next">
          <span className="carousel-control-next-icon fal fa-angle-right" aria-hidden="true"></span>
          <span className="sr-only">Next</span>
        </a>
      </div>
    </div>
  );
}

export const getStaticProps = async _ => {
  const headers = {'Content-Type': 'application/json'};
  const sort = JSON.stringify({ index: 1 });
  const body = JSON.stringify({ photo_set: "Assorted", sort });
  const data = await fetch('http://localhost:5678/api/p', { method: "POST", headers, body });
  const photos = await data.json();
  return { props: { photos } };
}

export const getStaticPaths = async _ => {
  const headers = { "Content-Type": "application/json" };
  const body = JSON.stringify({ photo_set: "Assorted", sort: '{ "index": 1 }' });
  const data = await fetch('http://localhost:5678/api/p', { method: "POST", headers, body });
  const photos = await data.json();
  return { paths: photos.map((p, i) => ({ params: { id: `${i}` } })), fallback: false };
}

export default Gallery;
