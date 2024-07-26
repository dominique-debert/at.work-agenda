import React from "react";
import * as inscriptionEventActions from "../actions/InscriptionEventAction";
import {
  DRAFT,
  FR_REGION,
  PENDING,
  REJECTED,
  STATUS_REQUEST,
  USER_ID,
} from "../constants/constants";
import ActionButton from "./ActionButton";
import EventDateComponent from "./EventDate";
import Ribbon from "./Ribbon";
import ValidationActionButton from "./ValidationActionButton";
import { truncate } from "agiir-react-components";

class EventItem_List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      acceptedrequest: [],
      mesinscriptions: [],
    };
  }

  async componentDidMount() {
    await this.getAllEventsInscriptions();
  }

  async getAllEventsInscriptions() {
    const { item } = this.props;
    const res = await inscriptionEventActions.getAllEventInscriptions();
    const acceptedrequest = res.filter(
      (data) =>
        data.status == STATUS_REQUEST.accepted && data.eventId == item.id
    );
    const mesinscriptions = res.filter(
      (data) => data.userId == USER_ID && data.eventId == item.id
    );

    this.setState({
      acceptedrequest: acceptedrequest,
      inscriptionsEvents: res,
      mesinscriptions: mesinscriptions,
    });
  }

  render() {
    const {
      item,
      handleDetailsView,
      handleUpdateView,
      handleDeleteView,
      handleUpdateStatusView,
      displayAdminButton,
      duplicateItem,
      unarchiveItem,
      action,
      administration,
      handleRegisterEvent,
      isContrib,
    } = this.props;
    const { mesinscriptions } = this.state;
    const region = FR_REGION.filter(
      (element) => element.id == item.price_sortable
    );
    return (
      <div style={{ width: "100%" }}>
        <div className="user_event_card">
          <div class="event_entry_inner">
            <div
              class="event-image-container position-relative"
              style={{ backgroundImage: 'url("' + item.image_uri + '")' }}
              onClick={() => handleDetailsView()}
            >
              {item.start_date_sortable && item.end_date_sortable && (
                <EventDateComponent
                  start_date_timestap={item.start_date_sortable}
                  end_date_timestamp={item.end_date_sortable}
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

            <div
              class="event-text-container"
              onClick={() => handleDetailsView()}
            >
              <div class="event_title">{item.title}</div>
              {item.categories && Array.isArray(item.categories) ? (
                <div class="event-category">
                  {item.categories.map((category, index) => (
                    <span className="text-nowrap">{`#${category}`}&ensp;</span>
                  ))}
                </div>
              ) : (
                <div class="event-category">#{item.categories}</div>
              )}
              {item.description && (
                <div
                  class="event-description text-justify mb-3"
                  dangerouslySetInnerHTML={{
                    __html: truncate(item.description, 200),
                  }}
                />
              )}

              <div style={{ display: "flex" }}>
                {item.price != null && item.price != "" && region.length > 0 && (
                  <div class="event-localisation">
                    <i className="mdi mdi-map-outline mdi-18px agiir-text-primary"></i>
                    <span className="pl-3">{region.at(0).value}</span>
                  </div>
                )}
                {item.localisation && (
                  <div class="event-localisation">
                    <i className="mdi mdi-map-marker-outline mdi-18px agiir-text-primary"></i>
                    <span className="pl-3">{item.localisation}</span>
                  </div>
                )}

                {item.hours != "" &&
                item.hours != null &&
                item.hours != undefined ? (
                  <div class="event-localisation">
                    <i className="mdi mdi-clock-outline mdi-18px agiir-text-primary"></i>
                    <span className="pl-3">{item.hours}</span>
                  </div>
                ) : (
                  <div></div>
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
            </div>
            {action != "archive" && (
              <div className="user-event-status">
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
              </div>
            )}
            {administration && (displayAdminButton || isContrib) && (
              <div class="event_action_container">
                {action == "validate" ? (
                  <ValidationActionButton
                    displayAdminButton={displayAdminButton || isContrib}
                    handleUpdateStatusView={handleUpdateStatusView}
                    approveTitle="Publier un événement"
                    approveMessage="Êtes-vous sûr de bien vouloir publier cet événement ?"
                    rejectTitle="Refuser un événement"
                    rejectMessage="Êtes-vous sûr de bien vouloir refuser cet événement ?"
                  />
                ) : (
                  <ActionButton
                    displayAdminButton={displayAdminButton || isContrib}
                    canDelete={
                      displayAdminButton ||
                      (isContrib && item.publisher_id == USER_ID)
                    }
                    handleUpdateView={handleUpdateView}
                    handleDeleteView={handleDeleteView}
                    duplicateItem={duplicateItem}
                    unarchiveItem={unarchiveItem}
                    action={action}
                    suppressionMessage="Êtes-vous sûr de bien vouloir supprimer cet événement ?"
                    suppressionTitle="Supprimer un événement"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default EventItem_List;
