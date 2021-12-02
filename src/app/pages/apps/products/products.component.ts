import { Component, OnInit, } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap'
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  CompanyId: any;
  taxgroups: any;
  taxGroupId: number;
  producttypes: any;
  units: any;
  kotgroups: any;
  categories: any;
  masterproduct: any = [];
  product = { id: 0, name: "", description: "", category: "", tax: 0, price: 0 }
  isvisible: boolean;
  visible = false;
  checked: Boolean = true
  listOfSearchName: string[] = []
  listOfSearchAddress: string[] = []
  term: string = '';
  https = 0;
  // listOfData = orders
  // listOfDisplayData = [...this.listOfData]
  mapOfSort: { [key: string]: any } = {
    id: null,
    name: null,
    description: null,
    category: null,
    tax: null,
    price: null,
    quantity: null,
    status: null,
  }
  sortName: string | null = null
  sortValue: string | null = null
  loginfo: any;
  constructor(private modalService: NgbModal, private Auth: AuthService,) {
  }
  // listOfPosition: NzPlacementType[] = [
  //   'bottomLeft'
  // ]
  // contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
  //   this.nzContextMenuService.create($event, menu)
  // }

  // closeMenu(): void {
  //   this.nzContextMenuService.close()
  // }
  ngOnInit() {
    this.Auth.getloginfo().subscribe(data => {
      this.loginfo = data
      this.getMasterproduct();
      this.gettax();
      this.getproducttype();
      this.getUnits();
      this.getKotGroups();
      this.getCategories();
    })

  }
  open(): void {
    this.visible = true
  }

  close(): void {
    this.visible = false
  }
  sort(sortName: string, value: string): void {
    this.sortName = sortName
    this.sortValue = value
    for (const key in this.mapOfSort) {
      if (this.mapOfSort.hasOwnProperty(key)) {
        this.mapOfSort[key] = key === sortName ? value : null
      }
    }
  }
  getMasterproduct() {
    this.Auth.getMasterProduct(this.loginfo.companyId).subscribe(data => {
      this.masterproduct = data
      this.filteredvalues = this.masterproduct;
      console.log(this.masterproduct)
      this.https++;
      if (this.https == 6)
        this.setproducts();
    })
  }
  gettax() {
    this.Auth.getTax(this.loginfo.companyId).subscribe(data => {
      this.taxgroups = data;
      console.log(this.taxgroups);
      this.https++;
      if (this.https == 6)
        this.setproducts();
    });
  }
  getproducttype() {
    this.Auth.getProductType().subscribe(data => {
      this.producttypes = data;
      console.log(data);
      this.https++;
      if (this.https == 6)
        this.setproducts();
    })
  }
  getUnits() {
    this.Auth.getUnits().subscribe(data => {
      this.units = data;
      console.log(data);
      this.https++;
      if (this.https == 6)
        this.setproducts();
    })
  }
  getKotGroups() {
    this.Auth.getKotgroups().subscribe(data => {
      this.kotgroups = data;
      console.log(data);
      this.https++;
      if (this.https == 6)
        this.setproducts();
    })
  }
  getCategories() {
    this.Auth.getCategory(this.loginfo.companyId).subscribe(data => {
      this.categories = data;
      console.log(this.categories);
      this.https++;
      if (this.https == 6)
        this.setproducts();
    });
  }
  setproducts() {
    // this.masterproduct.forEach(prod => {
    //   prod.category = this.categories.filter(x => x.id == prod.categoryId)[0];
    //   prod.taxGroup = this.taxgroups.filter(x => x.id == prod.taxGroupId)[0];
    // });
    this.filteredvalues = this.masterproduct;
    console.log(this.masterproduct)
  }

  filteredvalues = [];
  filtersearch(): void {
    this.filteredvalues = this.term
      ? this.masterproduct.filter(x => x.name.toLowerCase().includes(this.term.toLowerCase()))
      : this.masterproduct;
    console.log(this.filteredvalues)
  }


}
