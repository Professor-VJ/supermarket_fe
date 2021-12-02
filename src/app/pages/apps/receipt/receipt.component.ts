import { Component, OnInit } from '@angular/core';
// const orders: any = require('./data.json')
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap'
import {
  NzPlacementType,
  NzContextMenuService,
  NzDropdownMenuComponent,
} from 'ng-zorro-antd/dropdown'
@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss']
})
export class ReceiptComponent implements OnInit {
  constructor(private modalService: NgbModal,private nzContextMenuService: NzContextMenuService) { }
  isvisible: boolean;
  visible = false;
  checked: Boolean = true
  listOfSearchName: string[] = []
  listOfSearchAddress: string[] = []
  // listOfData = orders
  // listOfDisplayData = [...this.listOfData]
  mapOfSort: { [key: string]: any } = {
    id: null,
    date: null,
    customer: null,
    total: null,
    tax: null,
    shipping: null,
    quantity: null,
    status: null,
  }
  sortName: string | null = null
  sortValue: string | null = null
  listOfPosition: NzPlacementType[] = [
    'bottomLeft'
  ]
  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
    this.nzContextMenuService.create($event, menu)
  }

  closeMenu(): void {
    this.nzContextMenuService.close()
  }
  ngOnInit() { }
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

}


