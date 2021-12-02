import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SyncService {
  cansaveorder = true
  pendingorders: any = []
  preorders: any = []
  constructor(private auth: AuthService) { }
  sync() {
    if (this.cansaveorder) {
      this.getorders()
      this.getpurchaseorder()
    }
  }
  //////////////////////SALE    
  getorders() {
    if (navigator.onLine) {
      if (this.pendingorders.length == 0) {
        this.cansaveorder = false
        this.auth.getorderdb(6).subscribe(data => {
          this.pendingorders = data
          if (this.pendingorders.length > 0)
            this.saveorders()
          else
            this.cansaveorder = true
        })
      } else {
        this.saveorders()
      }
    } else {
      setTimeout(() => {
        this.getorders()
      }, 30000);
    }
  }
  saveorders() {
    var order = this.pendingorders.shift()
    this.auth.saveorder(order).subscribe(data => {
      if (data["status"] == 200 || data["status"] == 409) {
        this.auth.deleteorderfromnedb(order._id, data["stockBatches"]).subscribe(ddata => { this.getorders() })
      } else {
        this.getorders()
      }
    }, error => {
      this.getorders()
    })
  }
  /////////////////////////////////////////// PURCHASE
  getpurchaseorder() {
    if (navigator.onLine) {
      if (this.pendingorders.length == 0) {
        this.cansaveorder = false
        this.auth.getorderdb(1).subscribe(data => {
          this.preorders = data
          console.log(this.preorders)
          if (this.preorders.length > 0)
            this.savepurchaseorder()
          else
            this.cansaveorder = true
        })
      } else {
        this.savepurchaseorder()
      }
    } else {
      setTimeout(() => {
        this.getpurchaseorder()
      }, 30000);
    }
  }
  savepurchaseorder() {
    var order = this.preorders.shift()
    console.log(order)
    if (order.OrderType == 1) {
      this.auth.savepurchase(order).subscribe(data => {
        if (data["status"] == 200) {
          this.auth.deleteorderfromnedb(order._id, data["stockBatches"]).subscribe(ddata => { 
            this.getpurchaseorder()
          })
          console.log(order.status)
        } else if (data["status"] == 409) {
          order.status = "D"
          this.auth.updatepurchaseorder(order).subscribe(ddata => { this.getpurchaseorder() })
        } else if (data["status"] == 500) {
          order.status = "E"
          order.error = data["error"]
          this.auth.updatepurchaseorder(order).subscribe(ddata => { this.getpurchaseorder() })
        }
      }, error => {
        order.status = "E"
        console.log(order.status)
        this.auth.updatepurchaseorder(order).subscribe(ddata => { this.getpurchaseorder() })
      })
    }
  }
}

