import React from "react";
import { Breadcrumb, BreadcrumbItem } from "reactstrap";

export default class FileAriane extends React.Component {
  render() {
    const { fileArianeItems } = this.props;
    return (
      <div className="file-ariane">
        <Breadcrumb className="responsive-container custom-breadcumb">
          {fileArianeItems.map(item =>
            item.active === true ? (
              <BreadcrumbItem active={item.active}>
                <span href={item.link}> {item.name} </span>
              </BreadcrumbItem>
            ) : (
              <BreadcrumbItem active={item.active}>
                <a href={item.link}> {item.name} </a>
              </BreadcrumbItem>
            )
          )}
        </Breadcrumb>
      </div>
    );
  }
}
