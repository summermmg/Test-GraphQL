const checkIsFilterMatch = (data, filter) => {
  let { field, operator, value } = filter;
  value = Number(value);
  let isMatch = true;
  const dataValue = data[field];

  switch (operator) {
    case "greaterthan":
      isMatch = dataValue > value;
      break;

    case "greaterthanorequal":
      isMatch = dataValue >= value;
      break;

    case "lessthan":
      isMatch = dataValue < value;
      break;

    case "lessthanorequal":
      isMatch = dataValue <= value;
      break;

    case "equal":
      isMatch = dataValue === value;
      break;
    default:
      break;
  }

  return isMatch;
};

const filterList = (list, where) => {
  let result = [...list];
  const filters = [];
  let c; // condition
  const getPredicates = (w) => {
    if (!w || w.length <= 0) {
      return;
    }

    w.forEach((element) => {
      const { predicates, isComplex, condition } = element;

      if (predicates && isComplex) {
        if (condition && !c) {
          c = condition;
        }
        getPredicates(predicates);
      } else {
        filters.push(element);
      }
    });
  };

  getPredicates(where);

  if (c === "and") {
    result = result.filter((item) =>
      filters.every((f) => checkIsFilterMatch(item, f))
    );
  } else {
    result = result.filter((item) =>
      filters.some((f) => checkIsFilterMatch(item, f))
    );
  }

  return result;
};

const getHeaderTemplate = (reportInput) => {
  const { reportAssetDetails } = reportInput;
  const tradeAreaTxt = reportAssetDetails?.tradearea?.value;
  const benchmarkTxt = reportAssetDetails?.benchmark?.value;
  const variableTxt = reportAssetDetails?.variable?.value;
  let content = `<div class='stacked-header'>
  <p class="title">${reportInput.reportName || "-"}</p>`;

  if (tradeAreaTxt)
    content += `<p class="text"><span class="text-header">Trade Area: </span>${
      tradeAreaTxt || "-"
    }</p>`;

  if (benchmarkTxt)
    content += `<p class="text"><span class="text-header">Benchmark: </span>${
      benchmarkTxt || "-"
    }</p>`;
  if (variableTxt)
    content += `<p class="text"><span class="text-header">Variable: </span>${
      variableTxt || ""
    }</p>`;

  return content;
};

const isColHidden = (col, hideColInfo) =>
  col.isHidable && hideColInfo.includes(col.field);

const getSubColumns = (index, columns, hideColInfo) => {
  let result = [];

  if (index === 0) {
    result = columns.filter((col) => !isColHidden(col, hideColInfo));
  } else if (index > 0) {
    columns.forEach((col) => {
      if (col.isNumeric && !isColHidden(col, hideColInfo)) {
        result.push({
          ...col,
          field: `${col.field}${index}`,
        });
      }
    });
  }

  return result;
};

const getStackedColumns = (columns, hideColInfo, reportInputsInfo) => {
  let result = [];

  reportInputsInfo.forEach((reportInput, index) => {
    const obj = {
      textAlign: "center",
      field: `stackedHeader-${index}`,
      headerTemplate: getHeaderTemplate(reportInput),
      columns: getSubColumns(index, columns, hideColInfo),
    };

    result.push(obj);
  });

  return result;
};

const DEFAULT_SG_ORDER = [
  "U1",
  "S1",
  "S2",
  "F1",
  "S3",
  "R1",
  "S4",
  "S5",
  "F2",
  "U2",
  "F3",
  "F4",
  "R2",
  "U3",
  "T1",
  "S6",
  "U4",
  "S7",
  "R3",
  "U5",
  "U6",
];

const DEFAULT_SG_ORDER_MAP = DEFAULT_SG_ORDER.reduce(
  (obj, item, index) => ({
    ...obj,
    [item]: index,
  }),
  {}
);

const DEFAULT_LG_ORDER = ["Y1", "Y2", "Y3", "F1", "F2", "F3", "M1", "M2"];

const DEFAULT_LG_ORDER_MAP = DEFAULT_LG_ORDER.reduce(
  (obj, item, index) => ({
    ...obj,
    [item]: index,
  }),
  {}
);

const sortList = (datamanager, list) => {
  let result = [...list]  
  const condition = datamanager.sorted[0];
  const isString = typeof result[0][condition.name] === "string";

  if (condition.direction === "ascending") {
    if (isString) {
      result.sort((a, b) =>
        a[condition.name].localeCompare(b[condition.name])
      );
    } else {
      result.sort((a, b) => a[condition.name] - b[condition.name]);
    }
  } else {
    if (isString) {
      result.sort((a, b) =>
        b[condition.name].localeCompare(a[condition.name])
      );
    } else {
      result.sort((a, b) => b[condition.name] - a[condition.name]);
    }
  }

  return result
}

