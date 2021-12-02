import { Component, OnInit, TemplateRef, ViewChild, ElementRef, HostListener } from '@angular/core';
import * as moment from 'moment'
import { FormControl, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal'
import { NgbModal, ModalDismissReasons, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap'
import { AuthService } from 'src/app/auth.service';
import { NzNotificationService } from 'ng-zorro-antd'
import { merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { OrderItemModule, OrderModule } from './purchase.module';
import { SyncService } from 'src/app/services/sync/sync.service';
import { KeyedRead } from '@angular/compiler';

@Component({
  selector: 'app-purchase-entry',
  templateUrl: './purchase-entry.component.html',
  styleUrls: ['./purchase-entry.component.scss']
})
export class PurchaseEntryComponent implements OnInit {
  @ViewChild('instance', { static: true }) instance: NgbTypeahead
  @ViewChild('quantityel', { static: false }) public quantityel: TemplateRef<any>;//productinput
  @ViewChild('discperel', { static: false }) public discperel: TemplateRef<any>;
  @ViewChild('disc', { static: false }) public discel: TemplateRef<any>;
  @ViewChild('productautocomplete', { static: false }) public productinput: TemplateRef<any>;
  @ViewChild('scrollframe', { static: false }) scrollFrame: ElementRef;
  @ViewChild('rquantityel', { static: false }) public rquantityel: TemplateRef<any>;//productinput
  @ViewChild('rdiscperel', { static: false }) public rdiscperel: TemplateRef<any>;
  @ViewChild('rdisc', { static: false }) public rdiscel: TemplateRef<any>;
  @ViewChild('rproductautocomplete', { static: false }) public rproductinput: TemplateRef<any>;
  @ViewChild('rdquantityel', { static: false }) public rdquantityel: TemplateRef<any>;//productinput
  @ViewChild('rddiscperel', { static: false }) public rddiscperel: TemplateRef<any>;
  @ViewChild('rddisc', { static: false }) public rddiscel: TemplateRef<any>;
  @ViewChild('rdproductautocomplete', { static: false }) public rdproductinput: TemplateRef<any>;



  model: any = 'QWERTY'
  model1: any = 'gsgsag'
  model2: any = 'afdsdfgd'
  model3: any = 'rtfbgbg'
  model4: any = 'nbthtn'
  model5: any = 'rfdvfgf'


  order: OrderModule
  inputValue: string = '';
  focus$ = new Subject<string>()
  click$ = new Subject<string>()
  vendorid: number = 0
  vendororderproduct: any = [];
  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term === '' ? []
        : this.products.filter(v => v.product.toLowerCase().indexOf(term.toLowerCase()) > -1 || v.barCode?.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  formatter = (x: { product: string }) => x.product;

  searchvendor = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term === '' ? []
        : this.vendors.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  formattervendor = (x: { name: string }) => x.name;
  status = {
    "0": { name: 'NaN' },
    "1": { name: 'Open' },
    "2": { name: 'Dispatched' },
    "3": { name: 'Partial' },
    "4": { name: 'Closed' },
    "5": { name: 'ClosedManually' },
    "6": { name: 'MovedAnotherOrder' },
    "7": { name: 'Cancelled' }
  }
  // @ViewChild('cardnumber', { static: false }) cardnumber: ElementRef;
  buffer = '';
  paymenttypeid = 1;
  isuppercase: boolean = false;
  loginfo: any;
  show = 1;
  receivedorders: any = [];
  vendorreceivedorderproduct: any = [];
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    let data = this.buffer || '';
    if (event.key !== 'Enter' && event.key !== 'Shift') { // barcode ends with enter -key
      if (this.isuppercase) {
        data += event.key.toUpperCase();
        this.isuppercase = false;
      } else {
        data += event.key;
      }
      this.buffer = data;
    } else if (event.key === 'Shift') {
      this.isuppercase = true;
    } else {
      this.buffer = '';
      this.setproductbybarcode(data);
    }
    // console.log(event)
  }
  scrollContainer: any;
  products: any = [];
  vendors: any = [];
  filteredvalues = [];
  barcValue: string = '';
  cartitems: any = [];
  subtotal = 0;
  searchTerm = '';
  tax = 0;
  discount = 0;
  isVisible = false;
  batchno = 0;
  OrderNo = 0;
  orderId = 0;
  userId = 0;
  visible = false
  vendororders: any = [];
  tableData = [
    {
      "key": "1",
      "actionName": "New Users",
      "progress": { "value": 60, "color": "bg-success" },
      "value": "+3,125"
    },
    {
      "key": "2",
      "actionName": "New Reports",
      "progress": { "value": 15, "color": "bg-orange" },
      "value": "+643"
    },
    {
      "key": "3",
      "actionName": "Quote Submits",
      "progress": { "value": 25, "color": "bg-primary" },
      "value": "+982"
    }
  ]
  temporaryItem: any = { DiscAmount: 0, Quantity: null, DiscPercent: 0, rQuantity: null };
  barcodeItem = { quantity: null, tax: 0, amount: 0, price: null, Tax1: 0, Tax2: 0 };
  barcodemode: boolean = false;
  customerdetails = { data_state: '', name: '', PhoneNo: '', email: '', address: '', companyId: 0 }
  customers: any = [];
  // quantityfc = new FormControl('', [Validators.required, Validators.min(1)]);
  // page = 1
  // pageSize = 4
  // collectionSize = this.vendororders.length

  // get countries(): Country[] {
  //   return COUNTRIES.map((country, i) => ({ id: i + 1, ...country })).slice(
  //     (this.page - 1) * this.pageSize,
  //     (this.page - 1) * this.pageSize + this.pageSize,
  //   )
  // }

  constructor(
    private modalService: NgbModal,
    private Auth: AuthService,
    private notification: NzNotificationService,
    private sync: SyncService
  ) { }
  // getErrorMessage() {
  //   if (this.quantityfc.hasError('required')) {
  //     return "Quantity can't be Empty";
  //   }

  //   return this.quantityfc.hasError('min') ? 'Quantity should be greater than 0' : '';
  // }

  ngOnInit(): void {
    this.Auth.getloginfo().subscribe(data => {
      this.loginfo = data
      this.sync.sync()
      this.order = new OrderModule(1)
      this.products = [];
      this.getBarcodeProduct();
      // this.getcustomers();
      this.getVendorList();
      this.getvendororders();
      this.getreceivedorders();
      // this.getvendororderproduct()
      // this.products = JSON.parse(localStorage.getItem("Product"));
      this.products.forEach(product => {
        product.quantity = null;
        product.tax = 0;
        product.amount = 0;
      })
      this.customerdetails = { data_state: '', name: '', PhoneNo: '', email: '', address: '', companyId: this.loginfo.companyId }
    })

  }
  getBarcodeProduct() {
    this.Auth.getbarcodeproductdb().subscribe(data => {
      console.log(data)
      this.products = data
    })
  }
  getVendorList() {
    this.Auth.getvendors(this.loginfo.companyId).subscribe(data => {
      this.vendors = data;
      console.log(this.vendors)
    })
  }
  setproductbybarcode(code) {
    // console.log(code, this.products.filter(x => x.Product == code));
    // var product = this.products.filter(x => x.Product == code)[0];
    // if (product) {
    //   this.temporaryItem = product;
    //   this.temporaryItem.quantity = null;
    //   this.temporaryItem.amount = this.temporaryItem.price * this.temporaryItem.quantity
    //   this.temporaryItem.tax = (this.temporaryItem.Tax1 + this.temporaryItem.Tax2) * this.temporaryItem.amount / 100
    //   this.temporaryItem.amount = +this.temporaryItem.amount.toFixed(2)
    //   // this.temporaryItem.totalprice = +(this.temporaryItem.price * this.temporaryItem.quantity).toFixed(2)
    //   if (this.cartitems.some(x => x.Id == this.temporaryItem["Id"])) {
    //     this.cartitems.filter(x => x.Id == this.temporaryItem["Id"])[0].quantity += this.temporaryItem.quantity
    //   } else {
    //     this.cartitems.push(Object.assign({}, this.temporaryItem));
    //   }
    //   this.calculate();
    //   this.temporaryItem = { Id: 0, quantity: null, taxpercent: 0, tax: 0, amount: 0, price: null, Tax1: 0, Tax2: 0, barcode_Id: 0, disc: 0, product: "" };
    //   8901803000179
    // }
  }
  // getcustomers() {
  //   this.Auth.getcustomers().subscribe(data => {
  //     this.customers = data
  //   })
  // }
  savedata() {
    if (this.customerdetails.data_state == 'new') {
      this.addcustomer();
    } else if (this.customerdetails.data_state == 'old') {
      this.updatecustomer();
    }
  }
  updatecustomer() {
    this.Auth.updateCustomer(this.customerdetails).subscribe(data => {
      console.log(data);
      this.notification.success("Customer Updated!", `${this.customerdetails.name} updated successfully.`)
    }, error => {
      console.log(error)
    }, () => {
      // this.getcustomers();
    })
  }
  addcustomer() {
    this.Auth.addCustomer(this.customerdetails).subscribe(data => {
      console.log(data);
      this.notification.success("Customer Added!", `${this.customerdetails.name} added successfully.`)
      this.customerdetails.data_state = 'old'
    }, error => {
      console.log(error)
    }, () => {
      // this.getcustomers();
    })
  }
  ngAfterViewInit() {
    // this.scrollContainer = this.scrollFrame.nativeElement;
    // console.log(this.scrollContainer, this.scrollFrame)
    // Add a new item every 2 seconds for demo purposes
    // setInterval(() => {
    //   this.cartitems.push({});
    // }, 2000);
    // this.cardnumber.nativeElement.inputmask({"mask":"9999-9999-9999-9999"})
  }
  // getCustomer() {

  // }
  private async getCustomer() {
    // Sleep thread for 3 seconds
    console.log(this.customerdetails.PhoneNo)
    console.log(this.customers)
    this.customerdetails.data_state = 'loading'
    // await this.delay(3000);

    if (this.customers.some(x => x.PhoneNo == this.customerdetails.PhoneNo)) {
      var obj = this.customers.filter(x => x.PhoneNo == this.customerdetails.PhoneNo)[0]
      Object.keys(obj).forEach(element => {
        this.customerdetails[element] = obj[element]
      });
      this.customerdetails.data_state = 'old'
    } else {
      this.customerdetails.data_state = 'new'
    }
  }
  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  // scrollToBottom(): void {
  //   var el = document.getElementsByClassName('ant-table-body')[0]
  //   console.log(el.scrollHeight)
  //   // this.scrollContainer = this.scrollFrame.nativeElement;
  //   // console.log(this.scrollContainer, this.scrollFrame)
  //   el.scroll({
  //     top: el.scrollHeight + 1000,
  //     left: 0,
  //     behavior: 'smooth'
  //   });
  // }
  submitted: boolean = false;
  addItem() {
    this.submitted = true;
    if (this.validation()) {
      console.log(this.temporaryItem)
      if (this.order.Items.some(x => x.BarcodeId == this.temporaryItem["barcodeId"] && x.Price == this.temporaryItem["price"])) {
        this.order.Items.filter(x => x.BarcodeId == this.temporaryItem["barcodeId"] && x.Price == this.temporaryItem["price"])[0].OrderQuantity += this.temporaryItem.Quantity
        this.order.setbillamount()
      } else {
        this.order.addproduct(this.temporaryItem)
      }
      this.temporaryItem = { DiscAmount: 0, Quantity: null, DiscPercent: 0 };
      this.productinput['nativeElement'].focus()
      this.model = "";
      this.model1 = "";
      this.model2 = "";
      this.model3 = "";
      this.model4 = "";
      this.model5 = "";


      this.filteredvalues = [];
      this.submitted = false;
      console.log(this.order)

      return
      // this.cartitems.push(Object.assign({}, this.temporaryItem));
      // console.log(this.cartitems)
      // this.calculate();
      // this.temporaryItem.quantity = null;
      // this.temporaryItem.price = null;
      // this.temporaryItem.disc = null;
      // this.temporaryItem = { Id: 0, quantity: null, taxpercent: null, tax: 0, amount: 0, price: null, Tax1: 0, Tax2: 0, barcode_Id: 0, disc: 0, product: "", };
      // console.log(this.productinput)
      // this.productinput['nativeElement'].focus()
      // this.model = "";
      // this.filteredvalues = [];
      // this.submitted = false;
    }
  }
  addReceiveItem() {
    console.log("46654515")
    this.submitted = true;
    this.temporaryItem.Quantity = this.temporaryItem.rQuantity
    console.log(this.temporaryItem)
    if (this.validation()) {
      this.temporaryItem.Quantity = 0
      console.log(this.temporaryItem)
      if (this.order.Items.some(x => x.BarcodeId == this.temporaryItem["barcodeId"] && x.Price == this.temporaryItem["price"])) {
        // this.order.Items.filter(x => x.BarcodeId == this.temporaryItem["barcodeId"] && x.Price == this.temporaryItem["price"])[0].OrderQuantity += this.temporaryItem.rQuantity
        this.order.Items.filter(x => x.BarcodeId == this.temporaryItem["barcodeId"] && x.Price == this.temporaryItem["price"])[0].ReceivedQuantity += this.temporaryItem.rQuantity
        this.order.setreceivedbillamount()
      } else {
        this.order.raddproduct(this.temporaryItem)
      }
      this.temporaryItem = { DiscAmount: 0, Quantity: null, DiscPercent: 0, rQuantity: null };
      this.rproductinput['nativeElement'].focus()
      this.model = "";
      this.model1 = "";
      this.model2 = "";
      this.model3 = "";
      this.model4 = "";
      this.model5 = "";
      this.filteredvalues = [];
      this.submitted = false;
      console.log(this.order)

      return
      // this.cartitems.push(Object.assign({}, this.temporaryItem));
      // console.log(this.cartitems)
      // this.calculate();
      // this.temporaryItem.quantity = null;
      // this.temporaryItem.price = null;
      // this.temporaryItem.disc = null;
      // this.temporaryItem = { Id: 0, quantity: null, taxpercent: null, tax: 0, amount: 0, price: null, Tax1: 0, Tax2: 0, barcode_Id: 0, disc: 0, product: "", };
      // console.log(this.productinput)
      // this.productinput['nativeElement'].focus()
      // this.model = "";
      // this.filteredvalues = [];
      // this.submitted = false;
    }
  }

  addupdateReceivedItem() {
    console.log("46654515")
    this.submitted = true;
    this.temporaryItem.Quantity = this.temporaryItem.rQuantity
    console.log(this.temporaryItem)
    if (this.validation()) {
      this.temporaryItem.Quantity = 0
      console.log(this.temporaryItem)
      if (this.order.Items.some(x => x.BarcodeId == this.temporaryItem["barcodeId"] && x.Price == this.temporaryItem["price"])) {
        // this.order.Items.filter(x => x.BarcodeId == this.temporaryItem["barcodeId"] && x.Price == this.temporaryItem["price"])[0].OrderQuantity += this.temporaryItem.rQuantity
        this.order.Items.filter(x => x.BarcodeId == this.temporaryItem["barcodeId"] && x.Price == this.temporaryItem["price"])[0].ReceivedQuantity += this.temporaryItem.rQuantity
        this.order.setupdatedreceivedbillamount()
      } else {
        this.order.rdaddproduct(this.temporaryItem)
      }
      this.temporaryItem = { DiscAmount: 0, Quantity: null, DiscPercent: 0, rQuantity: null };
      this.rdproductinput['nativeElement'].focus()
      this.model = "";
      this.model1 = "";
      this.model2 = "";
      this.model3 = "";
      this.model4 = "";
      this.model5 = "";
      this.filteredvalues = [];
      this.submitted = false;
      console.log(this.order)

      return
      // this.cartitems.push(Object.assign({}, this.temporaryItem));
      // console.log(this.cartitems)
      // this.calculate();
      // this.temporaryItem.quantity = null;
      // this.temporaryItem.price = null;
      // this.temporaryItem.disc = null;
      // this.temporaryItem = { Id: 0, quantity: null, taxpercent: null, tax: 0, amount: 0, price: null, Tax1: 0, Tax2: 0, barcode_Id: 0, disc: 0, product: "", };
      // console.log(this.productinput)
      // this.productinput['nativeElement'].focus()
      // this.model = "";
      // this.filteredvalues = [];
      // this.submitted = false;
    }
  }
  // getcustomerdetails(compid) {
  //   this.Auth.getcustomers().subscribe(data => {
  //     console.log(compid)
  //   })
  // }
  barcodereaded(event) {
    console.log(event)
    console.log(event.element.nativeElement.id)
    var product = this.products.filter(x => x.Id == +event.element.nativeElement.id)[0]
    this.inputValue = product.Product;
    this.barcodeItem = product;
    this.barcodeItem.quantity = 1;
    if (this.cartitems.some(x => x.Id == this.barcodeItem["Id"])) {
      this.cartitems.filter(x => x.Id == this.barcodeItem["Id"])[0].quantity += this.barcodeItem.quantity
    } else {
      this.cartitems.push(Object.assign({}, this.barcodeItem));
    }
    this.calculate();
    this.barcodeItem = { quantity: null, tax: 0, amount: 0, price: null, Tax1: 0, Tax2: 0 };
    this.barcValue = ''
  }
  delete(index) {
    this.order.Items.splice(index, 1);
    this.order.setbillamount();
  }
  settotalprice(i, qty) {
    this.cartitems[i].amount = this.cartitems[i].Price * this.cartitems[i].Quantity;
    this.cartitems[i].tax = this.cartitems[i].amount * (this.cartitems[i].Tax1 + this.cartitems[i].Tax2) / 100;
    console.log(i, this.cartitems[i].Price, this.cartitems[i].Quantity, this.cartitems[i].amount, qty)
    this.cartitems[i].amount = +this.cartitems[i].amount.toFixed(2)
    this.calculate();
  }
  calculate() {
    this.subtotal = 0;
    this.tax = 0;
    this.discount = 0
    this.cartitems.forEach(item => {
      console.log(item)
      item.amount = item.price * item.quantity
      item.tax = (item.taxpercent) * item.amount / 100
      item.amount = (+item.amount.toFixed(2)) - item.disc
      this.subtotal += item.price * item.quantity
      this.tax += item.tax
      this.discount += item.disc
    })
    this.subtotal = +this.subtotal.toFixed(2)
    this.tax = +this.tax.toFixed(2)
    this.discount = +this.discount.toFixed(2)
    // console.log(this.tax)
  }
  date = new Date();
  onChange(e) {
    console.log(e, moment(e), this.date)
  }
  showModal(): void {
    this.isVisible = true
  }

  handleOk(): void {
    console.log('Button ok clicked!')
    this.isVisible = false
  }

  handleCancel(): void {
    console.log('Button cancel clicked!')
    this.isVisible = false
  }
  openCustomClass(content) {
    this.modalService.open(content, { centered: true })
  }
  opensplit(content) {
    this.modalService.open(content, { centered: true })
  }
  //////////////////////////////////////////rough////////////////////////////////////////////////////////
  selectedItem(item) {
    console.log(item, Object.assign({}, this.temporaryItem))
    Object.keys(item).forEach(key => {
      this.temporaryItem[key] = item[key]
    })
    console.log(this.temporaryItem)
    this.quantityel['nativeElement'].focus()
    this.rquantityel['nativeElement'].focus()
    this.rdquantityel['nativeElement'].focus()

  }
  selectedvendoritem(item) {
    console.log(item);
    this.order.SuppliedById = item.id
  }
  productbybarcode = [];
  barcode = '';
  searchbybarcode() {
    this.productbybarcode = this.products.filter(x => x.barCode == this.barcode)[0];
    console.log(this.barcode, this.productbybarcode, this.products)
    this.model = this.productbybarcode["product"]
  }
  validation() {
    var isvalid = true;
    if (!this.temporaryItem.productId) {
      isvalid = false
      console.log('temporaryItem.productId')
    };
    if (this.temporaryItem.Quantity <= 0) {
      isvalid = false
      console.log('temporaryItem.Quantity')
    };
    if (this.temporaryItem.price <= 0) {
      isvalid = false
      console.log('temporaryItem.price')
    };
    return isvalid;
  }
  VendorsValidation() {
    var isvalid = true;
    if (!this.order.SuppliedById) isvalid = false;
    return isvalid;
  }
  vendorsubmitted: boolean = false;
  savePurchase() {
    this.vendorsubmitted = true;
    this.order.BillDate = moment().format('YYYY-MM-DD HH:MM A')
    this.order.CreatedDate = moment().format('YYYY-MM-DD HH:MM A')
    this.order.BillDateTime = moment().format('YYYY-MM-DD HH:MM A')
    this.order.OrderedDate = moment().format('YYYY-MM-DD HH:MM A')
    this.order.OrderedDateTime = moment().format('YYYY-MM-DD HH:MM A')
    this.order.DeliveryDateTime = moment().format('YYYY-MM-DD HH:MM A')
    this.order.ModifiedDate = moment().format('YYYY-MM-DD HH:MM A')
    this.order.CompanyId = this.loginfo.companyId
    this.order.StoreId = this.loginfo.storeId
    this.order.OrderedById = 18;
    this.order.ProdStatus = "1";
    this.order.WipStatus = "1"
    this.order.ReceiveStatus = 1
    this.order.OrderNo = this.OrderNo;
    if (this.VendorsValidation()) {
      // if (navigator.onLine) {
      //   this.Auth.savepurchase(this.order).subscribe(data => {
      //     console.log(data)
      //     this.vendorsubmitted = false;
      //     this.OrderNo = data["lastorderno"]++
      //     var stockbatchdata = {}
      //     stockbatchdata["batches"] = data["batches"]
      //     stockbatchdata["stockBatches"] = data["stockBatches"]
      //     this.order = new OrderModule(1);
      //     this.notification.success("Purchased successfully!", `Purchased successfully.`)
      //   })
      // } else {

      var products = []
      this.order.Items.forEach(item => {
        var obj = {
          "product": item.ProductName,
          "barcodeId": item.BarcodeId,
          "productId": item.ProductId,
          "barCode": item.Barcode,
          "price": item.Price,
          "tax1": item.Tax1,
          "tax2": item.Tax2,
          "tax3": item.Tax3,
          "isInclusive": item.IsInclusive,
          "stockBatchId": 0,
          "quantity": item.OrderQuantity,

          "createdDate": moment().format('DD-MM-YYYY HH:MM:SS A')
        }
        products.push(obj)
      })
      console.log(this.order.Id)
      if (!this.order.Id) {
        this.Auth.saveorderdb(this.order).subscribe(data1 => {
          console.log(data1)
          this.sync.sync();
          this.vendorsubmitted = false;
          // this.OrderNo = data["lastorderno"]++
          var stockbatchdata = {}
          // stockbatchdata["batches"] = data["batches"]
          // stockbatchdata["stockBatches"] = data["stockBatches"]
          this.order = new OrderModule(1);
          this.notification.success("Purchased successfully!", `Purchased successfully.`)
          // this.Auth.saveStockbatch(data1["stockBatches"]).subscribe(sbdt => {
          //   this.getvendororders();
          //   this.getreceivedorders();
          //   this.back()
          // })
          this.show = 1;
          this.getvendororders();
        })
      } else {
        this.Auth.updatePurchase(this.order).subscribe(data2 => {
          this.order = new OrderModule(1);
          this.notification.success("Purchase Updated successfully!", `Purchase Updated successfully.`)
          // this.Auth.saveStockbatch(data2["stockBatches"]).subscribe(sbdt => {
          //   this.getvendororders();
          //   this.getreceivedorders();
          //   this.back()
          // })
          this.show = 1;

          console.log(data2)
        })
      }
      // }
    }

  }

  saveReceivePurchase() {
    this.vendorsubmitted = true;
    this.order.BillDate = moment().format('YYYY-MM-DD HH:MM A')
    this.order.CreatedDate = moment().format('YYYY-MM-DD HH:MM A')
    this.order.BillDateTime = moment().format('YYYY-MM-DD HH:MM A')
    this.order.OrderedDate = moment().format('YYYY-MM-DD HH:MM A')
    this.order.OrderedDateTime = moment().format('YYYY-MM-DD HH:MM A')
    this.order.DeliveryDateTime = moment().format('YYYY-MM-DD HH:MM A')
    this.order.ModifiedDate = moment().format('YYYY-MM-DD HH:MM A')
    this.order.CompanyId = this.loginfo.companyId
    this.order.StoreId = this.loginfo.storeId
    this.order.OrderedById = 18;
    this.order.ProdStatus = "1";
    this.order.WipStatus = "1";
    this.order.OrderNo = this.OrderNo;
    if (this.VendorsValidation()) {
      // if (navigator.onLine) {
      //   this.Auth.savepurchase(this.order).subscribe(data => {
      //     console.log(data)
      //     this.vendorsubmitted = false;
      //     this.OrderNo = data["lastorderno"]++
      //     var stockbatchdata = {}
      //     stockbatchdata["batches"] = data["batches"]
      //     stockbatchdata["stockBatches"] = data["stockBatches"]
      //     this.order = new OrderModule(1);
      //     this.notification.success("Purchased successfully!", `Purchased successfully.`)
      //   })
      // } else {

      var products = []
      this.order.Items.forEach(item => {
        var obj = {
          "product": item.ProductName,
          "barcodeId": item.BarcodeId,
          "productId": item.ProductId,
          "barCode": item.Barcode,
          "price": item.Price,
          "tax1": item.Tax1,
          "tax2": item.Tax2,
          "tax3": item.Tax3,
          "isInclusive": item.IsInclusive,
          "stockBatchId": 0,
          "quantity": item.OrderQuantity,

          "createdDate": moment().format('DD-MM-YYYY HH:MM:SS A')
        }
        products.push(obj)
      })
      console.log(this.order.Id)
      if (!this.order.Id) {
        this.Auth.saveorderdb(this.order).subscribe(data => {
          this.Auth.directreceivedpurchase(this.orderId, this.order.OrderedById, this.order).subscribe(data1 => {
            console.log(data1)
            this.vendorsubmitted = false;
            var stockbatchdata = {}
            this.order = null;
            this.notification.success("Received successfully!", `Received successfully.`)
            this.Auth.saveStockbatch(data1["stockBatches"]).subscribe(sbdt => {
              this.getvendororders();
              this.getreceivedorders();
              this.back()
            })
          })
        })
      } else {
        this.Auth.updatereceivedItem(this.orderId, this.order.OrderedById, this.order).subscribe(data => {
          this.order = null;
          this.Auth.saveStockbatch(data["stockBatches"]).subscribe(sbdt => {
            this.getvendororders();
            this.getreceivedorders();
            this.notification.success("Received successfull!", `Received successfully.`)
            this.back()
          })
        })
      }
    }

  }
  updateReceivedOrder() {
    this.Auth.updatereceivedPurchase(this.orderId, this.order.OrderedById, this.order).subscribe(data => {
      this.order = new OrderModule(1);
      this.notification.success("Updated Received successfull!", `Updated Received successfully.`)
      this.Auth.saveStockbatch(data["stockBatches"]).subscribe(sbdt => {
        this.getvendororders();
        this.getreceivedorders();
        this.back()
      })
      // console.log(data)
      // this.show = 1;
      // this.getreceivedorders();
    })
  }
  orderid = 0
  billid = 0
  productid = 0
  orderstatus = 0
  receivestatus = 0 //[(ngModel)] = "orderid"
  numofrecords = 100
  cancelstatus = 0
  getvendororders() {
    this.Auth.getvendororders(this.loginfo.companyId, this.loginfo.storeId, 
      this.vendorid, this.orderid, this.billid, this.productid, this.orderstatus, this.receivestatus,this.numofrecords,this.cancelstatus).subscribe(data => {
      this.vendororders = data["order"];
      console.log(this.vendororders)
      this.vendororders.forEach(order => {
        console.log(order.receiveStatus, this.status[order.receiveStatus.toString()]?.name)
        order.reStatus = this.status[order.receiveStatus.toString()]?.name
      });
      console.log(this.vendororders);
      this.close();
    })
  }
  getreceivedorders() {
    this.Auth.getreceivedorders(this.loginfo.companyId, this.loginfo.storeId).subscribe(data => {
      this.receivedorders = data["receivedOrder"];
      console.log(this.receivedorders);
    })
  }
  // getvendororderproduct() {
  //   this.Auth.getvendororderproduct(this.orderId).subscribe(data => {
  //     console.log(data);
  //   })
  // }
  currentorderdetails
  editpurchase(orderId) {
    console.log(orderId)
    this.order = new OrderModule(1)
    var order = this.vendororders.filter(x => x.id == orderId)[0]
    this.currentorderdetails = order
    this.model = this.vendors.filter(x => x.id == this.currentorderdetails.suppliedById)[0]
    for (var key in order) this.order[key.charAt(0).toUpperCase() + key.slice(1)] = order[key]
    this.order.Items = []
    this.orderId = orderId
    this.Auth.getvendororderproduct(this.orderId).subscribe(data => {
      // console.log(data);
      this.vendororderproduct = data["orderproduct"]
      this.show = 2;
      this.vendororderproduct.forEach(oi => {
        var obj = new OrderItemModule(oi)
        for (var key in oi) obj[key.charAt(0).toUpperCase() + key.slice(1)] = oi[key]
        this.order.Items.push(obj)
      });
      this.order.setbillamount()
    })
    console.log(this.currentorderdetails)
  }
  editReceivedPurchase(orderId) {
    console.log(orderId)
    this.order = new OrderModule(1)
    var order = this.vendororders.filter(x => x.id == orderId)[0]
    this.currentorderdetails = order
    console.log(this.vendororders, this.currentorderdetails)
    this.model = this.vendors.filter(x => x.id == this.currentorderdetails.suppliedById)[0]
    for (var key in order) this.order[key.charAt(0).toUpperCase() + key.slice(1)] = order[key]
    this.order.Items = []
    this.orderId = orderId
    this.Auth.getvendorreceivedorders(this.orderId).subscribe(data => {
      this.vendorreceivedorderproduct = data["receivedOrder"]
      console.log(data);
      this.show = 4;
      this.vendorreceivedorderproduct.forEach(oi => {
        var obj = new OrderItemModule(oi)
        for (var key in oi) obj[key.charAt(0).toUpperCase() + key.slice(1)] = oi[key]
        this.order.Items.push(obj)
      });
      this.order.setupdatedreceivedbillamount()

    })
  }

  receivepurchase(orderId) {
    console.log(orderId)
    this.order = new OrderModule(1)
    var order = this.vendororders.filter(x => x.id == orderId)[0]
    this.currentorderdetails = order
    for (var key in order) this.order[key.charAt(0).toUpperCase() + key.slice(1)] = order[key]
    this.order.Items = []
    this.orderId = orderId
    this.Auth.getvendororderproduct(this.orderId).subscribe(data => {
      // console.log(data);
      this.vendororderproduct = data["orderproduct"]
      this.show = 3;
      this.vendororderproduct.forEach(oi => {
        var obj = new OrderItemModule(oi)
        for (var key in oi) obj[key.charAt(0).toUpperCase() + key.slice(1)] = oi[key]
        this.order.Items.push(obj)
      });
      this.order.setreceivedbillamount()
    })
    console.log(this.currentorderdetails)
  }
  back() {
    this.temporaryItem = { DiscAmount: 0, Quantity: null, DiscPercent: 0 };
    this.productinput['nativeElement'].focus()
    this.model = "";
    this.model1 = "";
    this.model2 = "";
    this.model3 = "";
    this.model4 = "";
    this.model5 = "";


    this.filteredvalues = [];
    this.submitted = false;
    this.show = 1;
  }
  createorder() {
    this.order = new OrderModule(1)
    this.show = 2;
  }

  receiveorder() {
    this.order = new OrderModule(1)
    this.show = 3;
  }
  receivedorder1(orderId) {
    this.order = new OrderModule(1)
    this.show = 4;
  }
  open(): void {
    this.visible = true
  }

  close(): void {
    this.visible = false
  }

}