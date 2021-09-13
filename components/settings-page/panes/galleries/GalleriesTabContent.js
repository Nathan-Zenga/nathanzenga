import PhotoDeleteForm from "./PhotoDeleteForm";
import PhotoEditForm from "./PhotoEditForm";
import PhotoSetCoverForm from "./PhotoSetCoverForm";
import PhotoSetDeleteForm from "./PhotoSetDeleteForm";
import PhotoUploadForm from "./PhotoUploadForm";

const GalleriesTabContent = ({ photos }) => {

  const onPhotoSetOptsChanged = e => {
    const input = e.target;
    const $form = $(input).closest("form");
    const $preview = $form.find(".img-preview");
    const $selectInput = $form.find("#photo-to-delete, #photo-to-edit, #photo-set-cover-choice");
    const filter = item => !input.value || item.photo_set === input.value;
    const sort = (a, b) => a.index - b.index;
    $preview.empty();
    photos.filter(filter).sort(sort).forEach((img, i) => {
      if (i == 0) $selectInput.html("<option value=''>Select image</option>");
      $selectInput.append("<option value="+ img._id +">"+ img.photo_title +"</option>")
    });
    $selectInput.find("option:first").prop("selected", true);
  }

  const selectPhoto = e => {
    const $form = $(e.target).closest("form");
    const $preview = $form.find(".img-preview");
    const img = photos.find(p => p._id == e.target.value);
    $preview.empty().append(img ? "<img src='"+ img.photo_url +"'>" : "");
    $form.find("#photo-title-edit").val(img.photo_title);
    $form.find("#photo-set-edit").val(img.photo_set);
  }

  return (
    <>
    <PhotoUploadForm photos={photos} />

    <br/><br/><br/>

    <PhotoEditForm photos={photos} onPhotoSetOptsChanged={onPhotoSetOptsChanged} selectPhoto={selectPhoto} />

    <br/><br/><br/>

    <PhotoSetCoverForm photos={photos} onPhotoSetOptsChanged={onPhotoSetOptsChanged} selectPhoto={selectPhoto} />

    <br/><br/><br/>

    <PhotoDeleteForm photos={photos} onPhotoSetOptsChanged={onPhotoSetOptsChanged} selectPhoto={selectPhoto} />

    <br/><br/><br/>

    <PhotoSetDeleteForm photos={photos} />
    </>
  )
}

export default GalleriesTabContent
