import DesignEditForm from "./DesignEditForm"
import DesignUploadForm from "./DesignUploadForm"

const DesignsTabContent = ({ designs }) => {
  return (
    <>
    <DesignUploadForm designs={designs} />

    <br/><br/><br/>

    <DesignEditForm designs={designs} />
    </>
  )
}

export default DesignsTabContent
