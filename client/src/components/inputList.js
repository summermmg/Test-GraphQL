import { nanoid } from "nanoid";

export const columns = [
  "count",
  "percentComp",
  "baseCount",
  "basePercent",
  "percentPen",
  "index",
];

export const operatorList = [
  "greaterthan",
  "lessthan",
  "greaterthanorequal",
  "lessthanorequal",
  "equal",
];

export const reportInputsInfo = [
  {
    reportName: "test active report",
    reportAssetDetails: {
      tradearea: { type: "Area", value: "Ontario" },
      benchmark: { type: "Benchmark", value: "Canada" },
      variable: { type: "Variable", value: "test variable active" },
    },
  },
  // {
  //   reportName: "test compare report 1",
  //   reportAssetDetails: {
  //     tradearea: { type: "Area", value: "Montreal" },
  //     benchmark: { type: "Benchmark", value: "Canada" },
  //     variable: { type: "Variable", value: "test variable compare 2" },
  //   },
  // },
  // {
  //   reportName: "test compare report 2",
  //   reportAssetDetails: {
  //     tradearea: { type: "Area", value: "Alberta" },
  //     benchmark: { type: "Benchmark", value: "Canada" },
  //     variable: { type: "Variable", value: "test variable compare 2" },
  //   },
  // },
];

export const defaultFilterSettings = {
  condition: "and",
  filters: [
    {
      id: nanoid(),
      field: "index",
      operator: "greaterthanorequal",
      value: "",
    },
  ],
};

export const reportInput = {
  area: "test area",
  benchmark: "test benchmark",
  variables: ["variable1", "variable2", "variable3"],
};
