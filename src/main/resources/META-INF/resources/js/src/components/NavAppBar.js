import classnames from "classnames";
import React, { Fragment } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import {
  ADMIN_CATEG,
  ADMIN_EVENT,
  ALL_ITEMS,
  VALID_EVENT,
  ADMIN_INSCRIT,
  MES_INSCRIT,
  ARCHIVE_EVENT,
  DETAILS_EVENT,
  NAVBAR_DETAILS_ITEMS,
  DETAIL_VIEW,
  INSCRIPTION_VIEW,
} from "../constants/constants";

export default class NavAppBar extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      categoryList: [],
      dropdownOpen: false,
      activeTab: this.props.activeTab ? this.props.activeTab : ALL_ITEMS.code,
      isMbDropdownOpen: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { activeTab } = nextProps;
    if (this.state.activeTab != activeTab) {
      this.setState({
        activeTab: activeTab,
      });
    }
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  }

  toggleView(tab, params) {
    const { viewChange } = this.props;
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
    if (params != null) {
      viewChange(tab, params);
    } else {
      viewChange(tab);
    }
  }

  stopRedirect(e) {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  }

  toggleMobileDropdown() {
    this.setState({
      isMbDropdownOpen: this.state.isMbDropdownOpen ? false : true,
    });
  }

  render() {
    const { activeTab, isMbDropdownOpen } = this.state;
    const {
      type,
      displayAdminButton,
      canPost,
      canManage,
      isDetailPage,
    } = this.props;

    return (
      <div className="nav-block">
        {type === "desktop" ? (
          <Nav tabs className="custom-nav">
            {!isDetailPage ? (
              <Fragment>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: activeTab === ALL_ITEMS.code,
                    })}
                    onClick={() => {
                      this.toggleView(ALL_ITEMS.code);
                    }}
                  >
                    {ALL_ITEMS.label}
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: activeTab === MES_INSCRIT.code,
                    })}
                    onClick={() => {
                      this.toggleView(MES_INSCRIT.code);
                    }}
                  >
                    {MES_INSCRIT.label}
                  </NavLink>
                </NavItem>
                {canPost && (
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: activeTab === ADMIN_EVENT.code,
                      })}
                      onClick={() => {
                        this.toggleView(ADMIN_EVENT.code);
                      }}
                    >
                      {ADMIN_EVENT.label}
                    </NavLink>
                  </NavItem>
                )}
                {displayAdminButton && canManage && (
                  <Fragment>
                    <NavItem>
                      <NavLink
                        className={classnames({
                          active: activeTab === ADMIN_CATEG.code,
                        })}
                        onClick={() => {
                          this.toggleView(ADMIN_CATEG.code);
                        }}
                      >
                        {ADMIN_CATEG.label}
                      </NavLink>
                    </NavItem>
                    {/* <NavItem>
                    <NavLink
                      className={classnames({
                        active: activeTab === ADMIN_INSCRIT.code
                      })}
                      onClick={() => {
                        this.toggleView(ADMIN_INSCRIT.code);
                      }}
                    >
                      {ADMIN_INSCRIT.label}
                    </NavLink>
                  </NavItem> */}
                    <NavItem>
                      <NavLink
                        className={classnames({
                          active: activeTab === VALID_EVENT.code,
                        })}
                        onClick={() => {
                          this.toggleView(VALID_EVENT.code);
                        }}
                      >
                        {VALID_EVENT.label}
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({
                          active: activeTab === ARCHIVE_EVENT.code,
                        })}
                        onClick={() => {
                          this.toggleView(ARCHIVE_EVENT.code);
                        }}
                      >
                        {ARCHIVE_EVENT.label}
                      </NavLink>
                    </NavItem>
                  </Fragment>
                )}
              </Fragment>
            ) : (
              <Fragment>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: activeTab === DETAIL_VIEW.code,
                    })}
                    onClick={() => {
                      this.toggleView(DETAIL_VIEW.code);
                    }}
                  >
                    {DETAIL_VIEW.label}
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: activeTab === INSCRIPTION_VIEW.code,
                    })}
                    onClick={() => {
                      this.toggleView(INSCRIPTION_VIEW.code);
                    }}
                  >
                    {INSCRIPTION_VIEW.label}
                  </NavLink>
                </NavItem>
              </Fragment>
            )}
          </Nav>
        ) : (
          <Dropdown
            className="agiir-app-mobile-nav-dropdown"
            isOpen={isMbDropdownOpen}
            toggle={() => this.toggleMobileDropdown()}
          >
            <DropdownToggle>
              <span>
                {activeTab === ALL_ITEMS.code
                  ? ALL_ITEMS.label
                  : activeTab === ADMIN_EVENT.code
                  ? ADMIN_EVENT.label
                  : activeTab === ADMIN_CATEG.code
                  ? ADMIN_CATEG.label
                  : activeTab === ADMIN_INSCRIT.code
                  ? ADMIN_INSCRIT.label
                  : activeTab === MES_INSCRIT.code
                  ? MES_INSCRIT.label
                  : activeTab === VALID_EVENT.code
                  ? VALID_EVENT.label
                  : activeTab === ARCHIVE_EVENT.code
                  ? ARCHIVE_EVENT.label
                  : ADMIN_CATEG.label}
              </span>
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem
                onClick={() => {
                  this.toggleView(ALL_ITEMS.code);
                }}
                className={classnames({
                  active: activeTab === ALL_ITEMS.code,
                })}
              >
                {ALL_ITEMS.label}
              </DropdownItem>
              {canPost && (
                <DropdownItem
                  className={classnames({
                    active: activeTab === ADMIN_EVENT.code,
                  })}
                  onClick={() => {
                    this.toggleView(ADMIN_EVENT.code);
                  }}
                >
                  {ADMIN_EVENT.label}
                </DropdownItem>
              )}
              {displayAdminButton && (
                <DropdownItem
                  className={classnames({
                    active: activeTab === ADMIN_CATEG.code,
                  })}
                  onClick={() => {
                    this.toggleView(ADMIN_CATEG.code);
                  }}
                >
                  {ADMIN_CATEG.label}
                </DropdownItem>
              )}
              {displayAdminButton && (
                <DropdownItem
                  className={classnames({
                    active: activeTab === VALID_EVENT.code,
                  })}
                  onClick={() => {
                    this.toggleView(VALID_EVENT.code);
                  }}
                >
                  {VALID_EVENT.label}
                </DropdownItem>
              )}
              {displayAdminButton && (
                <DropdownItem
                  className={classnames({
                    active: activeTab === ARCHIVE_EVENT.code,
                  })}
                  onClick={() => {
                    this.toggleView(ARCHIVE_EVENT.code);
                  }}
                >
                  {ARCHIVE_EVENT.label}
                </DropdownItem>
              )}
            </DropdownMenu>
          </Dropdown>
        )}
      </div>
    );
  }
}
