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

module.exports = { filterList, getStackedColumns, isColHidden };
