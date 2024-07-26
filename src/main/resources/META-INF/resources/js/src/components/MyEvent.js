import React from "react";
import { Button, Card, CardBody, CardTitle } from "reactstrap";
import * as agendaEventActions from "../actions/AgendaEventsAction";
import * as inscriptionEventActions from "../actions/InscriptionEventAction";
import { FR_REGION, STATUS_REQUEST } from "../constants/constants";
import AgiirUtil from "../utils/AgiirUtil/AgiirUtil";
import Ribbon from "./Ribbon";

export default class MyEvent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      abonnes: [],
      event: {},
      eventAccepted: 0,
    };
  }

  async componentDidMount() {
    await this.getEvent();
    await this.getEventAccepted();
  }

  async getEvent() {
    const { item } = this.props;
    const result = await agendaEventActions.getEventDetail(item.eventId);
    if (result) {
      this.setState({ event: result });
    }
  }
  async getEventAccepted() {
    const { item } = this.props;
    const result = await inscriptionEventActions.getAllEventInscriptions();
    const eventAcceptedlist = result.filter(
      (data) =>
        data.status == STATUS_REQUEST.accepted && data.eventId == item.eventId
    );
    this.setState({ eventAccepted: eventAcceptedlist.length });
  }

  renderSessionButton() {
    const {
      item,
      handleRegisterToEvent,
      handleCancelRegistration,
      alreadyRefusedInscription,
    } = this.props;
    switch (item.status) {
      case STATUS_REQUEST.pending:
        return (
          <Button
            color="primary"
            outline
            size="sm"
            className="mes-inscrit-button"
            onClick={handleCancelRegistration}
          >
            <i className="mdi mdi-close mdi-16px"></i>
            <span>Annuler</span>
          </Button>
        );
      default:
        return (
          <Button
            color="primary"
            outline
            size="sm"
            className="mes-inscrit-button"
            onClick={handleCancelRegistration}
          >
            <i className="mdi mdi-cancel mdi-16px"></i>
            <span>Se désinscrire</span>
          </Button>
        );
    }
  }

  render() {
    const { item, isMobile } = this.props;
    const { abonnes, event } = this.state;

    const region = FR_REGION.filter(
      (element) => element.id == parseInt(event.price)
    );

    return (
      <div className="list-item-card">
        <Card className="admin-register-card">
          <div className="event-card-container">
            <div
              class="event-image-container event_card_img_container"
              style={{ backgroundImage: 'url("' + event.image + '")' }}
            />
          </div>
          <CardBody>
            <CardTitle className="event_title">{event.title}</CardTitle>

            {event.categories && event.categories.length > 0 && (
              <div class="event-category">
                {event.categories.map((category, index) => (
                  <span className="text-nowrap">
                    {`#${category.label}`}&ensp;
                  </span>
                ))}
              </div>
            )}

            {event.localisation != null && event.localisation != "" && (
              <div className="event-localisation">
                <i className="mdi mdi-map-outline mdi-18px agiir-text-primary"></i>
                <span className="pl-2">{event.localisation}</span>
              </div>
            )}
            {event.startdate != null && event.enddate != null && (
              <div className="event-localisation">
                <i className="mdi mdi-clock-outline mdi-18px agiir-text-primary"></i>
                <span className="pl-2">
                  {AgiirUtil.convertDate(event.startdate) ==
                  AgiirUtil.convertDate(event.enddate)
                    ? AgiirUtil.convertDate(event.startdate)
                    : `${AgiirUtil.convertDate(
                        event.startdate
                      )} - ${AgiirUtil.convertDate(event.enddate)}`}
                </span>
              </div>
            )}
            <div
              className="event-status-container"
              style={{ width: isMobile ? "92%" : "88%" }}
            >
              {item.status && item.status == STATUS_REQUEST.pending ? (
                <Ribbon
                  className="badge-inscri-status-pending"
                  text="En attente"
                />
              ) : item.status == STATUS_REQUEST.accepted ? (
                <Ribbon
                  className="badge-inscri-status-accepted"
                  text="Inscrit"
                />
              ) : (
                <Ribbon
                  className="badge-inscri-status-declined"
                  text="Refusé"
                />
              )}
              <div>{this.renderSessionButton()}</div>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }
}
