const getMyDataList = `query getDataList($datamanager:Datamanager) {
  myDataList(datamanager: $datamanager) {
    order
    geoCode
    geoName
    count
    index
    areaId
  }
}`;

export { getMyDataList };
