const DesignEditForm = ({ designs }) => {

  const onSelectedDesign = e => {
    var id = e.target.value;
    var design = designs.find(doc => doc._id === id);
    if (!design) { $(e.target).closest("form").get(0).reset(); return false };
    $("#d-id-edit").val(design.d_id);
    $("#client-edit").val(design.text.client);
    $("#tools-edit").val(design.text.tools);
    $("#description-edit").val(design.text.description);
    $("#link-edit").val(design.link);
    $("#make-hidden-change").prop("checked", design.hidden);
  }

  return (
    <form className="form-group design-edit-settings" method="post" action="/api/settings/design/edit">
      <label>Select to edit</label>
      <select className="form-control details" id="design-to-edit" name="id" onChange={onSelectedDesign} required>
        <option value="">Select design</option>
        { designs.map(design => <option key={design._id} value={design._id}>{design.text.client}</option>) }
      </select>
      <label style={{ marginBottom: "1em" }}>All fields below are optional</label>
      <div className="row">
        <div className="col-sm-6 float-left">
          <label>ID</label>
          <input className="form-control details" type="text" id="d-id-edit" name="d_id" />
        </div>
        <div className="col-sm-6 float-left">
          <label>Client</label>
          <input className="form-control details" type="text" id="client-edit" name="client" />
        </div>
      </div>
      <label>Tools</label>
      <input className="form-control details" type="text" id="tools-edit" name="tools" />
      <label>Description</label>
      <textarea className="form-control details" type="text" id="description-edit" name="description"></textarea>
      <label>Link</label>
      <input className="form-control details" type="url" id="link-edit" name="link" />
      <div className="row">
        <label className="col-2 float-left"> Hidden? </label>
        <div className="col-10 float-left"> <input type="checkbox" name="hidden" value="true" id="make-hidden-change" /> </div>
      </div>
      <input className="form-control submit" type="submit" value="Edit Design" />
    </form>
  )
}

export default DesignEditForm
