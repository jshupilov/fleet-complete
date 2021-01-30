export class ResponseFleet {
  meta!: any;
  status!: number;
}

export class ResponseFleetLastData extends ResponseFleet {
  response!: ResponseFleetLastDataItem[];
}
export class ResponseFleetLastDataItem {
  objectId!: number;
  objectName!: string;
  latitude!: number;
  longitude!: number;
  speed!: number;
  timestamp!: Date;
}

export class ResponseFleetRawData extends ResponseFleet {
  response!: ResponseFleetRawDataItem[];
}
export class ResponseFleetRawDataItem {
  EngineStatus!: number;
  Latitude!: number;
  Longitude!: number;
  timestamp!: Date;
} 