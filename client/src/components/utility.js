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

export const calculateTotal = (args, field) => {
  let numeratorField = "";
  let denominatorField = "";
  let total = 0;
  let items = [];

  if (args.result) {
    if (args.result.records) {
      items = args.result.records;
    } else {
      items = args.result;
    }
  } else {
    items = args?.items ? args?.items : args;
  }

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

export const formatValue = (value, precision = 2) => {
  if (!value) return 0;

  const formattedValue = value.toLocaleString('en-US', {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  });

  return formattedValue;
};

export const formatAggregateValue = (args, colField) => {
  let result = 0;
  if (colField === "segmentName") {
    result = "Subtotals:";
  }

  if (colField === "count" || colField === "baseCount") {
    result = formatValue(args.Custom, 0);
  }

  if (colField === "percentComp" || colField === "basePercent") {
    result = formatValue(args.Sum);
  }

  if (colField === "percentPen") {
    result = formatValue(args.Custom);
  }

  if (colField === "index") {
    result = formatValue(parseFloat(args.Custom), 0);
  }

  return result;
};

const aggregateTemplate = (args, colField) =>
  formatAggregateValue(args, colField);

const getAggregateCell = (col) => {
  if (col && col.field) {
    const { field, isNumeric } = col;
    const aggregateRow = {
      field,
      groupFooterTemplate: (args) => aggregateTemplate(args, col.field),
    };

    if (field === "segmentName") {
      return {
        field,
        type: "Sum",
        groupFooterTemplate: "<span>Subtotals<span>",
      };
    }

    if (isNumeric) {
      switch (field) {
        case "percentComp":
        case "basePercent":
          return {
            ...aggregateRow,
            type: "Sum",
          };

        case "count":
        case "baseCount":
        case "percentPen":
        case "index":
          return {
            ...aggregateRow,
            type: "Custom",
            customAggregate: (args) => calculateTotal(args, field),
          };

        default:
          return undefined;
      }
    }
  }
};

export const getAggregates = (columns) => {
  const aggregateList = [];

  columns.forEach((col) => {
    if (col.columns) {
      col.columns.forEach((c) => {
        const aggregateCell = getAggregateCell(c);

        if (aggregateCell) {
          aggregateList.push(aggregateCell);
        }
      });
    } else {
      const aggregateCell = getAggregateCell(col);

      if (aggregateCell) {
        aggregateList.push(aggregateCell);
      }
    }
  });

  const aggregate = [
    {
      columns: aggregateList,
    },
  ];

  return aggregate;
};
