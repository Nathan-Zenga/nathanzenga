const PhotoSetDeleteForm = ({ photos }) => {

  return (
    <form className="form-group" id="photo-set-delete-form" method="post" action="/api/settings/photo/set/delete">
      <label htmlFor="photo-set-to-delete">Select photo set</label>
      <select className="form-control" id="photo-set-to-delete" name="photo_set" required>
        <option value="">Select photo set</option>
        { photos.map((image, i, a) => {
          if ((i !== 0 && image.photo_set === a[i-1].photo_set) || image.photo_set === "Assorted") return '';
          return <option key={image._id} value={image.photo_set}>{image.photo_set}</option>
        }) }
      </select>
      <input className="form-control submit btn-danger" type="submit" value="Delete photo set" />
    </form>
  )
}

export default PhotoSetDeleteForm
