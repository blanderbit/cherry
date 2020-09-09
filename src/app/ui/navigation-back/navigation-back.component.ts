import { Location } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-navigation-back',
    templateUrl: './navigation-back.component.html',
    styleUrls: ['./navigation-back.component.scss'],
})
export class NavigationBackComponent {
    @Input()
    public text = 'navigation-back';

    @Input()
    public link = '../';

    get hasHistory() {
        return window.history && window.history.length > 2; // 2 default when page loaded
    }

    @Input()
    useHistory = false;

    get useNativeNavigation() {
        return this.hasHistory && this.useHistory;
    }

    constructor(protected _location: Location, private router: Router, protected _route: ActivatedRoute) {
    }

    navigateBack() {
        if (this.useNativeNavigation)
            this._location.back();

        else
            this.router.navigate([this.link], {relativeTo: this._route});
    }
}
