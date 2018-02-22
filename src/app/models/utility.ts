export class Utility {
  id: number;
  name: string;
  payments: number;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.payments = (data.payments) ? data.payments : 0;
  }
}
