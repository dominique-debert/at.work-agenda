import React from "react";
import {
  Input,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
} from "reactstrap";
import { SeqensCustomInput } from "../EventForm";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import { fr } from "date-fns/locale";
registerLocale("fr", fr);

class FilterDateItem extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      filterOpen: false,
    };
  }

  onDateChange(value) {
    const { position, selectedFiltersList } = this.props;
    const date = new Date(value);
    const selectedDate = selectedFiltersList;
    selectedDate[0] = date.getTime();
    this.props.onSelectFilters(position, selectedDate);
  }

  toggle() {
    this.setState((prevState) => ({
      filterOpen: !prevState.filterOpen,
    }));
  }

  render() {
    const { filterOpen } = this.state;
    const { selectedFiltersList, name } = this.props;
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
        <DropdownMenu className="agiir-date-filters-menu theme-seqens">
          <div className="agiir-filters-itemlist" style={{ padding: 6 }}>
            <DatePicker
              id="selected_date"
              name="selected_date"
              selected={selectedFiltersList[0] ? selectedFiltersList[0] : ""}
              onChange={(value) => this.onDateChange(value)}
              locale="fr"
              dateFormat="dd/MM/yyyy"
              customInput={<SeqensCustomInput />}
            />
          </div>
        </DropdownMenu>
      </Dropdown>
    );
  }
}

export default FilterDateItem;
