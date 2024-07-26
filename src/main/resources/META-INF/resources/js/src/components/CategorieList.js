import React from "react";
import { AgiirDrawerModal, AlertUtil } from "agiir-react-components";
import { Alert, Button, Table } from "reactstrap";
import * as agendaEventsCategoryActions from "../actions/AgendaEventsCategoryAction";
import { ADMIN_CATEG } from "../constants/constants";
import ActionButton from "./ActionButton";
import EventCategoyForm from "./EventCategoyForm";
import CustomPagination from "./CustomPagination";
import ActionButtonMobile from "./ActionButton_Mobile";

class CategoriesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: 1,
      itemsPerPage: 8,
      selectedItem: null,
      formModal: false,
      pageItemsList: [],
    };

    this.handlePageChange = this.handlePageChange.bind(this);
    this.toggleFormModal = this.toggleFormModal.bind(this);
    this.handleRefreshList = this.handleRefreshList.bind(this);
    this.handleUpdateView = this.handleUpdateView.bind(this);
    this.handleDeleteView = this.handleDeleteView.bind(this);
  }

  componentDidMount() {
    this.initiatePageItemList();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.items !== this.props.items) {
      this.initiatePageItemList();
    }
  }

  initiatePageItemList() {
    const { items } = this.props;
    const { itemsPerPage, activePage } = this.state;
    let startPosition = (activePage - 1) * itemsPerPage;
    let endPosition = activePage * itemsPerPage;
    let list = items.sort((a, b) => a.label.localeCompare(b.label));
    list = list.slice(startPosition, endPosition);
    this.setState({ pageItemsList: list });
  }

  handlePageChange(pageNumber) {
    const { scrollToTop } = this.props;
    scrollToTop();
    const { items } = this.props;
    const { itemsPerPage } = this.state;
    let activePage = pageNumber.selected + 1;
    let startPosition = (activePage - 1) * itemsPerPage;
    let endPosition = activePage * itemsPerPage;
    let list = items.slice(startPosition, endPosition);
    this.setState({ activePage: activePage, pageItemsList: list });
  }

  handleUpdateView(item) {
    this.setState({ selectedItem: item });
    this.toggleFormModal();
  }

  async handleDeleteView(item) {
    const { refreshListCallback, eventsList } = this.props;
    let canDelete = false;
    if (eventsList.length > 0) {
      eventsList.map((event) => {
        if (event.categoryId == item.id) {
          canDelete = false;
        } else {
          canDelete = true;
        }
      });
    } else {
      canDelete = true;
    }

    if (canDelete == true) {
      let response = await agendaEventsCategoryActions.deleteAgendaEventsCategory(
        item.id
      );
      if (response != 501) {
        // 501 et 201 sont inversés dans le back
        AlertUtil.alert(
          "Une erreur critique est survenue, Veuillez contacter le service technique !",
          "error"
        );
      } else {
        AlertUtil.alert("La catégorie a bien été supprimée", "success");
      }
      refreshListCallback();
    } else {
      AlertUtil.alert(
        "Impossible de supprimer cette catégorie, des événements lui sont associés. Supprimer d'abords les événements",
        "error"
      );
    }
  }

  handleRefreshList() {
    const { refreshListCallback } = this.props;
    this.toggleFormModal();
    refreshListCallback();
  }

  handleAddEventCategView() {
    this.setState({ selectedItem: null });
    this.toggleFormModal();
  }

  toggleFormModal() {
    this.setState({
      formModal: !this.state.formModal,
    });
  }

  render() {
    const { items, canManage, isMobile } = this.props;
    const {
      itemsPerPage,
      activePage,
      pageItemsList,
      selectedItem,
      formModal,
    } = this.state;
    return (
      <div>
        <div>
          <div className="title-flexbox">
            <h1 className="page-title">
              Gestion des {ADMIN_CATEG.label.toLowerCase()}
            </h1>
            <Button
              className="action-button"
              size="sm"
              color="primary"
              outline
              onClick={() => this.handleAddEventCategView()}
            >
              <i className="mdi mdi-plus mdi-16px"></i>
              <span>{!isMobile && "Ajouter une catégorie"}</span>
            </Button>
          </div>
          <hr className="title-hr"></hr>
          {items.length > 0 ? (
            <div>
              <Table className="large-category-list" striped hover>
                <thead>
                  <tr>
                    <th className="text-left" style={{ width: "25%" }}>
                      Titre
                    </th>
                    <th className="text-left">Description</th>
                    <th className="table-cell-expand" style={{ width: "10%" }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pageItemsList.map((item, index) => (
                    <tr key={index}>
                      <td className="font-weight-bold"> {item.label} </td>
                      <td> {item.description} </td>
                      <td className="text-center">
                        <ActionButton
                          displayAdminButton={canManage}
                          handleUpdateView={() => this.handleUpdateView(item)}
                          handleDeleteView={() => this.handleDeleteView(item)}
                          suppressionMessage={
                            "Êtes-vous sûr de bien vouloir supprimer cette catégorie ?"
                          }
                          suppressionTitle={"Supprimer une catégorie"}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div className="mobile-category-list">
                {pageItemsList.map((item, index) => (
                  <div className="card-category-item">
                    <div className="d-flex title-category-container">
                      <div className="left-title-category">
                        <div style={{ color: "#495057" }}>Titre</div>
                        <div className="mobile-category-title">
                          {item.label}
                        </div>
                      </div>
                      <ActionButtonMobile
                        displayAdminButton={canManage}
                        handleUpdateView={() => this.handleUpdateView(item)}
                        handleDeleteView={() => this.handleDeleteView(item)}
                        suppressionMessage={
                          "Êtes-vous sûr de bien vouloir supprimer cette catégorie ?"
                        }
                        suppressionTitle={"Supprimer une catégorie"}
                      />
                    </div>
                    <div className="description-container">
                      <span className="mr-4 mb-2" style={{ color: "#495057" }}>
                        Description
                      </span>
                      <div className="mobile-category-description">
                        {item.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <CustomPagination
                list={items}
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
        <AgiirDrawerModal
          isOpen={formModal}
          closeModal={this.toggleFormModal}
          title={`${
            selectedItem == null ? "Ajouter" : "Modifier"
          } une catégorie`}
        >
          <div>
            <EventCategoyForm
              current={selectedItem}
              handleRefreshList={this.handleRefreshList}
            />
          </div>
        </AgiirDrawerModal>
      </div>
    );
  }
}

export default CategoriesList;
