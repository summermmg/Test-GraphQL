const getMyDataList = `query getDataList($datamanager:Datamanager) {
  myDataList(datamanager: $datamanager) {
    order
    geoCode
    areaId
  }
}`;

const searchDataByOrder = `{
    searchData(order: 2) {            
      areaId
      order
      geoCode
      geoName
      count
      index
    }
  }`;

export { getMyDataList, searchDataByOrder };
