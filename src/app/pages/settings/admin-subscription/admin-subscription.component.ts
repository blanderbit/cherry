import {
    Component,
    ComponentFactoryResolver,
    ComponentRef,
    Inject, OnDestroy,
    OnInit,
    Optional,
    Type,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import { HEADER } from '../modules/company-settings/keys';
import { GridItemsComponent } from 'grid';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'notifier';
import { HumanResourcesProvider } from 'communication';
import {AccountStatus} from "../../../../../projects/communication/src/lib/models/account-status";

@Component({
  selector: 'app-admin-subscription',
  templateUrl: './admin-subscription.component.html',
  styleUrls: ['./admin-subscription.component.scss']
})
export class AdminSubscriptionComponent extends GridItemsComponent<any> implements OnInit, OnDestroy {

  @ViewChild('headerContainer', {read: ViewContainerRef, static: true})
  private headerContainer: ViewContainerRef;

  isUpgrade = false;

  plans = [
      {
          plan_code: 'basic-monthly',
          name: 'Basic',
          unit: 'user',
          recurring_price: 100,
          interval: 1,
          interval_unit: 'months',
          billing_cycles: 12,
          trial_period: 14,
          description: 'Basic monthly plan',
      },
      {
          plan_code: 'pro-monthly',
          name: 'Corporate',
          unit: 'user',
          recurring_price: 250,
          interval: 1,
          interval_unit: 'months',
          billing_cycles: 24,
          trial_period: 21,
          description: 'Corporate monthly plan',
      }
  ];

  constructor(
      protected _provider: HumanResourcesProvider,
      protected _notifier: NotifierService,
      protected _route: ActivatedRoute,
      protected _router: Router,
      private resolver: ComponentFactoryResolver,
      @Optional() @Inject(HEADER) public header)  {
      super();
  }

  ngOnInit() {
      super.ngOnInit();

      if (this.header) {
          this.createComponent(this.headerContainer, this.header);
      }
  }

    private createComponent(container: ViewContainerRef, componentToken: Type<any>): ComponentRef<any> {
        const factory = this.resolver.resolveComponentFactory(componentToken);
        return container.createComponent(factory);
    }

    statusClass(item): string {
        if (!item)
            return;

        return item && AccountStatus[item].toLowerCase();
    }
}


