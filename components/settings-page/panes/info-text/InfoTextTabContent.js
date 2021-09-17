const InfoTextTabContent = ({ text }) => {

  return (
    <form className="form-group info-text-settings" method="post" action="/api/settings/info-text/save">
      <label className="sr-only">Info Text</label>
      <pre><textarea className="form-control details" type="text" id="text" name="text" placeholder="HTML or plain text" defaultValue={text || ""} /></pre>
      <input className="form-control submit" type="submit" value="Save" />
    </form>
  )
}

export default InfoTextTabContent
