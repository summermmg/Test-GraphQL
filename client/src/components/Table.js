import {
  ColumnDirective,
  ColumnsDirective,
  GridComponent,
  Inject,
  Sort,
  PagerComponent,
} from "@syncfusion/ej2-react-grids";
import { nanoid } from "nanoid";
import { useEffect, useRef } from "react";

const sortComparer = () => 0;
const pageSize = 10;

function Table(props) {
  const {
    tableData,
    tableColumns,
    totalRecord,
    datamanager,
    setDatamanager,
    fetchDataList,
  } = props;

  const grid = useRef();

  useEffect(() => {
    console.log(tableColumns);
    if (grid.current) {
      console.log(grid.current);
      grid.current.columnModel = tableColumns.columns;
      grid.current.componentRefresh();
    }
  }, [tableColumns]);

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
    <div className="table">
      {tableColumns && tableData && (
        <GridComponent
          dataSource={tableData}
          allowSorting={true}
          actionBegin={onActionBegin}
          ref={grid}
        >
          <ColumnsDirective>
            {tableColumns.map((col) => (
              <ColumnDirective
                key={nanoid()}
                field={col.field}
                textAlign={col.textAlign}
                width={col.width || "10%"}
                headerText={col.headerText || ""}
                headerTemplate={col.headerTemplate}
                sortComparer={sortComparer}
                columns={col.columns}
                valueAccessor={
                  col.hasAccessor
                    ? (field, value) =>
                        Number(value[field]).toLocaleString("en-US", {
                          minimumFractionDigits: col.precision,
                          maximumFractionDigits: col.precision,
                        })
                    : null
                }
              />
            ))}
          </ColumnsDirective>
          <Inject services={[Sort]} />
        </GridComponent>
      )}

      {totalRecord && (
        <PagerComponent
          totalRecordsCount={totalRecord}
          pageSize={pageSize}
          pageCount={Math.ceil(totalRecord / pageSize)}
          click={onPagingClick}
        ></PagerComponent>
      )}
    </div>
  );
}

export default Table;
