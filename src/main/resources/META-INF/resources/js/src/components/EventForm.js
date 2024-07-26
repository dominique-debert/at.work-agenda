import { AlertUtil } from "agiir-react-components";
import CKEditor from "ckeditor4-react";
import { fr } from "date-fns/locale";
import React from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import {
  Button,
  CustomInput,
  Form,
  FormFeedback,
  FormGroup,
  FormText,
  Input,
  InputGroup,
  InputGroupText,
  Label,
} from "reactstrap";
import * as agendaEventsActions from "../actions/AgendaEventsAction";
import {
  COMPANY_ID,
  GROUP_ID,
  USER_ID,
  FR_REGION,
  DRAFT,
  PENDING,
} from "../constants/constants";
import Select from "react-select";
import ImageUpload from "./ImageUpload";
registerLocale("fr", fr);

export default class EventForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      description: "",
      publisherId: USER_ID,
      groupId: GROUP_ID,
      companyId: COMPANY_ID,
      categoryIds: [],
      status: DRAFT,
      localisation: "",
      videoUrl: "",
      mapUrl: "",
      image_uri: "",
      imageURL: "",
      publish_date: new Date(),
      start_date: new Date(),
      end_date: new Date(),
      prices: "",
      infont: false,
      startDateError: false,
      endDateError: false,
      publishDateError: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.onSubmit.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
  }

  componentDidMount() {
    const { current } = this.props;
    if (current != null) {
      this.fillFormContent(current);
    }
  }

  fillFormContent(current) {
    const { categories } = this.props;
    current.id != null && this.setState({ id: current.id });
    current.title != null && this.setState({ title: current.title });
    current.description != null &&
      this.setState({ description: current.description });
    current.localisation != null &&
      this.setState({ localisation: current.localisation });
    current.price_sortable != null &&
      this.setState({ prices: current.price_sortable });
    current.publish_date_sortable != null &&
      this.setState({ publish_date: new Date(current.publish_date_sortable) });
    current.start_date_sortable != null &&
      this.setState({ start_date: new Date(current.start_date_sortable) });
    current.end_date_sortable != null &&
      this.setState({ end_date: new Date(current.end_date_sortable) });
    current.image_uri != null &&
      this.setState({ image_uri: current.image_uri });
    current.imageURL != null && this.setState({ imageURL: current.imageURL });
    current.nbrdesplaces != null &&
      this.setState({ nbrdesplaces: current.nbrdesplaces });
    current.video_url != null && this.setState({ videoUrl: current.video_url });
    current.map_url != null && this.setState({ mapUrl: current.map_url });
    current.inFont != null &&
      this.setState({ infont: current.inFont == "true" });
    if (current.categoriesIDS) {
      const categoriesArray = categories.filter((x) =>
        Array.isArray(current.categoriesIDS)
          ? current.categoriesIDS.includes(x.id.toString())
          : x.id == current.categoriesIDS
      );
      this.setState({
        categoryIds: categoriesArray.map((x) => ({
          value: x.id,
          label: x.label,
        })),
      });
    }
  }

  // Fonction qui permet de mettre à jour le state avec les valeurs saisies dans le form
  handleChange(e) {
    let change = {};
    if (e.target) {
      change[e.target.name] = e.target.value;
      this.setState(change);
      this.synchroError(e.target.name, e.target.value);
      if (e.target && e.target.name == "imageURL") {
        if (e.target.value != "" && this.state.image_uri != "") {
          this.setState({ image_uri: "" });
        }
      }
    } else {
      change["description"] = e.editor.getData();
      this.setState(change);
      this.synchroError("description", e.editor.getData());
    }
  }

  async onSubmit(new_status) {
    const {
      id,
      title,
      description,
      categoryIds,
      localisation,
      image_uri,
      publish_date,
      start_date,
      end_date,
      prices,
      publisherId,
      groupId,
      companyId,
      infont,
      imageURL,
      nbrdesplaces,
      entireDay,
      videoUrl,
      mapUrl,
    } = this.state;
    const { handleRefreshList } = this.props;

    await this.synchroError("title", title);
    await this.synchroError("description", description);
    await this.synchroError("image_uri", image_uri);
    await this.synchroError("imageURL", imageURL);
    await this.synchroError("publish_date", publish_date);
    await this.synchroError("start_date", start_date);
    await this.synchroError("end_date", end_date);
    // await this.synchroError("prices", prices);
    await this.synchroError("categoryIds", categoryIds);
    await this.synchroError("nbrdesplaces", nbrdesplaces);

    const {
      titleError,
      descriptionError,
      categoryError,
      imageError,
      startDateError,
      endDateError,
      publishDateError,
      imageURLError,
      nbrdesplacesError,
    } = this.state;

    let condition =
      titleError == false &&
      descriptionError == false &&
      categoryError == false &&
      publishDateError == false &&
      startDateError == false &&
      endDateError == false &&
      nbrdesplacesError == false &&
      // priceError == false &&
      !(imageError && imageURLError);

    const startHour =
      start_date.getHours() < 10
        ? "0" + start_date.getHours()
        : start_date.getHours();
    const startMin =
      start_date.getMinutes() < 10
        ? "0" + start_date.getMinutes()
        : start_date.getMinutes();
    const endHour =
      end_date.getHours() < 10
        ? "0" + end_date.getHours()
        : end_date.getHours();
    const endMin =
      end_date.getMinutes() < 10
        ? "0" + end_date.getMinutes()
        : end_date.getMinutes();

    if ((new_status == PENDING && condition == true) || new_status == DRAFT) {
      let categories = categoryIds.map((item) => item.value);
      let event = {
        title: title,
        description: description,
        categoryIds: categories.toString(),
        localisation: localisation,
        image_uri: image_uri != "" ? image_uri : imageURL,
        start_date: start_date.getTime(),
        end_date: end_date.getTime(),
        publish_date: publish_date.getTime() || new Date().getTime(),
        price: prices == null || prices == "" ? 0 : parseInt(prices),
        hours: entireDay
          ? "Journée entière"
          : startHour + "h" + startMin + " - " + endHour + "h" + endMin,
        inFont: infont,
        status: new_status,
        publisherId: publisherId,
        companyId: companyId,
        groupId: groupId,
        nbrdesplaces: nbrdesplaces.replace("/[,.]/g", ""),
        videoUrl: videoUrl,
        mapUrl: mapUrl,
      };
      try {
        if (id != null) {
          event.id = id;
          let response = await agendaEventsActions.updateAgendaEvents(event);
          if (response != 201) {
            if (response == 502) {
              AlertUtil.alert(
                "L'image de l'évènement ne respecte pas la taille souhaitée (maximum 1Mo) ou/et le format souhaité (JPEG/PNG/TIFF).",
                "warning"
              );
            } else {
              AlertUtil.alert(
                "Une erreur critique est survenue, veuillez contacter le service technique !",
                "error"
              );
            }
          } else {
            AlertUtil.alert("L'événement a bien été modifié.", "success");
            handleRefreshList();
          }
        } else {
          if (event.start_date > event.end_date) {
            AlertUtil.alert(
              "Vous ne pouvez pas ajouter un événement avec une date de début supérieure à la date de fin !",
              "warning"
            );
            return;
          } else if (event.price < 0) {
            AlertUtil.alert(
              "Vous ne pouvez pas ajouter un événement avec un prix négatif !",
              "warning"
            );
            return;
          } else {
            let response = await agendaEventsActions.createAgendaEvents(event);
            if (response != 201) {
              if (response == 502) {
                AlertUtil.alert(
                  "L'image de l'évènement ne respecte pas la taille souhaitée (maximum 1Mo) ou/et le format souhaité (JPEG/PNG/TIFF).",
                  "warning"
                );
              } else {
                AlertUtil.alert(
                  "Une erreur critique est survenue, veuillez contacter le service technique !",
                  "error"
                );
              }
            } else {
              AlertUtil.alert("L'événement a bien été ajouté.", "success");
              handleRefreshList();
            }
          }
        }
      } catch (error) {
        AlertUtil.alert(
          "Une erreur critique est survenue, Veuillez contacter le service technique !",
          "error"
        );
      }
    } else {
      AlertUtil.alert(
        "Un des champs requis est vide, veuillez vérifier vos informations.",
        "warning"
      );
    }
  }

  handleIsFontChange() {
    this.setState({ infont: !this.state.infont });
  }

  synchroError(stateName, value) {
    if (stateName == "title") {
      if (value == "" || value.length > 75) {
        this.setState({ titleError: true });
      } else {
        this.setState({ titleError: false });
      }
    } else if (stateName == "description") {
      if (value == "" || value.length > 3000) {
        this.setState({ descriptionError: true });
      } else {
        this.setState({ descriptionError: false });
      }
    } else if (stateName == "nbrdesplaces") {
      if (value % 1 != 0) {
        this.setState({ nbrdesplacesError: true });
      } else {
        this.setState({ nbrdesplacesError: false });
      }
    } else if (stateName == "categoryIds") {
      if (!value.length > 0) {
        this.setState({ categoryError: true });
      } else {
        this.setState({ categoryError: false });
      }
    } else if (stateName == "image_uri") {
      if (value == "") {
        this.setState({ imageError: true });
      } else {
        this.setState({ imageError: false });
      }
    } else if (stateName == "imageURL") {
      const isImageValid = this.imageExists(value);
      if (value == "" || !isImageValid) {
        this.setState({ imageURLError: true });
      } else {
        this.setState({ imageURLError: false });
      }
    } else if (stateName == "publish_date") {
      if (value == null) {
        this.setState({ publishDateError: true });
      } else {
        this.setState({ publishDateError: false });
      }
    } else if (stateName == "end_date") {
    } else if (stateName == "start_date") {
      if (value == null) {
        this.setState({ startDateError: true });
      } else {
        this.setState({ startDateError: false });
      }
    } else if (stateName == "end_date") {
      if (value == null) {
        this.setState({ endDateError: true });
      } else {
        this.setState({ endDateError: false });
      }
    } else if (stateName == "prices") {
      if (value != null && value != "" && isNaN(parseInt(value))) {
        this.setState({ priceError: true });
      } else {
        this.setState({ priceError: false });
      }
    } else if (stateName == "category") {
      if (value == null || (value != null && value == 0)) {
        this.setState({ categoryError: true });
      } else {
        this.setState({ categoryError: false });
      }
    }
  }

  handleFileUpload(bytes) {
    this.setState({ image_uri: bytes });
    this.synchroError("image_uri", bytes);
    if (this.state.imageURL != "" && this.state.image_uri != "") {
      this.setState({ imageURL: "" });
    }
  }

  onDateChange(name, value) {
    let change = {};
    change[name] = value;
    this.setState(change);
    this.synchroError(name, value);
  }

  imageExists(image_url) {
    var http = new XMLHttpRequest();
    http.open("HEAD", image_url, false);
    http.send();
    return http.status != 404;
  }

  handleSelectCategories(selectedCategories) {
    this.setState({ categoryIds: selectedCategories || [] });
    this.synchroError("categoryIds", selectedCategories || []);
  }

  render() {
    const {
      title,
      description,
      categoryIds,
      localisation,
      prices,
      entireDay,
      image_uri,
      publish_date,
      start_date,
      end_date,
      infont,
      imageURL,
      imageError,
      titleError,
      descriptionError,
      categoryError,
      startDateError,
      endDateError,
      publishDateError,
      imageURLError,
      nbrdesplaces,
      nbrdesplacesError,
      videoUrl,
      mapUrl,
    } = this.state;
    const { isMobile, categories, handleRefreshList } = this.props;
    return (
      <Form>
        <FormGroup>
          <Label for="name">
            Titre<span className="required">*</span>
          </Label>
          <Input
            type="text"
            name="title"
            id="title"
            value={title}
            onChange={this.handleChange}
            valid={titleError == false}
            invalid={titleError == true}
          />
          <FormFeedback>
            Le titre ne doit pas être vide ou ne contenir plus de 75 caractères
          </FormFeedback>
        </FormGroup>
        <FormGroup>
          <Label for="categoryIds">
            Catégories<span className="required">*</span>
          </Label>
          <Select
            isMulti
            name="categoryIds"
            options={
              categories.length > 0
                ? categories.map((x) => ({ value: x.id, label: x.label }))
                : []
            }
            value={categoryIds}
            classNamePrefix="select"
            onChange={(selected) => this.handleSelectCategories(selected)}
          />
          {categoryError && (
            <div className="error">La catégorie ne doit pas être vide</div>
          )}
        </FormGroup>
        <FormGroup>
          <Label for="description">
            Description<span className="required">*</span>
          </Label>
          <CKEditor
            name="description"
            id="description"
            editorName={title}
            config={{
              filebrowserUploadUrl: [
                ["/group/opconnect/documents/-/document_library/"],
              ],
              filebrowserBrowseUrl: [
                ["/group/opconnect/documents/-/document_library/"],
              ],
            }}
            onChange={this.handleChange}
            data={description}
            onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)}
          />
          {descriptionError == true && (
            <div className="error">
              La description ne doit pas être vide et peut contenir au maximum
              3000 caractères
            </div>
          )}
        </FormGroup>

        <FormGroup>
          <CustomInput
            type="checkbox"
            onChange={() => this.handleIsFontChange()}
            checked={infont}
            id="infont"
          >
            &nbsp;&nbsp; <Label for="infont">Événement à la une</Label>
          </CustomInput>
        </FormGroup>

        <FormGroup>
          <CustomInput
            type="checkbox"
            onChange={() => this.setState({ entireDay: !entireDay })}
            checked={entireDay}
            id="entireDay"
          >
            &nbsp;&nbsp; <Label for="entireDay">Journée entière</Label>
          </CustomInput>
        </FormGroup>

        <FormGroup>
          <Label for="categoryId">Nombre des places</Label>
          <Input
            type="number"
            name="nbrdesplaces"
            id="nbrdesplaces"
            value={nbrdesplaces}
            onChange={this.handleChange}
            valid={nbrdesplacesError == false}
            invalid={nbrdesplacesError == true}
          />
          <FormFeedback>
            Le nombre de places doit être un nombre entier
          </FormFeedback>
        </FormGroup>
        <FormGroup>
          <Label for="start_date">
            Date de publication<span className="required">*</span>
          </Label>
          <DatePicker
            id="publish_date"
            name="publish_date"
            selected={publish_date}
            onChange={(value) => this.onDateChange("publish_date", value)}
            minDate={new Date()}
            locale="fr"
            dateFormat="dd/MM/yyyy"
            customInput={<SeqensCustomInput />}
          />
          {publishDateError == true && (
            <div className="error">
              La date de publication est ne doit pas être vide et elle doit être
              postérieure à cet instant
            </div>
          )}
        </FormGroup>
        <FormGroup>
          <Label for="start_date">
            Date et heure de début<span className="required">*</span>
          </Label>
          <DatePicker
            id="start_date"
            name="start_date"
            selected={start_date}
            onChange={(value) => this.onDateChange("start_date", value)}
            minDate={new Date()}
            locale="fr"
            showTimeSelect
            dateFormat="dd/MM/yyyy HH:mm"
            timeIntervals={15}
            timeCaption="Heure :"
            customInput={<SeqensCustomInput />}
          />
          {startDateError == true && (
            <div className="error">
              La date de début ne doit pas être vide et elle doit être
              postérieure à cet instant
            </div>
          )}
        </FormGroup>
        <FormGroup>
          <Label for="end_date">
            Date et heure de fin<span className="required">*</span>
          </Label>
          <DatePicker
            id="end_date"
            name="end_date"
            selected={end_date}
            onChange={(value) => this.onDateChange("end_date", value)}
            minDate={start_date}
            locale="fr"
            showTimeSelect
            dateFormat="dd/MM/yyyy HH:mm"
            timeIntervals={15}
            timeCaption="Heure :"
            customInput={<SeqensCustomInput />}
          />
          {endDateError == true && (
            <div className="error">
              La date de fin ne doit pas être vide et elle doit être postérieure
              à cet instant et à la date de début
            </div>
          )}
        </FormGroup>

        <FormGroup>
          <Label for="regionId">Région</Label>
          <Input
            type="select"
            name="prices"
            id="prices"
            value={prices}
            onChange={this.handleChange}
            // valid={priceError == false}
            // invalid={priceError == true}
          >
            <option value={-1}></option>
            {FR_REGION.map((region) => (
              <option value={region.id}>{region.value}</option>
            ))}
          </Input>
          <FormFeedback>La région ne doit pas être vide</FormFeedback>
        </FormGroup>
        <FormGroup>
          <Label for="localisation">Localisation :</Label>
          <Input
            type="text"
            name="localisation"
            id="localisation"
            value={localisation}
            onChange={this.handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="videoUrl">Lien vers vidéo YOUTUBE</Label>
          <Input
            type="text"
            name="videoUrl"
            id="videoUrl"
            value={videoUrl}
            onChange={this.handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="mapUrl">Lien vers GoogleMAP (http://URL/)</Label>
          <Input
            type="text"
            name="mapUrl"
            id="mapUrl"
            value={mapUrl}
            onChange={this.handleChange}
          />
        </FormGroup>

        <FormGroup>
          <Label for="appIcon">
            Image de l'événement<span className="required">*</span>
          </Label>
          <div className="image_div">
            <ImageUpload
              imageId={1}
              uploaded={image_uri != "" ? true : false}
              callbackFile={(bytes) => this.handleFileUpload(bytes)}
              src={image_uri}
              error={imageError}
              className="image_upload"
            />
            {image_uri == "" && (
              <div className="image_url">
                <Input
                  type="text"
                  name="imageURL"
                  id="imageURL"
                  value={imageURL}
                  onChange={this.handleChange}
                  valid={imageURLError == false}
                  invalid={imageURLError == true && imageError == true}
                  placeholder="Image de l'évènement par URL (image de l'intranet)"
                  className="image_input"
                />
                <img
                  style={{ maxWidth: "100%" }}
                  src={imageURL}
                  onError={(e) => {
                    e.target.style = "display: none; max-width: 100%";
                  }}
                  onLoad={(e) => {
                    e.target.style = "display: block; max-width: 100%";
                  }}
                />
              </div>
            )}
          </div>
          {imageError == true && imageURLError == true && (
            <div className="error">
              L'affiche de l'événement ne doit pas être vide
            </div>
          )}
          {image_uri == "" && (
            <FormText color="muted" className="font-weight-normal">
              Insérez une image, en téléchargeant un fichier local ou en
              insérant un lien vers une image de la bibliothèque de votre
              intranet.
            </FormText>
          )}
        </FormGroup>

        <div className="action-button">
          <Button color="cancel" size="sm" onClick={() => handleRefreshList()}>
            <i className="mdi mdi-close mdi-16px"></i>
            {isMobile ? "" : <span>Annuler</span>}
          </Button>
          <Button
            color="primary"
            size="sm"
            outline
            onClick={() => this.handleSubmit(DRAFT)}
          >
            <i className="mdi mdi-content-save-outline mdi-16px"></i>
            {isMobile ? "" : <span>Sauvegarder en brouillon</span>}
          </Button>
          <Button
            color="primary"
            size="sm"
            outline
            onClick={() => this.handleSubmit(PENDING)}
          >
            <i className="mdi mdi-check mdi-16px"></i>
            {isMobile ? "" : <span>Publier</span>}
          </Button>
        </div>
      </Form>
    );
  }
}

export const SeqensCustomInput = ({ value, onClick }) => (
  <InputGroup>
    <Input className="form-agiir-dropdown" onClick={onClick} value={value} />
    <InputGroupText>
      <i className="mdi mdi-calendar-text mdi-18px"></i>
    </InputGroupText>
  </InputGroup>
);
