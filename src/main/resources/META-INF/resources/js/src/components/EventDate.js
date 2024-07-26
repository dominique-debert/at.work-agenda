import React from "react";
import { getDateByTimestamp } from "agiir-react-components";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "reactstrap";
import AgiirUtil from "../utils/AgiirUtil/AgiirUtil";

const EventDateComponent = ({
  onClick,
  start_date_timestap,
  end_date_timestamp,
  customClassName,
  color,
  item,
  handleRegisterEvent,
  showInscriptionButton,
}) => {
  return (
    <div className={`agenda-event-date-container ${customClassName}`}>
      <div className="event-date-start" onClick={onClick}>
        {getDateByTimestamp(start_date_timestap, "day") ===
          getDateByTimestamp(end_date_timestamp, "day") &&
        getDateByTimestamp(start_date_timestap, "month") ===
          getDateByTimestamp(end_date_timestamp, "month") ? (
          <span className="agenda-event-day">
            {format(new Date(start_date_timestap), "dd MMMM yyyy", {
              locale: fr,
            })}
          </span>
        ) : (
          <span className="agenda-event-day">
            {`${AgiirUtil.formatDateIntl(
              start_date_timestap
            )} - ${AgiirUtil.formatDateIntl(end_date_timestamp)}`}
          </span>
        )}
      </div>
      {showInscriptionButton && (
        <div>
          <Button
            color="primary"
            className="card_inscription_button text-nowrap"
            outline
            onClick={(e) => handleRegisterEvent(e, item)}
          >
            <i className="mdi mdi-account-plus-outline mdi-16px"></i>
            <span>{"Je m'inscris"}</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default EventDateComponent;
