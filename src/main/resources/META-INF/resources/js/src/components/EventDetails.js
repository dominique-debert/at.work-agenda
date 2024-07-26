import React, { Fragment } from "react";
import {
  AgiirDrawerModal,
  AlertUtil,
  getDateByTimestamp,
} from "agiir-react-components";
import { Button, FormGroup, Label } from "reactstrap";
import * as inscriptionEventActions from "../actions/InscriptionEventAction";
import {
  DETAIL_VIEW,
  DRAFT,
  FR_REGION,
  INSCRIPTION_VIEW,
  NAVBAR_DETAILS_ITEMS,
  PENDING,
  REJECTED,
  STATUS_REQUEST,
  USER_ID,
} from "../constants/constants";
import InscritList from "./InscritList";
import { SeqensCustomInput } from "./EventForm";
import DatePicker from "react-datepicker";
import { fr } from "date-fns/locale";
import AgiirUtil from "../utils/AgiirUtil/AgiirUtil";
import { format } from "date-fns";
import Ribbon from "./Ribbon";
import NavAppBar from "./NavAppBar";

class EventDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allInscriptions: [],
      mesinscriptions: null,
      displayUsersList: true,
      inscriptionError: false,
      inscriptionModal: false,
      view: DETAIL_VIEW.code,
    };
    this.viewChange = this.viewChange.bind(this);
    this.toggleInscriptionModal = this.toggleInscriptionModal.bind(this);
    this.getAllEventsInscriptions = this.getAllEventsInscriptions.bind(this);
  }

  async componentDidMount() {
    await this.getAllEventsInscriptions();
  }

  toggleDisplayUsersList() {
    const { displayUsersList } = this.state;
    this.setState({ displayUsersList: !displayUsersList });
  }

  copyPageLink(id) {
    let searchParam = "?eventId=" + id;
    let baseURL = location.origin + location.pathname;
    navigator.clipboard.writeText(baseURL + searchParam);
    AlertUtil.alert("L'URL est copié dans le Presse-papier", "info");
  }

  async getAllEventsInscriptions() {
    const { item } = this.props;

    let res = await inscriptionEventActions.getAllEventInscriptions();

    let allInscriptions = res.filter((data) => data.eventId == item.id);
    let mesinscriptions = res.find(
      (data) => data.userId == USER_ID && data.eventId == item.id
    );

    this.setState({ allInscriptions, mesinscriptions });
  }

  handleExportICS() {
    const { item } = this.props;
    // Create the .ics URL
    let url = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      "DTSTART:" + this.formatDate(new Date(item.start_date_sortable)),
      "DTEND:" + this.formatDate(new Date(item.end_date_sortable)),
      "SUMMARY:" + item.title,
      "DESCRIPTION:" + `${item.description ? item.description : ""}`,
      "LOCATION:" + `${item.localisation ? item.localisation : ""}`,
      "BEGIN:VALARM",
      "TRIGGER:-PT15M",
      "REPEAT:1",
      "DURATION:PT15M",
      "ACTION:DISPLAY",
      "DESCRIPTION:Reminder",
      "END:VALARM",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\n");

    // let blob = new Blob([url], { type: 'text/calendar;charset=utf-8' });
    window.open(encodeURI("data:text/calendar;charset=utf8," + url));
    // if (/msie\s|trident\/|edge\//i.test(window.navigator.userAgent)) {
    //   // Open/Save link in IE and Edge
    //   window.navigator.msSaveBlob(blob, `.ics`);
    // } else {
    //   // Open/Save link in Modern Browsers
    //   window.open(encodeURI("data:text/calendar;charset=utf8," + url));
    // }
  }

  formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date
      .getDate()
      .toString()
      .padStart(2, "0");
    const hours = date
      .getHours()
      .toString()
      .padStart(2, "0");
    const minutes = date
      .getMinutes()
      .toString()
      .padStart(2, "0");
    const seconds = date
      .getSeconds()
      .toString()
      .padStart(2, "0");

    return `${year}${month}${day}T${hours}${minutes}${seconds}`;
  }

  youtubeParser(url) {
    if (url && url != "") {
      var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
      var match = url.match(regExp);
      return match && match[7].length == 11
        ? `https://www.youtube.com/embed/${match[7]}`
        : url;
    }
    return "";
  }
  extractIframeSrc(iframeCode) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(iframeCode, "text/html");
    if (
      doc.querySelector("iframe") &&
      doc.querySelector("iframe").getAttribute("src")
    ) {
      const iframeSrc = doc.querySelector("iframe").getAttribute("src");
      return iframeSrc;
    }
    return "";
  }

  synchroError(stateName, value) {
    if (stateName == "inscription_date") {
      if (value == null) {
        this.setState({ inscriptionError: true });
      } else {
        this.setState({ inscriptionError: false });
      }
    }
  }

  toggleInscriptionModal() {
    this.setState({
      inscriptionModal: !this.state.inscriptionModal,
    });
  }

  onDateChange(name, value) {
    let change = {};
    change[name] = value;
    this.setState(change);
    this.synchroError(name, value);
  }

  async registerEvent() {
    const { refreshUserEventsListCallback, item } = this.props;
    const { inscriptionModal, inscription_date } = this.state;
    const jsonData = {
      eventId: item.id,
      userId: USER_ID,
      inscription_date: inscription_date,
      status: STATUS_REQUEST.pending,
    };
    const res = await inscriptionEventActions.addEventInscription(jsonData);

    if (res == 201) {
      await refreshUserEventsListCallback();
      await this.getAllEventsInscriptions();
      inscriptionModal == true && this.toggleInscriptionModal();
      this.setState({ inscription_date: null });
      AlertUtil.alert("Votre inscription a été prise en compte", "success");
    } else {
      AlertUtil.alert(
        "Une erreur critique est survenue, veuillez contacter le service technique !",
        "error"
      );
    }
  }

  async submitRegister() {
    const { inscription_date } = this.state;
    this.synchroError("inscription_date", inscription_date);
    const { inscriptionError } = this.state;
    if (inscriptionError == false) {
      this.registerEvent();
    } else {
      AlertUtil.alert(
        "Un des champs requis est vide, veuillez vérifier vos informations.",
        "warning"
      );
    }
  }

  async handleClickRegister() {
    const { item } = this.props;
    if (item.end_date_sortable > item.start_date_sortable) {
      await this.toggleInscriptionModal();
    } else {
      await this.setState({ inscription_date: item.start_date_sortable });
      await this.registerEvent();
    }
  }

  async handleCancelRegistration() {
    const { mesinscriptions } = this.state;
    const res = await inscriptionEventActions.deleteEventInscriptionbyId(
      mesinscriptions.id
    );
    if (res == 201) {
      await this.getAllEventsInscriptions();
      AlertUtil.alert("Votre inscription a bien été annulée", "success");
    } else {
      AlertUtil.alert(
        "Une erreur critique est survenue, veuillez contacter le service technique !",
        "error"
      );
    }
  }
  async viewChange(component) {
    this.setState({ view: component });
  }

  render() {
    const { item, isMobile, isAdmin } = this.props;
    const {
      inscription_date,
      inscriptionModal,
      inscriptionError,
      allInscriptions,
      mesinscriptions,
      view,
    } = this.state;
    const region = FR_REGION.filter(
      (element) => element.id == item.price_sortable
    );
    return (
      <div className="agenda-modal-content">
        <NavAppBar
          isDetailPage
          activeTab={view}
          viewChange={this.viewChange}
          type={isMobile ? "mobile" : "desktop"}
          displayAdminButton={isAdmin}
          canPost={isAdmin}
          canManage={isAdmin}
          className="px-0"
        />
        {view == DETAIL_VIEW.code ? (
          <Fragment>
            <div className="title-flexbox">
              <h1 className="page-title">{item.title}</h1>
              <div className="d-flex">
                <Button
                  color="primary"
                  size="sm"
                  outline
                  className="mr-2"
                  onClick={() => this.handleExportICS()}
                >
                  <i className="mdi mdi-calendar-import mdi-16px"></i>
                  {isMobile ? "" : <span>Enregistrer dans mon calendrier</span>}
                </Button>
                <Button
                  color="primary"
                  outline
                  size="sm"
                  onClick={() => this.copyPageLink(item.id)}
                >
                  <i className="mdi mdi-share-variant mdi-16px"></i>
                  {isMobile ? "" : <span>Partager</span>}
                </Button>
              </div>
            </div>
            <hr className="title-hr" />
            <div className="event_detail_row">
              <div className="event_detail_col">
                <div
                  class="event-image-container agenda-event-details-image"
                  style={{ backgroundImage: 'url("' + item.image_uri + '")' }}
                >
                  {item.start_date_sortable && item.start_date_sortable && (
                    <div className="event-date-start event_day_container_detail">
                      {getDateByTimestamp(item.start_date_sortable, "day") ===
                        getDateByTimestamp(item.end_date_sortable, "day") &&
                      getDateByTimestamp(item.start_date_sortable, "month") ===
                        getDateByTimestamp(item.end_date_sortable, "month") ? (
                        <span className="event_day_detail">
                          {format(
                            new Date(item.start_date_sortable),
                            "dd MMMM yyyy",
                            { locale: fr }
                          )}
                        </span>
                      ) : (
                        <Fragment>
                          <span className="event_day_detail">
                            {`${AgiirUtil.formatDateIntl(
                              item.start_date_sortable
                            )}`}
                          </span>
                          <i className="mdi mdi-arrow-right mdi-18px"></i>
                          <span className="event_day_detail ml-2">
                            {`${AgiirUtil.formatDateIntl(
                              item.end_date_sortable
                            )}`}
                          </span>
                        </Fragment>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="event_detail_col">
                {item.categories && Array.isArray(item.categories) ? (
                  <div class="event-category">
                    {item.categories.map((category, index) => (
                      <span className="text-nowrap">
                        {`#${category}`}&ensp;
                      </span>
                    ))}
                  </div>
                ) : (
                  <div class="event-category">#{item.categories}</div>
                )}

                <div className="d-flex">
                  {item.price != null && item.price != "" && region.length > 0 && (
                    <div class="event-localisation">
                      <i className="mdi mdi-map-outline mdi-18px agiir-text-primary mr-2"></i>
                      <span>{region.at(0).value}</span>
                    </div>
                  )}
                  {item.localisation != null && item.localisation != "" && (
                    <div class="event-localisation">
                      <i className="mdi mdi-map-marker-outline mdi-18px agiir-text-primary"></i>
                      <span>{item.localisation}</span>
                    </div>
                  )}
                  {item.hours != null && item.hours != "" && (
                    <div class="event-localisation">
                      <i className="mdi mdi-clock-outline mdi-18px agiir-text-primary"></i>
                      <span>{item.hours}</span>
                    </div>
                  )}
                </div>
                {item.motif_refus && (
                  <div className="motif_refus">
                    Motif du refus :{" "}
                    <span className="font-weight-normal">
                      {item.motif_refus.length > 50
                        ? `${item.motif_refus.slice(0, 50)}...`
                        : item.motif_refus}
                    </span>
                  </div>
                )}
                <div
                  class="event-description text-justify"
                  dangerouslySetInnerHTML={{ __html: item.description }}
                />
              </div>
            </div>
            <div className="event_detail_row">
              {item.video_url && (
                <div className="event_detail_col">
                  <iframe
                    className="card-map-video"
                    frameborder="0"
                    border="0"
                    cellspacing="0"
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                    src={this.youtubeParser(item.video_url)}
                  />
                </div>
              )}
              {item.map_url && (
                <div className="event_detail_col">
                  <iframe
                    className="card-map-video"
                    frameborder="0"
                    border="0"
                    cellspacing="0"
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                    src={this.extractIframeSrc(item.map_url)}
                  />
                </div>
              )}
            </div>
            <Fragment>
              <hr className="title-hr" />
              <div className="d-flex justify-content-between">
                {isAdmin ? (
                  <Fragment>
                    {item.event_status &&
                      (item.event_status == DRAFT ? (
                        <Ribbon
                          className="badge-status-info"
                          text="Brouillon"
                        />
                      ) : item.event_status == PENDING ? (
                        <Ribbon
                          className="badge-status-warning"
                          text="En attente"
                        />
                      ) : item.event_status == REJECTED ? (
                        <Ribbon className="badge-status-danger" text="Refusé" />
                      ) : (
                        <Ribbon
                          className="badge-status-success"
                          text="Publié"
                        />
                      ))}
                  </Fragment>
                ) : (
                  <div></div>
                )}

                {(mesinscriptions == null ||
                  mesinscriptions.status == STATUS_REQUEST.pending) && (
                  <Fragment>
                    {!mesinscriptions ? (
                      <Button
                        color="primary"
                        outline
                        size="sm"
                        onClick={(e) => this.handleClickRegister(e)}
                      >
                        <i className="mdi mdi-account-plus-outline mdi-16px"></i>
                        <span>Je m'inscris</span>
                      </Button>
                    ) : (
                      <Button
                        color="primary"
                        outline
                        size="sm"
                        onClick={() => this.handleCancelRegistration()}
                      >
                        <i className="mdi mdi-cancel mdi-16px"></i>
                        <span>Annuler l'inscription</span>
                      </Button>
                    )}
                  </Fragment>
                )}
              </div>
            </Fragment>
          </Fragment>
        ) : (
          <InscritList
            event={item}
            allInscriptions={allInscriptions}
            isMobile={isMobile}
            refreshListCallback={this.getAllEventsInscriptions}
          />
        )}

        <AgiirDrawerModal
          isOpen={inscriptionModal}
          closeModal={this.toggleInscriptionModal}
          title="Ajout d'une date d'inscription"
        >
          <FormGroup>
            <Label for="inscription_date">
              Date d'inscription<span className="required">*</span> :
            </Label>
            <DatePicker
              id="inscription_date"
              name="inscription_date"
              selected={inscription_date}
              onChange={(value) => this.onDateChange("inscription_date", value)}
              minDate={
                new Date(item.start_date_sortable) > new Date()
                  ? new Date(item.start_date_sortable)
                  : new Date()
              }
              maxDate={new Date(item.end_date_sortable)}
              locale="fr"
              showTimeSelect
              dateFormat="dd/MM/yyyy HH:mm"
              timeIntervals={15}
              timeCaption="Heure :"
              customInput={<SeqensCustomInput />}
            />
            {inscriptionError == true && (
              <div className="error">
                La date d'inscription ne doit pas être vide
              </div>
            )}
          </FormGroup>
          <div className="action-button">
            <Button
              onClick={() => this.toggleInscriptionModal()}
              color="cancel"
              size="sm"
              className="mr-2"
            >
              <i className="mdi mdi-close mdi-16px"></i>
              <span>Annuler</span>
            </Button>

            <Button
              onClick={() => this.submitRegister()}
              color="primary"
              size="sm"
            >
              <i className="mdi mdi-check mdi-16px"></i>
              <span>Valider</span>
            </Button>
          </div>
        </AgiirDrawerModal>
      </div>
    );
  }
}

export default EventDetails;
