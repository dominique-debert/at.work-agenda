import React from "react";
import {
  AgiirDrawerModal,
  AlertUtil,
  DRAWER_MODAL_SIZE,
} from "agiir-react-components";
import { Button, FormFeedback, FormGroup, Input, Label } from "reactstrap";
import { APPROVED, REJECTED, STATUS_REQUEST } from "../constants/constants";

export default class ValidationActionButtonMobile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdownOpen: false,
      approveModal: false,
      motif: "",
      validationAction: "",
      motifError: false,
    };

    this.toggleApproveModal = this.toggleApproveModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    let change = {};
    change[e.target.name] = e.target.value;
    this.setState(change);
    this.synchroError(e.target.name, e.target.value);
  }

  synchroError(name, value) {
    if (name == "motif") {
      if (value == "") {
        this.setState({ motifError: true });
      } else {
        this.setState({ motifError: false });
      }
    }
  }

  toggleApproveModal = (validationAction) => {
    this.setState({ validationAction, approveModal: !this.state.approveModal });
  };

  async updateStatus(status) {
    const {
      handleUpdateStatusView,
      handleChangeInscriptionStatus,
      action,
    } = this.props;
    const { motif } = this.state;
    await this.synchroError("motif", motif);
    const { motifError } = this.state;
    const statusObject = {
      code: status,
      title:
        status == APPROVED ? STATUS_REQUEST.accepted : STATUS_REQUEST.declined,
      motif,
    };
    if (status == APPROVED) {
      action == "inscription"
        ? await handleChangeInscriptionStatus(statusObject)
        : await handleUpdateStatusView(statusObject);
      this.toggleApproveModal();
    } else {
      if (motifError == false) {
        action == "inscription"
          ? await handleChangeInscriptionStatus(statusObject)
          : await handleUpdateStatusView(statusObject);
        this.toggleRefusModal();
      } else {
        AlertUtil.alert("Le champ requis ne doit pas être vide !", "warning");
      }
    }
    this.setState({ motif: "" });
  }

  render() {
    const { approveModal, validationAction, motif, motifError } = this.state;
    const {
      rejectTitle,
      rejectMessage,
      approveTitle,
      approveMessage,
    } = this.props;
    return (
      <div>
        <div className="mobile-action-button">
          <Button
            color="primary"
            outline
            size="sm"
            onClick={() => this.toggleApproveModal(APPROVED)}
          >
            <i className="mdi mdi-check mdi-16px"></i>
          </Button>
          <Button
            color="primary"
            outline
            size="sm"
            onClick={() => this.toggleApproveModal(REJECTED)}
          >
            <i className="mdi mdi-close mdi-16px"></i>
          </Button>
        </div>

        <AgiirDrawerModal
          isOpen={approveModal}
          closeModal={this.toggleApproveModal}
          title={validationAction == APPROVED ? approveTitle : rejectTitle}
        >
          <p className="modal-message">
            {validationAction == APPROVED ? approveMessage : rejectMessage}
          </p>
          {validationAction == REJECTED && (
            <FormGroup>
              <Label for="name">
                Motif du refus<span className="required">*</span> :
              </Label>
              <Input
                type="textarea"
                name="motif"
                id="motif"
                value={motif}
                onChange={this.handleChange}
                valid={!motifError}
                invalid={motifError}
              />
              <FormFeedback>
                Le motif du refus ne doit pas être vide.
              </FormFeedback>
            </FormGroup>
          )}
          <div className="action-button">
            <Button
              onClick={() => this.toggleApproveModal()}
              color="cancel"
              size="sm"
            >
              <i className="mdi mdi-close mdi-16px"></i>
              <span>Annuler</span>
            </Button>
            <Button
              onClick={() => this.updateStatus(validationAction)}
              color="primary"
              outline
              size="sm"
            >
              <i className="mdi mdi-check mdi-16px"></i>
              <span>
                {validationAction == APPROVED ? "Publier" : "Valider"}
              </span>
            </Button>
          </div>
        </AgiirDrawerModal>
      </div>
    );
  }
}
