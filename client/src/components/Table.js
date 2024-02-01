import {
  ColumnDirective,
  ColumnsDirective,
  GridComponent,
  Inject,
  Sort,
  PagerComponent,
  Group,
  Resize,
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
    groupOptions,
  } = props;

  const grid = useRef();

  useEffect(() => {
    if (grid?.current) {
      grid.current.componentRefresh();
    }
  }, [tableColumns, groupOptions]);

  // get updated datamanager
  const getDatamanager = (requestType, args) => {
    const result = { ...datamanager };

    if (requestType === "sorting") {
      if (args.name && args.direction) {
        result.sorted = [{ name: args.name, direction: args.direction }];
      } else {
        result.sorted = [];
      }
    }

    if (requestType === "paging") {
      result.pageIndex = args.pageIndex;
      result.pageSize = args.pageSize;
    }

    return result;
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

  const queryCellInfo = (args) => {
    if (!args.data.segmentCode) {
      args.cell.classList.add('subtotal-cell');
    }
  }

  const onPagingClick = (args) => {
    const newDatamanager = getDatamanager("paging", {
      pageIndex: args.currentPage,
      pageSize,
    });

    fetchDataList(newDatamanager);
    setDatamanager(newDatamanager);
  };

  const getValueAccessor = (column) => (field, value) =>
    column.hasAccessor
      ? Number(value[field]).toLocaleString("en-US", {
          minimumFractionDigits: column.precision,
          maximumFractionDigits: column.precision,
        })
      : value[field];

  return (
    <div className="table">
      {tableColumns && tableData && (
        <GridComponent
          dataSource={tableData}
          allowSorting={true}
          allowGrouping={true}
          allowResizing
          groupSettings={groupOptions}
          actionBegin={onActionBegin}
          ref={grid}
          queryCellInfo={queryCellInfo}
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
                columns={col?.columns?.map((c) => ({
                  ...c,
                  valueAccessor: getValueAccessor(c),
                }))}
                valueAccessor={getValueAccessor(col)}
              />
            ))}
          </ColumnsDirective>
          <Inject services={[Sort, Group, Resize]} />
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
