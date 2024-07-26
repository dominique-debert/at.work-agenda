import React from "react";
import Modal from "react-responsive-modal";
import { Button } from "reactstrap";
import BluemindEventForm from "./BluemindEventForm";

class ParticipationComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formModal: false,
    };
    this.toggleFormModal = this.toggleFormModal.bind(this);
    this.handleAddEventToAgenda = this.addUserEventCallback.bind(this);
  }

  componentDidMount() {
    const { item } = this.props;
    if (item != null && item.user_registration != null) {
      this.setState({ active: parseInt(item.user_registration) });
    }
  }

  addUserEventCallback() {
    const { refreshUserEventsListCallback } = this.props;
    this.toggleFormModal();
    refreshUserEventsListCallback();
  }

  toggleFormModal() {
    this.setState({
      formModal: !this.state.formModal,
    });
  }

  render() {
    const { item } = this.props;
    const { formModal } = this.state;
    return (
      <div>
        <div className="event-particpation-flexbox">
          <div class="event_localisation event-particpation-buttons">
            <Button
              onClick={() => this.toggleFormModal()}
              color="primary"
              size="sm"
            >
              <i className="mdi mdi-calendar-check mdi-16px"></i>
              <span>Ajouter à mon agenda Bluemind</span>
            </Button>
          </div>
        </div>
        <Modal
          open={formModal}
          onClose={this.toggleFormModal}
          center
          closeOnEsc={false}
          closeOnOverlayClick={false}
          classNames={{ modal: "agiir-modal" }}
        >
          <div className="agenda-modal-header">
            <h2>{"Ajouter un événement dans l'agenda Bluemind"}</h2>
          </div>
          <div>
            <BluemindEventForm
              item={item}
              addUserEventCallback={this.handleAddEventToAgenda}
            />
          </div>
        </Modal>
      </div>
    );
  }
}

export default ParticipationComponent;
