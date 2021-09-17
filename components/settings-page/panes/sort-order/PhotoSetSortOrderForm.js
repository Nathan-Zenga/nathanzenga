const PhotoSetSortOrderForm = ({ photos }) => {

  const sets = photos.filter(p => p.photo_set_cover === true);
  const sort = (a, b) => a.photo_set_index - b.photo_set_index;
  const options = p => <option key={p._id} value={p.photo_set}>{p.photo_set_index +" - "+ p.photo_set}</option>;

  return (
    <form className="form-group" id="photo-set-sort-order" method="post" action="/api/settings/photo/set/sort-order">
      <label htmlFor="photo-set-to-sort">Select photo set</label>
      <select className="form-control" id="photo-set-to-sort" name="photo_set" required>
        <option value="">Select photo set</option>
        { sets.sort(sort).map(options) }
      </select>
      <label htmlFor="photo-set-index">Photo set position number</label>
      <input className="form-control details" type="number" name="photo_set_index" id="photo-set-index" min="1" max={sets.length} required />
      <br/>
      <input className="form-control submit" type="submit" value="Sort photo set" />
    </form>
  )
}

export default PhotoSetSortOrderForm
