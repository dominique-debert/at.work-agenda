import React from "react";
// import { SemipolarLoading } from "react-loadingg";
import * as permissionActions from "../actions/PermissionsActions";
import PermissionStore from "../utils/AgiirUtil/PermissionStore";
import AgiirLoader from "./AgiirLoader";

const KEYS = ["GET", "POST", "PUT", "OWNER", "DELETE"];

export default class AgiirPermission extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      canPost: false,
      canEdit: false,
      canDelete: false,
      isOwner: false,
      isAdmin: false,
      isContrib: false,
      isContribPlus: false,
      canManage: false,
      canView: false,
      loading: true,
    };
  }

  async componentDidMount() {
    setTimeout(() => {
      this.storePermission();
      this.setState({ loading: false });
    }, 300);
  }

  async storePermission() {
    if (
      PermissionStore.getCheckIfIsAdmin() == false &&
      PermissionStore.getPermissions().length == 0
    ) {
      let pId = Liferay.Portlet.list.filter((portlet) =>
        portlet.includes("agiiragenda_INSTANCE")
      )[0];
      //console.log(pId);
      if (pId) {
        let admin = await permissionActions.isAdmin();
        let contributeur = await permissionActions.checkIfHasRole(
          "Contributeur"
        );

        let adminLR = await permissionActions.checkIfHasRole(
          "LR ADMINISTRATEUR"
        );
        let contributeurLR = await permissionActions.checkIfHasRole(
          "LR CONTRIBUTEUR"
        );
        let contributeurLRPlus = await permissionActions.checkIfHasRole(
          "LR CONTRIBUTEUR AVANCE"
        );

        //let manager = await permissionActions.checkIfHasRole("PROJECT_MANAGER");

        this.setState({
          isAdmin: admin || adminLR,
          isContrib: contributeur || contributeurLR,
          isContribPlus: contributeurLRPlus,
        });

        if (admin == true) {
          PermissionStore.setCheckIfIsAdmin(admin);
        } else {
          let permissions = await permissionActions.getPermissionsByPortletId(
            pId
          );
          //console.log("Perms ->", permissions);
          PermissionStore.setPermissions(permissions);
          KEYS.map((key) => {
            PermissionStore.hasPermission(key, "event").then((res) => {
              //console.log("Rendering App. User can create offers ?", res);
              switch (key) {
                case "POST":
                  this.setState({ canPost: res });
                  break;
                case "PUT":
                  this.setState({ canEdit: res });
                  break;
                case "OWNER":
                  this.setState({ isOwner: res });
                  break;
                case "GET":
                  this.setState({ canView: res });
                  break;
                case "DELETE":
                  this.setState({ canDelete: res });
                  break;
              }
            });
          });
        }
      } else {
        console.error(
          "Can't get permissions: Impossible de récupérer l'id du portlet"
        );
      }
    } else {
      let admin = PermissionStore.getCheckIfIsAdmin();
      let contributeur = await permissionActions.checkIfHasRole("Contributeur");

      let adminLR = await permissionActions.checkIfHasRole("LR ADMINISTRATEUR");
      let contributeurLR = await permissionActions.checkIfHasRole(
        "LR CONTRIBUTEUR"
      );
      let contributeurLRPlus = await permissionActions.checkIfHasRole(
        "LR CONTRIBUTEUR AVANCE"
      );

      this.setState({
        isAdmin: admin || adminLR,
        isContrib: contributeur || contributeurLR,
        isContribPlus: contributeurLRPlus,
      });

      if (admin == false) {
        KEYS.map((key) => {
          PermissionStore.hasPermission(key, "event").then((res) => {
            //console.log("Rendering App. User can create offers ?", res);
            switch (key) {
              case "POST":
                this.setState({ canPost: res });
                break;
              case "PUT":
                this.setState({ canEdit: res });
                break;
              case "OWNER":
                this.setState({ isOwner: res });
                break;
              case "GET":
                this.setState({ canView: res });
                break;
              case "DELETE":
                this.setState({ canDelete: res });
                break;
            }
          });
        });
      }
    }
  }

  render() {
    const { loading } = this.state;
    // TODO @Dominique : find an alternative solution to get rid of the semipolarloading shit
    // const { loading } = false;
    return (
      <div>
        {loading == true ? <AgiirLoader /> : this.props.render(this.state)}
      </div>
    );
  }
}
