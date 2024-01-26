import Table from "./components/Table";
import FilterComponent from "./components/FilterComponent";
import HideColumn from "./components/HideColumn";
import Grouping from "./components/grouping";
import "./index.css";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import {
  TabComponent,
  TabItemDirective,
  TabItemsDirective,
} from "@syncfusion/ej2-react-navigations";
import {
  DataManager,
  Query,
  GraphQLAdaptor,
  Predicate,
} from "@syncfusion/ej2-data";
import { columns, reportInputsInfo } from "./components/inputList";
import { getMyDataList, getMyColumns } from "./queries";

const SERVICE_URI = "http://localhost:4000/graphql";
const pageSize = 10;
const defaultFilterSettings = {
  condition: "and",
  filters: [
    {
      id: nanoid(),
      field: "index",
      operator: "greaterthanorequal",
      value: "",
    },
  ],
};

function App() {
  const renderCaptionTemplate = (groupItems) => {
    if (groupItems && groupItems.items.length === 0) return null;

    const groupFirstItem = groupItems.items[0];
    const label = groupFirstItem[groupItems.field];

    return <span className="group-label">{label}</span>;
  };

  const defaultGroupSettings = {
    showGroupedColumn: true,
    showDropArea: false,
    allowReordering: true,
    columns: [],
    captionTemplate: renderCaptionTemplate,
  };

  // datamanager contains sorting and paging info
  const [datamanager, setDatamanager] = useState({ pageIndex: 1, pageSize });
  const [tableData, setTableData] = useState([]);
  const [tableColumns, setTableColumns] = useState([]);
  const [totalRecord, setTotalRecord] = useState(0);
  const [filterSettings, setFilterSettings] = useState(defaultFilterSettings);
  const [hideColsInfo, setHideColsInfo] = useState(new Set());
  const [withStackedHeader, setStackedHeader] = useState(false);
  const [groupOptions, setGroupOptions] = useState(defaultGroupSettings);
  const [aggregate, setAggregate] = useState();

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
        setTotalRecord(e?.result.count);
      });
  };

  const fetchColumns = () => {
    const query = new Query()
      .addParams("reportType", "profileArea")
      .addParams("hideColInfo", [...hideColsInfo])
      .addParams("withStackedHeader", withStackedHeader || false)
      .addParams("reportInputsInfo", reportInputsInfo);

    new DataManager({
      url: SERVICE_URI,
      adaptor: new GraphQLAdaptor({
        response: {
          result: "myColumns", // map the response
        },
        query: getMyColumns(),
      }),
    })
      .executeQuery(query)
      .then((e) => {
        setTableColumns(e.result);
      });
  };

  useEffect(() => {
    fetchDataList(datamanager);
    fetchColumns();
  }, []);

  const onFilterApply = (e) => {
    e.preventDefault();

    fetchDataList(datamanager);
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

  const onHideColApply = () => {
    fetchColumns();
  };

  const getContent = (type) => {
    let content;

    switch (type) {
      case "filter":
        content = (
          <FilterComponent
            filterSettings={filterSettings}
            setFilterSettings={setFilterSettings}
            onFilterApply={onFilterApply}
            onAddNewFilter={onAddNewFilter}
            onFilterReset={onFilterReset}
            onConditionChange={onConditionChange}
          />
        );

        break;

      case "hideColumn":
        content = (
          <HideColumn
            hideColsInfo={hideColsInfo}
            setHideColsInfo={setHideColsInfo}
            onHideColApply={onHideColApply}
            withStackedHeader={withStackedHeader}
            setStackedHeader={setStackedHeader}
          />
        );
        break;

      default:
        content = (
          <Grouping
            groupOptions={groupOptions}
            setGroupOptions={setGroupOptions}
          />
        );
        break;
    }

    return content;
  };

  return (
    <div className="container">
      <Table
        tableData={tableData}
        tableColumns={tableColumns}
        datamanager={datamanager}
        setDatamanager={setDatamanager}
        fetchDataList={fetchDataList}
        totalRecord={totalRecord}
        groupOptions={groupOptions}
        aggregate={aggregate}
        setAggregate={setAggregate}
      />
      <TabComponent>
        <TabItemsDirective>
          <TabItemDirective
            header={{ text: "filter" }}
            content={() => getContent("filter")}
          />
          <TabItemDirective
            header={{ text: "Hide Column" }}
            content={() => getContent("hideColumn")}
          />
          <TabItemDirective
            header={{ text: "Grouping" }}
            content={() => getContent("grouping")}
          />
        </TabItemsDirective>
      </TabComponent>
    </div>
  );
}

export default App;
