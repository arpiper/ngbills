export class Person {
  id: number;
  name: string;
  payments_made: number;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.payments_made = 0;
  }
}
