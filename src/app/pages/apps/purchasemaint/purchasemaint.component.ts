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
  selector: 'app-purchasemaint',
  templateUrl: './purchasemaint.component.html',
  styleUrls: ['./purchasemaint.component.scss']
})
export class PurchasemaintComponent implements OnInit {
  isShown = true;
  isTable =false;
  users = [];
  CompanyId =1;
  stores :any= [];
  purchaseData: any =[];
  billstatus = 'ALL';
  transtype =2;
  numRecords = 50;
  ordId =0;
  Ordprd:any =[];
  OrderedById = 0;
  SuppliedById = 0;
  Accountdata =0;
  DispatchById = 0;
  contactId =0;
  orderDate ='';
  paymentmode =2;
  creditTypeStatus =" ";                                                                                                        
  contacttype =2;
  paycred =[];
  amt =400;
  NewArr:any =[];
  EditCredit:any =[];
  credData:any =[];
  OrdId = 0;
  billId = null;
  credit =[];
  term:string ='';
  // trans =[];
  trans: any = {   amount: 0, creditTypeStatus:"", PaymentTypeId:1, 
  Description: "", CompanyId: 1,contactId:this.contactId,responsibleById:this.DispatchById,
  storeId:this.SuppliedById, contactType:0,
   TransDateTime:moment().format('YYYY-MM-DD HH:MM A'),
   TransDate:moment().format('YYYY-MM-DD HH:MM\ A'),
  CreatedDate:moment().format('YYYY-MM-DD HH:MM A')}
    // contactId:this.contactId,
    // responsibleById:this.DispatchById, contactType:this.contacttype,
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
    this.getStoreList();
     this.getpurchaseData("All");
  }
  getStoreList() {
    this.Auth.getstores(this.CompanyId).subscribe(data => {
      this.stores = data;
      console.log("stores",this.stores)
      })
  }
  getpurchaseData(billstatus) {
    var x = new Date();
    x.setDate(1);
    x.setMonth(x.getMonth() - 1);
    console.log("fromdate",x)
    // console.log("fromdate",x.setMonth(x.getMonth() - 1))
    this.Ordprd.push({
      companyId:this.CompanyId,
      searchId:this.ordId,
       UserID:this.users[0].id,
       billstatus:billstatus,
       billId:this.billId,
      numRecords:this.numRecords,
      dateFrom:x
    })
    // console.log("billstatus",this.billstatus)
    this.Auth.getpurchmaint(this.Ordprd).subscribe(data => {
      this.purchaseData = data;
      this.filteredvalues = this.purchaseData;
      console.log("purchaseData",this.purchaseData)
    })
  }

  filteredvalues = [];
  filtersearch(): void {
    this.filteredvalues = this.term
      ? this.purchaseData.filter(x => x.name1.toLowerCase().includes(this.term.toLowerCase()))
      : this.purchaseData;
    console.log("filtered values",this.filteredvalues)
  }

  Deletedata(id)
  {
    this.NewArr.push({
      companyId:this.CompanyId,
      TransactionId:id
    })
    this.Auth.deleteCredit(this.NewArr).subscribe(data => {
      console.log("delete",data)
      })
    
  }
  billpay(Id)
  {
this.isShown = !this.isShown;
this.isTable = !this.isTable;
  }

  Billstatus(val)
  {
    console.log("val", val)
    if(val == 1)
    {
      this.billstatus ="PEN";  
    }
    if(val == 2)
    {
      this.billstatus ="PAID";  
    }
    if(val == 3)
    {
      this.billstatus ="ALL";  
    }
    console.log("val", this.billstatus)
      this.getpurchaseData(this.billstatus);
  } 

  locback()
  {
    this.isShown =  !this.isShown;
    this.isTable =  !this.isTable;

  }
  onChange(e) {
    console.log("date",e);
    this.orderDate =e;
  }

  selecteddispatchitem(item) {
    console.log("item", item);
    this.DispatchById = item.id;
  }
  searchdispatch = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term === '' ? []
        : this.stores.cusList.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  formatterdispatch = (x: { name: string }) => x.name;

  selectedcontactitem(item) {
    console.log("item", item);
    this.contactId = item.id;
  }
  searchcontact = (text$: Observable<string>) =>
    text$.pipe(
       debounceTime(200),
      map(term => term === '' ? []
        : this.stores.cusList.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  formattercontact = (x: { name: string }) => x.name;

  selectedsupplieritem(item) {
    console.log("item",item);
    this.SuppliedById =item.id;
  }
  searchsupplier = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term === '' ? []
        : this.stores.storeList.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  formattersupplier = (x: { name: string }) => x.name;
  selectedaccountitem(item) {
    console.log("item",item);
    this.Accountdata =item.id;
  }
  searchBankAccount = (text$: Observable<string>) =>
  text$.pipe(
    debounceTime(200),
    map(term => term === '' ? []
      : this.stores.bankAcct.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
  )

formatteraccount = (x: { name: string }) => x.name;

  recStatus(Value)
  {
    console.log("rec",Value)
this.paymentmode =Value;
  }
  creditStatus(Val)
  {
    console.log("credit",Val)
    this.creditTypeStatus = Val;
  }

  Submit()
  {
    this.paycred.push({
      CompanyId:this.CompanyId,
      ContactId:this.contactId,
       ResponsibleById:this.DispatchById,
       ContactType:this.contacttype,
      CreditType:this.trans.creditTypeStatus,
      StoreId:this.SuppliedById,
      ProviderId:this.SuppliedById,       
      Amount:this.trans.amount,
      Description:this.trans.description,
      TransDate:moment().format('YYYY-MM-DD HH:MM A'),
      CreatedDate:moment().format('YYYY-MM-DD HH:MM A'),
      TransDateTime:moment().format('YYYY-MM-DD HH:MM A'),
      PaymentTypeId:1,
      PaymentStatusId:2,
      TranstypeId:2
    })
    this.Auth.Creditpay(this.paycred).subscribe(data => {
      console.log(data)
      this.isShown =  !this.isShown;
      this.isTable =  !this.isTable;
      // this.getcreditrepayData();
    })
  }
  contactType(val)
  {
    this.contacttype = val;
  }
  Delete(Id)
  {
    this.paycred.push({
      transactionId:Id,
      companyId:this.CompanyId
    })
    this.Auth.DeleteCreditpay(this.paycred).subscribe(data => {
      console.log(data)
    }) 
  }
}