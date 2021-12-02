import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap'
import { AuthService } from 'src/app/auth.service';
// const orders: any = require('./data.json')

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {

  constructor(private modalService: NgbModal,  private Auth: AuthService) { }
  sortName: string | null = null
  sortValue: string | null = null
  mapOfSort: { [key: string]: any } = {address: "", city: "", email: "", id: 0, name: "", phoneNo: "", sync: 1}
  listOfSearchName: string[] = []
  listOfSearchAddress: string[] = []
  customers: any = [];
  customerdetails = {address: "", city: "", email: "", id: 0, name: "", phoneNo: "", sync: 1}
  // listOfData = orders
  listOfDisplayData = this.customers
  term: string = '';
  ngOnInit(): void {
    this.getcustomers();
  }
  getcustomers(){
    this.Auth.getcustomers().subscribe(data => {
      console.log(data)
      this.customers = data;
      this.filteredvalues = this.customers;
    })
  }
  sort(sortName: string, value: string): void {
    this.sortName = sortName
    this.sortValue = value
    for (const key in this.mapOfSort) {
      if (this.mapOfSort.hasOwnProperty(key)) {
        this.mapOfSort[key] = key === sortName ? value : null
      }
      this.search(this.listOfSearchName, this.listOfSearchAddress)
    }
  }
  search(listOfSearchName: string[], listOfSearchAddress: string[]): void {
    this.listOfSearchName = listOfSearchName
    this.listOfSearchAddress = listOfSearchAddress
    const filterFunc = item =>
      (this.listOfSearchAddress.length
        ? this.listOfSearchAddress.some(Address => item.Address.indexOf(Address) !== -1)
        : true) &&
      (this.listOfSearchName.length
        ? this.listOfSearchName.some(Name => item.Name.indexOf(Name) !== -1)
        : true)
    const listOfData = this.customers.filter(item => filterFunc(item))
    if (this.sortName !== null && this.sortValue !== null) {
      this.customers = listOfData.sort((a, b) =>
        this.sortValue === 'ascend'
          ? a[this.sortName] > b[this.sortName]
            ? 1
            : -1
          : b[this.sortName] > a[this.sortName]
          ? 1
          : -1,
      )
    } else {
      this.listOfDisplayData = listOfData
    }
  }
  setCustomer(customer, content){
    this.customerdetails = customer
    this.openCustomClass(content);
  }
  openCustomClass(content) {
    this.modalService.open(content, { centered: true })
  }
  filteredvalues:any = [];
  filtersearch(): void {
    console.log(this.term,this.filteredvalues)
    this.filteredvalues = this.term
      ? this.customers.filter(x => x.name&&x.name.toLowerCase().includes(this.term.toLowerCase()))
      : this.customers;
    console.log(this.filteredvalues)
  }
}
