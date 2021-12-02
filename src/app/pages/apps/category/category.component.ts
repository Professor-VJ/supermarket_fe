import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  CompanyId:any;
  categories:any = [];
  term: string = '';
  loginfo: any;;
  constructor(private Auth: AuthService) { }

  ngOnInit(): void {
    this.Auth.getloginfo().subscribe(data => {
      this.loginfo = data
      this.getCategory();
    })
   
  }
  getCategory(){
    this.Auth.getcategories(this.loginfo.companyId, 'A').subscribe(data => {
      this.categories = data;
       this.filteredvalues = this.categories;
      console.log(this.categories)
    })
  }
  filteredvalues = [];
  filtersearch(): void {
    this.filteredvalues = this.term
      ? this.categories.filter(x => x.description.toLowerCase().includes(this.term.toLowerCase()))
      : this.categories;
    console.log(this.filteredvalues)
  }

}
