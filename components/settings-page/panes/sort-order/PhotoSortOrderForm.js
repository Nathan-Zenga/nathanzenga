const PhotoSortOrderForm = ({ photos }) => {

  const photoToSort = e => {
    const $form = $(e.target).closest("form");
    const $preview = $form.find(".img-preview");
    $preview.empty();
    photos.filter(p => p._id == e.target.value).forEach(p => {
      $preview.append(`<img src="${p.photo_url}">`);
    });
  }

  const photoSetSelect = e => {
    const { $photo_to_sort_select, options } = window;
    const photo_set = e.target.value;
    const $form = $(e.target).closest("form");
    const $preview = $form.find(".img-preview");
    $preview.empty();
    $photo_to_sort_select.html(options);
    const set = photos.filter(e => e.photo_set === photo_set);
    set.sort((a, b) => a.index - b.index).forEach(p => {
      const html = `<option value="${p._id}">${p.index} - ${p.photo_title}</option>`;
      $photo_to_sort_select.append(html);
    });
    $form.find("#photo-index").attr("max", set.length).val(set.length);
  }

  return (
    <form className="form-group" id="photo-sort-order" method="post" action="/api/settings/photo/sort-order">
      <label htmlFor="photo-set-select">Select photo set</label>
      <select className="form-control" id="photo-set-select" name="photo_set" onChange={photoSetSelect} required>
        <option value="">Select photo set</option>
        { photos.map((p, i, a) => {
          if (i !== 0 && p.photo_set === a[i-1].photo_set) return '';
          return <option key={p._id + i} value={p.photo_set}>{p.photo_set}</option>
        }) }
      </select>
      <label htmlFor="photo-to-sort">Select photo</label>
      <select className="form-control" id="photo-to-sort" name="id" onChange={photoToSort} required>
        <option value="">Select image</option>
      </select>
      <div className="img-preview"></div>
      <label htmlFor="photo-index">Photo position number</label>
      <input className="form-control details" type="number" id="photo-index" name="index" min="1" required />
      <br/>
      <input className="form-control submit" type="submit" value="Sort photo in set" />
    </form>
  )
}
  
export default PhotoSortOrderForm
