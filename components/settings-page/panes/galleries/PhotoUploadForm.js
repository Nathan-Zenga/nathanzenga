const PhotoUploadForm = ({ photos }) => {

  const selectPhotoSet = e => {
    const input = e.target;
    $("#photo-index").attr({ disabled: true, max: 1 }).val(1);
    $("#photo-set-new").remove();
    if (input.value === "new") {
      const type = "text";
      const name = "photo_set_new";
      const id = "photo-set-new";
      const placeholder = "Enter new photo set name";
      const required = true;
      $("<input>").addClass("form-control").attr({ type, name, id, placeholder, required }).insertAfter(input);
      $("#photo-index").attr("disabled", false);
    }
    else if (input.value) {
      const max = photos.filter(e => e.photo_set == input.value).length + 1;
      $("#photo-index").attr({ disabled: false, max }).val(max);
    }
  }

  return (
    <form className="form-group" id="photo-upload-form" method="post" action="/api/settings/photo/upload">
      <label>Image Upload</label>
      <div className="image-input-group-container">
        <div className="image-input-group row" style={{ marginBottom: "1.5em" }}>
          <div className="col-sm-5 float-left">
            <input type="file" className="image-file-input" accept=".jpg,.jpeg,.png" /><br />
          </div>
          <div className="col-sm-7 float-left">
            <input type="url" className="form-control image-url" name="file" placeholder="Enter image URL (optional)" required />
            <input type="hidden" name="file" disabled />
          </div>
          <div className="col-sm-12 float-left" style={{ textAlign: "right", padding: "0 .5em" }}>
            <a className="image-input-group-btn" data-opt="clear" style={{ marginLeft: "20px" }}>Clear Input</a>
          </div>
        </div>
      </div>
      <label htmlFor="photo-title">Title</label>
      <input className="form-control" type="text" name="photo_title" id="photo-title" required />
      <label htmlFor="photo-set-to-save">Photo set</label>
      <select className="form-control" name="photo_set" id="photo-set-to-save" onChange={selectPhotoSet} required>
        <option value="">Select photo set</option>
        <option value="new">*NEW*</option>
        { photos.map((image, i, a) => {
          if (i !== 0 && image.photo_set === a[i-1].photo_set) return '';
          return <option key={image._id} value={image.photo_set}>{image.photo_set}</option>
        }) }
      </select>
      <label htmlFor="photo-index">Photo position number</label>
      <input className="form-control" type="number" name="index" id="photo-index" min="1" max="1" value="1" disabled required />
      <br/>
      <input className="form-control submit" type="submit" value="Save photo" />
    </form>
  )
}

export default PhotoUploadForm
