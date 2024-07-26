import React, { Fragment } from "react";
import { Input, Button, FormFeedback } from "reactstrap";

class ImageUpload extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      imageName: "",
      LiferayImgPath:
        Liferay.ThemeDisplay.getPathThemeImages() + "/lexicon/icons.svg",
    };
  }

  handleUpload(evt) {
    //console.log(evt.target.files[0]);
    if (evt.target.files[0]) {
      var file = evt.target.files[0];
      this.setState({ imageName: file.name, uploaded: true });
      //console.log("FileUpload InPageAjout: " + file.name);
      this.imageToBase64(file).then((data) => {
        //console.log("CONVERTED TO BASE 64" + data);
        this.props.callbackFile(data);
      });
    } else {
      console.error("handle upload image error");
    }
  }

  resetImage() {
    //console.log("reset")
    this.props.callbackFile("");
    this.setState({ imageName: "" });
  }

  //TODO -> A BOUGER DANS LE AGIIRUTIL
  imageToBase64(file) {
    const validImagetypes = ["image/jpeg", "image/png", "image/tiff"];
    if (file != null && validImagetypes.includes(file.type)) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    }
  }

  render() {
    const { LiferayImgPath } = this.state;
    return (
      <div className="agiir-component-imageupload">
        {!this.props.uploaded ? (
          <div>
            <label className="btn btn-upload">
              <i className="mdi mdi-tray-arrow-up mdi-16px"></i>
              <span>Ajouter une image</span>
              <Input
                type="file"
                accept="image/*"
                onChange={(evt) => this.handleUpload(evt)}
                name="imageUpload"
                id={"fileUpload" + this.props.imageId}
                hidden
                valid={this.props.error == false}
                invalid={this.props.error == true}
              />
            </label>
          </div>
        ) : (
          <Fragment>
            <Button
              className="agiir-component-imageupload-btnMargin btn-yellow"
              color="secondary"
              onClick={() => this.resetImage()}
            >
              <i className="mdi mdi-minus mdi-16px"></i>
              <span>Retirer</span>
            </Button>
            <span>{this.state.imageName}</span>
            <br />
            <img
              className="agiir-component-imageupload-imgCanvas"
              src={this.props.src}
            />
          </Fragment>
        )}
        {this.props.error == true && (
          <FormFeedback invalid>
            Ce champ est obligatoire et doit être supérieur à 0
          </FormFeedback>
        )}
      </div>
    );
  }
}

export default ImageUpload;
