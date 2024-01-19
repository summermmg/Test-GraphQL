const getMyDataList = `{
    myDataList {
      areaId
      order
      geoCode
      geoName
      count
      index
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
