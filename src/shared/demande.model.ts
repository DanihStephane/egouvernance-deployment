export class RequestStatus {
  code!: string;
  label!: string;
  requestStatusId!: number;
}

export class RequestInfoResponse {
  id!: number;
  address!: string;
  dateOfBirth!: string | null;
  fathersName!: string;
  lastName!: string;
  firstName!: string;
  maritalStatus!: string;
  mothersName!: string;
  phoneNumber!: string;
  placeOfBirth!: string;
  request!: string;
  sex!: string;
}

export class RequestType {
  requestTypeId!: number;
  code!: string;
  label!: string;
}

export class Demande {
  id!: number;
  reason!: string;
  requestDate!: string | null;
  flag!: string;
  updateDateTime!: string;
  requestStatus!: RequestStatus;
  requestType!: RequestType;
  requestInfoResponse!: RequestInfoResponse;
  illustration!: string | null;
}
