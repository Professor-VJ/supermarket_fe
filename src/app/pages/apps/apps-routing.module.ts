import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

// Apps
import { AppsMessagingComponent } from 'src/app/pages/apps/messaging/messaging.component'
import { AppsCalendarComponent } from 'src/app/pages/apps/calendar/calendar.component'
import { AppsProfileComponent } from 'src/app/pages/apps/profile/profile.component'
import { AppsGalleryComponent } from 'src/app/pages/apps/gallery/gallery.component'
import { AppsMailComponent } from 'src/app/pages/apps/mail/mail.component'
import { GithubExploreComponent } from 'src/app/pages/apps/github-explore/github-explore.component'
import { GithubDiscussComponent } from 'src/app/pages/apps/github-discuss/github-discuss.component'
import { JiraDashboardComponent } from 'src/app/pages/apps/jira-dashboard/jira-dashboard.component'
import { JiraAgileBoardComponent } from 'src/app/pages/apps/jira-agile-board/jira-agile-board.component'
import { TodoistListComponent } from 'src/app/pages/apps/todoist-list/todoist-list.component'
import { DigitaloceanDropletsComponent } from 'src/app/pages/apps/digitalocean-droplets/digitalocean-droplets.component'
import { DigitaloceanCreateComponent } from 'src/app/pages/apps/digitalocean-create/digitalocean-create.component'
import { GoogleAnalyticsComponent } from 'src/app/pages/apps/google-analytics/google-analytics.component'
import { HelpdeskDashboardComponent } from 'src/app/pages/apps/helpdesk-dashboard/helpdesk-dashboard.component'
import { WordpressPostComponent } from 'src/app/pages/apps/wordpress-post/wordpress-post.component'
import { WordpressPostsComponent } from 'src/app/pages/apps/wordpress-posts/wordpress-posts.component'
import { WordpressAddComponent } from 'src/app/pages/apps/wordpress-add/wordpress-add.component'
import { SaleComponent } from 'src/app/pages/apps/sale/sale.component'
import { SettingComponent } from 'src/app/pages/apps/setting/setting.component'
import { ReceiptComponent } from 'src/app/pages/apps/receipt/receipt.component'
import { CustomerComponent } from 'src/app/pages/apps/customer/customer.component'
import { AddproductComponent } from './addproduct/addproduct.component'
import { StockEntryComponent } from './stock-entry/stock-entry.component'
import { BatchEntryComponent } from './batch-entry/batch-entry.component'
import { ProductOptionsComponent } from './product-options/product-options.component'
import { InternalTransferComponent } from './internal-transfer/internal-transfer.component'
import { ProductsComponent } from './products/products.component'
import { CategoryComponent } from './category/category.component'
import { AddcategoryComponent } from './addcategory/addcategory.component'
import { PurchaseEntryComponent } from './purchase-entry/purchase-entry.component'
import { VendorsComponent } from './vendors/vendors.component'
import { TaxgroupComponent } from './taxgroup/taxgroup.component'






const routes: Routes = [
  {
    path: 'sale',
    component: SaleComponent,
    data: { title: 'Sales App' },
  },
  {
    path: 'products',
    component: ProductsComponent,
    data: { title: 'Product App' },
  },
  {
    path: 'category',
    component: CategoryComponent,
    data: { title: 'Category App' },
  },
  {
    path: 'setting',
    component: SettingComponent,
    data: { title: 'Setting App' },
  },
  {
    path: 'receipt',
    component: ReceiptComponent,
    data: { title: 'Receipt App' },
  },
  {
    path: 'customer',
    component: CustomerComponent,
    data: { title: 'Customer App' },
  },
  {
    path: 'addproduct/:id',
    component: AddproductComponent,
    data: { title: 'Addproduct App' },
  },
  {
    path: 'addcategory/:id',
    component: AddcategoryComponent,
    data: { title: 'Addcategory App' },
  },
  {
    path: 'batchentry',
    component: BatchEntryComponent,
    data: { title: 'BatchEntry App' },
  },
  {
    path: 'stockentry',
    component: StockEntryComponent,
    data: { title: 'StockEntry App' },
  },
  {
    path: 'internaltransfer',
    component: InternalTransferComponent,
    data: { title: 'InternalTransfer App' },
  },
  {
    path: 'productoptions',
    component: ProductOptionsComponent,
    data: { title: 'ProductOptions App' },
  },
  {
    path: 'purchaseentry',
    component: PurchaseEntryComponent,
    data: { title: 'PurchaseEntry App'},
  },
  {
    path: 'vendors',
    component: VendorsComponent,
    data: { title: 'Vendors App'},
  },
  {
    path: 'taxgroup',
    component: TaxgroupComponent,
    data: { title: 'TaxGroup App'},
  },
  {
    path: 'messaging',
    component: AppsMessagingComponent,
    data: { title: 'Messaging App' },
  },
  {
    path: 'calendar',
    component: AppsCalendarComponent,
    data: { title: 'Calendar App' },
  },
  {
    path: 'profile',
    component: AppsProfileComponent,
    data: { title: 'Profile App' },
  },
  {
    path: 'gallery',
    component: AppsGalleryComponent,
    data: { title: 'Gallery App' },
  },
  {
    path: 'mail',
    component: AppsMailComponent,
    data: { title: 'Mail App' },
  },
  {
    path: 'github-explore',
    component: GithubExploreComponent,
    data: { title: 'Github Explore' },
  },
  {
    path: 'github-discuss',
    component: GithubDiscussComponent,
    data: { title: 'Github Discuss' },
  },
  {
    path: 'jira-dashboard',
    component: JiraDashboardComponent,
    data: { title: 'Jira Dashboard' },
  },
  {
    path: 'jira-agile-board',
    component: JiraAgileBoardComponent,
    data: { title: 'Jira Agile Board' },
  },
  {
    path: 'todoist-list',
    component: TodoistListComponent,
    data: { title: 'Todoist List' },
  },
  {
    path: 'digitalocean-droplets',
    component: DigitaloceanDropletsComponent,
    data: { title: 'Digitalocean Droplets' },
  },
  {
    path: 'digitalocean-create',
    component: DigitaloceanCreateComponent,
    data: { title: 'Digitalocean Create' },
  },
  {
    path: 'google-analytics',
    component: GoogleAnalyticsComponent,
    data: { title: 'Google Analytics' },
  },
  {
    path: 'helpdesk-dashboard',
    component: HelpdeskDashboardComponent,
    data: { title: 'Helpdesk Dashboard' },
  },
  {
    path: 'wordpress-post',
    component: WordpressPostComponent,
    data: { title: 'Wordpress Post' },
  },
  {
    path: 'wordpress-posts',
    component: WordpressPostsComponent,
    data: { title: 'Wordpress Posts' },
  },
  {
    path: 'wordpress-add',
    component: WordpressAddComponent,
    data: { title: 'Wordpress Add' },
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [],
  exports: [RouterModule],
})
export class AppsRouterModule {}
