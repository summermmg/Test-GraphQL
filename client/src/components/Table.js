import { useEffect, useState } from "react";
import { DataManager, Query, GraphQLAdaptor } from "@syncfusion/ej2-data";
import {
  ColumnDirective,
  ColumnsDirective,
  GridComponent,
} from "@syncfusion/ej2-react-grids";
import  { getMyDataList, searchDataByOrder } from '../queries';

function Table() {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    new DataManager({
      url: "http://localhost:4000/graphql",
      adaptor: new GraphQLAdaptor({
        response: {
          result: "data",
        },
        query: getMyDataList,
      }),
    })
      .executeQuery(new Query().take(15))
      .then((e) => {
        setTableData(e?.actual?.data?.myDataList);
      });
  }, []);

  return (
    <GridComponent dataSource={tableData}>
      <ColumnsDirective>
        <ColumnDirective
          field="order"
          headerText="Order"
          width="20%"
          textAlign="Right"
        />
        <ColumnDirective
          field="areaId"
          headerText="Area Id"
          width="20%"
          textAlign="Right"
        />
        <ColumnDirective
          field="geoCode"
          headerText="Geography Code"
          width="20%"
          textAlign="Right"
        />
        <ColumnDirective
          field="geoName"
          headerText="Geography Name"
          width="20%"
          textAlign="Right"
        />
        <ColumnDirective
          field="count"
          headerText="Count"
          width="20%"
          textAlign="Right"
        />
        <ColumnDirective
          field="index"
          headerText="Index"
          width="20%"
          textAlign="Right"
        />
      </ColumnsDirective>
    </GridComponent>
  );
}

export default Table;
