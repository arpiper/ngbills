import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Bill } from '../models/bill';
import { Utility } from '../models/utility';
import { Person } from '../models/person';

import { BillService } from '../services/bill.service';
import { UtilityService } from '../services/utility.service';
import { PersonService } from '../services/person.service';

@Component({
  moduleId: module.id,
  selector: 'bill-form',
  template:`
    <h5>form</h5>
    <form>
      <input type="text">
    </form>
  `,
})

export class BillFormComponent implements OnInit {
  private utilities: Utility[];
  private persons: Person[];
  private model: Bill;
  private bill: FormGroup;

  constructor(
    private billService: BillService,
    private utilityService: UtilityService,
    private personService: PersonService,
    private route: ActivatedRoute,
    //private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    // need a resolver to get utiliyt/person data for the form.
    this.route.data.subscribe(
      (data) => {
        console.log(data);
        this.utilities = data.utilities;
        this.persons = data.persons;
      }
    );
  }
}
