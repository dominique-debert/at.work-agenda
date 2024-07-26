import React from "react";
import {
  AgiirDrawerModal,
  AlertUtil,
  DRAWER_MODAL_SIZE,
} from "agiir-react-components";
import { Alert, Button } from "reactstrap";
import * as agendaEventsActions from "../actions/AgendaEventsAction";

import {
  ADMIN_EVENT,
  APPROVED,
  ARCHIVE_EVENT,
  VALID_EVENT,
} from "../constants/constants";
import EventForm from "./EventForm";
import CustomPagination from "./CustomPagination";
import EventItem_Card from "./EventItem_Card";
import EventItem_List from "./EventItem_List";

class UserEventList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: 1,
      itemsPerPage: 8,
      selectedItem: null,
      formModal: false,
      pageItemsList: [],
      acceptedrequest: [],
    };

    this.handlePageChange = this.handlePageChange.bind(this);
    this.toggleFormModal = this.toggleFormModal.bind(this);
    this.handleRefreshList = this.handleRefreshList.bind(this);
  }

  async componentDidMount() {
    await this.refreshPage();
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.items !== this.props.items) {
      //console.log("change ....");
      await this.refreshPage();
    }
  }

  async refreshPage() {
    const { items } = this.props;
    const { itemsPerPage, activePage } = this.state;
    let startPosition = (activePage - 1) * itemsPerPage;
    let endPosition = activePage * itemsPerPage;
    let list = items.slice(startPosition, endPosition);
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

  async handleUpdateStatusView(item, new_status) {
    const { refreshListCallback } = this.props;
    let response = await agendaEventsActions.updateAgendaEventStatus(
      item.id,
      new_status.code,
      new_status.motif
    );
    if (response != 201) {
      AlertUtil.alert(
        "Une erreur critique est survenue, Veuillez contacter le service technique !",
        "error"
      );
    } else {
      let message =
        new_status.code == APPROVED
          ? "L'événement a bien été publié"
          : "L'événement a bien été refusé";
      AlertUtil.alert(message, "success");
      refreshListCallback();
    }
  }

  async handleDeleteView(item) {
    let response = await agendaEventsActions.deleteAgendaEvents(item.id);
    if (response != 201) {
      AlertUtil.alert(
        "Une erreur critique est survenue, Veuillez contacter le service technique !",
        "error"
      );
    } else {
      AlertUtil.alert("L'événement a bien été supprimé", "success");
    }
    const { refreshListCallback } = this.props;
    refreshListCallback();
  }

  async duplicateItem(item) {
    const { refreshListCallback } = this.props;
    const response = await agendaEventsActions.duplicateEvent(item.id_sortable);
    if (response != 201) {
      AlertUtil.alert(
        "Une erreur critique est survenue, Veuillez contacter le service technique !",
        "error"
      );
    } else {
      AlertUtil.alert("L'événement a bien été dupliqué", "success");
      refreshListCallback();
    }
  }
  async unarchiveItem(item) {
    const { refreshListCallback } = this.props;
    const response = await agendaEventsActions.unarchiveEvent(item.id_sortable);
    if (response != 201) {
      AlertUtil.alert(
        "Une erreur critique est survenue, Veuillez contacter le service technique !",
        "error"
      );
    } else {
      AlertUtil.alert("L'événement a bien été désarchivé", "success");
      await refreshListCallback();
    }
  }

  handleRefreshList() {
    const { refreshListCallback } = this.props;
    this.toggleFormModal();
    refreshListCallback();
  }

  handleAddEventView() {
    this.setState({ selectedItem: null });
    this.toggleFormModal();
  }

  toggleFormModal() {
    this.setState({
      formModal: !this.state.formModal,
    });
  }

  render() {
    const {
      items,
      categories,
      isMobile,
      handleDetailsView,
      canPost,
      action,
      currentLayout,
      isContrib,
    } = this.props;
    const {
      itemsPerPage,
      activePage,
      pageItemsList,
      selectedItem,
      formModal,
    } = this.state;
    return (
      <div>
        {(canPost || isContrib) && (
          <div>
            <div className="title-flexbox">
              <h1 className="page-title">
                {action == "validate"
                  ? VALID_EVENT.label
                  : action == "archive"
                  ? ARCHIVE_EVENT.label
                  : "Gestion des " + ADMIN_EVENT.label.toLowerCase()}
              </h1>
              {action == "manage" && (
                <Button
                  color="primary"
                  className="action-button"
                  size="sm"
                  onClick={() => this.handleAddEventView()}
                >
                  <i className="mdi mdi-plus mdi-16px"></i>
                  {!isMobile && <span>Ajouter un événement</span>}
                </Button>
              )}
            </div>
            <hr className="title-hr" />
            {items.length > 0 ? (
              <div>
                <div
                  className={
                    isMobile || currentLayout == "grid" ? "list-items-box" : ""
                  }
                >
                  {pageItemsList.map((item) =>
                    !isMobile && currentLayout == "list" ? (
                      <EventItem_List
                        displayAdminButton={canPost}
                        isContrib={isContrib}
                        administration
                        item={item}
                        action={action}
                        isMobile={isMobile}
                        handleDetailsView={() => handleDetailsView(item)}
                        handleUpdateView={() => this.handleUpdateView(item)}
                        handleDeleteView={() => this.handleDeleteView(item)}
                        duplicateItem={() => this.duplicateItem(item)}
                        unarchiveItem={() => this.unarchiveItem(item)}
                        handleUpdateStatusView={(action) =>
                          this.handleUpdateStatusView(item, action)
                        }
                      />
                    ) : (
                      <EventItem_Card
                        displayAdminButton={canPost}
                        isContrib={isContrib}
                        administration
                        item={item}
                        action={action}
                        isMobile={isMobile}
                        categories={categories}
                        handleDetailsView={() => handleDetailsView(item)}
                        handleUpdateView={() => this.handleUpdateView(item)}
                        handleDeleteView={() => this.handleDeleteView(item)}
                        handleUpdateStatusView={(action) =>
                          this.handleUpdateStatusView(item, action)
                        }
                        duplicateItem={() => this.duplicateItem(item)}
                        unarchiveItem={() => this.unarchiveItem(item)}
                      />
                    )
                  )}
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
                  {action != "validate"
                    ? "Aucun événement n'est disponible pour le moment"
                    : "Aucune validation d'événement n'est disponible pour le moment"}
                </Alert>
              </div>
            )}
          </div>
        )}

        <AgiirDrawerModal
          isOpen={formModal}
          closeModal={this.toggleFormModal}
          title={`${
            selectedItem == null ? "Ajouter" : "Modifier"
          } un événement`}
          size={DRAWER_MODAL_SIZE.MD}
        >
          <div>
            <EventForm
              current={selectedItem}
              categories={categories}
              handleRefreshList={this.handleRefreshList}
              isMobile={isMobile}
            />
          </div>
        </AgiirDrawerModal>
      </div>
    );
  }
}

export default UserEventList;
