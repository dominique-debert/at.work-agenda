import { AlertUtil } from "agiir-react-components";
import { fr } from "date-fns/locale";
import React from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import {
  Button,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  InputGroup,
  InputGroupText,
  Label,
} from "reactstrap";
import * as agendaEventUserParticipationActions from "../actions/AgendaEventUserParticipationAction";
import {
  COMPANY_ID,
  EVENT_PART_YES,
  GROUP_ID,
  USER_ID,
} from "../constants/constants";
registerLocale("fr", fr);

export default class BluemindEventForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      start_date: new Date(),
      end_date: new Date(),
      userScreenName: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.onSubmit.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
  }

  async componentDidMount() {
    const { item } = this.props;
    await this.getUserscreenName();
    if (item != null) {
      this.fillFormContent(item);
    }
  }

  async getUserscreenName() {
    var user = {};
    await Liferay.Service(
      "/user/get-user-by-id",
      {
        userId: USER_ID,
      },
      function(response) {
        //console.log(response);
        user = response;
      }
    );
    if (user != null && user.screenName != null) {
      this.setState({ userScreenName: user.screenName });
    }
  }

  fillFormContent(item) {
    item.title != null && this.setState({ title: item.title });
    item.start_date != null &&
      this.setState({ start_date: new Date(item.start_date_sortable) });
    item.end_date != null &&
      this.setState({ end_date: new Date(item.end_date_sortable) });
  }

  // Fonction qui permet de mettre à jour le state avec les valeurs saisies dans le form
  handleChange(e) {
    let change = {};
    if (e.target) {
      change[e.target.name] = e.target.value;
      this.setState(change);
      this.synchroError(e.target.name, e.target.value);
    }
  }

  async onSubmit() {
    const { title, start_date, end_date, userScreenName } = this.state;

    await this.synchroError("title", title);
    await this.synchroError("start_date", start_date);
    await this.synchroError("end_date", end_date);

    const { titleError, startDateError, endDateError } = this.state;

    let condition =
      titleError == false && startDateError == false && endDateError == false;

    if (condition == true) {
      const { item } = this.props;
      let obj = {
        groupId: GROUP_ID,
        companyId: COMPANY_ID,
        userId: USER_ID,
        eventId: item.id,
        participation: EVENT_PART_YES,
        date: new Date().getTime(),
      };

      let response = await agendaEventUserParticipationActions.setUserEventParticipation(
        obj
      );
      if (response == 201) {
        let obj = {
          title: title,
          start_date: start_date,
          end_date: end_date,
        };
        let addResponse = await agendaEventUserParticipationActions.addEventInBluemind(
          userScreenName,
          obj
        );
        if (addResponse != 201) {
          AlertUtil.alert(
            "Une erreur critique est survenue, Veuillez contacter le service technique !",
            "error"
          );
        } else {
          const { addUserEventCallback } = this.props;
          AlertUtil.alert(
            "Cet évènement a été ajouté à votre agenda Bluemind",
            "success"
          );
          addUserEventCallback();
        }
      } else {
        AlertUtil.alert(
          "Une erreur critique est survenue, Veuillez contacter le service technique !",
          "error"
        );
      }
    } else {
      AlertUtil.alert("Champ vide.. !", "error");
    }
  }

  synchroError(stateName, value) {
    if (stateName == "title") {
      if (value == "") {
        this.setState({ titleError: true });
      } else {
        this.setState({ titleError: false });
      }
    } else if (stateName == "start_date") {
      if (value == null) {
        this.setState({ startDateError: true });
      } else {
        this.setState({ startDateError: false });
      }
    } else if (stateName == "end_date") {
      if (value == null) {
        this.setState({ endDateError: true });
      } else {
        this.setState({ endDateError: false });
      }
    }
  }

  onDateChange(name, value) {
    let change = {};
    change[name] = value;
    this.setState(change);
    this.synchroError(name, value);
  }

  render() {
    const {
      title,
      start_date,
      end_date,
      titleError,
      startDateError,
      endDateError,
    } = this.state;
    const { addUserEventCallback } = this.props;
    return (
      <Form>
        <FormGroup>
          <Label>
            Titre<span className="required">*</span> :
          </Label>
          <Input
            type="text"
            name="title"
            id="title"
            value={title}
            onChange={this.handleChange}
            valid={titleError == false}
            invalid={titleError == true}
          />
          <FormFeedback>Le titre ne doit pas être vide</FormFeedback>
        </FormGroup>
        <FormGroup>
          <Label>
            Date et heure de début<span className="required">*</span> :
          </Label>
          <DatePicker
            id="start_date"
            name="start_date"
            selected={start_date}
            onChange={(value) => this.onDateChange("start_date", value)}
            minDate={new Date()}
            locale="fr"
            showTimeSelect
            dateFormat="dd/MM/yyyy HH:mm"
            timeIntervals={15}
            timeCaption="Heure :"
            customInput={<SeqensCustomInput />}
          />
          {startDateError == true && (
            <div className="error">
              La date de début est ne doit pas être vide et elle doit être
              postérieure à cet instant
            </div>
          )}
        </FormGroup>
        <FormGroup>
          <Label>
            Date et heure de fin<span className="required">*</span> :
          </Label>
          <DatePicker
            id="end_date"
            name="end_date"
            selected={end_date}
            onChange={(value) => this.onDateChange("end_date", value)}
            minDate={start_date}
            locale="fr"
            showTimeSelect
            dateFormat="dd/MM/yyyy HH:mm"
            timeIntervals={15}
            timeCaption="Heure :"
            customInput={<SeqensCustomInput />}
          />
          {endDateError == true && (
            <div className="error">
              La date de fin est ne doit pas être vide et elle doit être
              postérieure à cet instant et à la date de début
            </div>
          )}
        </FormGroup>

        <div className="action-button">
          {
            <Button
              color="cancel"
              onClick={() => addUserEventCallback()}
              className="mr-2"
              size="sm"
            >
              <i className="mdi mdi-close mdi-16px"></i>
              <span>Annuler</span>
            </Button>
          }
          {
            <Button
              color="primary"
              onClick={() => this.handleSubmit()}
              size="sm"
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

export const SeqensCustomInput = ({ value, onClick }) => (
  <InputGroup>
    <Input className="form-agiir-dropdown" onClick={onClick} value={value} />
    <InputGroupText>
      <i className="mdi mdi-calendar-text mdi-18px"></i>
    </InputGroupText>
  </InputGroup>
);
