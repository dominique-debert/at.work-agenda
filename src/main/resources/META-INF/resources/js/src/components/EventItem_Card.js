import React from "react";
import { Card, CardBody, CardSubtitle, CardTitle } from "reactstrap";
import {
  DRAFT,
  PENDING,
  REJECTED,
  STATUS_REQUEST,
  USER_ID,
} from "../constants/constants";
import ActionButtonMobile from "./ActionButton_Mobile";
import EventDateComponent from "./EventDate";
import Ribbon from "./Ribbon";
import ValidationActionButtonMobile from "./ValidationActionButton_Mobile";
export default class EventItem_Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mesinscriptions: [],
      acceptedrequest: [],
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

    if (inscriptionsEvents) {
      const acceptedrequest = inscriptionsEvents.filter(
        (data) =>
          data.status == STATUS_REQUEST.accepted && data.eventId == item.id
      );

      const mesinscriptions = inscriptionsEvents.filter(
        (data) => data.userId == USER_ID && data.eventId == item.id
      );

      this.setState({
        acceptedrequest: acceptedrequest,
        mesinscriptions: mesinscriptions,
      });
    }
  }

  render() {
    const {
      item,
      handleDetailsView,
      administration,
      displayAdminButton,
      handleUpdateView,
      handleDeleteView,
      duplicateItem,
      unarchiveItem,
      isAdmin,
      action,
      handleRegisterEvent,
      handleUpdateStatusView,
      isContrib,
    } = this.props;
    const { mesinscriptions } = this.state;

    return (
      <div className="list-item-card">
        <Card className="admin-register-card">
          <div
            className="event-card-container"
            onClick={() => handleDetailsView()}
          >
            <div
              class="event-image-container event_card_img_container position-relative rounded-0"
              style={{ backgroundImage: 'url("' + item.image_uri + '")' }}
            >
              {item.start_date_sortable && item.end_date_sortable && (
                <EventDateComponent
                  start_date_timestap={item.start_date_sortable}
                  end_date_timestamp={item.end_date_sortable}
                  customClassName="event-card-date-container"
                  onClick={() => handleDetailsView()}
                  item={item}
                  handleRegisterEvent={handleRegisterEvent}
                  showInscriptionButton={
                    !administration &&
                    item.nbrdesplaces != null &&
                    item.nbrdesplaces > 0 &&
                    mesinscriptions.length <= 0
                  }
                />
              )}
            </div>
          </div>
          <CardBody>
            <CardTitle
              className="event_title m-0"
              onClick={() => handleDetailsView()}
            >
              {item.title}
            </CardTitle>
            <CardSubtitle className="event-category">
              {item.categories && Array.isArray(item.categories) ? (
                <div class="event-category">
                  {item.categories.map((category, index) => (
                    <span className="text-nowrap">{`#${category}`}&ensp;</span>
                  ))}
                </div>
              ) : (
                <div class="event-category">#{item.categories}</div>
              )}
            </CardSubtitle>
            <div onClick={() => handleDetailsView()}>
              {item.localisation && (
                <div className="event-localisation">
                  <i className="mdi mdi-map-outline mdi-18px agiir-text-primary"></i>
                  <span>{item.localisation}</span>
                </div>
              )}
              {item.hours != null && item.hours != "" && (
                <div className="event-localisation">
                  <i className="mdi mdi-clock-outline mdi-18px agiir-text-primary"></i>
                  <span>{item.hours}</span>
                </div>
              )}
              {isAdmin && item.nbrdesplaces != null && item.nbrdesplaces != 0 && (
                <div class="event_nbplaces">
                  <i className="mdi mdi-account-multiple-outline mdi-18px agiir-text-primary"></i>
                  <span>Places réservées</span>
                  <span className="place-number-label pr-2 pl-2">
                    {this.state.acceptedrequest.length +
                      " / " +
                      item.nbrdesplaces}
                  </span>
                </div>
              )}
              {item.motif_refus && (
                <div className="motif_refus">
                  Motif du refus :{" "}
                  <span className="font-weight-normal">
                    {item.motif_refus.length > 25
                      ? `${item.motif_refus.slice(0, 25)}...`
                      : item.motif_refus}
                  </span>
                </div>
              )}
            </div>
            {administration && (displayAdminButton || isContrib) && (
              <div className="event-status-container">
                {item.event_status &&
                  (item.event_status == DRAFT ? (
                    <Ribbon className="badge-status-info" text="Brouillon" />
                  ) : item.event_status == PENDING ? (
                    <Ribbon
                      className="badge-status-warning"
                      text="En attente"
                    />
                  ) : item.event_status == REJECTED ? (
                    <Ribbon className="badge-status-danger" text="Refusé" />
                  ) : (
                    <Ribbon className="badge-status-success" text="Publié" />
                  ))}
                {action == "validate" ? (
                  <ValidationActionButtonMobile
                    displayAdminButton={displayAdminButton}
                    handleUpdateStatusView={handleUpdateStatusView}
                    approveTitle={"Publier un événement"}
                    approveMessage={
                      "Êtes-vous sûr de bien vouloir publier cet événement ?"
                    }
                    rejectTitle={"Refuser un événement"}
                    rejectMessage={
                      "Êtes-vous sûr de bien vouloir refuser cet événement ?"
                    }
                  />
                ) : (
                  <ActionButtonMobile
                    displayAdminButton={displayAdminButton || isContrib}
                    canDelete={
                      displayAdminButton ||
                      (isContrib && item.publisher_id == USER_ID)
                    }
                    showDuplicate
                    action={action}
                    handleUpdateView={handleUpdateView}
                    handleDeleteView={handleDeleteView}
                    duplicateItem={duplicateItem}
                    unarchiveItem={unarchiveItem}
                    suppressionMessage={
                      "Êtes-vous sûr de bien vouloir supprimer cet événement ?"
                    }
                    suppressionTitle={"Supprimer un événement"}
                  />
                )}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    );
  }
}
