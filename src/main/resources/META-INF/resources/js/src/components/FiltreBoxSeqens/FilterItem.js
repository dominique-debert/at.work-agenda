import React from "react";
import {
  Input,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
} from "reactstrap";

class FilterItem extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
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

  toggle() {
    this.setState((prevState) => ({
      filterOpen: !prevState.filterOpen,
    }));
  }

  render() {
    const { filterOpen } = this.state;
    const { list, name, selectedFiltersList } = this.props;
    return (
      <Dropdown isOpen={filterOpen} size="sm" toggle={this.toggle}>
        <DropdownToggle
          color="primary"
          className={
            selectedFiltersList.length > 0
              ? "agiir-search-filterbar-filters-button-active"
              : "agiir-search-filterbar-filters-button"
          }
        >
          {selectedFiltersList.length > 0
            ? name + ` (${selectedFiltersList.length})`
            : name}
        </DropdownToggle>
        <DropdownMenu className="agiir-filters-menu theme-seqens">
          <div className="agiir-filters-itemlist">
            {list.map((item, index) => (
              <DropdownItem
                className="agiir-filters-item agiir-filters-container"
                key={index}
                toggle={false}
                onClick={
                  this.props.name == "Mois"
                    ? () => this.inList(index)
                    : () => this.inList(item)
                }
              >
                <Input
                  type="checkbox"
                  value={" " + item.label}
                  checked={selectedFiltersList.includes(item)}
                  onChange={() => this.inList(item)}
                />
                <span className="checkmark"></span>
                {" " + item.label}
              </DropdownItem>
            ))}
          </div>
        </DropdownMenu>
      </Dropdown>
    );
  }
}

export default FilterItem;
