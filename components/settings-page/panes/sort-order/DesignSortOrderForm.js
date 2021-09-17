const DesignSortOrderForm = ({ designs }) => {

  return (
    <form className="form-group" id="design-sort-order" method="post" action="/api/settings/design/sort-order">
      <label htmlFor="design-to-sort">Select design</label>
      <select className="form-control" id="design-to-sort" name="id" required>
        <option value="">Select design collection</option>
        { designs.sort((a,b) => a.index - b.index).map(d => {
          return <option key={d._id} value={d._id}>{d.index +" - "+ d.text.client}</option>
        }) }
      </select>
      <label htmlFor="design-index">Design position number</label>
      <input className="form-control details" type="number" id="design-index" name="index" min="1" max={designs.length} required />
      <br/>
      <input className="form-control submit" type="submit" value="Sort Design collection" />
    </form>
  )
}
  
export default DesignSortOrderForm
