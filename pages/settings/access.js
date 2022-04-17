import { useRouter } from "next/router";
import { useState } from "react";
import Meta from "../../components/Meta";

const AdminAccessPage = ({ flashMessage, inSession }) => {

  const [ message, setMessage ] = useState(flashMessage);
  const router = useRouter();
  const { title, ogTitle } = Meta.defaultProps;

  const login = e => {
    e.preventDefault();
    const form = e.target;
    const btnControl = new submitBtnController(form);
    $.post(form.action, $(form).serializeArray(), redirectUrl => {
      inSession(true);
      router.push(redirectUrl);
    }).fail(err => {
      setMessage(err.responseText);
    }).always(() => {
      btnControl.finish();
    })
  }

  return (
    <>
    <Meta title={`Password Required - ${title}`} ogTitle={`Password Required - ${ogTitle}`} />
    <div className="container content">
      <form className="form-group" method="post" action="/api/settings/login" onSubmit={login}>
        <div className="row">
          <div className="col-sm-10 float-left">
            <label className="sr-only">Password</label>
            <input className="form-control details" type="password" id="password" name="password" placeholder="Password" required />
          </div>
          <div className="col-sm-2 float-left">
            <input className="form-control submit" type="submit" value="Enter" />
          </div>
        </div>
      </form>
      { message && <div style={{ textAlign: "center" }}>{message}</div> }
    </div>
    </>
  )
}

export const getServerSideProps = ({ req }) => {
  if (req.user) return { redirect: { destination: '/settings/---', permanent: false } };
  return { props: { flashMessage: req.query.redirect === "true" ? "Not logged in" : "" } }
}

export default AdminAccessPage
