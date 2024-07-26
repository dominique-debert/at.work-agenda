import React from "react";
import { Button, Card, CardBody, CardTitle } from "reactstrap";
import AgiirUtil from "../utils/AgiirUtil/AgiirUtil";
import * as inscriptionEventActions from "../actions/InscriptionEventAction";
import * as agendaEventActions from "../actions/AgendaEventsAction";
import * as userActions from "../actions/UserActions";
import { STATUS_REQUEST, FR_REGION } from "../constants/constants";
import DummyAvatar from "./DummyAvatar";

export default class EventRequestItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      abonnes: [],
      event: null,
      eventAccepted: 0,
    };
  }

  async componentDidMount() {
    await this.getEvent();
    await this.getUser();
    await this.getEventAccepted();
  }

  async getEventAccepted() {
    const { item } = this.props;
    let result = await inscriptionEventActions.getAllEventInscriptions();
    let eventAcceptedlist = result.filter(
      (data) =>
        data.status == STATUS_REQUEST.accepted && data.eventId == item.eventId
    );
    this.setState({ eventAccepted: eventAcceptedlist.length });
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.item != this.props.item) {
      await this.getEvent();
    }
  }

  async getUser() {
    const { item } = this.props;
    let user = await userActions.getUserById(item.userId);
    this.setState({
      user,
    });
  }

  async getEvent() {
    const { item } = this.props;
    let res = await agendaEventActions.getEventDetail(item.eventId);
    if (res) {
      this.setState({ event: res });
    }
  }

  render() {
    const { handleAcceptRequest, handleDeclineRequest } = this.props;
    const { user, event } = this.state;
    const region =
      event && event.price
        ? FR_REGION.filter((element) => element.id == parseInt(event.price))
        : [];

    return (
      <div className="list-item-card">
        <Card className="admin-register-card shadow-none">
          {user && (
            <div className="d-flex flex-column justify-content-center event-card-container pt-3">
              <DummyAvatar
                firstName={user ? user.firstName : ""}
                lastName={user ? user.lastName : ""}
                email={user ? user.emailAddress : ""}
                size={100}
              />
              <div className="event-request-user-info text-center">{`${user.lastName} ${user.firstName}`}</div>
              <div className="event-request-email text-center">
                {user.emailAddress}
              </div>
            </div>
          )}
          {event && (
            <CardBody>
              <CardTitle className="event_title mb-0">{event.title}</CardTitle>
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
                  <span>{event.localisation}</span>
                </div>
              )}

              {event.startdate != null && event.enddate != null && (
                <div className="event-localisation">
                  <i className="mdi mdi-clock-outline mdi-18px"></i>
                  <span>
                    {AgiirUtil.convertDate(event.startdate) ==
                    AgiirUtil.convertDate(event.enddate)
                      ? AgiirUtil.convertDate(event.startdate)
                      : `${AgiirUtil.convertDate(
                          event.startdate
                        )} - ${AgiirUtil.convertDate(event.enddate)}`}
                  </span>
                </div>
              )}

              {event.nbrdesplaces != null && event.nbrdesplaces != "" && (
                <div class="event_nbplaces">
                  <i className="mdi mdi-account-multiple-outline mdi-18px agiir-text-primary"></i>
                  <span>Places réservées</span>
                  <span className="place-number-label pr-2 pl-2">
                    {this.state.eventAccepted + " / " + event.nbrdesplaces}
                  </span>
                </div>
              )}

              <hr className="my-3" />
              <div className="d-flex justify-content-end my-2">
                <Button
                  size="sm"
                  color="primary"
                  outline
                  onClick={() => handleDeclineRequest()}
                >
                  <i className="mdi mdi-close mdi-16px"></i>
                  <span>Refuser</span>
                </Button>
                <Button
                  size="sm"
                  color="primary"
                  outline
                  onClick={() => handleAcceptRequest()}
                >
                  <i className="mdi mdi-check mdi-16px"></i>
                  <span>Accepter</span>
                </Button>
              </div>
            </CardBody>
          )}
        </Card>
      </div>
    );
  }
}
