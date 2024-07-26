import React from "react";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  FormFeedback,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import { APPROVED, REJECTED } from "../constants/constants";
import { AgiirDrawerModal, AlertUtil } from "agiir-react-components";

export default class ValidationActionButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdownOpen: false,
      approveModal: false,
      motif: "",
      validationAction: "",
      motifError: false,
    };

    this.toggle = this.toggle.bind(this);
    this.toggleApproveModal = this.toggleApproveModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  toggle(event) {
    const { dropdownOpen } = this.state;
    this.setState({
      dropdownOpen: !dropdownOpen,
    });
    event.preventDefault();
    event.stopPropagation();
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

  async updateStatus(action) {
    const { handleUpdateStatusView } = this.props;
    const { motif } = this.state;
    await this.synchroError("motif", motif);
    const { motifError } = this.state;
    const status = {
      code: action,
      motif,
    };
    if (action == APPROVED) {
      await handleUpdateStatusView(status);
      this.toggleApproveModal();
    } else {
      if (motifError == false) {
        await handleUpdateStatusView(status);
        this.toggleRefusModal();
      } else {
        AlertUtil.alert("Le champ requis ne doit pas être vide !", "warning");
      }
    }
    this.setState({ motif: "" });
  }

  render() {
    const {
      approveModal,
      dropdownOpen,
      validationAction,
      motif,
      motifError,
    } = this.state;
    const {
      displayAdminButton,
      rejectTitle,
      rejectMessage,
      approveTitle,
      approveMessage,
    } = this.props;
    return (
      <div>
        <Dropdown
          direction="end"
          isOpen={dropdownOpen}
          toggle={(e) => {
            this.toggle(e);
          }}
        >
          <DropdownToggle className="action-button-dropdown">
            <i className="mdi mdi-dots-vertical mdi-18px"></i>
          </DropdownToggle>
          <DropdownMenu>
            {displayAdminButton != null && displayAdminButton == true && (
              <DropdownItem onClick={() => this.toggleApproveModal(APPROVED)}>
                <i className="mdi mdi-check mdi-16px"></i>
                <span>Publier</span>
              </DropdownItem>
            )}
            {displayAdminButton != null && displayAdminButton == true && (
              <DropdownItem onClick={() => this.toggleApproveModal(REJECTED)}>
                <i className="mdi mdi-close mdi-16px"></i>
                <span>Refuser</span>
              </DropdownItem>
            )}
          </DropdownMenu>
        </Dropdown>

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
              className="mr-2"
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
