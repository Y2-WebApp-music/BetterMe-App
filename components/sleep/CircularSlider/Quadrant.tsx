import React from "react";
import { polar2Canvas } from "react-native-redash";
import { Circle, Line, G } from "react-native-svg";

import { CENTER, PADDING, R, SIZE, STROKE, TAU } from "./Constants";
import { useTheme } from "../../../context/themeContext";
import { Text, View } from "react-native";

const LINES = 75;
const DELTA = TAU / LINES;

const Quadrant = () => {

  const { colors } = useTheme();

  return (
    <>
      <Circle
        strokeWidth={STROKE}
        stroke={colors.gray}
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={R}
        fill={colors.white}
      />
      <G mask="url(#mask)">
        <Circle fill={colors.night} cx={SIZE / 2} cy={SIZE / 2} r={R + PADDING} />
        <View
          style={{
            position:'absolute',
            width:SIZE/2,
            height:SIZE/2,
            // backgroundColor:'red',
            borderRadius:200,
            top:SIZE/4,
            left:SIZE/4,
          }}
        >
          <View style={{position:'absolute', top:0, left:'38%'}}>
            <Text style={{color:colors.subText, fontSize:12}}> 12 AM </Text>
          </View>
          <View style={{position:'absolute', top:'45%', right:0}}>
            <Text style={{color:colors.subText, fontSize:12}}> 6 AM </Text>
          </View>
          <View style={{position:'absolute', top:'45%', left:0}}>
            <Text style={{color:colors.subText, fontSize:12}}> 6 PM </Text>
          </View>
          <View style={{position:'absolute', bottom:0, left:'40%'}}>
            <Text style={{color:colors.subText, fontSize:12}}> 12 PM </Text>
          </View>
        </View>
        {new Array(LINES).fill(0).map((_, i) => {
          const theta = DELTA * i;
          const p1 = polar2Canvas({ theta, radius: R - PADDING / 2 }, CENTER);
          const p2 = polar2Canvas({ theta, radius: R + PADDING / 2 }, CENTER);
          return (
            <Line
              stroke={colors.white}
              strokeWidth={2}
              strokeLinecap="round"
              key={i}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
            />
          );
        })}
      </G>
      {new Array(24).fill(0).map((_, i) => {
        const theta = (i * TAU) / 24;
        const p1 = polar2Canvas({ theta, radius: R - 2 * PADDING }, CENTER);
        const p2 = polar2Canvas(
          { theta, radius: R - (3 * PADDING) / 2 },
          CENTER
        );
        return (
          <React.Fragment key={i}>
            <Line
              stroke={colors.darkGray}
              strokeWidth={2}
              strokeLinecap="round"
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
            />
            {new Array(4).fill(0).map((_e, j) => {
              const alpha = (i * TAU) / 24 + (j + 1) * (TAU / 24 / 4);
              const s = polar2Canvas(
                { theta: alpha, radius: R - 1.75 * PADDING },
                CENTER
              );
              const e = polar2Canvas(
                { theta: alpha, radius: R - (3 * PADDING) / 2 },
                CENTER
              );
              return (
                <Line
                  stroke={colors.gray}
                  strokeWidth={2}
                  strokeLinecap="round"
                  key={j}
                  x1={s.x}
                  y1={s.y}
                  x2={e.x}
                  y2={e.y}
                />
              );
            })}
          </React.Fragment>
        );
      })}
    </>
  );
};

export default Quadrant;