export const locationDtoPrint = async (locationDto) => {
  console.log(
    " memberId:",
    locationDto.memberId,
    "recordId: ",
    locationDto.recordId,
    "latitude: ",
    locationDto.latitude,
    " longitude:",
    locationDto.longitude,
    " heartRate:",
    locationDto.heartRate,
    " pace:",
    locationDto.pace,
    " time: ",
    locationDto.time,
    " runningDistance: ",
    locationDto.runningDistance,
    " routeId",
    locationDto.routeID
  );
};
