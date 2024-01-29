const getMyDataList = () => `query getDataList($datamanager:Datamanager) {
  myDataList(datamanager: $datamanager) {
    totalRecord, result{
      segmentCode
      sg
      lg
      segmentName
      count
      percentComp
      baseCount
      basePercent
      percentPen
      index
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

export { getMyDataList, getMyColumns };
