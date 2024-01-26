// TODO: get from columns query
export const columns = [
  {
    field: "segmentCode",
    headerText: "Code",
    width: "20%",
    textAlign: "Right",
    id: 1,
  },
  {
    field: "sg",
    headerText: "SG",
    width: "20%",
    textAlign: "Right",
    id: 1,
  },
  {
    field: "lg",
    headerText: "LG",
    width: "20%",
    textAlign: "Right",
    id: 2,
  },
  {
    field: "segmentName",
    headerText: "Segment Name",
    width: "20%",
    textAlign: "Right",
    id: 3,
  },
  {
    field: "count",
    headerText: "Count",
    width: "20%",
    textAlign: "Right",
    isNumeric: true,
    isHidable: true,
    id: 4,
    hasAccessor: true,
    precision: 2,
  },
  {
    field: "percentComp",
    headerText: "Percent Comp",
    width: "20%",
    textAlign: "Right",
    isNumeric: true,
    isHidable: true,
    id: 5,
    hasAccessor: true,
    precision: 2,
  },
  {
    field: "index",
    headerText: "Index",
    width: "20%",
    textAlign: "Right",
    isNumeric: true,
    isHidable: true,
    id: 6,
  },
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