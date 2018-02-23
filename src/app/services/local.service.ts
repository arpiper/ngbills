import { Person } from "../models/person"
import { Utility } from "../models/utility"
import { Bill } from "../models/bill"

/*
 * DEMO Data
 */
let utilities = [
  new Utility({name: "Internet Company", id: 1, payments: 50}),
  new Utility({name: "Water Company", id: 2}),
  new Utility({name: "Electric Company", id: 3}),
]
let persons = [
  new Person({name: "Roommate 1",id: 1, payments_made: 16.67}),
  new Person({name: "Roommate 2",id: 2, payments_made: 16.67}),
  new Person({name: "Roommate 3",id: 3, payments_made: 16.67}),
]
let bills = [
  new Bill({
    id: 1,
    due_date: "2/27/2018",
    amount: 50, 
    paid_to: utilities[0], 
    split_by: persons,
    paid_full: true,
    paid_partial: persons,
    paid_date: "2/26/2018",
    notes: "This is an internet bill",
  }),
  new Bill({
    id: 2,
    due_date: "4/7/2018",
    amount: 150, 
    paid_to: utilities[2], 
    split_by: persons,
  }),
  new Bill({
    id: 3,
    due_date: "3/20/2018",
    amount: 83, 
    paid_to: utilities[1], 
    split_by: persons,
  }),
  new Bill({
    id: 4,
    due_date: "5/17/2018",
    amount: 282, 
    paid_to: utilities[1], 
    split_by: persons,
  }),
  new Bill({
    id: 5,
    due_date: "3/27/2018",
    amount: 50, 
    paid_to: utilities[0], 
    split_by: persons,
  })
]

saveLocalStorage("ngpersons", persons)
saveLocalStorage("ngutilities", utilities)
saveLocalStorage("ngbills", bills)

function getLocalStorage(key: string): Array<any> {
  let ls = localStorage.getItem(key)
  if (!ls) {
    return []
  }
  return JSON.parse(ls)
}

function saveLocalStorage(key: string, val: any): void {
  localStorage.setItem(key, JSON.stringify(val))
}

export {
  getLocalStorage as getLS,
  saveLocalStorage as saveLS
}
