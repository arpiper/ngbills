export class Utility {
  id: number;
  name: string;
  // payments_made: number;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    //payments_made = 0;
  }
}
