import { useRouter } from "next/router";
import { useState } from "react";
import Meta from "../../components/Meta";

const AdminAccessPage = ({ flashMessage }) => {

  const [message, setMessage] = useState(flashMessage);
  const router = useRouter();

  const loginFormSubmit = e => {
    e.preventDefault();
    const form = e.target;
    const btnControl = new submitBtnController(form);
    $.post(form.action, $(form).serializeArray(), redirectUrl => {
      $("#logout-link").removeClass("visible");
      router.push(redirectUrl);
    }).fail(err => {
      setMessage(err.responseText);
    }).always(() => {
      btnControl.finish();
    })
  }

  const { title, ogTitle } = Meta.defaultProps;
  return (
    <>
    <Meta title={`Password Required - ${title}`} ogTitle={`Password Required - ${ogTitle}`} />
    <div className="container content">
      <form className="form-group" method="post" action="/api/settings/access" onSubmit={loginFormSubmit}>
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
      { message ? <div style={{ textAlign: "center" }}>{message}</div> : <></> }
    </div>
    </>
  )
}

export const getServerSideProps = ({ req }) => {
  if (req.isAuthenticated()) return { redirect: { destination: '/settings/---', permanent: false } };
  const flashMessage = req.query.redirect === "true" ? "Not logged in" : "";
  return { props: { flashMessage } }
}

export default AdminAccessPage
