import React from "react";
import { ResponsiveBar } from "@nivo/bar";

class BarChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //data: INTIALE_STATE
    };
  }

  componentDidMount() {}

  render() {
    const {
      data,
      keys,
      indexBy,
      axisLeftLegend,
      axisBottomLegend
    } = this.props;
    return (
      <ResponsiveBar
        data={data}
        keys={keys}
        indexBy={indexBy}
        margin={{ top: 20, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={{ scheme: "accent" }}
        borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
        axisTop={null}
        axisRight={null}
        axisBottom={
          axisBottomLegend
            ? {
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: axisBottomLegend,
                legendPosition: "middle",
                legendOffset: 32
              }
            : null
        }
        axisLeft={
          axisLeftLegend
            ? {
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: axisLeftLegend,
                legendPosition: "middle",
                legendOffset: -40
              }
            : null
        }
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
        legends={[
          {
            dataFrom: "keys",
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 120,
            translateY: 0,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: "left-to-right",
            itemOpacity: 0.85,
            symbolSize: 20,
            effects: [
              {
                on: "hover",
                style: {
                  itemOpacity: 1
                }
              }
            ]
          }
        ]}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
      />
    );
  }
}

export default BarChart;
