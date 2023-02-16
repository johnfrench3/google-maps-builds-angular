/// <reference types="google.maps" />
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="google.maps" />
import { Directive, Input, NgZone, Output } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GoogleMap } from '../google-map/google-map';
import { MapEventManager } from '../map-event-manager';
import * as i0 from "@angular/core";
import * as i1 from "../google-map/google-map";
/**
 * Angular component that renders a Google Maps Ground Overlay via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/image-overlay#GroundOverlay
 */
export class MapGroundOverlay {
    /** URL of the image that will be shown in the overlay. */
    set url(url) {
        this._url.next(url);
    }
    /** Bounds for the overlay. */
    get bounds() {
        return this._bounds.value;
    }
    set bounds(bounds) {
        this._bounds.next(bounds);
    }
    /** Opacity of the overlay. */
    set opacity(opacity) {
        this._opacity.next(opacity);
    }
    constructor(_map, _ngZone) {
        this._map = _map;
        this._ngZone = _ngZone;
        this._eventManager = new MapEventManager(this._ngZone);
        this._opacity = new BehaviorSubject(1);
        this._url = new BehaviorSubject('');
        this._bounds = new BehaviorSubject(undefined);
        this._destroyed = new Subject();
        /** Whether the overlay is clickable */
        this.clickable = false;
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/image-overlay#GroundOverlay.click
         */
        this.mapClick = this._eventManager.getLazyEmitter('click');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/image-overlay
         * #GroundOverlay.dblclick
         */
        this.mapDblclick = this._eventManager.getLazyEmitter('dblclick');
    }
    ngOnInit() {
        if (this._map._isBrowser) {
            // The ground overlay setup is slightly different from the other Google Maps objects in that
            // we have to recreate the `GroundOverlay` object whenever the bounds change, because
            // Google Maps doesn't provide an API to update the bounds of an existing overlay.
            this._bounds.pipe(takeUntil(this._destroyed)).subscribe(bounds => {
                if (this.groundOverlay) {
                    this.groundOverlay.setMap(null);
                    this.groundOverlay = undefined;
                }
                // Create the object outside the zone so its events don't trigger change detection.
                // We'll bring it back in inside the `MapEventManager` only for the events that the
                // user has subscribed to.
                if (bounds) {
                    this._ngZone.runOutsideAngular(() => {
                        this.groundOverlay = new google.maps.GroundOverlay(this._url.getValue(), bounds, {
                            clickable: this.clickable,
                            opacity: this._opacity.value,
                        });
                    });
                    this._assertInitialized();
                    this.groundOverlay.setMap(this._map.googleMap);
                    this._eventManager.setTarget(this.groundOverlay);
                }
            });
            this._watchForOpacityChanges();
            this._watchForUrlChanges();
        }
    }
    ngOnDestroy() {
        this._eventManager.destroy();
        this._destroyed.next();
        this._destroyed.complete();
        if (this.groundOverlay) {
            this.groundOverlay.setMap(null);
        }
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/image-overlay
     * #GroundOverlay.getBounds
     */
    getBounds() {
        this._assertInitialized();
        return this.groundOverlay.getBounds();
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/image-overlay
     * #GroundOverlay.getOpacity
     */
    getOpacity() {
        this._assertInitialized();
        return this.groundOverlay.getOpacity();
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/image-overlay
     * #GroundOverlay.getUrl
     */
    getUrl() {
        this._assertInitialized();
        return this.groundOverlay.getUrl();
    }
    _watchForOpacityChanges() {
        this._opacity.pipe(takeUntil(this._destroyed)).subscribe(opacity => {
            if (opacity != null) {
                this._assertInitialized();
                this.groundOverlay.setOpacity(opacity);
            }
        });
    }
    _watchForUrlChanges() {
        this._url.pipe(takeUntil(this._destroyed)).subscribe(url => {
            this._assertInitialized();
            const overlay = this.groundOverlay;
            overlay.set('url', url);
            // Google Maps only redraws the overlay if we re-set the map.
            overlay.setMap(null);
            overlay.setMap(this._map.googleMap);
        });
    }
    _assertInitialized() {
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
            if (!this._map.googleMap) {
                throw Error('Cannot access Google Map information before the API has been initialized. ' +
                    'Please wait for the API to load before trying to interact with it.');
            }
            if (!this.groundOverlay) {
                throw Error('Cannot interact with a Google Map GroundOverlay before it has been initialized. ' +
                    'Please wait for the GroundOverlay to load before trying to interact with it.');
            }
        }
    }
}
MapGroundOverlay.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.0-rc.0", ngImport: i0, type: MapGroundOverlay, deps: [{ token: i1.GoogleMap }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive });
MapGroundOverlay.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.0-rc.0", type: MapGroundOverlay, selector: "map-ground-overlay", inputs: { url: "url", bounds: "bounds", clickable: "clickable", opacity: "opacity" }, outputs: { mapClick: "mapClick", mapDblclick: "mapDblclick" }, exportAs: ["mapGroundOverlay"], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.0-rc.0", ngImport: i0, type: MapGroundOverlay, decorators: [{
            type: Directive,
            args: [{
                    selector: 'map-ground-overlay',
                    exportAs: 'mapGroundOverlay',
                }]
        }], ctorParameters: function () { return [{ type: i1.GoogleMap }, { type: i0.NgZone }]; }, propDecorators: { url: [{
                type: Input
            }], bounds: [{
                type: Input
            }], clickable: [{
                type: Input
            }], opacity: [{
                type: Input
            }], mapClick: [{
                type: Output
            }], mapDblclick: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWdyb3VuZC1vdmVybGF5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2dvb2dsZS1tYXBzL21hcC1ncm91bmQtb3ZlcmxheS9tYXAtZ3JvdW5kLW92ZXJsYXkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBU0EscUNBQXFDO0FBVHJDOzs7Ozs7R0FNRztBQUVILHlFQUF5RTtBQUN6RSxxQ0FBcUM7QUFFckMsT0FBTyxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFxQixNQUFNLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDbEYsT0FBTyxFQUFDLGVBQWUsRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzFELE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUV6QyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDbkQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHNCQUFzQixDQUFDOzs7QUFFckQ7Ozs7R0FJRztBQUtILE1BQU0sT0FBTyxnQkFBZ0I7SUFpQjNCLDBEQUEwRDtJQUMxRCxJQUNJLEdBQUcsQ0FBQyxHQUFXO1FBQ2pCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3RCLENBQUM7SUFFRCw4QkFBOEI7SUFDOUIsSUFDSSxNQUFNO1FBQ1IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQU0sQ0FBQztJQUM3QixDQUFDO0lBQ0QsSUFBSSxNQUFNLENBQUMsTUFBa0U7UUFDM0UsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUtELDhCQUE4QjtJQUM5QixJQUNJLE9BQU8sQ0FBQyxPQUFlO1FBQ3pCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFpQkQs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QVMsRUFBRTtZQUNqRCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7Z0JBQ3hCLE1BQU0sS0FBSyxDQUNULDRFQUE0RTtvQkFDMUUsb0VBQW9FLENBQ3ZFLENBQUM7YUFDSDtZQUNELElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFO2dCQUN2QixNQUFNLEtBQUssQ0FDVCxrRkFBa0Y7b0JBQ2hGLDhFQUE4RSxDQUNqRixDQUFDO2FBQ0g7U0FDRjtJQUNILENBQUM7O2tIQXJLVSxnQkFBZ0I7c0dBQWhCLGdCQUFnQjtnR0FBaEIsZ0JBQWdCO2tCQUo1QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxvQkFBb0I7b0JBQzlCLFFBQVEsRUFBRSxrQkFBa0I7aUJBQzdCO3FIQW9CSyxHQUFHO3NCQUROLEtBQUs7Z0JBT0YsTUFBTTtzQkFEVCxLQUFLO2dCQVNHLFNBQVM7c0JBQWpCLEtBQUs7Z0JBSUYsT0FBTztzQkFEVixLQUFLO2dCQVNhLFFBQVE7c0JBQTFCLE1BQU07Z0JBUVksV0FBVztzQkFBN0IsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vLyBXb3JrYXJvdW5kIGZvcjogaHR0cHM6Ly9naXRodWIuY29tL2JhemVsYnVpbGQvcnVsZXNfbm9kZWpzL2lzc3Vlcy8xMjY1XG4vLy8gPHJlZmVyZW5jZSB0eXBlcz1cImdvb2dsZS5tYXBzXCIgLz5cblxuaW1wb3J0IHtEaXJlY3RpdmUsIElucHV0LCBOZ1pvbmUsIE9uRGVzdHJveSwgT25Jbml0LCBPdXRwdXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtCZWhhdmlvclN1YmplY3QsIE9ic2VydmFibGUsIFN1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHt0YWtlVW50aWx9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtHb29nbGVNYXB9IGZyb20gJy4uL2dvb2dsZS1tYXAvZ29vZ2xlLW1hcCc7XG5pbXBvcnQge01hcEV2ZW50TWFuYWdlcn0gZnJvbSAnLi4vbWFwLWV2ZW50LW1hbmFnZXInO1xuXG4vKipcbiAqIEFuZ3VsYXIgY29tcG9uZW50IHRoYXQgcmVuZGVycyBhIEdvb2dsZSBNYXBzIEdyb3VuZCBPdmVybGF5IHZpYSB0aGUgR29vZ2xlIE1hcHMgSmF2YVNjcmlwdCBBUEkuXG4gKlxuICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvaW1hZ2Utb3ZlcmxheSNHcm91bmRPdmVybGF5XG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hcC1ncm91bmQtb3ZlcmxheScsXG4gIGV4cG9ydEFzOiAnbWFwR3JvdW5kT3ZlcmxheScsXG59KVxuZXhwb3J0IGNsYXNzIE1hcEdyb3VuZE92ZXJsYXkgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX2V2ZW50TWFuYWdlciA9IG5ldyBNYXBFdmVudE1hbmFnZXIodGhpcy5fbmdab25lKTtcblxuICBwcml2YXRlIHJlYWRvbmx5IF9vcGFjaXR5ID0gbmV3IEJlaGF2aW9yU3ViamVjdDxudW1iZXI+KDEpO1xuICBwcml2YXRlIHJlYWRvbmx5IF91cmwgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PHN0cmluZz4oJycpO1xuICBwcml2YXRlIHJlYWRvbmx5IF9ib3VuZHMgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PFxuICAgIGdvb2dsZS5tYXBzLkxhdExuZ0JvdW5kcyB8IGdvb2dsZS5tYXBzLkxhdExuZ0JvdW5kc0xpdGVyYWwgfCB1bmRlZmluZWRcbiAgPih1bmRlZmluZWQpO1xuICBwcml2YXRlIHJlYWRvbmx5IF9kZXN0cm95ZWQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKlxuICAgKiBUaGUgdW5kZXJseWluZyBnb29nbGUubWFwcy5Hcm91bmRPdmVybGF5IG9iamVjdC5cbiAgICpcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvaW1hZ2Utb3ZlcmxheSNHcm91bmRPdmVybGF5XG4gICAqL1xuICBncm91bmRPdmVybGF5PzogZ29vZ2xlLm1hcHMuR3JvdW5kT3ZlcmxheTtcblxuICAvKiogVVJMIG9mIHRoZSBpbWFnZSB0aGF0IHdpbGwgYmUgc2hvd24gaW4gdGhlIG92ZXJsYXkuICovXG4gIEBJbnB1dCgpXG4gIHNldCB1cmwodXJsOiBzdHJpbmcpIHtcbiAgICB0aGlzLl91cmwubmV4dCh1cmwpO1xuICB9XG5cbiAgLyoqIEJvdW5kcyBmb3IgdGhlIG92ZXJsYXkuICovXG4gIEBJbnB1dCgpXG4gIGdldCBib3VuZHMoKTogZ29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzIHwgZ29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzTGl0ZXJhbCB7XG4gICAgcmV0dXJuIHRoaXMuX2JvdW5kcy52YWx1ZSE7XG4gIH1cbiAgc2V0IGJvdW5kcyhib3VuZHM6IGdvb2dsZS5tYXBzLkxhdExuZ0JvdW5kcyB8IGdvb2dsZS5tYXBzLkxhdExuZ0JvdW5kc0xpdGVyYWwpIHtcbiAgICB0aGlzLl9ib3VuZHMubmV4dChib3VuZHMpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIG92ZXJsYXkgaXMgY2xpY2thYmxlICovXG4gIEBJbnB1dCgpIGNsaWNrYWJsZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBPcGFjaXR5IG9mIHRoZSBvdmVybGF5LiAqL1xuICBASW5wdXQoKVxuICBzZXQgb3BhY2l0eShvcGFjaXR5OiBudW1iZXIpIHtcbiAgICB0aGlzLl9vcGFjaXR5Lm5leHQob3BhY2l0eSk7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvaW1hZ2Utb3ZlcmxheSNHcm91bmRPdmVybGF5LmNsaWNrXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgbWFwQ2xpY2s6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PignY2xpY2snKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvaW1hZ2Utb3ZlcmxheVxuICAgKiAjR3JvdW5kT3ZlcmxheS5kYmxjbGlja1xuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG1hcERibGNsaWNrOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4oJ2RibGNsaWNrJyk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBfbWFwOiBHb29nbGVNYXAsIHByaXZhdGUgcmVhZG9ubHkgX25nWm9uZTogTmdab25lKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICh0aGlzLl9tYXAuX2lzQnJvd3Nlcikge1xuICAgICAgLy8gVGhlIGdyb3VuZCBvdmVybGF5IHNldHVwIGlzIHNsaWdodGx5IGRpZmZlcmVudCBmcm9tIHRoZSBvdGhlciBHb29nbGUgTWFwcyBvYmplY3RzIGluIHRoYXRcbiAgICAgIC8vIHdlIGhhdmUgdG8gcmVjcmVhdGUgdGhlIGBHcm91bmRPdmVybGF5YCBvYmplY3Qgd2hlbmV2ZXIgdGhlIGJvdW5kcyBjaGFuZ2UsIGJlY2F1c2VcbiAgICAgIC8vIEdvb2dsZSBNYXBzIGRvZXNuJ3QgcHJvdmlkZSBhbiBBUEkgdG8gdXBkYXRlIHRoZSBib3VuZHMgb2YgYW4gZXhpc3Rpbmcgb3ZlcmxheS5cbiAgICAgIHRoaXMuX2JvdW5kcy5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKS5zdWJzY3JpYmUoYm91bmRzID0+IHtcbiAgICAgICAgaWYgKHRoaXMuZ3JvdW5kT3ZlcmxheSkge1xuICAgICAgICAgIHRoaXMuZ3JvdW5kT3ZlcmxheS5zZXRNYXAobnVsbCk7XG4gICAgICAgICAgdGhpcy5ncm91bmRPdmVybGF5ID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBvYmplY3Qgb3V0c2lkZSB0aGUgem9uZSBzbyBpdHMgZXZlbnRzIGRvbid0IHRyaWdnZXIgY2hhbmdlIGRldGVjdGlvbi5cbiAgICAgICAgLy8gV2UnbGwgYnJpbmcgaXQgYmFjayBpbiBpbnNpZGUgdGhlIGBNYXBFdmVudE1hbmFnZXJgIG9ubHkgZm9yIHRoZSBldmVudHMgdGhhdCB0aGVcbiAgICAgICAgLy8gdXNlciBoYXMgc3Vic2NyaWJlZCB0by5cbiAgICAgICAgaWYgKGJvdW5kcykge1xuICAgICAgICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmdyb3VuZE92ZXJsYXkgPSBuZXcgZ29vZ2xlLm1hcHMuR3JvdW5kT3ZlcmxheSh0aGlzLl91cmwuZ2V0VmFsdWUoKSwgYm91bmRzLCB7XG4gICAgICAgICAgICAgIGNsaWNrYWJsZTogdGhpcy5jbGlja2FibGUsXG4gICAgICAgICAgICAgIG9wYWNpdHk6IHRoaXMuX29wYWNpdHkudmFsdWUsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgICAgIHRoaXMuZ3JvdW5kT3ZlcmxheS5zZXRNYXAodGhpcy5fbWFwLmdvb2dsZU1hcCEpO1xuICAgICAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5zZXRUYXJnZXQodGhpcy5ncm91bmRPdmVybGF5KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuX3dhdGNoRm9yT3BhY2l0eUNoYW5nZXMoKTtcbiAgICAgIHRoaXMuX3dhdGNoRm9yVXJsQ2hhbmdlcygpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5kZXN0cm95KCk7XG4gICAgdGhpcy5fZGVzdHJveWVkLm5leHQoKTtcbiAgICB0aGlzLl9kZXN0cm95ZWQuY29tcGxldGUoKTtcbiAgICBpZiAodGhpcy5ncm91bmRPdmVybGF5KSB7XG4gICAgICB0aGlzLmdyb3VuZE92ZXJsYXkuc2V0TWFwKG51bGwpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9pbWFnZS1vdmVybGF5XG4gICAqICNHcm91bmRPdmVybGF5LmdldEJvdW5kc1xuICAgKi9cbiAgZ2V0Qm91bmRzKCk6IGdvb2dsZS5tYXBzLkxhdExuZ0JvdW5kcyB8IG51bGwge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMuZ3JvdW5kT3ZlcmxheS5nZXRCb3VuZHMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9pbWFnZS1vdmVybGF5XG4gICAqICNHcm91bmRPdmVybGF5LmdldE9wYWNpdHlcbiAgICovXG4gIGdldE9wYWNpdHkoKTogbnVtYmVyIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmdyb3VuZE92ZXJsYXkuZ2V0T3BhY2l0eSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2ltYWdlLW92ZXJsYXlcbiAgICogI0dyb3VuZE92ZXJsYXkuZ2V0VXJsXG4gICAqL1xuICBnZXRVcmwoKTogc3RyaW5nIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmdyb3VuZE92ZXJsYXkuZ2V0VXJsKCk7XG4gIH1cblxuICBwcml2YXRlIF93YXRjaEZvck9wYWNpdHlDaGFuZ2VzKCkge1xuICAgIHRoaXMuX29wYWNpdHkucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKG9wYWNpdHkgPT4ge1xuICAgICAgaWYgKG9wYWNpdHkgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgICB0aGlzLmdyb3VuZE92ZXJsYXkuc2V0T3BhY2l0eShvcGFjaXR5KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3dhdGNoRm9yVXJsQ2hhbmdlcygpIHtcbiAgICB0aGlzLl91cmwucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKHVybCA9PiB7XG4gICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgY29uc3Qgb3ZlcmxheSA9IHRoaXMuZ3JvdW5kT3ZlcmxheTtcbiAgICAgIG92ZXJsYXkuc2V0KCd1cmwnLCB1cmwpO1xuXG4gICAgICAvLyBHb29nbGUgTWFwcyBvbmx5IHJlZHJhd3MgdGhlIG92ZXJsYXkgaWYgd2UgcmUtc2V0IHRoZSBtYXAuXG4gICAgICBvdmVybGF5LnNldE1hcChudWxsKTtcbiAgICAgIG92ZXJsYXkuc2V0TWFwKHRoaXMuX21hcC5nb29nbGVNYXAhKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2Fzc2VydEluaXRpYWxpemVkKCk6IGFzc2VydHMgdGhpcyBpcyB7Z3JvdW5kT3ZlcmxheTogZ29vZ2xlLm1hcHMuR3JvdW5kT3ZlcmxheX0ge1xuICAgIGlmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpIHtcbiAgICAgIGlmICghdGhpcy5fbWFwLmdvb2dsZU1hcCkge1xuICAgICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICAnQ2Fubm90IGFjY2VzcyBHb29nbGUgTWFwIGluZm9ybWF0aW9uIGJlZm9yZSB0aGUgQVBJIGhhcyBiZWVuIGluaXRpYWxpemVkLiAnICtcbiAgICAgICAgICAgICdQbGVhc2Ugd2FpdCBmb3IgdGhlIEFQSSB0byBsb2FkIGJlZm9yZSB0cnlpbmcgdG8gaW50ZXJhY3Qgd2l0aCBpdC4nLFxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLmdyb3VuZE92ZXJsYXkpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICAgJ0Nhbm5vdCBpbnRlcmFjdCB3aXRoIGEgR29vZ2xlIE1hcCBHcm91bmRPdmVybGF5IGJlZm9yZSBpdCBoYXMgYmVlbiBpbml0aWFsaXplZC4gJyArXG4gICAgICAgICAgICAnUGxlYXNlIHdhaXQgZm9yIHRoZSBHcm91bmRPdmVybGF5IHRvIGxvYWQgYmVmb3JlIHRyeWluZyB0byBpbnRlcmFjdCB3aXRoIGl0LicsXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0=