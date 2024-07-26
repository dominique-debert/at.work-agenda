import React from "react";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import {
  ADMIN_EVENT,
  ALL_ITEMS,
  ARCHIVE_EVENT,
  DEFAULT_SORT_TYPE,
  VALID_EVENT,
} from "../../constants/constants";
import FilterDateItem from "./FilterDateItem";
import FilterDateItemMobile from "./FilterDateItemMobile";
import FilterItem from "./FilterItem";
import FilterItemMobile from "./FilterItemMobile";

class Filtrebox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedFiltersList: [],
      currentLayout: "grid",
      popoverOpen: false,
      dropdownOpen: false,
      sortType: DEFAULT_SORT_TYPE[0],
      sortIndex: 0,
    };

    this.handleFilters = this.handleFilters.bind(this);
    this.validateFilters = this.validateFilters.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
    this.toggleSort = this.toggleSort.bind(this);
  }

  componentDidMount() {
    this.setState({
      selectedFiltersList: this.props.selectedFiltersList
        ? this.props.selectedFiltersList
        : [],
    });
  }

  componentDidUpdate(prevProps) {
    const { view } = this.props;
    if (view != prevProps.view) {
      if (view == ALL_ITEMS.code) {
        this.onChangeLayout("grid");
      } else if (
        view == ADMIN_EVENT.code ||
        view == ARCHIVE_EVENT.code ||
        view == VALID_EVENT.code
      ) {
        this.onChangeLayout("list");
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { selectedFiltersList } = nextProps;
    this.setState({
      selectedFiltersList: selectedFiltersList,
    });
  }

  onChangeLayout(layout) {
    this.setState({ currentLayout: layout });
    this.props.layoutChange(layout);
  }

  handleFilters(position, selectedFilters) {
    const { selectedFiltersList } = this.state;
    const list = selectedFiltersList.map((item, index) => {
      if (index == position) {
        let newOne = {
          name: item.name,
          list: selectedFilters,
        };
        return newOne;
      }
      return item;
    });
    this.setState({ selectedFiltersList: list });
  }

  validateFilters() {
    const { selectedFiltersList } = this.state;
    this.props.onSelectFilters(selectedFiltersList);
  }
  async resetFilters() {
    const { selectedFiltersList } = this.state;
    const defaultSelected = selectedFiltersList.map((item) => ({
      name: item.name,
      list: [],
    }));
    await this.setState({ selectedFiltersList: defaultSelected });
    this.validateFilters();
  }

  handleSort(selectedSort, index) {
    const { onChangeSort } = this.props;
    let i = 0;
    switch (selectedSort.label) {
      case DEFAULT_SORT_TYPE[1].label:
        if (index == 0) {
          i = 1;
          this.setState({ sortIndex: 1, sortType: selectedSort });
        } else {
          i = 0;
          this.setState({ sortIndex: 0, sortType: selectedSort });
        }
        break;
      case DEFAULT_SORT_TYPE[2].label:
        if (index == 2) {
          i = 3;
          this.setState({ sortIndex: 3, sortType: selectedSort });
        } else {
          i = 2;
          this.setState({ sortIndex: 2, sortType: selectedSort });
        }
        break;
      case DEFAULT_SORT_TYPE[3].label:
        if (index == 4) {
          i = 5;
          this.setState({ sortIndex: 5, sortType: selectedSort });
        } else {
          i = 4;
          this.setState({ sortIndex: 4, sortType: selectedSort });
        }
        break;
      default:
    }
    console.log("selected sort : ", selectedSort, " index : ", i);
    onChangeSort(i);
  }

  togglePopover() {
    this.setState({ popoverOpen: this.state.popoverOpen ? false : true });
  }

  toggleSort = () => this.setState({ dropdownOpen: !this.state.dropdownOpen });

  render() {
    const {
      sortType,
      sortIndex,
      currentLayout,
      selectedFiltersList,
    } = this.state;
    const { isMobile, filters, sortEnabled } = this.props;
    return (
      <div className="responsive-container agiir-search-filterbar">
        <div className="agiir-search-filterbar-first-container">
          <span className="agiir-search-filtrerpar-text">Filtrer par</span>
          <div className=" agiir-search-filterbox-container">
            {filters.map((filter, index) =>
              filter.name != "Date" ? (
                isMobile ? (
                  <FilterItemMobile
                    key={index}
                    isMobile={isMobile}
                    name={filter.name}
                    list={filter.list}
                    onSelectFilters={this.handleFilters}
                    position={index}
                    selectedFiltersList={
                      selectedFiltersList[index]
                        ? selectedFiltersList[index].list
                        : []
                    }
                  />
                ) : (
                  <FilterItem
                    key={index}
                    isMobile={isMobile}
                    name={filter.name}
                    list={filter.list}
                    onSelectFilters={this.handleFilters}
                    position={index}
                    className="agiir-search-filterbar-filters-button"
                    selectedFiltersList={
                      selectedFiltersList[index]
                        ? selectedFiltersList[index].list
                        : []
                    }
                  />
                )
              ) : isMobile ? (
                <FilterDateItemMobile
                  key={index}
                  isMobile={isMobile}
                  name={filter.name}
                  list={filter.list}
                  onSelectFilters={this.handleFilters}
                  position={index}
                  selectedFiltersList={
                    selectedFiltersList[index]
                      ? selectedFiltersList[index].list
                      : []
                  }
                />
              ) : (
                <FilterDateItem
                  key={index}
                  isMobile={isMobile}
                  name={filter.name}
                  list={filter.list}
                  onSelectFilters={this.handleFilters}
                  position={index}
                  className="agiir-search-filterbar-filters-button"
                  selectedFiltersList={
                    selectedFiltersList[index]
                      ? selectedFiltersList[index].list
                      : []
                  }
                />
              )
            )}
          </div>
          <Button
            color="transparent"
            className="ml-2"
            onClick={this.validateFilters}
            size="sm"
          >
            <i className="mdi mdi-check mdi-16px text-primary"></i>
          </Button>
          <Button color="transparent" onClick={this.resetFilters}>
            <i className="mdi mdi-close mdi-16px text-primary"></i>
          </Button>
        </div>
        {!isMobile && (
          <div className="agiir-filters-right-block">
            <span className="agiir-search-filtrerpar-text">Trier par</span>
            {sortEnabled == true && (
              <Dropdown
                isOpen={this.state.dropdownOpen}
                toggle={this.toggleSort}
              >
                <DropdownToggle className="agiir-sort-button" caret>
                  {sortType.label}
                </DropdownToggle>

                <DropdownMenu>
                  <DropdownItem
                    className="agiir-sort-item"
                    onClick={() =>
                      this.handleSort(DEFAULT_SORT_TYPE[1], sortIndex)
                    }
                  >
                    Dates de création
                  </DropdownItem>
                  <DropdownItem
                    className="agiir-sort-item"
                    onClick={() =>
                      this.handleSort(DEFAULT_SORT_TYPE[2], sortIndex)
                    }
                  >
                    Dates de début
                  </DropdownItem>
                  <DropdownItem
                    className="agiir-sort-item"
                    onClick={() =>
                      this.handleSort(DEFAULT_SORT_TYPE[3], sortIndex)
                    }
                  >
                    Dates de fin
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            )}
            <Button
              className="button-icon-layout mx-3 text-primary"
              color="transparent"
              onClick={() => this.handleSort(sortType, sortIndex)}
            >
              <i className="mdi mdi-swap-vertical mdi-18px"></i>
            </Button>

            <Button
              className="button-icon-layout"
              color="transparent"
              outline
              onClick={() =>
                this.onChangeLayout(currentLayout == "grid" ? "list" : "grid")
              }
            >
              {currentLayout == "grid" ? (
                <i className="mdi mdi-view-module mdi-18px text-primary"></i>
              ) : (
                <i className="mdi mdi-view-list mdi-18px text-primary"></i>
              )}
            </Button>
          </div>
        )}
      </div>
    );
  }
}

export default Filtrebox;
