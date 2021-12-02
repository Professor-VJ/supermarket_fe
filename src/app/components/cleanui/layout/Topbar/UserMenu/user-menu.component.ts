import { Component } from '@angular/core'
import { select, Store } from '@ngrx/store'
import * as UserActions from 'src/app/store/user/actions'
import * as Reducers from 'src/app/store/reducers'
import { ConstantsService } from "../../../../../services/constants/constants.service";
import { NzNotificationService } from 'ng-zorro-antd'
import { AuthService } from 'src/app/auth.service';


@Component({
  selector: 'cui-topbar-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
})
export class TopbarUserMenuComponent {
  badgeCount: number = 7
  name: string = ''
  role: string = ''
  email: string = ''
  phone: string = ''
  datasavetype: string = '1';
  loginfo = null

  constructor(private store: Store<any>, private globals: ConstantsService,
    private notification: NzNotificationService, private Auth: AuthService) {
    this.store.pipe(select(Reducers.getUser)).subscribe(state => {
      this.name = state.name
      this.role = state.role
      this.email = globals.email;
    })
    this.datasavetype = localStorage.getItem("datasavetype");
  }
  ngOnInit(): void {
    this.Auth.getloginfo().subscribe(data => {
      this.loginfo = data
    })
    // setInterval(() => {
    //   this.batchdate = new Date();
    // }, 15000);
  }


  badgeCountIncrease() {
    this.badgeCount = this.badgeCount + 1
  }

  logout() {
    this.store.dispatch(new UserActions.Logout())
  }

  sync() {
    this.Auth.syncdata().subscribe(data => {
      console.log(data)
      this.notification.success("Variant Added", "Successfully")
    })
  }
  syncdata(){
    this.Auth.getstoredata(this.loginfo.companyId, this.loginfo.storeId,1).subscribe(data1 => {
      console.log(data1)
      this.Auth.getstoredatadb(data1).subscribe(d => {
        this.notification.success("Synchronized Successfull", " Successfully Synchronized")
      })
    })
  }
}
