import React, { Component } from 'react';
import Statcounter from '../Statcounter';

class Info extends Component {
  state = { text: "" }

  async componentDidMount() {
    document.title = "Info - Nathan Zenga";
    document.body.id = "info-page";

    const doc = await $.get('/info/-');
    this.setState({ text: doc.text });
    Statcounter();

    $("#info-text").html(this.state.text);
    $("#info-text, #contact").each((i, e) => $(e).delay(i * 500).fadeTo(1000, 1));
    $("form").on("submit", e => {
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
    })
  }

  componentWillUnmount() { $("form").off("submit") }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-6 float-left" id="info-text" style={{ opacity: 0 }}></div>

          <div className="col-sm-6 float-left" id="contact" style={{ opacity: 0 }}>
            <form className="form-group" method="post" action="/send/message">
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
        </div>
      </div>
    );
  }
}

export default Info;
