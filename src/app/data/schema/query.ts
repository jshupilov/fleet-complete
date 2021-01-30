
export class RequestParamsFleet {
  key!: string;
  json!: boolean;
}
export class RequestParamsFleetRoutes extends RequestParamsFleet {
  objectId!: number;
  begTimestamp!: string;
  endTimestamp!: string;
}