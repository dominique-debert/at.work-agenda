import React, { Fragment } from "react";
import { getDateByTimestamp } from "agiir-react-components";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { STATUS_REQUEST, USER_ID } from "../constants/constants";

const DESCRIPTION_MAX_LENGTH = 225;
export default class ItemOfCarousel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventAccepted: 0,
      mesinscriptions: [],
    };
  }
  async componentDidMount() {
    await this.getAllEventsInscriptions();
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.inscriptionsEvents != this.props.inscriptionsEvents) {
      this.getAllEventsInscriptions();
    }
  }

  async getAllEventsInscriptions() {
    const { item, inscriptionsEvents } = this.props;
    let acceptedrequest = inscriptionsEvents.filter(
      (data) =>
        data.status == STATUS_REQUEST.accepted && data.eventId == item.id
    );
    let mesinscriptions = inscriptionsEvents.filter(
      (data) => data.userId == USER_ID && data.eventId == item.id
    );
    this.setState({
      acceptedrequest: acceptedrequest.length,
      mesinscriptions: mesinscriptions,
    });
  }

  async handleRegisterEvent(e, item) {
    const { handleRegisterEvent } = this.props;
    handleRegisterEvent(e, item);
  }

  render() {
    const { item, handleDetailsView, isAdmin, region } = this.props;
    return (
      <div className="event_entry_inner">
        <div
          class="event-image-container carousel_image position-relative"
          style={{ backgroundImage: 'url("' + item.image_uri + '")' }}
          onClick={() => handleDetailsView(item)}
        >
          {item.start_date_sortable && item.end_date_sortable && (
            <div className="event-date-start justify-content-start event_day_container_detail">
              <span className="event_day_detail">
                {format(new Date(item.start_date_sortable), "dd MMMM yyyy", {
                  locale: fr,
                })}
              </span>
              {!(
                getDateByTimestamp(item.start_date_sortable, "day") ===
                  getDateByTimestamp(item.end_date_sortable, "day") &&
                getDateByTimestamp(item.start_date_sortable, "month") ===
                  getDateByTimestamp(item.end_date_sortable, "month")
              ) && (
                <Fragment>
                  <i className="mdi mdi-arrow-right mdi-18px"></i>
                  <span className="event_day_detail">
                    {`${format(
                      new Date(item.end_date_sortable),
                      "dd MMMM yyyy",
                      { locale: fr }
                    )}`}
                  </span>
                </Fragment>
              )}
            </div>
          )}
        </div>

        <div
          class="event-text-container carousel_image_container"
          onClick={() => handleDetailsView(item)}
        >
          <div class="event_title" onClick={() => handleDetailsView(item)}>
            {item.title}
          </div>
          <div
            class="agenda-event-slider-description text-justify"
            dangerouslySetInnerHTML={{
              __html:
                item.description.length > DESCRIPTION_MAX_LENGTH
                  ? `${item.description.slice(0, DESCRIPTION_MAX_LENGTH)}...`
                  : item.description,
            }}
          ></div>
          {item.categories && Array.isArray(item.categories) ? (
            <div class="event-category">
              {item.categories.map((category, index) => (
                <span className="text-nowrap">{`#${category}`}&ensp;</span>
              ))}
            </div>
          ) : (
            <div class="event-category">#{item.categories}</div>
          )}
          {item.price != null && item.price != "" && region.length > 0 && (
            <div class="event-localisation">
              <i className="mdi mdi-map-outline mdi-18px agiir-text-primary"></i>
              <span>{region.at(0).value}</span>
            </div>
          )}
          {item.localisation != "" &&
          item.localisation != null &&
          item.localisation != undefined ? (
            <div class="event-localisation">
              <i className="mdi mdi-map-marker-outline mdi-18px agiir-text-primary"></i>
              <span>{item.localisation}</span>
            </div>
          ) : (
            <div> </div>
          )}

          {item.hours != "" && item.hours != null && item.hours != undefined ? (
            <div class="event-localisation">
              <i className="mdi mdi-clock-outline mdi-18px agiir-text-primary"></i>
              <span>{item.hours}</span>
            </div>
          ) : (
            <div></div>
          )}

          {isAdmin && item.nbrdesplaces != null && item.nbrdesplaces != 0 && (
            <div class="event_nbplaces">
              <i className="mdi mdi-account-multiple-outline mdi-18px agiir-text-primary"></i>
              <span>Places réservées</span>
              <span className="place-number-label pr-2 pl-2">
                {this.state.acceptedrequest + " / " + item.nbrdesplaces}
              </span>
            </div>
          )}

          {/* {(item.nbrdesplaces != null && item.nbrdesplaces != 0 && this.state.mesinscriptions.length <= 0) && (
            <div className="float-right pb-2">
              <Button className="text-nowrap" color="secondary" size="sm" onClick={(e) => this.handleRegisterEvent(e, item)} >
                <Icon size={18} icon={ic_person_add_outline} /> &ensp;
                {"Je m'inscris"}
              </Button>
            </div>
          )} */}
        </div>
      </div>
    );
  }
}
