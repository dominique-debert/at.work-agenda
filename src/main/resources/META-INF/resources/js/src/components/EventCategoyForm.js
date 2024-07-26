import { AlertUtil } from "agiir-react-components";
import React from "react";
import {
  Button,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import * as agendaEventsCategoryActions from "../actions/AgendaEventsCategoryAction";
export default class EventCategoyForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      label: "",
      publisherId: Liferay.ThemeDisplay.getUserId(),
      groupId: Liferay.ThemeDisplay.getScopeGroupId(),
      companyId: Liferay.ThemeDisplay.getCompanyId(),
      description: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.onSubmit.bind(this);
    this.handleChangeColor = this.handleChangeColor.bind(this);
  }

  componentDidMount() {
    const { current } = this.props;
    if (current != null) {
      this.fillFormContent(current);
    }
  }

  fillFormContent(current) {
    current.id != null && this.setState({ id: current.id });
    current.label != null && this.setState({ label: current.label });
    current.description != null &&
      this.setState({ description: current.description });
  }

  // Fonction qui permet de mettre à jour le state avec les valeurs saisies dans le form
  handleChange(e) {
    let change = {};
    change[e.target.name] = e.target.value;
    this.setState(change);
    this.synchroError(e.target.name, e.target.value);
  }
  handleChangeColor(color, event) {
    //console.log("color : ", color.hex);
    this.setState({ color: color.hex });
  }

  async onSubmit() {
    const {
      id,
      label,
      publisherId,
      groupId,
      companyId,
      description,
    } = this.state;
    const { handleRefreshList } = this.props;

    await this.synchroError("label", label);
    await this.synchroError("description", description);

    const { labelError, descriptionError } = this.state;

    if (labelError == false && descriptionError == false) {
      let eventCateg = {
        label: label,
        description: description,
        publisherId: publisherId,
        companyId: companyId,
        groupId: groupId,
      };

      if (id != null) {
        eventCateg.id = id;
        let response = await agendaEventsCategoryActions.updateAgendaEventsCategory(
          eventCateg
        );
        if (response != 201) {
          AlertUtil.alert(
            "Une erreur critique est survenue, Veuillez contacter le service technique !",
            "error"
          );
        } else {
          AlertUtil.alert("La catégorie a bien été modifiée", "success");
        }
      } else {
        let response = await agendaEventsCategoryActions.createAgendaEventsCategory(
          eventCateg
        );
        if (response != 201) {
          AlertUtil.alert(
            "Une erreur critique est survenue, Veuillez contacter le service technique !",
            "error"
          );
        } else {
          AlertUtil.alert("La catégorie a bien été ajoutée", "success");
        }
      }
      handleRefreshList();
    } else {
      console.error("Erreur : Champ vide");
    }
  }

  synchroError(stateName, value) {
    if (stateName == "label") {
      if (value == "") {
        this.setState({ labelError: true });
      } else {
        this.setState({ labelError: false });
      }
    }
    if (stateName == "description") {
      if (value == "") {
        this.setState({ descriptionError: true });
      } else {
        this.setState({ descriptionError: false });
      }
    }
  }

  render() {
    const { label, labelError, description, descriptionError } = this.state;
    const { handleRefreshList } = this.props;
    return (
      <Form>
        <FormGroup>
          <Label for="name">
            Libellé<span className="required">*</span> :
          </Label>
          <Input
            type="text"
            name="label"
            id="label"
            value={label}
            onChange={this.handleChange}
            valid={labelError == false}
            invalid={labelError == true}
          />
          <FormFeedback>Le label ne doit pas être vide</FormFeedback>
        </FormGroup>
        <FormGroup>
          <Label for="name">
            Description<span className="required">*</span> :
          </Label>
          <Input
            type="textarea"
            name="description"
            id="description"
            value={description}
            onChange={this.handleChange}
            valid={descriptionError == false}
            invalid={descriptionError == true}
          />
          <FormFeedback>La description ne doit pas être vide</FormFeedback>
        </FormGroup>

        <div className="action-button">
          {
            <Button
              color="cancel"
              size="sm"
              className="mr-2"
              onClick={() => handleRefreshList()}
            >
              <i className="mdi mdi-close mdi-16px"></i>
              <span>Annuler</span>
            </Button>
          }
          &ensp;
          {
            <Button
              color="primary"
              size="sm"
              onClick={() => this.handleSubmit()}
            >
              <i className="mdi mdi-check mdi-16px"></i>
              <span>Valider</span>
            </Button>
          }
        </div>
      </Form>
    );
  }
}
