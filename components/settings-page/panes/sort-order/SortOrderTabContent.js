import DesignSortOrderForm from "./DesignSortOrderForm"
import PhotoSetSortOrderForm from "./PhotoSetSortOrderForm"
import PhotoSortOrderForm from "./PhotoSortOrderForm"

const SortOrderTabContent = ({ photos, designs }) => {

  return (
    <>
    <PhotoSortOrderForm photos={photos} />

    <br/><br/><br/>

    <DesignSortOrderForm designs={designs} />

    <br/><br/><br/>

    <PhotoSetSortOrderForm photos={photos} />
    </>
  )
}

export default SortOrderTabContent
