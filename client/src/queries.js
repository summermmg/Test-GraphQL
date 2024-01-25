const getMyDataList = (
  columns
) => `query getDataList($datamanager:Datamanager) {
  myDataList(datamanager: $datamanager) {
    totalRecord, result{
      ${columns.reduce((acc, curr) => `${acc}, ${curr.field}`, "")}
    }
  }}`;

export { getMyDataList };
