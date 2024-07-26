import React from "react";
import { Alert } from "reactstrap";
import { AlertUtil } from "agiir-react-components";
import LFS from "./utils/FetchService/LiferayFetchService";
import HomePage from "./pages/HomePage";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: "home",
      params: null
    };
  }

  componentDidMount() {}

  changePage(page, params) {
    if (params != null) {
      this.setState({
        currentPage: page,
        params: params
      });
    } else {
      this.setState({ currentPage: page });
    }
    window.scrollTo(0, 0); // return to top page
  }

  renderPage() {
    switch (this.state.currentPage) {
      case "home":
        return (
          <HomePage
            pageCallback={(page, params) => this.changePage(page, params)}
          />
        );
      default:
        return (
          <HomePage
            pageCallback={(page, params) => this.changePage(page, params)}
          />
        );
    }
  }

  render() {
    return (
      <div className="page">
        <AlertUtil></AlertUtil>
        {LFS.isUserConnected() ? (
          this.renderPage()
        ) : (
          <Alert color="danger">
            Veuillez vous connecter pour afficher ce composant
          </Alert>
        )}
      </div>
    );
  }
}

export default App;
