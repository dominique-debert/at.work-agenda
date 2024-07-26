import React from "react";
import LFS from "../utils/FetchService/LiferayFetchService";

class DummyAvatar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      randomGradient: this.getRandomGradient(),
      liferayImgPath: Liferay.ThemeDisplay.getPathImage(),
      gotAvatar: false,
      avatarSrc: ""
    };
  }

  getRandomGradient() {
    var angle = Math.round(Math.random() * 360);
    var gradient =
      "linear-gradient(" + angle + "deg, " + this.getRandomLightColors() + ")";
    return gradient;
  }

  getRandomLightColors() {
    var colors = ["#e58094", "#8bede3", "#89b0d6", "#f7b885", "#ffe299"];
    var randCol = Math.floor(Math.random() * colors.length);
    var randCol2 = randCol;
    while (randCol2 == randCol) {
      randCol2 = Math.floor(Math.random() * colors.length);
    }
    return colors[randCol] + ", " + colors[randCol2];
  }

  async getAvatarSrc(email) {
    let returnVal = await LFS.apiCall("getUserAvatarByMail", "util", {
      email: email
    });
    const value = JSON.parse(returnVal);
    if (value && value.src) {
      fetch(this.state.liferayImgPath + value.src, { method: "HEAD" })
        .then(res => {
          if (res.ok) {
            this.setState({
              gotAvatar: true,
              avatarSrc: this.state.liferayImgPath + value.src
            });
          } else {
            this.setState({
              gotAvatar: false,
              avatarSrc: ""
            });
          }
        })
        .catch(err => console.error("Error : ", err));
    } else {
      this.setState({
        gotAvatar: false,
        avatarSrc: ""
      });
    }
  }

  async componentDidMount() {
    await this.getAvatarSrc(this.props.email);
  }

  async componentWillReceiveProps(nextProps) {
    await this.getAvatarSrc(nextProps.email);
  }

  render() {
    const { firstName, lastName } = this.props;

    return this.state.gotAvatar ? (
      <img
        className="rounded-circle dummy-avatar "
        style={{
          width: this.props.size ? this.props.size + "px" : "inherit",
          height: this.props.size ? this.props.size + "px" : "inherit",
          minWidth: this.props.size ? this.props.size + "px" : "inherit",
          minHeight: this.props.size ? this.props.size + "px" : "inherit",
          maxWidth: this.props.size ? this.props.size + "px" : "inherit",
          maxHeight: this.props.size ? this.props.size + "px" : "inherit",
          margin: "auto"
        }}
        src={this.state.avatarSrc}
      />
    ) : (
      <div
        className={`rounded-circle dummy-avatar ${this.props.classes}`}
        style={{
          fontWeight: "400",
          background: this.state.randomGradient,
          width: this.props.size ? this.props.size + "px" : "inherit",
          height: this.props.size ? this.props.size + "px" : "inherit",
          minWidth: this.props.size ? this.props.size + "px" : "inherit",
          minHeight: this.props.size ? this.props.size + "px" : "inherit",
          maxWidth: this.props.size ? this.props.size + "px" : "inherit",
          maxHeight: this.props.size ? this.props.size + "px" : "inherit",
          margin: "auto"
        }}
      >
        <span>
          {firstName != null &&
            lastName != null &&
            firstName.charAt(0) &&
            lastName.charAt(0) &&
            firstName.charAt(0).toUpperCase() +
              lastName.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }
}

export default DummyAvatar;
