import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FR_REGION } from "../constants/constants";
import ItemOfCarousel from "./ItemOfCarousel";

export default class CarouselEvents extends React.Component {
  render() {
    const {
      items,
      handleDetailsView,
      categories,
      refreshUserEventsListCallback,
      inscriptionsEvents,
      handleRegisterEvent,
      isAdmin
    } = this.props;
    return (
      <Carousel autoPlay={false} showStatus={false} showThumbs={false}>
        {items &&
          items.length > 0 &&
          items.map(item => {
            let region = FR_REGION.filter(
              element => element.id == item.price_sortable
            );
            return (
              <ItemOfCarousel
                item={item}
                handleDetailsView={handleDetailsView}
                refreshUserEventsListCallback={refreshUserEventsListCallback}
                categories={categories}
                region={region}
                inscriptionsEvents={inscriptionsEvents}
                handleRegisterEvent={handleRegisterEvent}
                isAdmin={isAdmin}
              />
            );
          })}
      </Carousel>
    );
  }
}
