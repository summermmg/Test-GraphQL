import { useEffect, useState } from "react";
import { DataManager, Query, GraphQLAdaptor } from "@syncfusion/ej2-data";
import {
  ColumnDirective,
  ColumnsDirective,
  GridComponent,
  Inject,
  Sort,
} from "@syncfusion/ej2-react-grids";
import { getMyDataList } from "../queries";

const SERVICE_URI = "http://localhost:4000/graphql";
const sortComparer = () => 0;

function Table() {
  const [tableData, setTableData] = useState([]);
  const [datamanager, setDatamanager] = useState({});

  const formatQuery = (newDatamanager) => {
    let query = new Query();
    const { sorted } = newDatamanager;

    if (sorted && sorted.length > 0) {
      query = query.sortBy(sorted[0].name, sorted[0].direction);
    }

    // TODO: append other queries

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

    return temp;
  };

  const onActionBegin = (args) => {
    if (args.requestType === "sorting") {
      console.log(args);

      const newDatamanager = getDatamanager("sorting", {
        name: args.columnName || "",
        direction: args.direction || "",
      });

      fetchDataList(newDatamanager);
      setDatamanager(newDatamanager);
    }
  };

  return (
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
  );
}

export default Table;
