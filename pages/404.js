import Meta from "../components/Meta";

const ErrorPage = ({ message }) => {
  const { title, ogTitle } = Meta.defaultProps;
  return (
    <>
    <Meta title={`Error 404 - ${title}`} ogTitle={`Error 404 - ${ogTitle}`} />
    <h1 style={{ textAlign: "center" }}>{message || "SORRY, PAGE NOT FOUND"}</h1>
    </>
  )
};

export default ErrorPage;
