import Table from "./components/Table";
import FilterComponent from "./components/FilterComponent";
import "./index.css";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import {
  DataManager,
  Query,
  GraphQLAdaptor,
  Predicate,
} from "@syncfusion/ej2-data";
import { columns, operatorList } from "./components/inputList";
import { getMyDataList } from "./queries";

const SERVICE_URI = "http://localhost:4000/graphql";
const pageSize = 4;
const defaultFilterSettings = {
  condition: "and",
  filters: [
    {
      id: nanoid(),
      field: columns[3].field,
      operator: operatorList[0],
      value: "",
    },
  ],
};

function App() {
  // datamanager contains sorting and paging info
  const [datamanager, setDatamanager] = useState({ pageIndex: 1, pageSize });
  const [tableData, setTableData] = useState([]);
  const [totalRecord, setTotalRecord] = useState(0);
  const [filterSettings, setFilterSettings] = useState(defaultFilterSettings);

  const generateFilterQuery = (query, settings) => {
    const { condition, filters } = settings;

    if (filters.length > 0) {
      let predicate = new Predicate(
        filters[0].field,
        filters[0].operator,
        Number(filters[0].value)
      );

      filters.forEach((filter, index) => {
        if (index > 0) {
          if (condition === "and") {
            predicate = predicate.and(
              filter.field,
              filter.operator,
              Number(filter.value)
            );
          } else if (condition === "or") {
            predicate = predicate.or(
              filter.field,
              filter.operator,
              Number(filter.value)
            );
          }
        }
      });

      return query.where(predicate);
    }
  };

  const formatQuery = (newDatamanager) => {
    let query = new Query();
    const { sorted, pageIndex, pageSize } = newDatamanager;

    // append sort query
    if (sorted && sorted.length > 0) {
      query = query.sortBy(sorted[0].name, sorted[0].direction);
    }

    // append paging query
    query = query.page(pageIndex, pageSize);

    // append filter query
    if (filterSettings.filters.length > 0) {
      query = generateFilterQuery(query, filterSettings);
    }
    // between 2 - 5 or between 7-10
    // [{"isComplex":true,"ignoreCase":false,"condition":"or","predicates":[{"isComplex":true,"ignoreCase":false,"condition":"and","predicates":[{"isComplex":false,"field":"order","operator":"greaterthan","value":2,"ignoreCase":false},{"isComplex":false,"field":"order","operator":"lessthan","value":5,"ignoreCase":false}]},{"isComplex":true,"ignoreCase":false,"condition":"and","predicates":[{"isComplex":false,"field":"order","operator":"greaterthan","value":7,"ignoreCase":false},{"isComplex":false,"field":"order","operator":"lessthan","value":10,"ignoreCase":false}]}]}]
    // const predicate1 = new Predicate("order", "greaterthan", 2).and(
    //   "order",
    //   "lessthan",
    //   5
    // );
    // const predicate2 = new Predicate("order", "greaterthan", 7).and(
    //   "order",
    //   "lessthan",
    //   10
    // );

    // append additional params
    const reportInput = {
      area: "test area",
      benchmark: "test benchmark",
      variables: ["variable1", "variable2", "variable3"],
    };
    query = query.addParams("reportInput", reportInput);

    return query;
  };

  const fetchDataList = (newDatamanager) => {
    const query = formatQuery(newDatamanager);

    new DataManager({
      url: SERVICE_URI,
      adaptor: new GraphQLAdaptor({
        response: {
          result: "myDataList.result", // map the response
          count: "myDataList.totalRecord", // map the response
        },
        query: getMyDataList(columns),
      }),
    })
      .executeQuery(query)
      .then((e) => {
        setTableData(e?.result.result);
        setTotalRecord(e?.result.count)
      });
  };

  useEffect(() => {
    fetchDataList(datamanager);
  }, []);

  const onFilterApply = (e) => {
    e.preventDefault();

    fetchDataList(datamanager);
  };

  const onAddNewFilter = () => {
    const newFilters = [...filterSettings.filters];

    newFilters.push({
      id: nanoid(),
      field: columns[3].field,
      operator: operatorList[0],
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
    <div className="">
      <Table
        tableData={tableData}
        datamanager={datamanager}
        setDatamanager={setDatamanager}
        fetchDataList={fetchDataList}
        totalRecord={totalRecord}
      />
      <FilterComponent
        filterSettings={filterSettings}
        setFilterSettings={setFilterSettings}
        onFilterApply={onFilterApply}
        onAddNewFilter={onAddNewFilter}
        onFilterReset={onFilterReset}
        onConditionChange={onConditionChange}
      />
    </div>
  );
}

export default App;
