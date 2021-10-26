import { Component, OnInit } from '@angular/core';
import {JamsessionHttpService} from '../../core/http/jamsession.http.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  constructor(private jam: JamsessionHttpService, private router: Router) { }

  ngOnInit(): void {
    this.jam.createJamSession().subscribe(res => {
      this.router.navigate([res.label]);
    }, error => {
      this.router.navigate(['/'], { queryParams: {error: error.message}});
    });
  }
}
