import React, { useRef, useEffect } from "react";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";

const FilterInput = ({
  columns,
  operatorList,
  filter,
  filterSettings,
  setFilterSettings,
}) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const onFieldChange = (args) => {
    const newArray = filterSettings.filters.map((f) => {
      if (f.id === filter.id) {
        return { ...filter, field: args.value };
      }

      return f;
    });

    setFilterSettings({ condition: "and", filters: newArray });
  };
  const onOperatorChange = (args) => {
    const newArray = filterSettings.filters.map((f) => {
      if (f.id === filter.id) {
        return { ...filter, operator: args.value };
      }

      return f;
    });

    setFilterSettings({ condition: "and", filters: newArray });
  };

  const onValueChange = (e) => {
    const newArray = filterSettings.filters.map((f) => {
      if (f.id === filter.id) {
        return { ...filter, value: e.target.value };
      }

      return f;
    });

    setFilterSettings({ condition: "and", filters: newArray });
  };

  return (
    <div className="filter-input">
      <DropDownListComponent
        id="field-select"
        dataSource={columns
          .filter((col) => col.isNumeric)
          .map((col) => col.field)}
        change={onFieldChange}
        value={filter.field}
      />
      <DropDownListComponent
        id="operator-select"
        dataSource={operatorList}
        change={onOperatorChange}
        value={filter.operator}
      />
      <input
        ref={inputRef}
        className="e-input"
        type="text"
        placeholder="Enter Value"
        onChange={onValueChange}
        value={filter.value}
      />
    </div>
  );
};

export default FilterInput;
