import React from "react";
import { fr } from "date-fns/locale";
import DatePicker, { registerLocale } from "react-datepicker";
import { Button } from "reactstrap";
import { SeqensCustomInput } from "../EventForm";
registerLocale("fr", fr);

class FilterDateItemMobile extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.toggleMbView = this.toggleMbView.bind(this);
    this.state = {
      filterOpen: false,
      selectedFilters: [],
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

  toggleMbView() {
    this.setState({ filterOpen: this.state.filterOpen ? false : true });
  }

  render() {
    const { filterOpen } = this.state;
    const { selectedFiltersList, name } = this.props;
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

            <div className="agiir-filters-itemlist theme-seqens-mobile agiir-mobile-datefilter">
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
          </div>
        ) : null}
      </div>
    );
  }
}

export default FilterDateItemMobile;
