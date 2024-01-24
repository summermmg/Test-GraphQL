export const columns = [
  {
    field: "order",
    headerText: "Order",
    width: "20%",
    textAlign: "Right",
    id: 1,
  },
  {
    field: "geoCode",
    headerText: "Geography Name",
    width: "20%",
    textAlign: "Right",
    id: 2,
  },
  {
    field: "geoName",
    headerText: "Geography Code",
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
    id: 4,
  },
  {
    field: "index",
    headerText: "Index",
    width: "20%",
    textAlign: "Right",
    isNumeric: true,
    id: 5,
  },
  {
    field: "areaId",
    headerText: "Area Id",
    width: "20%",
    textAlign: "Right",
    id: 6,
  },
];

export const operatorList = [
  'greaterthan',
  'lessthan',
  'greaterthanorequal',
  'lessthanorequal',
  'equal',
]