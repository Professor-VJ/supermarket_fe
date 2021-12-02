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
  selector: 'app-billpaybyvendor',
  templateUrl: './billpaybyvendor.component.html',
  styleUrls: ['./billpaybyvendor.component.scss']
})
export class BillpaybyvendorComponent implements OnInit {
  isShown = true;
  isTable =false;
  users = [];
  CompanyId =1;
  stores :any= [];
  billData: any =[];
  billstatus = '';
  searchContactId =null;
  numRecords = 50;
  ordId =null;
  Ordprd:any =[];
  OrderedById = 0;
  SuppliedById = 0;
  Accountdata =0;
  DispatchById = 0;
  contactId =0;
  orderDate ='';
  paymentmode =2;
  creditTypeStatus ="";                                                                                                        
  contacttype =2;
  paycred =[];
  amt =400;
  NewArr:any =[];
  EditCredit:any =[];
  credData:any =[];
  OrdId = 0;
  isRepay = false;
  page = 2;
  term: string = '';

  // trans =[];
  trans: any = {   amount: 0, creditTypeStatus:"", PaymentTypeId:1, 
  Description: "", CompanyId: 1,contactId:this.contactId,responsibleById:this.DispatchById,
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
    this.getStoreList();
    this.getbillpaybyvendor();

  }
  getStoreList() {
    this.Auth.getstores(this.CompanyId).subscribe(data => {
      this.stores = data;
      console.log("stores",this.stores)
      })
  }
  getbillpaybyvendor() {
    this.Ordprd.push({
      companyId:this.CompanyId,
       UserID:this.users[0].id,
       searchContactId:this.searchContactId,
      numRecords:this.numRecords
    })
    this.Auth.getbillpayvendor(this.Ordprd).subscribe(data => {
      this.billData = data;
      this.filteredvalues = this.billData.ord;
      console.log("billData",this.billData)
    })
  }
  filteredvalues = [];
  filtersearch(): void {
    this.filteredvalues = this.term
      ? this.billData.filter(x => x.provider.toLowerCase().includes(this.term.toLowerCase()))
      : this.billData;
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
  getTransList(id)
  {
    this.isShown =  !this.isShown;
    this.isTable =  !this.isTable;
    this.credData.push({
      companyId:this.CompanyId,
      id:id
    })
    this.Auth.getTransdata(this.credData).subscribe(data => {
      this.trans = data;
      console.log("EditCredit",this.trans)
      })
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
      this.getbillpaybyvendor();
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
    if(Val == 1)
    {
      this.creditTypeStatus ="SALADV";  
    }
    if(Val == 2)
    {
      this.creditTypeStatus ="PURADV";  
    }
    if(Val == 3)
    {
      this.creditTypeStatus ="MANADV";  
    }
    if(Val == 4)
    {
      this.creditTypeStatus ="OTR";  
    }
    console.log("credit",this.creditTypeStatus)
    // this.creditTypeStatus = Val;
  }
  getrepayList(Id)
  {
this.isTable = this.isTable;
this.isShown = !this.isShown;
this.isRepay = !this.isRepay;
  }
  Submit()
  {
    this.paycred.push({
      CompanyId:this.CompanyId,
      ContactId:this.contactId,
       UserId:this.users[0].id,
       ResponsibleById:this.DispatchById,
       ContactType:this.contacttype,
      CreditType:this.creditTypeStatus,
      StoreId:this.SuppliedById,
      ProviderId:this.SuppliedById,       
      Amount:this.trans.amount,
      Description:this.trans.description,
      TransDate:moment().format('YYYY-MM-DD HH:MM A'),
      CreatedDate:moment().format('YYYY-MM-DD HH:MM A'),
      TransDateTime:moment().format('YYYY-MM-DD HH:MM A'),
      PaymentTypeId:this.paymentmode,
      PaymentStatusId:2,
      TranstypeId:8
    })
    this.Auth.Creditpay(this.paycred).subscribe(data => {
      console.log(data)
      this.isShown =  !this.isShown;
      this.isTable =  !this.isTable;
      this.getbillpaybyvendor();
    })
  }
  contactType(val)
  {
    this.contacttype = val;
  }
  billpay()
  {
    this.isShown =  !this.isShown;
    this.isTable =  !this.isTable; 
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
      