import React from "react";
import { Alert } from "reactstrap";
import * as inscriptionEventActions from "../actions/InscriptionEventAction";
import { STATUS_REQUEST, USER_ID } from "../constants/constants";
import MyEvent from "./MyEvent";
import CustomPagination from "./CustomPagination";

export default class MesInscrits extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inscriptionsEvents: [],
      structuredInscriptionsFormations: [],
      activePage: 1,
      itemsPerPage: this.props.isMobile ? 8 : 9,
      pageItemsList: []
    };
    this.handleRefreshList = this.handleRefreshList.bind(this);
  }

  async componentDidMount() {
    await this.getInscriptionsEvents();
    //   this.structureData()
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
    let res = await inscriptionEventActions.getAllSubscribersByEventInstanceIdbyuser(
      USER_ID
    );
    if (res) {
      this.setState({ inscriptionsEvents: res });
    }
  }

  async handleRefreshList() {
    await this.getInscriptionsEvents();
  }

  async handleRegisterToEvent(id) {
    const { inscriptionsEvents } = this.state;
    const inscription = inscriptionsEvents.find(
      insc => insc.id == id && insc.userId == USER_ID
    );
    if (inscription != null) {
      const jsonData = {
        status: STATUS_REQUEST.pending,
        eventId: inscription.eventId,
        inscriptionId: parseInt(inscription.id),
        userId: inscription.userId
      };
      const res = await inscriptionEventActions.updateEventInscription(
        jsonData
      );
      if (res == 201) {
        await this.getInscriptionsEvents();

        await this.refreshPage();
      }
    } else {
      const jsonData = {
        eventId: id,
        userId: USER_ID
      };
      const res = await inscriptionEventActions.addEventInscription(jsonData);
      if (res == 201) {
        await this.getInscriptionsEvents();

        await this.refreshPage();
      }
    }
  }

  async handleCancelRegistrationToEvent(id) {
    const res = await inscriptionEventActions.deleteEventInscriptionbyId(id);
    if (res == 201) {
      await this.getInscriptionsEvents();
      await this.refreshPage();
    }
  }

  alreadyRefusedInscriptionRepeat(item) {
    const { inscriptionsEvents } = this.state;
    if (item.status == "declined") {
      const inscription = inscriptionsEvents.filter(
        insc => insc.eventId == item.eventId
      );
      if (Array.isArray(inscription) == true && inscription.length > 1)
        return true;
      else return false;
    } else return false;
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
        <hr className="title-hr"></hr>
        {inscriptionsEvents.length > 0 ? (
          <div>
            <div className="list-items-box">
              {pageItemsList.map((item, key) => (
                <MyEvent
                  displayAdminButton={isAdmin}
                  key={key}
                  item={item}
                  isMobile={isMobile}
                  handleRefreshList={this.handleRefreshList}
                  handleRegisterToEvent={() =>
                    this.handleRegisterToEvent(item.id)
                  }
                  handleCancelRegistration={() =>
                    this.handleCancelRegistrationToEvent(item.id)
                  }
                  alreadyRefusedInscription={this.alreadyRefusedInscriptionRepeat(
                    item
                  )}
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
            <Alert color="info">
              Si vous ne disposez pas d'une inscription, veuillez vous inscrire
              aux activités qui vous intéressent.
            </Alert>
          </div>
        )}
      </div>
    );
  }
}
