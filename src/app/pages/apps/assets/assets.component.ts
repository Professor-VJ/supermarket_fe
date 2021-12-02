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
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss']
})
export class AssetsComponent implements OnInit {
  isShown = true;
  isTable =false;
  isEditTable = false;
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
  VendorId =0;
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
  assettypes:any =[];
  assetarr =[];
  Editasset:any =[];
  Id =null;
  term: string = '';
  // trans =[];
  asset: any = {  Description: "", CompanyId: 1,
 IsOnlinePayment:false,Count:null }
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
    this.getassetdata();
    this.getassettypedata();

  }
  getStoreList() {
    this.Auth.getstores(this.CompanyId).subscribe(data => {
      this.stores = data;
      console.log("stores",this.stores)
      })
  }
  getassettypedata() {
    this.Auth.getassettype(this.CompanyId).subscribe(data => {
      this.assettypes = data;
      console.log("assettypes",this.assettypes)
    })
  }



  getassetdata() {
    this.Auth.getasset(this.CompanyId).subscribe(data => {
      this.billData = data;
      this.filteredvalues = this.billData;
      console.log("billData",this.billData)
    })
  }
  
  filteredvalues = [];
  filtersearch(): void {
    this.filteredvalues = this.term
      ? this.billData.liability.filter(x => x.description.toLowerCase().includes(this.term.toLowerCase()))
      : this.billData;
    console.log("filtered values",this.filteredvalues)
  }

  DeActivate(Id)
  {
    this.Auth.DeActivateasset(Id).subscribe(data => {
      console.log(data)
      this.getassetdata();
    }) 
    this.getassetdata();
  }
  upddata(id)
  {
        this.isShown =  !this.isShown;
    this.isEditTable = !this.isEditTable;
    this.isTable = this.isTable;
         this.Auth.editasset(id).subscribe(data => {
       this.Editasset = data;
           console.log("Editasset",this.Editasset)
             this.asset.Description = this.Editasset.description;
      this.Id = this.Editasset.id;
      this.asset.IsActive = this.Editasset.isActive;
      this.asset.IsOnlinePayment = this.Editasset.isOnlinePayment;
      this.asset.LiabilityTypeId = this.Editasset.liabilityTypeId;
      this.asset.CompanyId = this.Editasset.companyId;
      this.asset.StoreId = this.Editasset.storeId;
      this.asset.VendorId = this.Editasset.vendorId;
      this.asset.ContactId = this.Editasset.contactId;
      this.asset.Count = this.Editasset.count;
            console.log("Editassetype",this.Editasset)
         })
  }
  Update()
  {
         console.log("maintBillType",this.assetarr)
         this.assetarr.push({
          LiabilityTypeId:this.DispatchById,
          VendorId:this.VendorId,
          StoreId:this.SuppliedById,
          ContactId:this.contactId,
          Description: this.asset.Description,
           CompanyId: this.asset.CompanyId,
     IsOnlinePayment:this.asset.IsOnlinePayment,
     Count:this.asset.Count,
     id:this.Id
        })    
    this.Auth.updasset(this.assetarr).subscribe(data => {
      console.log(data)
      this.isShown =  !this.isShown;
      this.isEditTable = !this.isEditTable;
      this.isTable = this.isTable;
       this.getassetdata();
    this.notification.success("Data Updated Successfully", `Updated successfully.`)
    })
  }


  locback()
  {
    this.isShown =  !this.isShown;
    this.isTable =  !this.isTable;
  }
  

  selecteddispatchitem(item) {
    console.log("item", item);
    this.DispatchById = item.id;
  }
  searchdispatch = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term === '' ? []
        : this.assettypes.filter(v => v.description.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  formatterdispatch = (x: { description: string }) => x.description;

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

  selectedvendoritem(item) {
    console.log("item",item);
    this.VendorId =item.id;
  }
  searchvendor = (text$: Observable<string>) =>
  text$.pipe(
    debounceTime(200),
    map(term => term === '' ? []
      : this.billData.vendor.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
  )

formattervendor = (x: { name: string }) => x.name;

Create()
  {
    console.log("asset",this.asset)
    this.assetarr.push({
      LiabilityTypeId:this.DispatchById,
      VendorId:this.VendorId,
      StoreId:this.SuppliedById,
      ContactId:this.contactId,
      Description: this.asset.Description,
       CompanyId: this.asset.CompanyId,
 IsOnlinePayment:this.asset.IsOnlinePayment,
 Count:this.asset.Count
    })
    console.log("asset",this.assetarr)
    this.Auth.saveasset(this.assetarr).subscribe(data => {
      console.log(data)
      this.isShown =  !this.isShown;
      this.isEditTable = this.isEditTable;
      this.isTable = !this.isTable;
          this.getassetdata();
          this.notification.success("Data Saved Successfully", `Saved successfully.`)
    })
  }
  contactType(val)
  {
    this.contacttype = val;
  }
  goback()
  {
    this.isShown =  !this.isShown;
     this.isEditTable = this.isEditTable;
    this.isTable = !this.isTable;
  }

}
      