const PhotoSetCoverForm = ({ photos, onPhotoSetOptsChanged, selectPhoto }) => {

  return (
    <form className="form-group" id="photo-set-cover-form" method="post" action="/settings/photo/set/cover">
      <label htmlFor="photo_set">Photo set</label>
      <select className="form-control photo-set-opts" name="photo_set" onChange={onPhotoSetOptsChanged} required>
        <option value="">Select photo set</option>
        { photos.map(image => {
          if (image.photo_set_cover === false) return '';
          return <option key={image._id} value={image.photo_set}>{image.photo_set}</option>
        }) }
      </select>
      <label htmlFor="photo-set-cover-choice">Select photo</label>
      <select className="form-control" name="id" id="photo-set-cover-choice" onChange={selectPhoto} required>
        <option value="">Select photo</option>
        { photos.map(image => <option key={image._id} value={image._id}>{image.photo_title}</option>) }
      </select>
      <div className="img-preview"></div>
      <br/>
      <input className="form-control submit" type="submit" value="Update photo set cover" />
    </form>
  )
}

export default PhotoSetCoverForm
