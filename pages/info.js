import Meta from '../components/Meta';
import React, { Component } from 'react';
import { getInfoText } from '../services/fetchData';

const InfoPage = ({ text }) => {
  const { title, ogTitle } = Meta.defaultProps;
  return (
    <>
    <Meta title={`Info - ${title}`} ogTitle={`Info - ${ogTitle}`} />
    <div className="container">
      <div className="row">
        <InfoPageBody text={text} />
      </div>
    </div>
    </>
  );
}

class InfoPageBody extends Component {
  constructor(props) {
    super(props);
    this.state = { text: props.text };
  }

  componentDidMount() { $("#info-text").html(this.state.text) }

  componentWillUnmount() { $("form").off("submit") }

  onFormSubmit = e => {
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

  render() {
    return (
      <>
        <div className="col-sm-6 float-left" id="info-text">
          {/* Text inserted here */}
        </div>

        <div className="col-sm-6 float-left" id="contact">
          <form className="form-group" method="post" action="/api/send/message" onSubmit={this.onFormSubmit}>
            <label className="sr-only">Name</label>
            <input className="form-control details" type="text" id="name" name="name" placeholder="Your Name" required />

            <label className="sr-only">Email Address</label>
            <input className="form-control details" type="email" id="email" name="email" placeholder="Your Email" required />

            <label className="sr-only">Subject</label>
            <input className="form-control details" type="text" id="subject" name="subject" placeholder="Subject" required />

            <label className="sr-only">Message</label>
            <textarea className="form-control details" type="text" id="message" name="message" placeholder="Enter Message" required></textarea>

            <input className="form-control submit" type="submit" value="Send" />
          </form>
        </div>
      </>
    );
  }
}

export const getStaticProps = async _ => {
  const text = await getInfoText();
  return { props: { text } };
}

export default InfoPage;
