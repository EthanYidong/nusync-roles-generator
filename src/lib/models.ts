export interface State {
  idGen: number;
  people: Array<Person>;
  roles: Array<Role>;
}

export interface Person {
  id: number;
  name: string;
  nusnetID: string;
}

export interface Role {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  people: Array<number>;
}
