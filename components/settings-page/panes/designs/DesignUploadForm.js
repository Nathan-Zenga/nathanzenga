const DesignUploadForm = ({ designs }) => {

  return (
    <form className="form-group design-settings" method="post" action="/settings/design/save">
      <div className="row">
        <div className="col-sm-6 float-left">
          <label>ID</label>
          <input className="form-control details" type="text" id="d-id" name="d_id" required />
        </div>
        <div className="col-sm-6 float-left">
          <label>Client</label>
          <input className="form-control details" type="text" id="client" name="client" required />
        </div>
      </div>
      <label>Tools</label>
      <input className="form-control details" type="text" id="tools" name="tools" required />
      <label>Description</label>
      <textarea className="form-control details" type="text" id="description" name="description" required></textarea>
      <label>Link</label>
      <input className="form-control details" type="url" name="link" id="design-link" required />
      <label>Index</label>
      <input className="form-control details" type="number" name="index" id="design-index" min="1" max={designs.length+1} defaultValue={designs.length+1} required />
      <div className="row">
        <label className="col-2 float-left"> Hidden? </label>
        <div className="col-10 float-left"> <input type="checkbox" name="hidden" defaultValue="true" id="make-hidden" /> </div>
      </div><br/>
      <label>Upload images</label>
      <div className="image-input-group-container">
        <div className="image-input-group row" style={{ marginBottom: "1.5em" }}>
          <div className="col-sm-5 float-left">
            <input type="file" className="image-file-input" accept="image/*,video/*" /><br/>
          </div>
          <div className="col-sm-7 float-left">
            <input type="url" className="form-control image-url" name="media" placeholder="Enter image / video URL (optional)" />
            <input type="hidden" name="media" disabled />
          </div>
          <div className="col-sm-12 float-left" style={{ textAlign: "right" }}>
            <a className="image-input-group-btn" data-opt="add">Add</a>
            <a className="image-input-group-btn" data-opt="remove" style={{ marginLeft: "20px" }}>Remove</a>
            <a className="image-input-group-btn" data-opt="clear" style={{ marginLeft: "20px" }}>Clear Input</a>
          </div>
        </div>
      </div>
      <input className="form-control submit" type="submit" value="Save" />
    </form>
  )
}

export default DesignUploadForm
