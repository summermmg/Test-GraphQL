const getMyDataList = `query getDataList($datamanager:Datamanager) {
  myDataList(datamanager: $datamanager) {
    order
    geoCode
    areaId
  }
}`;

export { getMyDataList };
