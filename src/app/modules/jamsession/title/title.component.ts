import { Component, OnInit } from '@angular/core';
import {JamsessionStore} from '../../../core/stores/jamsession.store';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss']
})
export class TitleComponent implements OnInit {

  constructor(public jamStore: JamsessionStore) { }

  ngOnInit(): void {
  }

}
