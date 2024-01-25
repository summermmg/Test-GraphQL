const getMyDataList = (
  columns
) => `query getDataList($datamanager:Datamanager) {
  myDataList(datamanager: $datamanager) {
    totalRecord, result{
      ${columns.reduce((acc, curr) => `${acc}, ${curr.field}`, "")}
    }
  }}`;

const getMyColumns = () => `query getColumns($datamanager:Datamanager) {
    myColumns(datamanager: $datamanager) {
      field
      id
      headerText
      width
      textAlign
      isNumeric
      isHidable
      hasAccessor
      precision
      headerTemplate
      columns {
        field
        id
        headerText
        width
        textAlign
        isNumeric
        isHidable
        hasAccessor
        precision
      }      
    }}`;

export { getMyDataList,getMyColumns };
