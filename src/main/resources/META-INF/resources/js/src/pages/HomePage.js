import React from "react";
// import { SemipolarLoading } from "react-loadingg";
import * as agendaEventsCategoryActions from "../actions/AgendaEventsCategoryAction";
import * as agendaEventUserParticipationActions from "../actions/AgendaEventUserParticipationAction";
import AgiirPermission from "../components/AgiirPermission";
import AllEventsList from "../components/AllEventsList";
import AllSubscribesList from "../components/AllSubscribes";
import CategorieList from "../components/CategorieList";
import FileAriane from "../components/FileAriane";
import FiltreBox from "../components/FiltreBoxSeqens/FiltreBox";
import MesInscrits from "../components/MesInscrits";
import NavAppBar from "../components/NavAppBar";
import UserEventsList from "../components/UserEventList";
import {
  ADMIN_CATEG,
  ADMIN_EVENT,
  ALL_ITEMS,
  APPROVED,
  BASE_URL,
  NAVBAR_ITEMS,
  PENDING,
  ADMIN_INSCRIT,
  URL,
  USER_ID,
  VALID_EVENT,
  FR_REGION_FILTERS,
  DEFAULT_SORT_TYPE,
  MES_INSCRIT,
  USER_SPACE,
  ARCHIVE_EVENT,
  DETAILS_EVENT,
} from "../constants/constants";
import AgiirUtil from "../utils/AgiirUtil/AgiirUtil";
import { isFuture, isPast, isToday } from "date-fns";
import EventDetails from "../components/EventDetails";
import AgiirLoader from "../components/AgiirLoader";

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageId: "EVT-LIST",
      LiferayImgPath:
        Liferay.ThemeDisplay.getPathThemeImages() + "/lexicon/icons.svg",
      headline: "Agenda",
      description: "Ici, vous trouvez la liste des événements",
      path: "Accueil/Agenda",
      pageTitle: ALL_ITEMS.label,
      loading: true,
      isMobile: false,
      events: [],
      userEventList: [],
      eventsCategs: [],
      selectedEvent: null,
      url: URL,
      view: ALL_ITEMS.code,
      currentLayout: "grid",
      filters: [
        {
          name: "Catégorie",
          list: [],
        },
        {
          name: "Date",
          list: [],
        },
        // {
        //     name: "Région",
        //     list: FR_REGION_FILTERS
        // }
      ],
      residences: [],
      selectedFilters: [
        {
          name: "Catégorie",
          list: [],
        },
        {
          name: "Date",
          list: [],
        },
      ],
      sortSelected: { label: "Aucun", index: -1 },
      fileArianeItems: [
        {
          name: " Accueil ",
          link: BASE_URL,
        },
        {
          name: " Agenda  ",
          link: URL,
        },
        {
          name: ALL_ITEMS.label,
          active: true,
        },
      ],
      sortType: {
        attribut: "start_date_sortable",
        order: "desc",
      },
    };

    window.addEventListener("resize", () => this.handleResize());
    this.handleFiltersSelected = this.handleFiltersSelected.bind(this);
    this.refreshEventList = this.refreshEventList.bind(this);
    this.refreshEventsCategList = this.refreshEventsCategList.bind(this);
    this.refreshUserEventsList = this.refreshUserEventsList.bind(this);
    this.viewChange = this.viewChange.bind(this);
    this.sortByStartDate = this.sortByStartDate.bind(this);
    this.scrollToTop = this.scrollToTop.bind(this);
    this.handleDetailsView = this.handleDetailsView.bind(this);
    this.handleChangeLayout = this.handleChangeLayout.bind(this);
  }

  async componentDidMount() {
    const { selectedFilters, sortType } = this.state;
    this.handleResize();
    await this.getEventsCategories();
    await this.getUserEvents();
    await this.handleFiltersSelected(selectedFilters, sortType);
    //this.sortByStartDate(this.state.events);
  }

  async getEventsCategories() {
    const { filters } = this.state;
    let categs = await agendaEventsCategoryActions.getAllAgendaEventsCategories();
    filters[0].list = categs;
    this.setState({ eventsCategs: categs, filters: filters });
  }

  async getUserEvents() {
    let userEvents = await agendaEventUserParticipationActions.getUserParticipations();
    this.setState({ userEventList: userEvents });
  }

  async refreshEventList() {
    const { selectedFilters, sortType } = this.state;
    await this.handleFiltersSelected(selectedFilters, sortType);
  }

  async refreshEventsCategList() {
    await this.getEventsCategories();
  }

  async refreshUserEventsList() {
    await this.getUserEvents();
  }

  handleResize() {
    if (window.innerWidth < 768) {
      this.setState({ isMobile: true });
    } else {
      this.setState({ isMobile: false });
    }
  }

  async handleFiltersSelected(selectedFilters, sorting) {
    //loading
    this.setState({ loading: true });
    if (selectedFilters != null) {
      await AgiirUtil.getInstance()
        .search(selectedFilters, sorting)
        .then((json) => {
          const list = json.map((app) => app._source);
          this.setState({
            events: list,
            selectedFilters: selectedFilters,
          });
        });
    }
    //this.sortByStartDate(this.state.events);
    setTimeout(() => this.setState({ loading: false }), 300);
  }

  handleDetailsView(item) {
    this.setState({ selectedEvent: item });
    this.viewChange(DETAILS_EVENT.code);
  }

  //tri
  handleSortSelected(sortSelected) {
    console.log(sortSelected);
  }

  handleChangeLayout(layout) {
    this.setState({ currentLayout: layout });
  }

  async viewChange(component) {
    // const { selectedFilters } = this.state;
    this.setState({ view: component });
    await this.handleSortByType(3); // Trier par start_date croissant d'event
    if (component == ALL_ITEMS.code) {
      this.setState({ pageTitle: ALL_ITEMS.label });
      this.state.fileArianeItems[2].name = ALL_ITEMS.label;
    } else if (component == ADMIN_EVENT.code) {
      this.setState({ pageTitle: ADMIN_EVENT.label });
      this.state.fileArianeItems[2].name = ADMIN_EVENT.label;
    } else if (component == VALID_EVENT.code) {
      this.setState({ pageTitle: VALID_EVENT.label });
      this.state.fileArianeItems[2].name = VALID_EVENT.label;
    } else if (component == ADMIN_INSCRIT.code) {
      this.setState({ pageTitle: ADMIN_INSCRIT.label });
      this.state.fileArianeItems[2].name = ADMIN_INSCRIT.label;
    } else if (component == MES_INSCRIT.code) {
      this.setState({ pageTitle: MES_INSCRIT.label });
      this.state.fileArianeItems[2].name = MES_INSCRIT.label;
    } else if (component == DETAILS_EVENT.code) {
      this.setState({ pageTitle: DETAILS_EVENT.label });
      this.state.fileArianeItems[2].name = DETAILS_EVENT.label;
    } else if (component == ARCHIVE_EVENT.code) {
      this.setState({ pageTitle: ARCHIVE_EVENT.label });
      this.state.fileArianeItems[2].name = ARCHIVE_EVENT.label;
    } else {
      this.setState({ pageTitle: ADMIN_CATEG.label });
      this.state.fileArianeItems[2].name = ADMIN_CATEG.label;
    }
  }

  async handleSortByType(st) {
    const { selectedFilters, sortType } = this.state;
    await this.handleFiltersSelected(selectedFilters, sortType);
    const { events } = this.state;
    let sorting;
    let eventsList = events;
    switch (st) {
      case 0:
        sorting = {
          attribut: "publish_date_sortable",
          order: "desc",
        };
        eventsList.sort(
          (a, b) => a.publish_date_sortable - b.publish_date_sortable
        );
        break;
      case 1:
        sorting = {
          attribut: "publish_date_sortable",
          order: "asc",
        };
        eventsList.sort(
          (a, b) => b.publish_date_sortable - a.publish_date_sortable
        );
        break;
      case 2:
        sorting = {
          attribut: "start_date_sortable",
          order: "desc",
        };
        eventsList.sort(
          (a, b) => a.start_date_sortable - b.start_date_sortable
        );
        break;
      case 3:
        sorting = {
          attribut: "start_date_sortable",
          order: "asc",
        };
        eventsList.sort(
          (a, b) => b.start_date_sortable - a.start_date_sortable
        );
        break;
      case 4:
        sorting = {
          attribut: "end_date_sortable",
          order: "desc",
        };
        eventsList.sort((a, b) => a.end_date_sortable - b.end_date_sortable);
        break;
      case 5:
        sorting = {
          attribut: "end_date_sortable",
          order: "asc",
        };
        eventsList.sort((a, b) => b.end_date_sortable - a.end_date_sortable);
        break;
      default:
    }
    this.setState({ events: eventsList });
    //await this.handleFiltersSelected(selectedFilters,sorting);
  }
  sortByStartDate(eventsSorted) {
    eventsSorted.sort((a, b) => a.start_date_sortable - b.start_date_sortable);
    return eventsSorted;
  }

  scrollToTop() {
    window.scrollTo(0, 0);
  }

  render() {
    const {
      events,
      loading,
      isMobile,
      filters,
      sortSelected,
      selectedFilters,
      eventsCategs,
      selectedEvent,
      view,
      fileArianeItems,
      currentLayout,
    } = this.state;
    return (
      <div>
        <FileAriane fileArianeItems={fileArianeItems} />
        {view != DETAILS_EVENT.code && (
          <AgiirPermission
            render={(permissions) => (
              <div className="responsive-container">
                <NavAppBar
                  activeTab={view}
                  viewChange={this.viewChange}
                  type={isMobile ? "mobile" : "desktop"}
                  displayAdminButton={permissions.isAdmin}
                  canPost={
                    permissions.isAdmin ||
                    permissions.isContrib ||
                    permissions.isContribPlus
                  }
                  canManage={permissions.isAdmin}
                  sections={NAVBAR_ITEMS}
                />
              </div>
            )}
          />
        )}
        {
          <div
            className={
              view == ADMIN_EVENT.code || view == ALL_ITEMS.code ? "" : "hidden"
            }
          >
            <FiltreBox
              filters={filters}
              view={view}
              onSelectFilters={this.handleFiltersSelected}
              onChangeSort={(sortTypeValue) =>
                this.handleSortByType(sortTypeValue)
              }
              selectedFiltersList={selectedFilters}
              sortType={sortSelected}
              isMobile={isMobile}
              layoutChange={this.handleChangeLayout}
              onSelectSort={this.handleSortSelected}
              sortEnabled={true}
              currentLayout={currentLayout}
            />
          </div>
        }

        <div className="responsive-container">
          {loading == false ? (
            view == ADMIN_CATEG.code ? (
              <AgiirPermission
                render={(permissions) =>
                  (permissions.isAdmin ||
                    permissions.isContrib ||
                    permissions.isContribPlus) && (
                    <CategorieList
                      items={eventsCategs}
                      isMobile={isMobile}
                      eventsList={events}
                      refreshListCallback={this.refreshEventsCategList}
                      canManage={
                        permissions.isAdmin ||
                        permissions.isContrib ||
                        permissions.isContribPlus
                      }
                      scrollToTop={this.scrollToTop}
                    />
                  )
                }
              />
            ) : view == ADMIN_EVENT.code ? (
              <AgiirPermission
                render={(permissions) => (
                  <UserEventsList
                    items={
                      permissions.isAdmin ||
                      permissions.isContrib ||
                      permissions.isContribPlus
                        ? events
                        : events.filter((item) => item.publisher_id == USER_ID)
                    }
                    isMobile={isMobile}
                    categories={eventsCategs}
                    refreshListCallback={this.refreshEventList}
                    canPost={permissions.isAdmin || permissions.isContribPlus}
                    isContrib={permissions.isContrib}
                    action="manage"
                    scrollToTop={this.scrollToTop}
                    handleDetailsView={this.handleDetailsView}
                    currentLayout={currentLayout}
                  />
                )}
              />
            ) : view == VALID_EVENT.code ? (
              <AgiirPermission
                render={(permissions) => (
                  <UserEventsList
                    items={events.filter(
                      (item) => item.event_status == PENDING
                    )}
                    isMobile={isMobile}
                    categories={eventsCategs}
                    refreshListCallback={this.refreshEventList}
                    canPost={
                      permissions.isAdmin ||
                      permissions.isContrib ||
                      permissions.isContribPlus
                    }
                    action="validate"
                    scrollToTop={this.scrollToTop}
                    handleDetailsView={this.handleDetailsView}
                    currentLayout={currentLayout}
                  />
                )}
              />
            ) : view == ARCHIVE_EVENT.code ? (
              <AgiirPermission
                render={(permissions) => (
                  <UserEventsList
                    items={events.filter(
                      (item) =>
                        item.event_status == APPROVED &&
                        !isToday(new Date(item.end_date_sortable)) &&
                        isPast(new Date(item.end_date_sortable))
                    )}
                    isMobile={isMobile}
                    categories={eventsCategs}
                    refreshListCallback={this.refreshEventList}
                    canPost={
                      permissions.isAdmin ||
                      permissions.isContrib ||
                      permissions.isContribPlus
                    }
                    isContrib={permissions.isContrib}
                    action="archive"
                    scrollToTop={this.scrollToTop}
                    handleDetailsView={this.handleDetailsView}
                    currentLayout={currentLayout}
                  />
                )}
              />
            ) : view == ADMIN_INSCRIT.code ? (
              <AgiirPermission
                render={(permissions) =>
                  (permissions.isAdmin ||
                    permissions.isContrib ||
                    permissions.isContribPlus) && (
                    <AllSubscribesList
                      canPost={
                        permissions.isAdmin ||
                        permissions.isContrib ||
                        permissions.isContribPlus
                      }
                      items={events.filter(
                        (item) => item.event_status == PENDING
                      )}
                      isAdmin={
                        permissions.isAdmin ||
                        permissions.isContrib ||
                        permissions.isContribPlus
                      }
                      onSwitchSpace={this.handleSwitchSpace}
                      userSpace={USER_SPACE.user}
                    />
                  )
                }
              />
            ) : view == MES_INSCRIT.code ? (
              <MesInscrits items={events} isMobile={isMobile} />
            ) : view == DETAILS_EVENT.code ? (
              <AgiirPermission
                render={(permissions) => (
                  <EventDetails
                    item={selectedEvent}
                    isAdmin={
                      permissions.isAdmin ||
                      permissions.isContrib ||
                      permissions.isContribPlus
                    }
                    refreshUserEventsListCallback={this.refreshUserEventsList}
                    isMobile={isMobile}
                  />
                )}
              />
            ) : (
              <AgiirPermission
                render={(permissions) => (
                  <AllEventsList
                    allEvents={events}
                    items={events.filter(
                      (article) =>
                        article.event_status == APPROVED &&
                        (isToday(new Date(article.publish_date_sortable)) ||
                          isPast(new Date(article.publish_date_sortable))) &&
                        (isToday(new Date(article.end_date_sortable)) ||
                          isFuture(new Date(article.end_date_sortable)))
                    )}
                    isMobile={isMobile}
                    isAdmin={
                      permissions.isAdmin ||
                      permissions.isContrib ||
                      permissions.isContribPlus
                    }
                    categories={eventsCategs}
                    refreshUserEventsListCallback={this.refreshUserEventsList}
                    scrollToTop={this.scrollToTop}
                    handleDetailsView={this.handleDetailsView}
                    currentLayout={currentLayout}
                  />
                )}
              />
            )
          ) : (
            <AgiirLoader />
          )}
        </div>
      </div>
    );
  }
}

export default HomePage;
