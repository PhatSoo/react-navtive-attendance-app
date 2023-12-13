export interface IEmployee {
  name: string;
  role: {
    typeName: string;
  };
  isPartTime: boolean;
  avatar: string;
}

export interface IForm {
  _id: string;
  status: string;
  startDate: Date;
  endDate: Date;
}
