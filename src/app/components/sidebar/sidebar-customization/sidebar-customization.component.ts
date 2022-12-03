import {Component} from '@angular/core';
import {ViewStore} from "../../../core/stores/view.store";
import {LocalstorageService} from "../../../core/services/localstorage.service";
import {ColorService} from "../../../core/services/color.service";

@Component({
  selector: 'app-sidebar-customization',
  templateUrl: './sidebar-customization.component.html',
  styleUrls: ['./sidebar-customization.component.scss']
})
export class SidebarCustomizationComponent {

  constructor(
    public viewStore: ViewStore,
    private localstorageService: LocalstorageService,
    public colorService: ColorService
  ) {
  }

  resetViews() {
    setTimeout(() => this.viewStore.menuSub = '', 10);
  }

  changeTheme(type): void {
    setTimeout(() => {
      let color = '';
      switch (type) {
        case 0:
          color = '236, 154, 41'; //Orange
          break;
        case 1:
          color = '101, 155, 94'; //Green
          break;
        case 2:
          color = '81, 113, 165'; //Blue
          break;
      }
      this.localstorageService.setItem("MainColor", color);
      document.documentElement.style.setProperty('--dominant-color', color);
      this.colorService.getCurrentColor();
    }, 10);
  }
}
