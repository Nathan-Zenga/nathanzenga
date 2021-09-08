import Meta from '../components/Meta';
import { motion } from 'framer-motion';
import { getInfoText } from '../services/fetchData';
import { useEffect } from 'react';

const InfoPage = ({ text }) => {
  const { title, ogTitle } = Meta.defaultProps;

  useEffect(() => { $("#info-text").html(text) });

  const onFormSubmit = e => {
    e.preventDefault();
    const form = e.target;
    const btnControl = new submitBtnController(form);
    $.post(form.action, $(form).serializeArray(), msg => {
      alert(msg);
      form.reset();
    }).fail(err => {
      alert(err.responseText);
    }).always(() => {
      btnControl.finish();
    })
  }

  return (
    <>
    <Meta title={`Info - ${title}`} ogTitle={`Info - ${ogTitle}`} />
    <div className="container">
      <div className="row">

        <motion.div
          className="col-sm-6 float-left" id="info-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: .5 }}
        >
          {/* Text inserted here */}
        </motion.div>

        <motion.div
          className="col-sm-6 float-left" id="contact"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: .5, delay: .5 }}
        >
          <form className="form-group" method="post" action="/send/message" onSubmit={onFormSubmit}>
            <label className="sr-only">Name</label>
            <input className="form-control details" type="text" id="name" name="name" placeholder="Your Name" required />

            <label className="sr-only">Email Address</label>
            <input className="form-control details" type="email" id="email" name="email" placeholder="Your Email" required />

            <label className="sr-only">Subject</label>
            <input className="form-control details" type="text" id="subject" name="subject" placeholder="Subject" required />

            <label className="sr-only">Message</label>
            <textarea className="form-control details" id="message" name="message" placeholder="Enter Message" required></textarea>

            <input className="form-control submit" type="submit" value="Send" />
          </form>
        </motion.div>

      </div>
    </div>
    </>
  );
}

export const getStaticProps = async _ => {
  const text = await getInfoText();
  return { props: { text }, revalidate: 60 };
}

export default InfoPage;
