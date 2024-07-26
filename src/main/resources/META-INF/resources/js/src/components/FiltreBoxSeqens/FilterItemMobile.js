import React from "react";
import AgiirUtil from "../../utils/AgiirUtil/AgiirUtil";
import { Input, DropdownItem, Button } from "reactstrap";

class FilterItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterOpen: false,
    };
  }

  inList(value) {
    const { position } = this.props;
    const selectedFilters = this.props.selectedFiltersList;
    if (!this.props.selectedFiltersList.includes(value)) {
      selectedFilters.push(value);
    } else {
      selectedFilters.splice(this.props.selectedFiltersList.indexOf(value), 1);
    }
    this.props.onSelectFilters(position, selectedFilters);
  }

  toggleMbView() {
    this.setState({ filterOpen: this.state.filterOpen ? false : true });
  }

  render() {
    const { filterOpen } = this.state;
    const { list, name, selectedFiltersList } = this.props;
    return (
      <div className="btn-group-sm">
        <Button
          color="primary"
          onClick={() => this.toggleMbView()}
          className={
            selectedFiltersList.length > 0
              ? "agiir-search-filterbar-filters-button-active btn-group-sm"
              : "agiir-search-filterbar-filters-button"
          }
        >
          {selectedFiltersList.length > 0
            ? name + ` (${selectedFiltersList.length})`
            : name}
        </Button>
        {filterOpen ? (
          <div className="agiir-filter-mobile-overlay">
            <div className="agiir-filter-mobile-overlay-header">
              <div
                className="agiir-filter-mobile-overlay-header-quitBtn"
                onClick={() => this.toggleMbView()}
              >
                <i className="mdi mdi-close mdi-18px"></i>
              </div>
            </div>
            <div className="agiir-filters-itemlist theme-seqens-mobile">
              {list.map((item, index) => (
                <DropdownItem
                  className="agiir-filters-item agiir-filters-container"
                  key={index}
                  toggle={false}
                  onClick={() => this.inList(item)}
                >
                  <Input
                    type="checkbox"
                    value={item}
                    checked={selectedFiltersList.includes(item)}
                    onChange={() => this.inList(item)}
                  />
                  <span className="checkmark"></span>
                  {name == "Thèmes"
                    ? " " + item.nom
                    : name == "Catégorie"
                    ? item.label
                    : AgiirUtil.parseDateMonth(item)}
                </DropdownItem>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default FilterItem;
