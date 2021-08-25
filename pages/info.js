import Meta from '../components/Meta';
import InfoPageBody from '../components/InfoPageBody';
import { getInfoText } from '../services/fetchData';

const InfoPage = ({ text }) => {
  const { title, ogTitle } = Meta.defaultProps;
  return (
    <>
    <Meta title={`Info - ${title}`} ogTitle={`Info - ${ogTitle}`} />
    <div className="container">
      <div className="row"><InfoPageBody text={text} /></div>
    </div>
    </>
  );
}

export const getStaticProps = async _ => {
  const text = await getInfoText();
  return { props: { text } };
}

export default InfoPage;
