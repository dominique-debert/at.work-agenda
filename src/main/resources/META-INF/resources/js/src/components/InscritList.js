import React from "react";
import { AlertUtil } from "agiir-react-components";
import { Alert, Button, Table } from "reactstrap";
import CustomPagination from "./CustomPagination";
import * as inscriptionEventActions from "../actions/InscriptionEventAction";
import { format } from "date-fns";
import Ribbon from "./Ribbon";
import { APPROVED, REJECTED, STATUS_REQUEST } from "../constants/constants";
import ValidationActionButtonMobile from "./ValidationActionButton_Mobile";

class InscritList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: 1,
      itemsPerPage: 8,
      selectedUser: null,
      pageItemsList: [],
    };

    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleRefreshList = this.handleRefreshList.bind(this);
    this.handleChangeInscriptionStatus = this.handleChangeInscriptionStatus.bind(
      this
    );
  }

  componentDidMount() {
    this.initiatePageItemList();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.allInscriptions !== this.props.allInscriptions) {
      this.initiatePageItemList();
    }
  }

  initiatePageItemList() {
    const { allInscriptions } = this.props;
    const { itemsPerPage, activePage } = this.state;
    let startPosition = (activePage - 1) * itemsPerPage;
    let endPosition = activePage * itemsPerPage;
    let list = allInscriptions.slice(startPosition, endPosition);
    this.setState({ pageItemsList: list });
  }

  handlePageChange(pageNumber) {
    const { scrollToTop } = this.props;
    scrollToTop();
    const { allInscriptions } = this.props;
    const { itemsPerPage } = this.state;
    let activePage = pageNumber.selected + 1;
    let startPosition = (activePage - 1) * itemsPerPage;
    let endPosition = activePage * itemsPerPage;
    let list = allInscriptions.slice(startPosition, endPosition);
    this.setState({ activePage: activePage, pageItemsList: list });
  }

  async handleDeleteUserRequest() {
    const { selectedUser } = this.state;
    let res = await inscriptionEventActions.deleteEventInscriptionbyId(
      selectedUser.id
    );
    if (res == 201) {
      await this.handleRefreshList();
      AlertUtil.alert(
        selectedUser.firstName +
          " " +
          selectedUser.lastName +
          " a été retiré de la liste des inscrits",
        "success"
      );
    } else {
      AlertUtil.alert(
        "Une erreur critique est survenue, veuillez contacter le service technique !",
        "error"
      );
    }
  }

  async handleChangeInscriptionStatus(id, status) {
    const { allInscriptions } = this.props;
    let inscription = allInscriptions.find((insc) => insc.id == id);
    if (inscription) {
      let jsonData = {
        status: status.title,
        eventId: inscription.eventId,
        id: parseInt(inscription.id),
        userId: inscription.userId,
        inscription_date: inscription.inscription_date,
      };
      if (status.code == REJECTED) {
        jsonData.motifRefus = status.motif;
      }
      let res = await inscriptionEventActions.updateEventInscription(jsonData);
      if (res == 201) {
        this.handleRefreshList();
        AlertUtil.alert(
          `L'inscription a bien été ${
            status.code == APPROVED ? "acceptée" : "refusée"
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

  handleExportCSV() {
    const { allInscriptions, event } = this.props;
    const rows = allInscriptions.map((inscription) => [
      inscription.lastName,
      inscription.firstName,
      inscription.email,
      inscription.phoneNumber.map((phone) => phone.number).join(", "),
      inscription.organizations
        .map((organization) => organization.name)
        .join(", "),
      inscription.status == STATUS_REQUEST.accepted
        ? "Acceptee"
        : inscription.status == STATUS_REQUEST.pending
        ? "En attente"
        : "Refusee",
      format(new Date(inscription.inscription_date), "dd/MM/yyyy"),
      format(new Date(event.start_date_sortable), "dd/MM/yyyy"),
      event.title,
    ]);

    let csvContent =
      "data:text/csv;charset=utf-8,Nom;Prenom;Email;Telephone;Service;Statut;Date d'inscription;Date de debut de l'evenement;Titre de l'evenement\n" +
      rows.map((e) => e.join(";")).join("\n");
    let encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
  }

  handleRefreshList() {
    const { refreshListCallback } = this.props;
    refreshListCallback();
  }

  render() {
    const { event, allInscriptions, displayAdminButton, isMobile } = this.props;
    const { itemsPerPage, activePage, pageItemsList } = this.state;
    return (
      <div>
        <div>
          <div className="title-flexbox align-items-center">
            <div
              className={`page-title d-flex ${isMobile ? "flex-column" : ""}`}
            >
              <span>{`${event.title}`} &ensp;</span>
              <span className={isMobile ? "list-inscrit-mobile-title" : ""}>{`${
                isMobile ? "L" : ": l"
              }iste des inscrits`}</span>
            </div>
            {allInscriptions && allInscriptions.length > 0 && (
              <Button
                color="primary"
                size="sm"
                outline
                onClick={() => this.handleExportCSV()}
              >
                <i className="mdi mdi-download-outline mdi-16px"></i>
                {isMobile ? "" : <span>&ensp;Exporter en CSV</span>}
              </Button>
            )}
          </div>
          <hr className="title-hr"></hr>
          {allInscriptions && allInscriptions.length > 0 ? (
            <div>
              <Table className="large-category-list" striped hover>
                <thead>
                  <tr>
                    <th className="text-left ">Prénom / Nom</th>
                    <th className="text-left ">Service</th>
                    <th className="text-left ">Email</th>
                    <th className="text-left ">Téléphone</th>
                    <th className="text-left ">Motif de refus</th>
                    <th className="text-left ">Statut</th>
                    <th className="text-left" style={{ width: "13%" }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pageItemsList.map((item, index) => (
                    <tr key={index}>
                      <td>{`${item.firstName} ${item.lastName}`}</td>
                      <td>
                        {item.organizations
                          .map((organization) => organization.name)
                          .join(", ")}
                      </td>
                      <td>{item.email}</td>
                      <td>
                        {item.phoneNumber
                          .map((phone) => phone.number)
                          .join(", ")}
                      </td>
                      <td>{item.motifRefus}</td>
                      <td>
                        {item.status &&
                        item.status == STATUS_REQUEST.pending ? (
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
                      </td>
                      <td>
                        {item.status == STATUS_REQUEST.pending && (
                          <ValidationActionButtonMobile
                            displayAdminButton={displayAdminButton}
                            handleChangeInscriptionStatus={(statusObject) =>
                              this.handleChangeInscriptionStatus(
                                item.id,
                                statusObject
                              )
                            }
                            approveTitle={"Valider une inscription"}
                            action="inscription"
                            approveMessage={`Êtes-vous sûr de bien vouloir valider l'inscription de ${item.firstName} ${item.lastName} ?`}
                            rejectTitle={"Refuser une inscription"}
                            rejectMessage={`Refuser l'inscription de ${item.firstName} ${item.lastName} à l'événement "${event.title}"`}
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div className="mobile-category-list">
                {pageItemsList.map((item, index) => (
                  <div key={index} className="card-category-item">
                    <div className="d-flex title-category-container">
                      <div className="left-title-category">
                        <div className="text-info">Prénom / Nom</div>
                        <div className="mobile-category-title">
                          {`${item.firstName} ${item.lastName}`}
                        </div>
                      </div>
                      {item.status == STATUS_REQUEST.pending && (
                        <ValidationActionButtonMobile
                          displayAdminButton={displayAdminButton}
                          handleChangeInscriptionStatus={(statusObject) =>
                            this.handleChangeInscriptionStatus(
                              item.id,
                              statusObject
                            )
                          }
                          approveTitle={"Valider une inscription"}
                          action="inscription"
                          approveMessage={`Êtes-vous sûr de bien vouloir valider l'inscription de ${item.firstName} ${item.lastName} ?`}
                          rejectTitle={"Refuser une inscription"}
                          rejectMessage={`Refuser l'inscription de ${item.firstName} ${item.lastName} à l'événement "${event.title}"`}
                        />
                      )}
                    </div>
                    <div className="description-container">
                      <span className="w-25 text-info">Service</span>
                      <div className="mobile-category-description">
                        {item.organizations
                          .map((organization) => organization.name)
                          .join(", ")}
                      </div>
                    </div>
                    <div className="description-container">
                      <span className="w-25 text-info">Email</span>
                      <div className="mobile-category-description">
                        {item.email}
                      </div>
                    </div>
                    <div className="description-container">
                      <span className="w-25 text-info">Telephone</span>
                      <div className="mobile-category-description">
                        {item.phoneNumber
                          .map((phone) => phone.number)
                          .join(", ")}
                      </div>
                    </div>
                    {item.motifRefus && (
                      <div className="description-container">
                        <span className="w-25 text-info">Motif de refus</span>
                        <div className="mobile-category-description">
                          {item.motifRefus}
                        </div>
                      </div>
                    )}
                    <div className="description-container mb-2">
                      <span className="w-25 text-info">Statut</span>
                      <div className="mobile-category-description">
                        {item.status &&
                        item.status == STATUS_REQUEST.pending ? (
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
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <CustomPagination
                list={allInscriptions}
                isMobile={isMobile}
                itemsPerPage={itemsPerPage}
                activePage={activePage}
                handlePageChange={this.handlePageChange}
              />
            </div>
          ) : (
            <div style={{ textAlign: "center", minHeight: 500 }}>
              <Alert color="info">
                Aucun événement ne correspond à votre recherche.
              </Alert>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default InscritList;
