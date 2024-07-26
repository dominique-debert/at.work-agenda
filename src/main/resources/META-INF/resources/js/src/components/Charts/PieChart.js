import React from "react";
import { ResponsivePie } from "@nivo/pie";

const data = [
  {
    id: "0",
    label: "Oui",
    value: 43,
    color: "#039a8b"
  },
  {
    id: "1",
    label: "Peut-être",
    value: 45,
    color: " #fcbc0f"
  },
  {
    id: "2",
    label: "Non",
    value: 18,
    color: "#e5224b"
  }
];

class PieChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //data: INTIALE_STATE
    };
  }

  componentDidMount() {}

  render() {
    //const { data } = this.state;
    return (
      <ResponsivePie
        data={data}
        margin={{ top: 0, right: 0, bottom: 10, left: 0 }}
        innerRadius={0}
        colors={["#039a8b", "#fcbc0f", "#e5224b"]}
        padAngle={0}
        cornerRadius={0}
        borderWidth={0}
        enableRadialLabels={false}
        radialLabelsSkipAngle={10}
        radialLabelsTextColor="#030303"
        radialLabelsLinkColor={{ from: "color" }}
        sliceLabelsSkipAngle={10}
        sliceLabelsTextColor="#030303"
        legends={[
          {
            anchor: "right",
            direction: "column",
            justify: false,
            translateX: 50,
            translateY: 10,
            itemsSpacing: 5,
            itemWidth: 100,
            itemHeight: 18,
            itemTextColor: "#999",
            itemDirection: "left-to-right",
            itemOpacity: 1,
            symbolSize: 18,
            symbolShape: "square",
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: "#000"
                }
              }
            ]
          }
        ]}
      />
    );
  }
}

export default PieChart;
