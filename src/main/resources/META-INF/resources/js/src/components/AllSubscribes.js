import React from "react";
import { STATUS_REQUEST, ADMIN_INSCRIT } from "../constants/constants";
import EventRequestItem from "./EventRequestItem";
import { Alert } from "reactstrap";
import * as inscriptionEventActions from "../actions/InscriptionEventAction";
import { AlertUtil } from "agiir-react-components";
import CustomPagination from "./CustomPagination";

export default class EventsRequestsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inscriptionsEvents: [],
      activePage: 1,
      itemsPerPage: this.props.isMobile ? 8 : 9,
      pageItemsList: [],
      eventAccepted: 0
    };
    this.handleRefreshList = this.handleRefreshList.bind(this);
    this.handleChangeInscriptionStatus = this.handleChangeInscriptionStatus.bind(
      this
    );
  }

  async componentDidMount() {
    await this.getInscriptionsEvents();
    await this.refreshPage();
  }

  async componentDidUpdate(prevProps, prevState) {
    const { isMobile } = this.props;
    let itemsPerPage;
    if (prevProps.isMobile !== isMobile) {
      itemsPerPage = isMobile ? 8 : 9;
      this.setState({ itemsPerPage: itemsPerPage });
      this.handlePageChange({ selected: 0 });
    }
  }

  async refreshPage() {
    const { itemsPerPage, activePage, inscriptionsEvents } = this.state;
    let startPosition = (activePage - 1) * itemsPerPage;
    let endPosition = activePage * itemsPerPage;
    let list = inscriptionsEvents.slice(startPosition, endPosition);
    this.setState({ pageItemsList: list });
  }

  handlePageChange(pageNumber) {
    const { itemsPerPage, inscriptionsEvents } = this.state;
    let activePage = pageNumber.selected + 1;
    let startPosition = (activePage - 1) * itemsPerPage;
    let endPosition = activePage * itemsPerPage;
    let list = inscriptionsEvents.slice(startPosition, endPosition);
    this.setState({ activePage: activePage, pageItemsList: list });
  }

  async getInscriptionsEvents() {
    let res = await inscriptionEventActions.getAllEventInscriptions();
    if (res) {
      let inscriptionsEvents = res.filter(
        item => item.status == STATUS_REQUEST.pending
      );
      let eventAcceptedlist = res.filter(
        item => item.status == STATUS_REQUEST.accepted
      );
      this.setState({
        inscriptionsEvents,
        eventAccepted: eventAcceptedlist.length
      });
    }
  }

  handleRefreshList = async () => {
    await this.getInscriptionsEvents();
  };

  async handleChangeInscriptionStatus(id, status) {
    const { inscriptionsEvents } = this.state;
    let inscription = inscriptionsEvents.find(insc => insc.id == id);
    if (inscription) {
      let jsonData = {
        status: status,
        eventId: inscription.eventId,
        id: parseInt(inscription.id),
        userId: inscription.userId,
        inscription_date: inscription.inscription_date
      };
      let res = await inscriptionEventActions.updateEventInscription(jsonData);
      if (res == 201) {
        await this.getInscriptionsEvents();
        await this.refreshPage();
        AlertUtil.alert(
          `L'inscription a bien été ${
            status == STATUS_REQUEST.accepted ? "acceptée" : "refusée"
          }`,
          "success"
        );
      } else {
        AlertUtil.alert(
          "Une erreur critique est survenue, Veuillez contacter le service technique !",
          "error"
        );
      }
    }
  }
  render() {
    const { isMobile, isAdmin } = this.props;
    const {
      itemsPerPage,
      activePage,
      pageItemsList,
      inscriptionsEvents
    } = this.state;
    return (
      <div>
        <div className="page-title">
          Gestion des {ADMIN_INSCRIT.label.toLowerCase()}
        </div>
        <hr className="title-hr"></hr>
        {inscriptionsEvents && inscriptionsEvents.length > 0 ? (
          <div>
            <div className="list-items-box">
              {pageItemsList.map((item, key) => (
                <EventRequestItem
                  displayAdminButton={isAdmin}
                  key={key}
                  item={item}
                  handleAcceptRequest={() =>
                    this.handleChangeInscriptionStatus(
                      item.id,
                      STATUS_REQUEST.accepted
                    )
                  }
                  handleDeclineRequest={() =>
                    this.handleChangeInscriptionStatus(
                      item.id,
                      STATUS_REQUEST.declined
                    )
                  }
                />
              ))}
            </div>
            <CustomPagination
              list={inscriptionsEvents}
              isMobile={isMobile}
              itemsPerPage={itemsPerPage}
              activePage={activePage}
              handlePageChange={this.handlePageChange}
            />
          </div>
        ) : (
          <div style={{ textAlign: "center", minHeight: 500 }}>
            <Alert color="info">Il n'y a aucune demande à traiter</Alert>
          </div>
        )}
      </div>
    );
  }
}
