import { nanoid } from "nanoid";
import { SwitchComponent } from "@syncfusion/ej2-react-buttons";
import FilterInput from "./FilterInput";
import { columns, operatorList } from "./inputList";

const FilterComponent = (props) => {
  const {
    filterSettings,
    setFilterSettings,
    onFilterApply,
    onAddNewFilter,
    onFilterReset,
    onConditionChange,
  } = props;

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

      <SwitchComponent
        change={onConditionChange}
        checked={filterSettings.condition === "and"}
      />
      <span>{filterSettings.condition}</span>
      <button onClick={onAddNewFilter}>Add new filter</button>
      <button onClick={onFilterApply}>Apply</button>
      <button onClick={onFilterReset}>Reset</button>
    </div>
  );
};

export default FilterComponent;
