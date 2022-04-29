import {Component, OnInit} from '@angular/core';
import {ViewStore} from "../../../core/stores/view.store";
import {PermissionsService} from "../../../core/services/permissions.service";
import {FormControl} from "@angular/forms";
import {JamSessionSetting} from "@jamfactoryapp/jamfactory-types";
import {JamsessionHttpService} from "../../../core/http/jamsession.http.service";
import {JamsessionStore} from "../../../core/stores/jamsession.store";
import {LocalstorageService} from "../../../core/services/localstorage.service";

@Component({
  selector: 'app-sidebar-options',
  templateUrl: './sidebar-options.component.html',
  styleUrls: ['./sidebar-options.component.scss']
})
export class SidebarOptionsComponent implements OnInit {

  public nameField = new FormControl('');
  public hasPassword = false;
  public passwordField = new FormControl('');

  constructor(
    public viewStore: ViewStore,
    public permissions: PermissionsService,
    private jamService: JamsessionHttpService,
    public jamStore: JamsessionStore,
    private localstorageService: LocalstorageService
  ) {
  }

  ngOnInit(): void {
    this.jamStore.$jamSession.subscribe(value => {
      if (value) {
        this.nameField.patchValue(value.name);
      }
    });

    const preview = this.localstorageService.getItem('PreviewSong');
    if (preview !== null) {
      this.viewStore.preview = (preview === 'true');
    } else {
      this.viewStore.preview = false;
    }
  }

  resetViews() {
    setTimeout(() => this.viewStore.menuSub = '', 10);
  }

  saveSettings(): void {
    const body: JamSessionSetting = {
      name: this.nameField.value
    };
    if (this.passwordField.value !== '') {
      body.password = this.passwordField.value;
    }
    this.jamService.putJamsession(body).subscribe(value => {
      this.jamStore.jamSession = value;
      if (this.passwordField.value !== '') {
        this.hasPassword = true;
      }
    });
  }

  toggleButton(): void {
    this.viewStore.preview = !this.viewStore.view.showPreview;
    this.localstorageService.setItem('PreviewSong', String(this.viewStore.view.showPreview));
  }
}
