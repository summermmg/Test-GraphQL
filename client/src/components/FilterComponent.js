import { nanoid } from "nanoid";
import { SwitchComponent, ButtonComponent } from "@syncfusion/ej2-react-buttons";
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

      <div className="filter-buttons">
        <div className="filter-button">
          <SwitchComponent
            change={onConditionChange}
            checked={filterSettings.condition === "and"}
          />
          <span>{filterSettings.condition}</span>
        </div>

        <ButtonComponent className="filter-button" onClick={onAddNewFilter}>Add new filter</ButtonComponent>
        <ButtonComponent className="filter-button" onClick={onFilterApply}>Apply</ButtonComponent>
        <ButtonComponent className="filter-button" onClick={onFilterReset}>Reset</ButtonComponent>
      </div>
    </div>
  );
};

export default FilterComponent;
