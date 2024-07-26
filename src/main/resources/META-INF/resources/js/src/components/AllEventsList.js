import React, { Fragment } from "react";
import {
  AgiirDrawerModal,
  AlertUtil,
  DRAWER_MODAL_SIZE,
} from "agiir-react-components";
import { isToday } from "date-fns";
import DatePicker from "react-datepicker";
import { Alert, Button, FormGroup, Label } from "reactstrap";
import * as inscriptionEventActions from "../actions/InscriptionEventAction";
import { ALL_ITEMS, STATUS_REQUEST, USER_ID } from "../constants/constants";
import Carousel from "./Carousel";
import CustomPagination from "./CustomPagination";
import { SeqensCustomInput } from "./EventForm";
import EventItem_Card from "./EventItem_Card";
import EventItem_List from "./EventItem_List";

class AllEventsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: 1,
      itemsPerPage: this.props.isMobile ? 8 : 9,
      selectedItem: null,
      modal: false,
      inscriptionModal: false,
      pageItemsList: [],
      inscriptionsEvents: [],
    };

    this.handlePageChange = this.handlePageChange.bind(this);
    this.toggleInscriptionModal = this.toggleInscriptionModal.bind(this);
    this.handleClickRegister = this.handleClickRegister.bind(this);
  }

  async componentDidMount() {
    await this.refreshPage();
    this.interceptSearchParams();
    await this.getAllEventsInscriptions();
  }
  async getAllEventsInscriptions() {
    const res = await inscriptionEventActions.getAllEventInscriptions();
    this.setState({ inscriptionsEvents: res });
  }
  async componentDidUpdate(prevProps) {
    const { isMobile } = this.props;
    if (prevProps.items !== this.props.items) {
      await this.refreshPage();
      // this.setState({ modal: false });
    }
    if (prevProps.isMobile !== isMobile) {
      const itemsPerPage = isMobile ? 8 : 9;
      await this.setState({ itemsPerPage });
      this.handlePageChange({ selected: 0 });
    }
  }

  async refreshPage() {
    const { items } = this.props;
    const { itemsPerPage, activePage } = this.state;
    const startPosition = (activePage - 1) * itemsPerPage;
    const endPosition = activePage * itemsPerPage;
    const list = items.slice(startPosition, endPosition);
    this.setState({ pageItemsList: list });
  }

  interceptSearchParams() {
    const { allEvents, handleDetailsView } = this.props;
    //Redirections pour les urls de raccourci
    const url = new URL(window.location.href);
    const eventId = url.searchParams.get("eventId");
    //Raccourcis
    if (eventId != null && Array.isArray(allEvents)) {
      const event = allEvents.find((item) => item.id == eventId);
      //Affichage d'une question via son id
      if (event != null) {
        handleDetailsView(event);
      }
      //To clear url
      history.pushState({}, "", url.pathname);
    }
  }

  handlePageChange(pageNumber) {
    const { scrollToTop } = this.props;
    scrollToTop();
    const { items } = this.props;
    const { itemsPerPage } = this.state;
    const activePage = pageNumber.selected + 1;
    const startPosition = (activePage - 1) * itemsPerPage;
    const endPosition = activePage * itemsPerPage;
    const list = items.slice(startPosition, endPosition);
    this.setState({ activePage: activePage, pageItemsList: list });
  }

  synchroError(stateName, value) {
    if (stateName == "inscription_date") {
      if (value == null) {
        this.setState({ inscriptionError: true });
      } else {
        this.setState({ inscriptionError: false });
      }
    }
  }

  toggleInscriptionModal() {
    this.setState({
      inscriptionModal: !this.state.inscriptionModal,
    });
  }

  onDateChange(name, value) {
    let change = {};
    change[name] = value;
    this.setState(change);
    this.synchroError(name, value);
  }

  async registerEvent() {
    const { refreshUserEventsListCallback } = this.props;
    const { inscriptionModal, inscription_date, selectedItem } = this.state;
    const jsonData = {
      eventId: selectedItem.id,
      userId: USER_ID,
      inscription_date: inscription_date,
      status: STATUS_REQUEST.pending,
    };
    const res = await inscriptionEventActions.addEventInscription(jsonData);

    if (res == 201) {
      await refreshUserEventsListCallback();
      await this.getAllEventsInscriptions();
      inscriptionModal == true && this.toggleInscriptionModal();
      this.setState({ selectedItem: null, inscription_date: null });
      AlertUtil.alert("Votre inscription a été prise en compte", "success");
    } else {
      AlertUtil.alert(
        "Une erreur critique est survenue, veuillez contacter le service technique !",
        "error"
      );
    }
  }

  async submitRegister() {
    const { inscription_date } = this.state;
    this.synchroError("inscription_date", inscription_date);
    const { inscriptionError } = this.state;
    if (inscriptionError == false) {
      this.registerEvent();
    } else {
      AlertUtil.alert(
        "Un des champs requis est vide, veuillez vérifier vos informations.",
        "warning"
      );
    }
  }

  async handleClickRegister(e, item) {
    e.stopPropagation();

    await this.setState({ selectedItem: item });
    if (
      item.end_date_sortable > item.start_date_sortable &&
      !isToday(new Date(item.end_date_sortable))
    ) {
      await this.toggleInscriptionModal();
    } else {
      await this.setState({ inscription_date: item.start_date_sortable });
      await this.registerEvent();
    }
  }

  render() {
    const {
      items,
      isMobile,
      refreshUserEventsListCallback,
      categories,
      isAdmin,
      currentLayout,
      handleDetailsView,
    } = this.props;
    const {
      itemsPerPage,
      activePage,
      pageItemsList,
      selectedItem,
      inscriptionsEvents,
      inscriptionModal,
      inscriptionError,
      inscription_date,
      modal,
    } = this.state;
    return (
      <div>
        <div className="page-title mt-2">{ALL_ITEMS.label}</div>
        <hr className="title-hr"></hr>
        {items && items.length > 0 ? (
          <div>
            {!isMobile && activePage == 1 && (
              <div className="mb-3">
                <Carousel
                  items={items
                    .filter((item) => item.inFont == "true")
                    .slice(0, 5)}
                  handleDetailsView={(item) => handleDetailsView(item)}
                  refreshUserEventsListCallback={refreshUserEventsListCallback}
                  categories={categories}
                  inscriptionsEvents={inscriptionsEvents}
                  isAdmin={isAdmin}
                  handleRegisterEvent={this.handleClickRegister}
                />
              </div>
            )}
            <div
              className={
                isMobile || currentLayout == "grid" ? "list-items-box" : ""
              }
            >
              {pageItemsList.length > 0 && (
                <Fragment>
                  {!isMobile && currentLayout == "list" ? (
                    <Fragment>
                      {pageItemsList.map((item) => (
                        <EventItem_List
                          item={item}
                          isAdmin={isAdmin}
                          categories={categories}
                          handleDetailsView={() => handleDetailsView(item)}
                          refreshUserEventsListCallback={
                            refreshUserEventsListCallback
                          }
                          inscriptionsEvents={inscriptionsEvents}
                          handleRegisterEvent={this.handleClickRegister}
                        />
                      ))}
                    </Fragment>
                  ) : (
                    <Fragment>
                      {pageItemsList.map((item) => (
                        <EventItem_Card
                          item={item}
                          isAdmin={isAdmin}
                          categories={categories}
                          handleDetailsView={() => handleDetailsView(item)}
                          refreshUserEventsListCallback={
                            refreshUserEventsListCallback
                          }
                          inscriptionsEvents={inscriptionsEvents}
                          handleRegisterEvent={this.handleClickRegister}
                        />
                      ))}
                    </Fragment>
                  )}
                </Fragment>
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
              Aucun événement n'est disponible pour le moment
            </Alert>
          </div>
        )}

        {selectedItem != null && (
          <AgiirDrawerModal
            isOpen={inscriptionModal}
            closeModal={this.toggleInscriptionModal}
            title="Ajout d'une date d'inscription"
            size={DRAWER_MODAL_SIZE.MD}
          >
            <FormGroup>
              <Label for="inscription_date">
                Date d'inscription<span className="required">*</span> :
              </Label>
              <DatePicker
                id="inscription_date"
                name="inscription_date"
                selected={inscription_date}
                onChange={(value) =>
                  this.onDateChange("inscription_date", value)
                }
                minDate={
                  new Date(selectedItem.start_date_sortable) > new Date()
                    ? new Date(selectedItem.start_date_sortable)
                    : new Date()
                }
                maxDate={new Date(selectedItem.end_date_sortable)}
                locale="fr"
                showTimeSelect
                dateFormat="dd/MM/yyyy HH:mm"
                timeIntervals={15}
                timeCaption="Heure :"
                customInput={<SeqensCustomInput />}
              />
              {inscriptionError == true && (
                <div className="error">
                  La date d'inscription ne doit pas être vide
                </div>
              )}
            </FormGroup>
            <div className="action-button">
              <Button
                onClick={() => this.toggleInscriptionModal()}
                color="cancel"
                size="sm"
                className="mr-2"
              >
                <i className="mdi mdi-close mdi-16px"></i>
                <span>Annuler</span>
              </Button>
              &ensp;
              <Button
                onClick={() => this.submitRegister()}
                color="primary"
                size="sm"
              >
                <i className="mdi mdi-check mdi-16px"></i>
                <span>Valider</span>
              </Button>
            </div>
          </AgiirDrawerModal>
        )}
      </div>
    );
  }
}

export default AllEventsList;
