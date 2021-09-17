const PhotoEditForm = ({ photos, onPhotoSetOptsChanged, selectPhoto }) => {

  return (
    <form className="form-group" id="photo-edit-form" method="post" action="/api/settings/photo/edit">
      <label>Photo set to filter (optional)</label>
      <select className="form-control photo-set-opts" onChange={onPhotoSetOptsChanged}>
        <option value="">Select photo set</option>
        { photos.map((image, i, a) => {
          if ((i !== 0 && image.photo_set === a[i-1].photo_set) || image.photo_set === "Assorted") return '';
          return <option key={image._id} value={image.photo_set}>{image.photo_set}</option>
        }) }
      </select>
      <label htmlFor="photo-to-edit">Select photo</label>
      <select className="form-control" name="id" id="photo-to-edit" onChange={selectPhoto} required>
        <option value="">Select photo set</option>
        { photos.map(image => <option key={image._id} key={image._id} value={image._id}>{image.photo_title}</option>) }
      </select>
      <div className="img-preview"></div>
      <label htmlFor="photo-title-edit">Edit Title</label>
      <input className="form-control" type="text" name="photo_title" id="photo-title-edit" />
      <label htmlFor="photo-url-edit">Edit Photo set</label>
      <select className="form-control" name="photo_set" id="photo-set-edit">
        <option value="">-</option>
        { photos.map((image, i, a) => {
          if ((i !== 0 && image.photo_set === a[i-1].photo_set) || image.photo_set === "Assorted") return '';
          return <option key={image._id} value={image.photo_set}>{image.photo_set}</option>
        }) }
      </select>
      <br/>
      <input className="form-control submit" type="submit" value="Edit photo details" />
    </form>
  )
}

export default PhotoEditForm
