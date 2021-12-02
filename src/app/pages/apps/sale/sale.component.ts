import { Component, OnInit, TemplateRef, ViewChild, ElementRef, HostListener } from '@angular/core';
import * as moment from 'moment'
import { FormControl, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal'
import { NgbModal, ModalDismissReasons,NgbModalConfig } from '@ng-bootstrap/ng-bootstrap'
import { AuthService } from 'src/app/auth.service';
import { NzNotificationService } from 'ng-zorro-antd'
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { OrderItemModule, OrderModule } from './sale.module';
import { SyncService } from 'src/app/services/sync/sync.service';


@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class SaleComponent implements OnInit {
  @ViewChild('quantityel', { static: false }) public quantityel: TemplateRef<any>;//productinput
  @ViewChild('discper', { static: false }) public discperel: TemplateRef<any>;
  @ViewChild('disc', { static: false }) public discel: TemplateRef<any>;
  @ViewChild('productautocomplete', { static: false }) public productinput: TemplateRef<any>;
  @ViewChild('scrollframe', { static: false }) scrollFrame: ElementRef;
  // @ViewChild('cardnumber', { static: false }) cardnumber: ElementRef;
  buffer = '';
  model: any = 'QWERTY'
  order: OrderModule
  paymenttypeid = 1;
  isuppercase: boolean = false;
  OrderNo = 0;
  loginfo: any;
  isDisable = false;
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
    console.log(this.isuppercase)
  }
  scrollContainer: any;
  products: any;
  groupedProducts = []
  filteredvalues = [];
  inputValue: string = '';
  barcValue: string = '';
  cartitems = [];
  subtotal = 0;
  searchTerm = '';
  tax = 0;
  isVisible = false
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
  // temporaryItem = { Id: 0, quantity: null, tax: 0, amount: 0, price: 0, Tax1: 0, Tax2: 0, barcodeId: 0 };
  temporaryItem: any = { DiscAmount: 0, Quantity: null, DiscPercent: 0 };
  barcodeItem = { quantity: null, tax: 0, amount: 0, price: 0, Tax1: 0, Tax2: 0 };
  barcodemode: boolean = false;
  customerdetails = { id: 0, name: '', phoneNo: '', email: '', address: '', companyId: 0, datastatus: '' }
  customers: any = [];
  // quantityfc = new FormControl('', [Validators.required, Validators.min(1)]);
  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term === '' ? []
        : this.groupedProducts.filter(v => (v.product.toLowerCase().indexOf(term.toLowerCase()) > -1 || v.barCode?.toLowerCase().indexOf(term.toLowerCase()) > -1) && v.quantity > 0).slice(0, 10))
    )

  formatter = (x: { product: string }) => x.product;
  constructor(
    private modalService: NgbModal,
    private Auth: AuthService,
    private notification: NzNotificationService,
    private sync: SyncService,
    config: NgbModalConfig,
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
   }
  // getErrorMessage() {
  //   if (this.quantityfc.hasError('required')) {
  //     return "Quantity can't be Empty";
  //   }

  //   return this.quantityfc.hasError('min') ? 'Quantity should be greater than 0' : '';
  // }
 
  ngOnInit(): void {
    this.Auth.getloginfo().subscribe(data => {
      this.loginfo = data
      this.order = new OrderModule(6)
      this.sync.sync()
      this.products = [];
      this.getproducts();
      this.getcustomers();
      this.temporaryItem.Quantity = null;
      // this.products = JSON.parse(localStorage.getItem("Product"));
      this.products.forEach(product => {
        product.Quantity = null;
        product.tax = 0;
        product.amount = 0;
      })
      this.customerdetails = { id: 0, name: '', phoneNo: '', email: '', address: '', companyId: this.loginfo.companyId, datastatus: '' }
    })


  }
  getproducts() {
    this.Auth.getproducts().subscribe(data => {
      this.products = data;
      console.log(this.products)
      this.products.forEach(prod => {
        prod.maxqty = prod.quantity
      });
      this.groupProduct()
    })
  }
  groupProduct() {
    // var res = this.products.reduce((groups, currentValue) => {
    //   if (groups.indexOf(currentValue.barcodeId) === -1) {
    //     groups.push(currentValue.barcodeId);
    //   }
    //   return groups;
    // }, []).map((barcodeId,createdDate,isInclusive,maxqty,product,productId,quantity,stockBatchId,tax1,tax2,tax3,barCode) => {
    //   return {
    //     barcodeId: barcodeId,
    //     createdDate:createdDate,
    //     isInclusive:isInclusive,
    //     maxqty:maxqty,
    //     product:product,
    //     productId:productId,
    //     quantity:quantity,
    //     stockBatchId:stockBatchId,
    //     tax1:tax1,
    //     tax2:tax2,
    //     tax3:tax3,
    //     barCode:barCode,
    //     price: this.products.filter((_el) => {
    //       return _el.barcodeId === barcodeId;
    //     }).map((_el) => { return _el.price; })
    //   }
    // });
    // console.log(res)
    var helper = {};
    this.groupedProducts = this.products.reduce((r, o) => {
      var key = o.barcodeId + '-'

      if (!helper[key]) {
        helper[key] = Object.assign({}, o); // create a copy of o
        r.push(helper[key]);
      }

      return r;
    }, []);

    console.log(this.groupedProducts);
  }
  setproductbybarcode(code) {
    // console.log(code, this.products.filter(x => x.Product == code));
    // var product = this.products.filter(x => x.Product == code)[0];
    // if (product) {
    //   this.temporaryItem = product;
    //   this.temporaryItem.Quantity = 1;
    //   // this.temporaryItem.amount = this.temporaryItem.price * this.temporaryItem.Quantity
    //   // this.temporaryItem.tax = (this.temporaryItem.Tax1 + this.temporaryItem.Tax2) * this.temporaryItem.amount / 100
    //   // this.temporaryItem.amount = +this.temporaryItem.amount.toFixed(2)
    //   // this.temporaryItem.totalprice = +(this.temporaryItem.price * this.temporaryItem.quantity).toFixed(2)
    //   if (this.order.Items.some(x => x.Id == this.temporaryItem["Id"])) {
    //     this.order.Items.filter(x => x.Id == this.temporaryItem["Id"])[0].OrderQuantity += this.temporaryItem.Quantity
    //   } else {
    //     this.order.Items.push(Object.assign({}, this.temporaryItem));
    //   }
    //   this.calculate();
    //  this.temporaryItem = { DiscAmount: 0, Quantity: null, DiscPercent: 0 };
    //   8901803000179
    // }
  }
  getcustomers() {
    this.Auth.getcustomers().subscribe(data => {
      this.customers = data
      console.log(data)
      // for(var key in this.order.CustomerDetails) {
      //   this.order.CustomerDetails[key] = this.customers[key.toLowerCase()]
      // // }
      // console.log(this.order.CustomerDetails)
    })

  }
  savedata() {
    // if (this.order.CustomerDetails.datastatus == 'new') {
    this.addcustomer();
    // } else if (this.order.CustomerDetails.datastatus == 'old') {
    //   this.updatecustomer();
    // }
  }
  updatecustomer() {
    Object.keys(this.order.CustomerDetails).forEach(key => {
      this.customerdetails[key.charAt(0).toLowerCase() + key.slice(1)] = this.order.CustomerDetails[key]
    });

    this.Auth.updateCustomerdb(this.customerdetails).subscribe(data => {
      // console.log(data);
      this.notification.success("Customer Updated!", `${this.order.CustomerDetails.Name} updated successfully.`)
    }, error => {
      // console.log(error)
    }, () => {
      this.getcustomers();
    })
  }
  addcustomer() {
    Object.keys(this.order.CustomerDetails).forEach(key => {
      this.customerdetails[key.charAt(0).toLowerCase() + key.slice(1)] = this.order.CustomerDetails[key]
    });
    this.Auth.addCustomerdb(this.customerdetails).subscribe(data => {
      // console.log(data);
      this.notification.success("Customer Added!", `${this.order.CustomerDetails.Name} added successfully.`)
      this.order.CustomerDetails.datastatus = 'old'
    }, error => {
      // console.log(error)
    }, () => {
      this.getcustomers();
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
    // console.log(this.order.CustomerDetails.phoneNo)
    // console.log(this.customers)
    this.order.CustomerDetails.datastatus = 'loading'
    // await this.delay(3000);
    // console.log(this.customers)
    if (this.customers.some(x => x.phoneNo == this.order.CustomerDetails.PhoneNo)) {
      var obj = this.customers.filter(x => x.phoneNo == this.order.CustomerDetails.PhoneNo)[0]
      console.log(obj)
      this.order.CustomerId = obj.id;
      // Object.keys(obj).forEach(element => {
      //   this.order.CustomerDetails[element] = obj[element]
      // });
      Object.keys(this.order.CustomerDetails).forEach(key => {
        this.order.CustomerDetails[key] = obj[key.charAt(0).toLowerCase() + key.slice(1)]
      });
      if (!this.order.CustomerDetails.Id) this.order.CustomerDetails.Id == 0
      console.log(this.order.CustomerDetails)
      this.order.CustomerDetails.datastatus = 'old'
    } else {
      this.order.CustomerDetails.datastatus = 'new'
    }
  }
  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  scrollToBottom(): void {
    var el = document.getElementsByClassName('ant-table-body')[0]
    // console.log(el.scrollHeight)
    // this.scrollContainer = this.scrollFrame.nativeElement;
    // console.log(this.scrollContainer, this.scrollFrame)
    el.scroll({
      top: el.scrollHeight + 1000,
      left: 0,
      behavior: 'smooth'
    });
  }

  filterAutoComplete() {
    this.filteredvalues = this.products.filter(x => x.product.toLowerCase().includes(this.inputValue));
  }
  fieldselect(event) {
    // console.log(event)
    // console.log(event.element.nativeElement.id)
    var product = this.products.filter(x => x.barcodeId == +event.element.nativeElement.id)[0]
    this.inputValue = product.product;
    // document.getElementById("productautocomplete").nodeValue = product.Product;
    this.temporaryItem = product;
  }
  // addItem() {
  //   this.temporaryItem.amount = this.temporaryItem.price * this.temporaryItem.quantity
  //   this.temporaryItem.tax = (this.temporaryItem.Tax1 + this.temporaryItem.Tax2) * this.temporaryItem.amount / 100
  //   this.temporaryItem.amount = +this.temporaryItem.amount.toFixed(2)
  //   // this.temporaryItem.totalprice = +(this.temporaryItem.price * this.temporaryItem.quantity).toFixed(2)
  //   if (this.cartitems.some(x => x.barcodeId == this.temporaryItem["barcodeId"])) {
  //     this.cartitems.filter(x => x.barcodeId == this.temporaryItem["barcodeId"])[0].quantity += this.temporaryItem.quantity
  //   } else {
  //     this.cartitems.push(Object.assign({}, this.temporaryItem));
  //   }
  //   this.calculate();
  //   this.inputValue = '';
  //   this.temporaryItem.quantity = null;
  //   this.temporaryItem = { Id: 0, quantity: null, tax: 0, amount: 0, price: 0, Tax1: 0, Tax2: 0,barcodeId: 0 };
  //   console.log(this.productinput)
  //   this.productinput['nativeElement'].focus()
  //   this.filteredvalues = [];
  //   this.scrollToBottom();
  // }
  submitted: boolean = false;
  addItem() {
    this.submitted = true;
    if (this.validation()) {
      if (this.order.Items.some(x => x.stockBatchId == this.temporaryItem["stockBatchId"])) {
        this.order.Items.filter(x => x.stockBatchId == this.temporaryItem["stockBatchId"])[0].OrderQuantity += this.temporaryItem.Quantity
        this.order.setbillamount()
      } else {
        this.order.addproduct(this.temporaryItem)
      }
      this.products.forEach(prod => {
        if (prod.stockBatchId == this.temporaryItem["stockBatchId"]) {
          prod.quantity -= this.temporaryItem.Quantity
         
        }
      });
      this.temporaryItem = { DiscAmount: 0, Quantity: null, DiscPercent: 0 };
      this.productinput['nativeElement'].focus()
      this.model = "";
      this.filteredvalues = [];
      this.submitted = false;
      // this.isDisable = true;
      // console.log(this.order)

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

  getcustomerdetails(compid) {
    this.Auth.getcustomers().subscribe(data => {
      console.log(compid)
    })
  }
  barcodereaded(event) {
    // console.log(event)
    // console.log(event.element.nativeElement.id)
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
    this.barcodeItem = { quantity: null, tax: 0, amount: 0, price: 0, Tax1: 0, Tax2: 0 };
    this.barcValue = ''
  }
  quantitychange(item: OrderItemModule, event) {
    var prod = this.products.filter(x => x.stockBatchId == item.stockBatchId)[0]
    console.log(item.OrderQuantity, prod.maxqty)
    if (item.OrderQuantity && item.OrderQuantity <= prod.maxqty) {
      console.log('%c GOOD! ', 'color: #bada55');
      this.products.filter(x => x.stockBatchId == item.stockBatchId)[0].quantity = prod.maxqty - item.OrderQuantity
      this.order.setbillamount()
    } else if (item.OrderQuantity == 0 || item.OrderQuantity == null) {
      event.preventDefault();
      console.log('%c VERY LOW! ', 'color: orange');
      item.OrderQuantity = 1
      this.products.filter(x => x.stockBatchId == item.stockBatchId)[0].quantity = prod.maxqty - 1
      this.order.setbillamount()
    } else {
      event.preventDefault();
      console.log('%c EXCEED! ', 'color: red');
      item.OrderQuantity = 1
      this.products.filter(x => x.stockBatchId == item.stockBatchId)[0].quantity = prod.maxqty - 1
      this.order.setbillamount()
    }
    console.log(item.OrderQuantity)
  }
  delete(index) {
    this.products.forEach(prod => {
      if (prod.stockBatchId == this.order.Items[index].stockBatchId) {
        prod.quantity += this.order.Items[index].OrderQuantity
      }
    });
    this.order.Items.splice(index, 1);
    this.order.setbillamount();
  }
  clearallorders() {
    this.order = new OrderModule(6)
  }
  settotalprice(i, qty) {
    this.cartitems[i].amount = this.cartitems[i].price * this.cartitems[i].quantity;
    this.cartitems[i].tax = this.cartitems[i].amount * (this.cartitems[i].Tax1 + this.cartitems[i].Tax2) / 100;
    // console.log(i, this.cartitems[i].price, this.cartitems[i].quantity, this.cartitems[i].amount, qty)
    this.cartitems[i].amount = +this.cartitems[i].amount.toFixed(2)
    this.calculate();
  }
  calculate() {
    this.subtotal = 0;
    this.tax = 0;
    this.cartitems.forEach(item => {
      // console.log(item)
      item.amount = item.price * item.quantity
      item.tax = (item.Tax1 + item.Tax2) * item.amount / 100
      item.amount = +item.amount.toFixed(2)
      this.subtotal += item.amount
      this.tax += item.tax
    })
    this.subtotal = +this.subtotal.toFixed(2)
    this.tax = +this.tax.toFixed(2)
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
    // console.log('Button ok clicked!')
    this.isVisible = false
  }

  handleCancel(): void {
    // console.log('Button cancel clicked!')
    this.isVisible = false
  }
  openCustomClass(content) {
    this.modalService.open(content, { centered: true })
  }
  opensplit(content) {
    this.modalService.open(content, { centered: true })
  }
  ////////////////////////////////////////dfgdfhsfhgj?//////////////////////////////////
  batchproduct: any = [];
  selectedItem(batchproduct, barcodeId) {
    this.batchproduct = this.products.filter(x => x.barcodeId == barcodeId);
    if(this.batchproduct.length > 1) {
      this.modalService.open(batchproduct, { centered: true })
    } else {
      this.selectedproduct(this.batchproduct[0])
    }
    this.quantityel['nativeElement'].focus()
    
  }
  selectedproduct(product) {
    console.log(product)
    Object.keys(product).forEach(key => {
      this.temporaryItem[key] = product[key]
    })
    this.modalService.dismissAll()
    // this.quantityel['nativeElement'].focus()
  }
  validation() {
    var isvalid = true;
    // if (!this.temporaryItem.productId) isvalid = false;
    if (this.temporaryItem.Quantity <= 0) isvalid = false;
    if (this.temporaryItem.Quantity > this.temporaryItem.quantity) isvalid = false;
    return isvalid;
  }
  saveOrder() {
    console.log(this.order.CustomerDetails);

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
    this.order.OrderNo = this.OrderNo;
    this.order.SuppliedById = 12;
    // if (!navigator.onLine) {
    //   this.Auth.savepurchase(this.order).subscribe(data => {
    //     console.log(data)
    //     this.OrderNo = data["lastorderno"]++
    //     var stockbatchdata = {}
    //     stockbatchdata["batches"] = data["batches"]
    //     stockbatchdata["stockBatches"] = data["stockBatches"]
    //     this.order = new OrderModule(1);
    //     this.notification.success("Purchased successfully!", `Purchased successfully.`)
    //   })
    // } 
    var products = []
    console.log(this.order.CustomerDetails)
    this.Auth.saveorderdb(this.order).subscribe(data1 => {
      // console.log(data1)
      this.sync.sync();
      // this.vendorsubmitted = false;
      // this.OrderNo = data1["lastorderno"]++
      var stockbatchdata = {}
      // stockbatchdata["batches"] = data1["batches"]
      // stockbatchdata["stockBatches"] = data1["stockBatches"]
      this.order = new OrderModule(6);
    })
    this.notification.success("Ordered Saved successfully!", `Ordered Saved successfully.`)
  }
  crossclick(){
    this.temporaryItem = { DiscAmount: 0, Quantity: null, DiscPercent: 0 };
    this.productinput['nativeElement'].focus()
    this.model = "";
    this.filteredvalues = [];
    this.submitted = false;
  }


}
