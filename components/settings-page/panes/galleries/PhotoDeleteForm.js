const PhotoDeleteForm = ({ photos, onPhotoSetOptsChanged, selectPhoto }) => {

  return (
    <form className="form-group" id="photo-delete-form" method="post" action="/api/settings/photo/delete">
      <label>Select photo set to filter (optional)</label>
      <select className="form-control photo-set-opts" name="photo_set" onChange={onPhotoSetOptsChanged}>
        <option value="">Select photo set</option>
        { photos.map((image, i, a) => {
          if (i !== 0 && image.photo_set === a[i-1].photo_set) return '';
          return <option key={image._id} value={image.photo_set}>{image.photo_set}</option>
        }) }
      </select>
      <label htmlFor="photo-to-delete">Select image to delete</label>
      <select className="form-control" id="photo-to-delete" name="id" onChange={selectPhoto} required>
        <option value="">Select image</option>
        { photos.map(image => <option key={image._id} value={image._id}>{image.photo_title}</option>) }
      </select>
      <div className="img-preview"></div>
      <input className="form-control submit btn-danger" type="submit" value="Delete photo" />
    </form>
  )
}

export default PhotoDeleteForm