// Aggregate utility

const calcIndex = (items, numeratorField, denominatorField) => {
  let result = { denominatorTotal: 0, numeratorTotal: 0 };
  let total = 0;

  if (items) {
    result = items.reduce(
      (accumulator, row) => {
        const numerator =
          typeof row[numeratorField] === "string"
            ? parseFloat(row[numeratorField].replace(/,/g, ""))
            : parseFloat(row[numeratorField] || 0);
        const denominator =
          typeof row[denominatorField] === "string"
            ? parseFloat(row[denominatorField].replace(/,/g, ""))
            : parseFloat(row[denominatorField] || 0);

        let { denominatorTotal } = accumulator;
        let { numeratorTotal } = accumulator;

        denominatorTotal += denominator;
        numeratorTotal += numerator;

        return { denominatorTotal, numeratorTotal };
      },
      { denominatorTotal: 0, numeratorTotal: 0 }
    );
  }

  if (
    result.denominatorTotal === 0 ||
    (result.denominatorTotal === 0 && result.numeratorTotal === 0)
  ) {
    total += 100;
  } else {
    total += (100 * result.numeratorTotal) / result.denominatorTotal;
  }

  return total;
};

const calcSum = (items, field) => {
  let total = 0;

  if (items) {
    total = items.reduce((acc, item) => {
      const countField =
        typeof item[field] === "string"
          ? parseFloat(item[field].replace(/,/g, ""))
          : item[field];

      return acc + countField;
    }, 0);
  }

  return total;
};

const calculateTotal = (recordList, field) => {
  let numeratorField = "";
  let denominatorField = "";
  let total = 0;
  let items = [...recordList];

  switch (field) {
    case "index":
      numeratorField = "percentComp";
      denominatorField = "basePercent";
      total = calcIndex(items, numeratorField.trim(), denominatorField.trim());
      break;
    case "percentPen":
      numeratorField = "count";
      denominatorField = "baseCount";
      total = calcIndex(items, numeratorField.trim(), denominatorField.trim());
      break;
    case "count":
      total = calcSum(items, "count".trim());
      break;
    case "baseCount":
      total = calcSum(items, "baseCount".trim());
      break;
    default:
      break;
  }

  return total;
};

const getAggregateCell = (col, recordList) => {
  if (col && col.field) {
    const { field, isNumeric } = col;

    if (field === "segmentName") {
      return "Subtotals";
    }

    if (isNumeric) {
      switch (field) {
        case "percentComp":
        case "basePercent":
          return calcSum(recordList, field);

        case "count":
        case "baseCount":
        case "percentPen":
        case "index":
          return calculateTotal(recordList, field);

        default:
          return "";
      }
    }
  }
};

// generate aggregate data rows based on columns, group records list,
const appendAggregateRow = (recordList, columns, field, datamanager) => {
  let result;

  if (datamanager.sorted) {
    result = sortList(datamanager, recordList)
  } else {
    result = [...recordList];
  }

  const aggregateRow = { isAggregate: true };
  aggregateRow[field] = result[0][field]; // for FE grouping

  columns.forEach((col) => {
    const aggregateCell = getAggregateCell(col, recordList);

    if (aggregateCell) {
      aggregateRow[col.field] = aggregateCell;
    }
  });

  result.push(aggregateRow);

  return result;
};

// {U1: [data1, data2], S1: [data3, data4]}
const groupListByField = (dataList, field) => {
  const result = dataList.reduce((obj, item) => {
    if (obj[item[field]] && obj[item[field]].length > 0) {
      obj[item[field]] = [...obj[item[field]], item];
    } else {
      obj[item[field]] = [item];
    }

    return obj;
  }, {});

  return result;
};

// data list and group field. eg: sg or lg
const formatAggregate = (dataList, field, columns, datamanager) => {
  const groupedList = groupListByField(dataList, field);
  let result = [];

  Object.values(groupedList).forEach((recordList) => {
    result.push(...appendAggregateRow(recordList, columns, field, datamanager));
  });

  return result;
};

module.exports = {
  filterList,
  getStackedColumns,
  isColHidden,
  DEFAULT_LG_ORDER_MAP,
  DEFAULT_SG_ORDER_MAP,
  formatAggregate,
  sortList,
};
