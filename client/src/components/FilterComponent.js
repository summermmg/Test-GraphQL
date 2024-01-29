import { nanoid } from "nanoid";
import {
  SwitchComponent,
  ButtonComponent,
} from "@syncfusion/ej2-react-buttons";
import FilterInput from "./FilterInput";
import { columns, operatorList, defaultFilterSettings } from "./inputList";

const FilterComponent = (props) => {
  const { filterSettings, setFilterSettings, fetchDataList } = props;

  const onFilterApply = (e) => {
    e.preventDefault();

    fetchDataList();
  };

  const onAddNewFilter = () => {
    const newFilters = [...filterSettings.filters];

    newFilters.push({
      id: nanoid(),
      field: "index",
      operator: "greaterthanorequal",
      value: "",
    });

    setFilterSettings({
      ...filterSettings,
      filters: newFilters,
    });
  };

  const onFilterReset = () => {
    setFilterSettings(defaultFilterSettings);
  };

  const onConditionChange = (e) => {
    const newSettings = {
      ...filterSettings,
      condition: e.checked ? "and" : "or",
    };

    setFilterSettings(newSettings);
  };

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

        <ButtonComponent className="filter-button" onClick={onAddNewFilter}>
          Add new filter
        </ButtonComponent>
        <ButtonComponent className="filter-button" onClick={onFilterApply}>
          Apply
        </ButtonComponent>
        <ButtonComponent className="filter-button" onClick={onFilterReset}>
          Reset
        </ButtonComponent>
      </div>
    </div>
  );
};

export default FilterComponent;
