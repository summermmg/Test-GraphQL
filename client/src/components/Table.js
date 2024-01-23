import { useEffect, useState } from "react";
import {
  DataManager,
  Query,
  GraphQLAdaptor,
  Predicate,
} from "@syncfusion/ej2-data";
import {
  ColumnDirective,
  ColumnsDirective,
  GridComponent,
  Inject,
  Sort,
  PagerComponent,
} from "@syncfusion/ej2-react-grids";
import { getMyDataList } from "../queries";

const SERVICE_URI = "http://localhost:4000/graphql";
const sortComparer = () => 0;
const pageSize = 4;

function Table() {
  const [tableData, setTableData] = useState([]);
  const [datamanager, setDatamanager] = useState({ pageIndex: 1, pageSize });

  const formatQuery = (newDatamanager) => {
    let query = new Query();
    const { sorted, pageIndex, pageSize } = newDatamanager;

    // append sort query
    if (sorted && sorted.length > 0) {
      query = query.sortBy(sorted[0].name, sorted[0].direction);
    }

    // append paging query
    query = query.page(pageIndex, pageSize);

    // TODO: append filter query
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

    // const predicates = predicate1.or(predicate2);
    // query = query.where(predicates);

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
          result: "myDataList", // map the response
        },
        query: getMyDataList,
      }),
    })
      .executeQuery(query)
      .then((e) => {
        setTableData(e?.result);
      });
  };

  useEffect(() => {
    fetchDataList(datamanager);
  }, []);

  // get updated datamanager
  const getDatamanager = (requestType, args) => {
    const temp = { ...datamanager };

    if (requestType === "sorting") {
      if (args.name && args.direction) {
        temp.sorted = [{ name: args.name, direction: args.direction }];
      } else {
        temp.sorted = [];
      }
    }

    if (requestType === "paging") {
      temp.pageIndex = args.pageIndex;
      temp.pageSize = args.pageSize;
    }

    return temp;
  };

  const onActionBegin = (args) => {
    if (args.requestType === "sorting") {
      const newDatamanager = getDatamanager("sorting", {
        name: args.columnName || "",
        direction: args.direction || "",
      });

      fetchDataList(newDatamanager);
      setDatamanager(newDatamanager);
    }
  };

  const onPagingClick = (args) => {
    const newDatamanager = getDatamanager("paging", {
      pageIndex: args.currentPage,
      pageSize,
    });

    fetchDataList(newDatamanager);
    setDatamanager(newDatamanager);
  };

  return (
    <div className="table-container">
      <div className="table">
        <GridComponent
          dataSource={tableData}
          allowSorting={true}
          actionBegin={onActionBegin}
        >
          <ColumnsDirective>
            <ColumnDirective
              field="order"
              headerText="Order"
              width="20%"
              textAlign="Right"
              sortComparer={sortComparer}
            />
            <ColumnDirective
              field="areaId"
              headerText="Area Id"
              width="20%"
              textAlign="Right"
              sortComparer={sortComparer}
            />
            <ColumnDirective
              field="geoCode"
              headerText="Geography Code"
              width="20%"
              textAlign="Right"
              sortComparer={sortComparer}
            />
            <ColumnDirective
              field="geoName"
              headerText="Geography Name"
              width="20%"
              textAlign="Right"
              sortComparer={sortComparer}
            />
            <ColumnDirective
              field="count"
              headerText="Count"
              width="20%"
              textAlign="Right"
              sortComparer={sortComparer}
            />
            <ColumnDirective
              field="index"
              headerText="Index"
              width="20%"
              textAlign="Right"
              sortComparer={sortComparer}
            />
          </ColumnsDirective>
          <Inject services={[Sort]} />
        </GridComponent>

        <PagerComponent
          totalRecordsCount={12}
          pageSize={pageSize}
          pageCount={3}
          click={onPagingClick}
        ></PagerComponent>
      </div>
    </div>
  );
}

export default Table;
