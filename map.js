export const getLatitudeLongitude = (coordinates) => coordinates.map(({ lng, lat }) => [lat, lng]);

export const getMidpoint = (firstPoint, secondPoint) => [(+firstPoint[0] + +secondPoint[0]) / 2, (+firstPoint[1] + +secondPoint[1]) / 2];