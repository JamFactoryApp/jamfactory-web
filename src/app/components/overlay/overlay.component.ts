import { Component, OnInit } from '@angular/core';
import {JamsessionStore} from '../../core/stores/jamsession.store';

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss']
})
export class OverlayComponent implements OnInit {

  constructor(private jamStore: JamsessionStore) { }

  public loading: boolean = true;

  ngOnInit(): void {
    this.jamStore.$jamSession.subscribe(res => {
      this.loading = false;
    })
  }

}
