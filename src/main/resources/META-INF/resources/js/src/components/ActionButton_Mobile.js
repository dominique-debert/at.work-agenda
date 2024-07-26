import React from "react";
import { AgiirDrawerModal } from "agiir-react-components";
import { Button } from "reactstrap";

export default class ActionButtonMobile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdownOpen: false,
      openModal: false,
      duplicateModal: false,
      unarchiveModal: false,
      isActive: false,
      projectManager: false,
    };
    this.toggleDuplicateModal = this.toggleDuplicateModal.bind(this);
    this.toggleUnarchiveModal = this.toggleUnarchiveModal.bind(this);
  }

  onOpenModal = () => {
    this.setState({ openModal: true });
  };

  onCloseModal = () => {
    this.setState({ openModal: false });
  };

  toggleDuplicateModal = () => {
    this.setState({ duplicateModal: !this.state.duplicateModal });
  };
  toggleUnarchiveModal = () => {
    this.setState({ unarchiveModal: !this.state.unarchiveModal });
  };

  openUpdateView() {
    const { handleUpdateView, targetValue } = this.props;
    handleUpdateView(targetValue);
  }

  deleteItem() {
    const { targetValue, handleDeleteView } = this.props;
    handleDeleteView(targetValue);
    this.onCloseModal();
  }

  async duplicateItem() {
    const { duplicateItem } = this.props;
    await duplicateItem();
    this.toggleDuplicateModal();
  }

  async unarchiveItem() {
    const { unarchiveItem } = this.props;
    await unarchiveItem();
    this.toggleUnarchiveModal();
  }

  openDeletePopupView() {
    this.onOpenModal();
  }

  render() {
    const { openModal, duplicateModal, unarchiveModal } = this.state;
    const {
      suppressionMessage,
      suppressionTitle,
      showDuplicate,
      action,
      canDelete,
    } = this.props;
    return (
      <div>
        <div className="mobile-action-button">
          {action != "archive" && showDuplicate && (
            <Button
              color="primary"
              outline
              size="sm"
              onClick={() => this.toggleDuplicateModal()}
            >
              <i className="mdi mdi-content-copy mdi-16px"></i>
            </Button>
          )}
          {action != "archive" && (
            <Button
              color="primary"
              outline
              size="sm"
              onClick={() => this.openUpdateView()}
            >
              <i className="mdi mdi-pencil-outline mdi-16px"></i>
            </Button>
          )}
          {action == "archive" && (
            <Button
              color="primary"
              outline
              size="sm"
              onClick={() => this.toggleUnarchiveModal()}
            >
              <i className="mdi mdi-archive-arrow-up-outline mdi-16px"></i>
            </Button>
          )}
          &ensp;
          {canDelete && (
            <Button
              color="primary"
              outline
              size="sm"
              onClick={() => this.openDeletePopupView()}
            >
              <i className="mdi mdi-delete-outline mdi-16px"></i>
            </Button>
          )}
        </div>

        <AgiirDrawerModal
          isOpen={openModal}
          title={suppressionTitle}
          closeModal={this.onCloseModal}
        >
          <div className="agenda-modal-header">
            <h2>{suppressionTitle}</h2>
          </div>
          <p className="modal-message">{suppressionMessage}</p>
          <div className="action-button">
            <Button
              onClick={() => this.onCloseModal()}
              color="cancel"
              size="sm"
              className="mr-2"
            >
              <i className="mdi mdi-close mdi-16px"></i>
              <span>Annuler</span>
            </Button>
            <Button
              onClick={() => this.deleteItem()}
              color="primary"
              outline
              size="sm"
            >
              <i className="mdi mdi-delete-outline mdi-16px"></i>
              <span>Supprimer</span>
            </Button>
          </div>
        </AgiirDrawerModal>
        <AgiirDrawerModal
          isOpen={duplicateModal}
          closeModal={this.toggleDuplicateModal}
          title="Dupliquer un événement"
        >
          <p className="modal-message">
            Etes-vous sûr de bien vouloir dupliquer cet événement ?
          </p>
          <div className="action-button">
            <Button
              onClick={() => this.toggleDuplicateModal()}
              color="cancel"
              size="sm"
              className="mr-2"
            >
              <i className="mdi mdi-close mdi-16px"></i>
              <span>Annuler</span>
            </Button>
            <Button
              onClick={() => this.duplicateItem()}
              outline
              color="primary"
              size="sm"
              className="mr-2"
            >
              <i className="mdi mdi-content-copy mdi-16px"></i>
              <span>Dupliquer</span>
            </Button>
          </div>
        </AgiirDrawerModal>
        <AgiirDrawerModal
          isOpen={unarchiveModal}
          closeModal={this.toggleUnarchiveModal}
          title="Désarchiver un événement"
        >
          <p className="modal-message">Désarchiver cet événement ?</p>
          <div className="action-button">
            <Button
              onClick={() => this.toggleUnarchiveModal()}
              color="cancel"
              size="sm"
              className="mr-2"
            >
              <i className="mdi mdi-close mdi-16px"></i>
              <span>Annuler</span>
            </Button>
            <Button
              onClick={() => this.unarchiveItem()}
              outline
              color="primary"
              size="sm"
            >
              <i className="mdi mdi-check mdi-16px"></i>
              <span>Confirmer</span>
            </Button>
          </div>
        </AgiirDrawerModal>
      </div>
    );
  }
}
