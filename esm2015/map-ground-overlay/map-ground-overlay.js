/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="googlemaps" />
import { Directive, Input, NgZone, Output } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { GoogleMap } from '../google-map/google-map';
import { MapEventManager } from '../map-event-manager';
/**
 * Angular component that renders a Google Maps Ground Overlay via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/image-overlay#GroundOverlay
 */
export class MapGroundOverlay {
    constructor(_map, _ngZone) {
        this._map = _map;
        this._ngZone = _ngZone;
        this._eventManager = new MapEventManager(this._ngZone);
        this._opacity = new BehaviorSubject(1);
        this._url = new BehaviorSubject('');
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
    /** URL of the image that will be shown in the overlay. */
    set url(url) {
        this._url.next(url);
    }
    /** Opacity of the overlay. */
    set opacity(opacity) {
        this._opacity.next(opacity);
    }
    ngOnInit() {
        if (!this.bounds && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw Error('Image bounds are required');
        }
        if (this._map._isBrowser) {
            this._combineOptions().pipe(take(1)).subscribe(options => {
                // Create the object outside the zone so its events don't trigger change detection.
                // We'll bring it back in inside the `MapEventManager` only for the events that the
                // user has subscribed to.
                this._ngZone.runOutsideAngular(() => {
                    this.groundOverlay =
                        new google.maps.GroundOverlay(this._url.getValue(), this.bounds, options);
                });
                this._assertInitialized();
                this.groundOverlay.setMap(this._map.googleMap);
                this._eventManager.setTarget(this.groundOverlay);
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
    _combineOptions() {
        return this._opacity.pipe(map(opacity => {
            const combinedOptions = {
                clickable: this.clickable,
                opacity,
            };
            return combinedOptions;
        }));
    }
    _watchForOpacityChanges() {
        this._opacity.pipe(takeUntil(this._destroyed)).subscribe(opacity => {
            if (opacity) {
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
MapGroundOverlay.decorators = [
    { type: Directive, args: [{
                selector: 'map-ground-overlay',
                exportAs: 'mapGroundOverlay',
            },] }
];
MapGroundOverlay.ctorParameters = () => [
    { type: GoogleMap },
    { type: NgZone }
];
MapGroundOverlay.propDecorators = {
    url: [{ type: Input }],
    bounds: [{ type: Input }],
    clickable: [{ type: Input }],
    opacity: [{ type: Input }],
    mapClick: [{ type: Output }],
    mapDblclick: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWdyb3VuZC1vdmVybGF5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2dvb2dsZS1tYXBzL21hcC1ncm91bmQtb3ZlcmxheS9tYXAtZ3JvdW5kLW92ZXJsYXkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgseUVBQXlFO0FBQ3pFLG9DQUFvQztBQUVwQyxPQUFPLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQXFCLE1BQU0sRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNsRixPQUFPLEVBQUMsZUFBZSxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDMUQsT0FBTyxFQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFcEQsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQ25ELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUVyRDs7OztHQUlHO0FBS0gsTUFBTSxPQUFPLGdCQUFnQjtJQWlEM0IsWUFBNkIsSUFBZSxFQUFtQixPQUFlO1FBQWpELFNBQUksR0FBSixJQUFJLENBQVc7UUFBbUIsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQWhEdEUsa0JBQWEsR0FBRyxJQUFJLGVBQWUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFekMsYUFBUSxHQUFHLElBQUksZUFBZSxDQUFTLENBQUMsQ0FBQyxDQUFDO1FBQzFDLFNBQUksR0FBRyxJQUFJLGVBQWUsQ0FBUyxFQUFFLENBQUMsQ0FBQztRQUN2QyxlQUFVLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQztRQWtCbEQsdUNBQXVDO1FBQzlCLGNBQVMsR0FBWSxLQUFLLENBQUM7UUFRcEM7OztXQUdHO1FBRUgsYUFBUSxHQUNKLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUF5QixPQUFP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dkIsTUFBTSxLQUFLLENBQ1Asa0ZBQWtGO29CQUNsRiw4RUFBOEUsQ0FBQyxDQUFDO2FBQ3JGO1NBQ0Y7SUFDSCxDQUFDOzs7WUFqS0YsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxvQkFBb0I7Z0JBQzlCLFFBQVEsRUFBRSxrQkFBa0I7YUFDN0I7OztZQVhPLFNBQVM7WUFKUyxNQUFNOzs7a0JBK0I3QixLQUFLO3FCQU1MLEtBQUs7d0JBR0wsS0FBSztzQkFHTCxLQUFLO3VCQVNMLE1BQU07MEJBU04sTUFBTSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vLyBXb3JrYXJvdW5kIGZvcjogaHR0cHM6Ly9naXRodWIuY29tL2JhemVsYnVpbGQvcnVsZXNfbm9kZWpzL2lzc3Vlcy8xMjY1XG4vLy8gPHJlZmVyZW5jZSB0eXBlcz1cImdvb2dsZW1hcHNcIiAvPlxuXG5pbXBvcnQge0RpcmVjdGl2ZSwgSW5wdXQsIE5nWm9uZSwgT25EZXN0cm95LCBPbkluaXQsIE91dHB1dH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0JlaGF2aW9yU3ViamVjdCwgT2JzZXJ2YWJsZSwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge21hcCwgdGFrZSwgdGFrZVVudGlsfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7R29vZ2xlTWFwfSBmcm9tICcuLi9nb29nbGUtbWFwL2dvb2dsZS1tYXAnO1xuaW1wb3J0IHtNYXBFdmVudE1hbmFnZXJ9IGZyb20gJy4uL21hcC1ldmVudC1tYW5hZ2VyJztcblxuLyoqXG4gKiBBbmd1bGFyIGNvbXBvbmVudCB0aGF0IHJlbmRlcnMgYSBHb29nbGUgTWFwcyBHcm91bmQgT3ZlcmxheSB2aWEgdGhlIEdvb2dsZSBNYXBzIEphdmFTY3JpcHQgQVBJLlxuICpcbiAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2ltYWdlLW92ZXJsYXkjR3JvdW5kT3ZlcmxheVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXAtZ3JvdW5kLW92ZXJsYXknLFxuICBleHBvcnRBczogJ21hcEdyb3VuZE92ZXJsYXknLFxufSlcbmV4cG9ydCBjbGFzcyBNYXBHcm91bmRPdmVybGF5IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICBwcml2YXRlIF9ldmVudE1hbmFnZXIgPSBuZXcgTWFwRXZlbnRNYW5hZ2VyKHRoaXMuX25nWm9uZSk7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBfb3BhY2l0eSA9IG5ldyBCZWhhdmlvclN1YmplY3Q8bnVtYmVyPigxKTtcbiAgcHJpdmF0ZSByZWFkb25seSBfdXJsID0gbmV3IEJlaGF2aW9yU3ViamVjdDxzdHJpbmc+KCcnKTtcbiAgcHJpdmF0ZSByZWFkb25seSBfZGVzdHJveWVkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKipcbiAgICogVGhlIHVuZGVybHlpbmcgZ29vZ2xlLm1hcHMuR3JvdW5kT3ZlcmxheSBvYmplY3QuXG4gICAqXG4gICAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2ltYWdlLW92ZXJsYXkjR3JvdW5kT3ZlcmxheVxuICAgKi9cbiAgZ3JvdW5kT3ZlcmxheT86IGdvb2dsZS5tYXBzLkdyb3VuZE92ZXJsYXk7XG5cbiAgLyoqIFVSTCBvZiB0aGUgaW1hZ2UgdGhhdCB3aWxsIGJlIHNob3duIGluIHRoZSBvdmVybGF5LiAqL1xuICBASW5wdXQoKVxuICBzZXQgdXJsKHVybDogc3RyaW5nKSB7XG4gICAgdGhpcy5fdXJsLm5leHQodXJsKTtcbiAgfVxuXG4gIC8qKiBCb3VuZHMgZm9yIHRoZSBvdmVybGF5LiAqL1xuICBASW5wdXQoKSBib3VuZHM6IGdvb2dsZS5tYXBzLkxhdExuZ0JvdW5kc3xnb29nbGUubWFwcy5MYXRMbmdCb3VuZHNMaXRlcmFsO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBvdmVybGF5IGlzIGNsaWNrYWJsZSAqL1xuICBASW5wdXQoKSBjbGlja2FibGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogT3BhY2l0eSBvZiB0aGUgb3ZlcmxheS4gKi9cbiAgQElucHV0KClcbiAgc2V0IG9wYWNpdHkob3BhY2l0eTogbnVtYmVyKSB7XG4gICAgdGhpcy5fb3BhY2l0eS5uZXh0KG9wYWNpdHkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2ltYWdlLW92ZXJsYXkjR3JvdW5kT3ZlcmxheS5jbGlja1xuICAgKi9cbiAgQE91dHB1dCgpXG4gIG1hcENsaWNrOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PignY2xpY2snKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvaW1hZ2Utb3ZlcmxheVxuICAgKiAjR3JvdW5kT3ZlcmxheS5kYmxjbGlja1xuICAgKi9cbiAgQE91dHB1dCgpXG4gIG1hcERibGNsaWNrOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PignZGJsY2xpY2snKTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IF9tYXA6IEdvb2dsZU1hcCwgcHJpdmF0ZSByZWFkb25seSBfbmdab25lOiBOZ1pvbmUpIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKCF0aGlzLmJvdW5kcyAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgdGhyb3cgRXJyb3IoJ0ltYWdlIGJvdW5kcyBhcmUgcmVxdWlyZWQnKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuX21hcC5faXNCcm93c2VyKSB7XG4gICAgICB0aGlzLl9jb21iaW5lT3B0aW9ucygpLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKG9wdGlvbnMgPT4ge1xuICAgICAgICAvLyBDcmVhdGUgdGhlIG9iamVjdCBvdXRzaWRlIHRoZSB6b25lIHNvIGl0cyBldmVudHMgZG9uJ3QgdHJpZ2dlciBjaGFuZ2UgZGV0ZWN0aW9uLlxuICAgICAgICAvLyBXZSdsbCBicmluZyBpdCBiYWNrIGluIGluc2lkZSB0aGUgYE1hcEV2ZW50TWFuYWdlcmAgb25seSBmb3IgdGhlIGV2ZW50cyB0aGF0IHRoZVxuICAgICAgICAvLyB1c2VyIGhhcyBzdWJzY3JpYmVkIHRvLlxuICAgICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuZ3JvdW5kT3ZlcmxheSA9XG4gICAgICAgICAgICAgIG5ldyBnb29nbGUubWFwcy5Hcm91bmRPdmVybGF5KHRoaXMuX3VybC5nZXRWYWx1ZSgpLCB0aGlzLmJvdW5kcywgb3B0aW9ucyk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgICB0aGlzLmdyb3VuZE92ZXJsYXkuc2V0TWFwKHRoaXMuX21hcC5nb29nbGVNYXAhKTtcbiAgICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLnNldFRhcmdldCh0aGlzLmdyb3VuZE92ZXJsYXkpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuX3dhdGNoRm9yT3BhY2l0eUNoYW5nZXMoKTtcbiAgICAgIHRoaXMuX3dhdGNoRm9yVXJsQ2hhbmdlcygpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5kZXN0cm95KCk7XG4gICAgdGhpcy5fZGVzdHJveWVkLm5leHQoKTtcbiAgICB0aGlzLl9kZXN0cm95ZWQuY29tcGxldGUoKTtcbiAgICBpZiAodGhpcy5ncm91bmRPdmVybGF5KSB7XG4gICAgICB0aGlzLmdyb3VuZE92ZXJsYXkuc2V0TWFwKG51bGwpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9pbWFnZS1vdmVybGF5XG4gICAqICNHcm91bmRPdmVybGF5LmdldEJvdW5kc1xuICAgKi9cbiAgZ2V0Qm91bmRzKCk6IGdvb2dsZS5tYXBzLkxhdExuZ0JvdW5kcyB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5ncm91bmRPdmVybGF5LmdldEJvdW5kcygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2ltYWdlLW92ZXJsYXlcbiAgICogI0dyb3VuZE92ZXJsYXkuZ2V0T3BhY2l0eVxuICAgKi9cbiAgZ2V0T3BhY2l0eSgpOiBudW1iZXIge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMuZ3JvdW5kT3ZlcmxheS5nZXRPcGFjaXR5KCk7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvaW1hZ2Utb3ZlcmxheVxuICAgKiAjR3JvdW5kT3ZlcmxheS5nZXRVcmxcbiAgICovXG4gIGdldFVybCgpOiBzdHJpbmcge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMuZ3JvdW5kT3ZlcmxheS5nZXRVcmwoKTtcbiAgfVxuXG4gIHByaXZhdGUgX2NvbWJpbmVPcHRpb25zKCk6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuR3JvdW5kT3ZlcmxheU9wdGlvbnM+IHtcbiAgICByZXR1cm4gdGhpcy5fb3BhY2l0eS5waXBlKG1hcChvcGFjaXR5ID0+IHtcbiAgICAgIGNvbnN0IGNvbWJpbmVkT3B0aW9uczogZ29vZ2xlLm1hcHMuR3JvdW5kT3ZlcmxheU9wdGlvbnMgPSB7XG4gICAgICAgIGNsaWNrYWJsZTogdGhpcy5jbGlja2FibGUsXG4gICAgICAgIG9wYWNpdHksXG4gICAgICB9O1xuICAgICAgcmV0dXJuIGNvbWJpbmVkT3B0aW9ucztcbiAgICB9KSk7XG4gIH1cblxuICBwcml2YXRlIF93YXRjaEZvck9wYWNpdHlDaGFuZ2VzKCkge1xuICAgIHRoaXMuX29wYWNpdHkucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKG9wYWNpdHkgPT4ge1xuICAgICAgaWYgKG9wYWNpdHkpIHtcbiAgICAgICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICAgICAgdGhpcy5ncm91bmRPdmVybGF5LnNldE9wYWNpdHkob3BhY2l0eSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF93YXRjaEZvclVybENoYW5nZXMoKSB7XG4gICAgdGhpcy5fdXJsLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpLnN1YnNjcmliZSh1cmwgPT4ge1xuICAgICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICAgIGNvbnN0IG92ZXJsYXkgPSB0aGlzLmdyb3VuZE92ZXJsYXk7XG4gICAgICBvdmVybGF5LnNldCgndXJsJywgdXJsKTtcblxuICAgICAgLy8gR29vZ2xlIE1hcHMgb25seSByZWRyYXdzIHRoZSBvdmVybGF5IGlmIHdlIHJlLXNldCB0aGUgbWFwLlxuICAgICAgb3ZlcmxheS5zZXRNYXAobnVsbCk7XG4gICAgICBvdmVybGF5LnNldE1hcCh0aGlzLl9tYXAuZ29vZ2xlTWFwISk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF9hc3NlcnRJbml0aWFsaXplZCgpOiBhc3NlcnRzIHRoaXMgaXMge2dyb3VuZE92ZXJsYXk6IGdvb2dsZS5tYXBzLkdyb3VuZE92ZXJsYXl9IHtcbiAgICBpZiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSB7XG4gICAgICBpZiAoIXRoaXMuX21hcC5nb29nbGVNYXApIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICAgICAnQ2Fubm90IGFjY2VzcyBHb29nbGUgTWFwIGluZm9ybWF0aW9uIGJlZm9yZSB0aGUgQVBJIGhhcyBiZWVuIGluaXRpYWxpemVkLiAnICtcbiAgICAgICAgICAgICdQbGVhc2Ugd2FpdCBmb3IgdGhlIEFQSSB0byBsb2FkIGJlZm9yZSB0cnlpbmcgdG8gaW50ZXJhY3Qgd2l0aCBpdC4nKTtcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5ncm91bmRPdmVybGF5KSB7XG4gICAgICAgIHRocm93IEVycm9yKFxuICAgICAgICAgICAgJ0Nhbm5vdCBpbnRlcmFjdCB3aXRoIGEgR29vZ2xlIE1hcCBHcm91bmRPdmVybGF5IGJlZm9yZSBpdCBoYXMgYmVlbiBpbml0aWFsaXplZC4gJyArXG4gICAgICAgICAgICAnUGxlYXNlIHdhaXQgZm9yIHRoZSBHcm91bmRPdmVybGF5IHRvIGxvYWQgYmVmb3JlIHRyeWluZyB0byBpbnRlcmFjdCB3aXRoIGl0LicpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19