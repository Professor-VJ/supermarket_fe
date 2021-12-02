import { Component, OnInit, TemplateRef, ViewChild, ElementRef, HostListener } from '@angular/core';
import * as moment from 'moment'
import { FormControl, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal'
import { NgbModal, ModalDismissReasons, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap'
import { AuthService } from 'src/app/auth.service';
import { NzNotificationService } from 'ng-zorro-antd'
import { merge, Observable, Subject } from 'rxjs';
import { Router , ActivatedRoute} from '@angular/router';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Location } from '@angular/common';

@Component({
  selector: 'app-billbyvendor',
  templateUrl: './billbyvendor.component.html',
  styleUrls: ['./billbyvendor.component.scss']
})
export class BillbyvendorComponent implements OnInit {
  vendors:any =[];
  stores:any =[];
  users = [];
  isShown = true;
  isTable =false;
  vendorId = null;
  SuppliedById = null;
  CompanyId =1;
  asset: any = {   amount: 0, creditTypeStatus:"", PaymentTypeId:1, 
  Description: "", CompanyId: 1,
  storeId:this.SuppliedById, contactType:0,
   TransDateTime:moment().format('YYYY-MM-DD HH:MM A'),
   TransDate:moment().format('YYYY-MM-DD HH:MM\ A'),
  CreatedDate:moment().format('YYYY-MM-DD HH:MM A')}

  constructor(
    private modalService: NgbModal,
     private Auth: AuthService,
    private notification: NzNotificationService,
    private router: Router ,
    private route: ActivatedRoute,
    public location: Location )
     { 
      this.users = JSON.parse(localStorage.getItem("users"));

    }

  ngOnInit(): void {
    this.getvendorList();
    this.getStoreList();
  }
  getStoreList() {
    this.Auth.getstores(this.CompanyId).subscribe(data => {
      this.stores = data;
      console.log("stores",this.stores)
      })
  }

  getvendorList() {
    this.Auth.getvendors(this.CompanyId).subscribe(data => {
      this.vendors = data;
      console.log("vendors",this.vendors)
      })
  }
Submit()
{
  
}
  selectedvendoritem(item) {
    console.log("item", item);
    this.vendorId = item.id;
  }
  searchvendor = (text$: Observable<string>) =>
    text$.pipe(
       debounceTime(200),
      map(term => term === '' ? []
        : this.vendors.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  formattervendor = (x: { name: string }) => x.name;

  selectedsupplieritem(item) {
    console.log("item",item);
    this.SuppliedById =item.id;
    this.getbilldetails(item.id,this.vendorId)
  }
  getbilldetails(Id,vendorId)
  {
    this.isTable = !this.isTable;
    this.isShown = !this.isShown;
    console.log("item",Id,vendorId);
    this.Auth.getvendors(this.CompanyId).subscribe(data => {
      this.vendors = data;
      console.log("vendors",this.vendors)
      })
  }
  searchsupplier = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term === '' ? []
        : this.stores.storeList.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  formattersupplier = (x: { name: string }) => x.name;

}
