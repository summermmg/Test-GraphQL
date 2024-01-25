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

module.exports = { filterList };
