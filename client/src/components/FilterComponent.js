import { useEffect } from "react";
import { nanoid } from "nanoid";
// import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import FilterInput from "./FilterInput";
import { columns, operatorList } from "./inputList";

const FilterComponent = (props) => {
  const { filterSettings, setFilterSettings, onFilterApply } = props;

  useEffect(() => {
    console.log(filterSettings);
  }, [filterSettings]);

  // TODO: Add and / or and add new filter functionality

  return (
    <div className="filter-component">
      <div className="filter-input-list">
        {filterSettings.filters.map((filter) => (
          <FilterInput
            key={nanoid()}
            columns={columns}
            operatorList={operatorList}
            filter={filter}
            filterSettings={filterSettings}
            setFilterSettings={setFilterSettings}
          />
        ))}
      </div>

      <button  onClick={onFilterApply}>Apply</button >
    </div>
  );
};

export default FilterComponent;
