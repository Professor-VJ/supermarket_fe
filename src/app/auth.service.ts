import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { catchError } from 'rxjs/operators'
import { throwError } from 'rxjs'
// import { Http, Response, Headers, RequestOptions } from "@angular/http";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  base_url1 = 'https://localhost:44315/api/'
  base_url = 'http://biz1retail.azurewebsites.net/api/'
  server_ip = 'http://localhost'
  constructor(private http: HttpClient) {
    // this.sver_ip = localStorage.getItem('serverip');
    // gdfjhgfy
  }

  registration(payload) {
    return this.http.post(this.base_url + 'Login/Register', payload)
  }

  login(payload) {
    return this.http.post(this.base_url + 'Login/LoginCheck', payload)
  }
  // getcustomers(compid) {
  //   return this.http.get(this.base_url + 'Customer/GetCustomerList?CompanyId=' + compid)
  // }
  addCustomer(payload) {
    return this.http.post(this.base_url + 'Customer/addData', payload)
  }
  updateCustomer(payload) {
    return this.http.put(this.base_url + 'Customer/updateData', payload)
  }
  getusers(storeid, companyid) {
    return this.http.get(
      this.base_url + `Login/getstoreusers?storeId=${storeid}&companyId=${companyid}`,
    )
  }

  getproducts() {
    return this.http.get(`${this.server_ip}:8081/getproducts`)
  }
  getcustomers() {
    return this.http.get(`${this.server_ip}:8081/getcustomers`)
    // return this.http.get(this.server_ip + ':8081/getcustomers')
  }
  checkifserver(ip) {
    return this.http.get(`http://${ip}:8081/checkifserver`).pipe(
      catchError(err => {
        console.log('error caught in service')
        console.error(err)

        //Handle the error here

        return throwError(err) //Rethrow it back to component
      }),
    )
  }
  getclientlist(ip) {
    return this.http.get(`http://${ip}:8081/getclients`)
  }
  joinserver(ip) {
    return this.http.get(`http://${ip}:8081/join`)
  }
  getKotgroups() {
    return this.http.get(this.base_url + 'Product/getKotGroup')
  }
  getvariantgroups_l(CompanyId) {
    return this.http.get(this.base_url + 'Product/getvariantgroups?CompanyId=' + CompanyId)
  }
  getvariant_l(CompanyId) {
    return this.http.get(this.base_url + 'Product/getvariants?CompanyId=' + CompanyId)
  }
  addVariants_l(variant) {
    return this.http.post(this.base_url + 'Product/addvariant', variant)
  }

  addVariantGroups_l(variantgroup) {
    return this.http.post(this.base_url + 'Product/addvariantgroup', variantgroup)
  }
  updateVariantGroups_l(optiongroup) {
    return this.http.post(this.base_url + 'Product/updatevariantgroup', optiongroup)
  }
  updateVariant_l(option) {
    return this.http.post(this.base_url + 'Product/updatevariant', option)
  }
  // getProduct(CompanyId,StoreId){
  //   return this.http.get(this.base_url + 'Product/getProduct?CompanyId=1&StoreId=8' )
  // }
  getBarcodeProduct(CompanyId, storeid) {
    return this.http.get(
      this.base_url + `Product/getbarcodeproduct?CompanyId=${CompanyId}&storeid=${storeid}`,
    )
  }
  getbatchEntry(batches, userid) {
    return this.http.post(this.base_url + 'Product/batchEntry?userid=' + userid, batches)
  }
  getStockProduct(CompanyId, StoreId) {
    return this.http.get(
      this.base_url + `Product/getStockProduct?CompanyId=${CompanyId}&StoreId=${StoreId}`,
    )
  }
  getstockEntry(stockBatches) {
    return this.http.post(this.base_url + 'Product/stockEntry', stockBatches)
  }
  getMasterProduct(companyid) {
    // return this.http.get(this.server_ip + ':8081/getmasterproduct')
    return this.http.get(this.base_url + 'Product/getmasterproducts?CompanyId=' + companyid)
  }
  getproductbyid(id) {
    return this.http.get(this.base_url + 'Product/getproductbyid?ProductId=' + id)
  }
  addproduct_l(product, userid, storeid) {
    return this.http.post(
      this.base_url + 'Product/addProduct?userid=' + userid + '&storeid=' + storeid,
      product,
    )
  }
  updateproduct_l(product, userid) {
    return this.http.post(this.base_url + 'Product/updateProduct?userid=' + userid, product)
  }
  getcategories(companyid, type) {
    return this.http.get(
      this.base_url + `Category/getcategories?CompanyId=${companyid}&type=${type}`,
    )
  }
  addcategories(category) {
    return this.http.post(this.base_url + 'Category/addcategory', category)
  }
  updatecategory(category) {
    return this.http.post(this.base_url + 'Category/updatecategory', category)
  }
  getcategorybyid(id) {
    return this.http.get(this.base_url + 'Category/getcategorybyid?CategoryId=' + id)
  }
  getcategoryvariants(id) {
    return this.http.get(this.base_url + 'Product/getcategoryvariants?categoryid=' + id)
  }
  getvendors(compid) {
    return this.http.get(this.base_url + 'Vendor/getVendorList?CompanyId=' + compid)
  }
  addvendors(vendor) {
    return this.http.post(this.base_url + 'Vendor/addvendors', vendor)
  }
  updatevendors(vendor) {
    return this.http.post(this.base_url + 'Vendor/updatevendors', vendor)
  }
  getVendorListbyid(id) {
    return this.http.get(this.base_url + 'Vendor/getVendorListbyid?vendorid=' + id)
  }
  savepurchase(order) {
    return this.http.post(this.base_url + 'Purchase/Purchase', order)
  }
  saveorder(order) {
    return this.http.post(this.base_url + 'Sale/saveorder', order)
  }
  getstoredata(companyid, storeid, pricetype) {
    return this.http.get(
      this.base_url +
        `Login/getStoreData?CompanyId=${companyid}&storeid=${storeid}&pricetype=${pricetype}`,
    )
  }
  getTax_l(CompanyId) {
    return this.http.get(this.base_url + 'Product/getTaxgroup?CompanyId=' + CompanyId)
    // return this.http.get(this.server_ip + ':8081/gettaxgroup')
  }
  addtaxgroup(taxgroup) {
    return this.http.post(this.base_url + 'Product/addtaxgroup', taxgroup)
    // return this.http.get(this.server_ip + ':8081/gettaxgroup')
  }
  updatetaxgroup(taxgroup) {
    return this.http.post(this.base_url + 'Product/updatetaxgroup', taxgroup)
    // return this.http.get(this.server_ip + ':8081/gettaxgroup')
  }
  getvariants(CompanyId) {
    return this.http.get(this.base_url + 'Product/getvariants')
    // return this.http.get(this.server_ip + ':8081/masteroption')
  }
  addVariants(variant) {
    // return this.http.post(this.base_url + 'Product/addvariant',variant)
    return this.http.post(this.server_ip + ':8081/addmasteroption', variant)
  }
  getvariantgroups(CompanyId) {
    return this.http.get(this.base_url + 'Product/getvariantgroups')
    // return this.http.get(this.server_ip + ':8081/masteroptiongroup')
  }
  addVariantGroups(variantgroup) {
    return this.http.post(this.base_url + 'Product/addvariantgroup', variantgroup)
    // return this.http.post(this.server_ip + ':8081/addmasteroptiongroup', variantgroup)
  }
  updateVariant(variant) {
    return this.http.post(this.base_url + 'Product/updatevariant', variant)
    // return this.http.post(this.server_ip + ":8081/updatemasteroption", option)
  }
  updateVariantGroups(variantgroup) {
    return this.http.post(this.base_url + 'Product/updatevariantgroup', variantgroup)
    // return this.http.post(this.server_ip + ":8081/updatemasteroptiongroup", optiongroup)
  }

  updatepreference(preferences) {
    return this.http.post(this.base_url + 'Preference/updatepricetype', preferences)
  }
  getvendororders(
    companyid,
    storeid,
    vendorid,
    orderid,
    billid,
    productid,
    orderstatus,
    receivestatus,
    numofrecods,
    cancelstatus,
  ) {
    return this.http.get(
      this.base_url1 +
        `Purchase/getVendorOrders?companyid=${companyid}&storeid=${storeid}&vendorid=${vendorid}&orderid=${orderid}&billid=${billid}&productid=${productid}&orderstatus=${orderstatus}&receivestatus=${receivestatus}&numofrecods=${numofrecods}&cancelstatus=${cancelstatus}`,
    )
  }

  getvendororderproduct(orderId) {
    return this.http.get(this.base_url + `Purchase/getVendorOrderProduct?orderId=${orderId}`)
  }

  updatePurchase(order) {
    return this.http.post(this.base_url + 'Purchase/updatePurchase', order)
  }

  updatereceivedItem(orderid, userid, order) {
    return this.http.post(
      this.base_url + `Purchase/updatereceiveItem?orderid=${orderid}&userid=${userid}`,
      order.Items,
    )
  }
  directreceivedpurchase(orderid, userid, order) {
    return this.http.post(
      this.base_url + `Purchase/directReceiveItem?orderid=${orderid}&userid=${userid}`,
      order,
    )
  }
  getreceivedorders(companyid, storeid) {
    return this.http.get(
      this.base_url + `Purchase/getReceivedOrders?companyid=${companyid}&storeid=${storeid}`,
    )
  }
  getvendorreceivedorders(orderId) {
    return this.http.get(this.base_url + `Purchase/getVendorReceivedOrder?orderId=${orderId}`)
  }
  updatereceivedPurchase(orderid, userid, order) {
    return this.http.post(
      this.base_url + `Purchase/UpdateReceiveOrder?orderid=${orderid}&userid=${userid}`,
      order,
    )
  }

  ///////////////////////////////////////////////NEDB////////////////////////////////////////////////////////

  getTax(CompanyId) {
    // return this.http.get(this.base_url + 'Product/getTaxgroup?CompanyId=1')
    return this.http.get(this.server_ip + ':8081/gettaxgroup')
  }
  getProductType() {
    // return this.http.get(this.base_url + 'Product/getProductType')
    return this.http.get(this.server_ip + ':8081/getproducttype')
  }

  getUnits() {
    // return this.http.get(this.base_url + 'Product/getUnits')
    return this.http.get(this.server_ip + ':8081/getunit')
  }
  getCategory(CompanyId) {
    return this.http.get(this.server_ip + ':8081/getmastercategory')
  }
  addProduct(product) {
    return this.http.post(this.server_ip + ':8081/addmasterproduct', product)
  }
  addCustomerdb(customerdetails) {
    return this.http.post(this.server_ip + ':8081/addcustomer', customerdetails)
  }
  updateCustomerdb(customerdetails) {
    return this.http.post(this.server_ip + ':8081/updatecustomer', customerdetails)
  }

  updatevendorsdb(vendors) {
    return this.http.post(this.server_ip + ':8081/updatevendors', vendors)
  }
  updateProduct(product) {
    return this.http.post(this.server_ip + ':8081/updatemasterproduct', product)
  }
  updatemasteroption(option) {
    return this.http.post(this.server_ip + ':8081/updatemasteroption', option)
  }
  updateoptiongroupdb(variantgroup) {
    // return this.http.get(this.server_ip + ":8081/updatevariantgroup")
    return this.http.post(this.server_ip + ':8081/updatevariantgroup', variantgroup)
  }
  updateoptiondb(variant) {
    // return this.http.get(this.server_ip + ":8081/updatevariant")
    return this.http.post(this.server_ip + ':8081/updatevariant', variant)
  }
  updateproductdb() {
    return this.http.get(this.server_ip + ':8081/updatemasterproduct')
  }
  syncdata() {
    return this.http.get(this.server_ip + ':8081/syncdata')
  }
  saveorderdb(order) {
    return this.http.post(this.server_ip + ':8081/saveorderdb', { order: order })
  }
  getorderdb(typeid) {
    return this.http.get(this.server_ip + ':8081/getorders?typeid=' + typeid)
  }
  // getorders() {
  //   return this.http.get('http://localhost:8081/getorders')
  // }
  deleteorderfromnedb(orderid, stockBatches) {
    return this.http.post(this.server_ip + ':8081/deleteorder?_id=' + orderid, stockBatches)
  }
  // getpurchaseorders() {
  //   return this.http.get(this.server_ip + ':8081/getpurchaseorders')
  // }
  updatepurchaseorder(order) {
    return this.http.post(this.server_ip + ':8081/updatepurchaseorder', order)
  }
  getcustomerbyphone(phoneNo) {
    return this.http.get(this.server_ip + ':8081/getcustomerbyphone?phone=' + phoneNo)
  }
  getstoredatadb(storedata) {
    return this.http.post(this.server_ip + ':8081/setstoredata', storedata)
  }
  getvendorsdb() {
    return this.http.get(this.server_ip + ':8081/getvendors')
  }
  getbarcodeproductdb() {
    return this.http.get(this.server_ip + ':8081/getbarcodeproduct')
  }
  addbarcodeproductdb(data) {
    return this.http.post(this.server_ip + ':8081/addbarcodeproduct', data)
  }
  getloginfo() {
    return this.http.get(this.server_ip + ':8081/getloginfo')
  }
  updatetaxgroupdb(taxgroup) {
    return this.http.post(this.server_ip + ':8081/updatetaxgroup', taxgroup)
  }
  updatecategoriesdb(category) {
    return this.http.post(this.server_ip + ':8081/updatecategories', category)
  }
  batchproductdb(batchentry) {
    return this.http.post(this.server_ip + ':8081/batchproduct', batchentry)
  }

  getpreferencedb() {
    return this.http.get(this.server_ip + ':8081/getpreference')
  }
  updatepreferencedb(preferences) {
    return this.http.post(this.server_ip + ':8081/updatepreference', preferences)
  }
  saveStockbatch(stockBatches) {
    console.log(stockBatches)
    return this.http.post(this.server_ip + ':8081/saveStockBatch', stockBatches)
  }
}
