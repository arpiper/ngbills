import { Utility } from './utility';
import { Person } from './person';

export class Bill {
  public id: number;
  public due_date: Date;
  public amount: number;
  public paid_to: Utility;
  public split_by: Person[];
  public split_by_ids?: number[] = [];
  public split_count?: number;
  public split_amount?: number;
  public paid_partial?: Person[];
  public paid_partial_ids?: number[] = [];
  public paid_full?: boolean;
  public paid_date?: Date;
  public notes?: string;

  constructor(billInfo:any) {
    this.id = billInfo.id;
    this.due_date = billInfo.due_date;
    this.amount = billInfo.amount;
    this.paid_to = billInfo.paid_to;
    this.split_by = billInfo.split_by;
    this.split_by.forEach(v => this.split_by_ids.push(v.id));

    // calculated values from the above.
    this.split_count = billInfo.split_by.length;
    this.split_amount = billInfo.amount / billInfo.split_by.length;
    this.paid_partial = (billInfo.paid_partial) ? billInfo.paid_partial : [];
    this.paid_partial.forEach(v => this.paid_partial_ids.push(v.id));
    this.paid_full = (billInfo.paid_full) ? billInfo.paid_full : false;

    this.paid_date = (billInfo.paid_date) ? billInfo.paid_full : undefined;
    this.notes = (billInfo.notes) ? billInfo.notes : undefined;
  }
}
