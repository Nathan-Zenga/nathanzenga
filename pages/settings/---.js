import { useEffect } from "react";
import Meta from "../../components/Meta";
import DesignsTabContent from "../../components/settings-page/panes/designs/DesignsTabContent";
import GalleriesTabContent from "../../components/settings-page/panes/galleries/GalleriesTabContent";
import InfoTextTabContent from "../../components/settings-page/panes/info-text/InfoTextTabContent";
import SortOrderTabContent from "../../components/settings-page/panes/sort-order/SortOrderTabContent";
import { getDesignWork, getInfoText, getPhotos } from "../../services/fetchData";
import "../../styles/SettingsPage.module.css";

const SettingsPage = ({ photos, designs, text }) => {

  useEffect(() => {
    $(".image-input-group-btn").click(e => {
      e.preventDefault();
      const btn = e.target;
      const multiple = $(btn).closest("form").find(".image-input-group").length > 1;
      const $group = $(btn).closest(".image-input-group");
      const $clone = $group.clone(true).find(":input").val("").end().find(".image-url").attr({disabled: false, title: ""}).end();
      switch (btn.dataset.opt) {
        case "add" : $clone.insertAfter($group); break;
        case "remove" : if (multiple) $group.remove(); break;
        case "clear" : $group.find(":input").val("").attr("disabled", false).filter(":hidden").attr("disabled", true); break;
      }
    });

    $(".image-file-input").change(e => {
      const input = e.target;
      const files = input.files;
      const $imageUrl = $(input).closest(".image-input-group").find(".image-url").attr({disabled: false, title: ""}).val("");
      const $hiddenInput = $(input).closest(".image-input-group").find(":hidden").attr({disabled: true}).val("");
      if (files && files.length) Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(e) {
          $imageUrl.attr({disabled: true, title: file.name}).val(file.name);
          $hiddenInput.attr({disabled: false}).val(e.target.result);
        };
      })
    });

    $("form").submit(e => {
      e.preventDefault();
      const form = e.target;
      const btnControl = new submitBtnController(form);
      $.post(form.action, $(form).serializeArray(), res => {
        $(form).find(".img-preview").empty();
        $(form).find("#photo_set_new").remove();
        alert(res);
      }).fail(err => {
        alert(err.responseText);
      }).always(() => {
        btnControl.finish();
      })
    });

    window.$photo_to_sort_select = $("#photo-to-sort");
    window.options = $photo_to_sort_select.children("option");

    return function cleanup() {
      $(".image-input-group-btn, .image-file-input, form").off("click change submit");
      window.$photo_to_sort_select = undefined;
      window.options = undefined;
    }
  }, []);

  const { title, ogTitle } = Meta.defaultProps;
  return (
    <>
    <Meta title={`Settings - ${title}`} ogTitle={`Settings - ${ogTitle}`} />
    <div className="container content">
      <div className="nav nav-pills justify-content-center">
        <a className="nav-link active" data-toggle="pill" href="#galleries">Galleries</a>
        <a className="nav-link" data-toggle="pill" href="#infotext">Info Text</a>
        <a className="nav-link" data-toggle="pill" href="#designs">Designs</a>
        <a className="nav-link" data-toggle="pill" href="#sort-order">Sort order</a>
      </div>

      <div className="tab-content">
        <div id="galleries" className="tab-pane fade show active">
          <GalleriesTabContent photos={photos} />
        </div>

        <div id="infotext" className="tab-pane fade">
          <InfoTextTabContent text={text} />
        </div>

        <div id="designs" className="tab-pane fade">
          <DesignsTabContent designs={designs} />
        </div>

        <div id="sort-order" className="tab-pane fade">
          <SortOrderTabContent photos={photos} designs={designs} />
        </div>
      </div>
    </div>
    </>
  )
}

export const getServerSideProps = async ({ req, res }) => {
  const { production } = res.locals;
  if (!req.user && production) return { redirect: { destination: '/settings/access?redirect=true', permanent: false } };
  const photos = await getPhotos({ sort: JSON.stringify({ photo_set: 1, index: 1 }) });
  const { designs } = await getDesignWork();
  const text = await getInfoText();
  return { props: { photos, designs, text } };
}

export default SettingsPage
