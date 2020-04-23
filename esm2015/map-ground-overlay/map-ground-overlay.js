/**
 * @fileoverview added by tsickle
 * Generated from: src/google-maps/map-ground-overlay/map-ground-overlay.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/// <reference types="googlemaps" />
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
    /**
     * @param {?} _map
     * @param {?} _ngZone
     */
    constructor(_map, _ngZone) {
        this._map = _map;
        this._ngZone = _ngZone;
        this._eventManager = new MapEventManager(this._ngZone);
        this._opacity = new BehaviorSubject(1);
        this._destroyed = new Subject();
        // Asserted in ngOnInit.
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
    /**
     * @param {?} opacity
     * @return {?}
     */
    set opacity(opacity) {
        this._opacity.next(opacity);
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (!this.url) {
            throw Error('An image url is required');
        }
        if (!this.bounds) {
            throw Error('Image bounds are required');
        }
        if (this._map._isBrowser) {
            this._combineOptions().pipe(take(1)).subscribe((/**
             * @param {?} options
             * @return {?}
             */
            options => {
                // Create the object outside the zone so its events don't trigger change detection.
                // We'll bring it back in inside the `MapEventManager` only for the events that the
                // user has subscribed to.
                this._ngZone.runOutsideAngular((/**
                 * @return {?}
                 */
                () => {
                    this.groundOverlay = new google.maps.GroundOverlay(this.url, this.bounds, options);
                }));
                this._assertInitialized();
                (/** @type {?} */ (this.groundOverlay)).setMap((/** @type {?} */ (this._map.googleMap)));
                this._eventManager.setTarget(this.groundOverlay);
            }));
            this._watchForOpacityChanges();
        }
    }
    /**
     * @return {?}
     */
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
     * @return {?}
     */
    getBounds() {
        this._assertInitialized();
        return (/** @type {?} */ (this.groundOverlay)).getBounds();
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/image-overlay
     * #GroundOverlay.getOpacity
     * @return {?}
     */
    getOpacity() {
        this._assertInitialized();
        return (/** @type {?} */ (this.groundOverlay)).getOpacity();
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/image-overlay
     * #GroundOverlay.getUrl
     * @return {?}
     */
    getUrl() {
        this._assertInitialized();
        return (/** @type {?} */ (this.groundOverlay)).getUrl();
    }
    /**
     * @private
     * @return {?}
     */
    _combineOptions() {
        return this._opacity.pipe(map((/**
         * @param {?} opacity
         * @return {?}
         */
        opacity => {
            /** @type {?} */
            const combinedOptions = {
                clickable: this.clickable,
                opacity,
            };
            return combinedOptions;
        })));
    }
    /**
     * @private
     * @return {?}
     */
    _watchForOpacityChanges() {
        this._opacity.pipe(takeUntil(this._destroyed)).subscribe((/**
         * @param {?} opacity
         * @return {?}
         */
        opacity => {
            if (opacity) {
                this._assertInitialized();
                (/** @type {?} */ (this.groundOverlay)).setOpacity(opacity);
            }
        }));
    }
    /**
     * @private
     * @return {?}
     */
    _assertInitialized() {
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
MapGroundOverlay.decorators = [
    { type: Directive, args: [{
                selector: 'map-ground-overlay',
            },] }
];
/** @nocollapse */
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
if (false) {
    /**
     * @type {?}
     * @private
     */
    MapGroundOverlay.prototype._eventManager;
    /**
     * @type {?}
     * @private
     */
    MapGroundOverlay.prototype._opacity;
    /**
     * @type {?}
     * @private
     */
    MapGroundOverlay.prototype._destroyed;
    /**
     * The underlying google.maps.GroundOverlay object.
     *
     * See developers.google.com/maps/documentation/javascript/reference/image-overlay#GroundOverlay
     * @type {?}
     */
    MapGroundOverlay.prototype.groundOverlay;
    /** @type {?} */
    MapGroundOverlay.prototype.url;
    /** @type {?} */
    MapGroundOverlay.prototype.bounds;
    /** @type {?} */
    MapGroundOverlay.prototype.clickable;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/image-overlay#GroundOverlay.click
     * @type {?}
     */
    MapGroundOverlay.prototype.mapClick;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/image-overlay
     * #GroundOverlay.dblclick
     * @type {?}
     */
    MapGroundOverlay.prototype.mapDblclick;
    /**
     * @type {?}
     * @private
     */
    MapGroundOverlay.prototype._map;
    /**
     * @type {?}
     * @private
     */
    MapGroundOverlay.prototype._ngZone;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWdyb3VuZC1vdmVybGF5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2dvb2dsZS1tYXBzL21hcC1ncm91bmQtb3ZlcmxheS9tYXAtZ3JvdW5kLW92ZXJsYXkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFTQSxvQ0FBb0M7Ozs7Ozs7Ozs7QUFFcEMsT0FBTyxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFxQixNQUFNLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDbEYsT0FBTyxFQUFDLGVBQWUsRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzFELE9BQU8sRUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRXBELE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUNuRCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7Ozs7OztBQVVyRCxNQUFNLE9BQU8sZ0JBQWdCOzs7OztJQTBDM0IsWUFBNkIsSUFBZSxFQUFtQixPQUFlO1FBQWpELFNBQUksR0FBSixJQUFJLENBQVc7UUFBbUIsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQXpDdEUsa0JBQWEsR0FBRyxJQUFJLGVBQWUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFekMsYUFBUSxHQUFHLElBQUksZUFBZSxDQUFTLENBQUMsQ0FBQyxDQUFDO1FBQzFDLGVBQVUsR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDOztRQWN6QyxjQUFTLEdBQUcsS0FBSyxDQUFDOzs7OztRQVkzQixhQUFRLEdBQ0osSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQXlCLE9BQU8sQ0FBQyxDQUFDOzs7Ozs7UUFRdkUsZ0JBQVcsR0FDUCxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBeUIsVUFBVSxDQUFDLENBQUM7SUFFTyxD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LEVBQUU7WUFDakUsSUFBSSxPQUFPLEVBQUU7Z0JBQ1gsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7Z0JBQzFCLG1CQUFBLElBQUksQ0FBQyxhQUFhLEVBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDekM7UUFDSCxDQUFDLEVBQUMsQ0FBQztJQUNMLENBQUM7Ozs7O0lBRU8sa0JBQWtCO1FBQ3hCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUN4QixNQUFNLEtBQUssQ0FDUCw0RUFBNEU7Z0JBQzVFLG9FQUFvRSxDQUFDLENBQUM7U0FDM0U7UUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUN2QixNQUFNLEtBQUssQ0FDUCxrRkFBa0Y7Z0JBQ2xGLDhFQUE4RSxDQUFDLENBQUM7U0FDckY7SUFDSCxDQUFDOzs7WUE1SUYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxvQkFBb0I7YUFDL0I7Ozs7WUFWTyxTQUFTO1lBSlMsTUFBTTs7O2tCQTRCN0IsS0FBSztxQkFFTCxLQUFLO3dCQUdMLEtBQUs7c0JBRUwsS0FBSzt1QkFTTCxNQUFNOzBCQVNOLE1BQU07Ozs7Ozs7SUFyQ1AseUNBQTBEOzs7OztJQUUxRCxvQ0FBMkQ7Ozs7O0lBQzNELHNDQUFrRDs7Ozs7OztJQU9sRCx5Q0FBMEM7O0lBRTFDLCtCQUFzQjs7SUFFdEIsa0NBQ2tFOztJQUVsRSxxQ0FBMkI7Ozs7OztJQVczQixvQ0FFdUU7Ozs7Ozs7SUFPdkUsdUNBRTBFOzs7OztJQUU5RCxnQ0FBZ0M7Ozs7O0lBQUUsbUNBQWdDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8vIFdvcmthcm91bmQgZm9yOiBodHRwczovL2dpdGh1Yi5jb20vYmF6ZWxidWlsZC9ydWxlc19ub2RlanMvaXNzdWVzLzEyNjVcbi8vLyA8cmVmZXJlbmNlIHR5cGVzPVwiZ29vZ2xlbWFwc1wiIC8+XG5cbmltcG9ydCB7RGlyZWN0aXZlLCBJbnB1dCwgTmdab25lLCBPbkRlc3Ryb3ksIE9uSW5pdCwgT3V0cHV0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7QmVoYXZpb3JTdWJqZWN0LCBPYnNlcnZhYmxlLCBTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7bWFwLCB0YWtlLCB0YWtlVW50aWx9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtHb29nbGVNYXB9IGZyb20gJy4uL2dvb2dsZS1tYXAvZ29vZ2xlLW1hcCc7XG5pbXBvcnQge01hcEV2ZW50TWFuYWdlcn0gZnJvbSAnLi4vbWFwLWV2ZW50LW1hbmFnZXInO1xuXG4vKipcbiAqIEFuZ3VsYXIgY29tcG9uZW50IHRoYXQgcmVuZGVycyBhIEdvb2dsZSBNYXBzIEdyb3VuZCBPdmVybGF5IHZpYSB0aGUgR29vZ2xlIE1hcHMgSmF2YVNjcmlwdCBBUEkuXG4gKlxuICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvaW1hZ2Utb3ZlcmxheSNHcm91bmRPdmVybGF5XG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hcC1ncm91bmQtb3ZlcmxheScsXG59KVxuZXhwb3J0IGNsYXNzIE1hcEdyb3VuZE92ZXJsYXkgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX2V2ZW50TWFuYWdlciA9IG5ldyBNYXBFdmVudE1hbmFnZXIodGhpcy5fbmdab25lKTtcblxuICBwcml2YXRlIHJlYWRvbmx5IF9vcGFjaXR5ID0gbmV3IEJlaGF2aW9yU3ViamVjdDxudW1iZXI+KDEpO1xuICBwcml2YXRlIHJlYWRvbmx5IF9kZXN0cm95ZWQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKlxuICAgKiBUaGUgdW5kZXJseWluZyBnb29nbGUubWFwcy5Hcm91bmRPdmVybGF5IG9iamVjdC5cbiAgICpcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvaW1hZ2Utb3ZlcmxheSNHcm91bmRPdmVybGF5XG4gICAqL1xuICBncm91bmRPdmVybGF5PzogZ29vZ2xlLm1hcHMuR3JvdW5kT3ZlcmxheTtcblxuICBASW5wdXQoKSB1cmwhOiBzdHJpbmc7ICAvLyBBc3NlcnRlZCBpbiBuZ09uSW5pdC5cblxuICBASW5wdXQoKVxuICBib3VuZHMhOiBnb29nbGUubWFwcy5MYXRMbmdCb3VuZHN8Z29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzTGl0ZXJhbDsgIC8vIEFzc2VydGVkIGluIG5nT25Jbml0LlxuXG4gIEBJbnB1dCgpIGNsaWNrYWJsZSA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIHNldCBvcGFjaXR5KG9wYWNpdHk6IG51bWJlcikge1xuICAgIHRoaXMuX29wYWNpdHkubmV4dChvcGFjaXR5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9pbWFnZS1vdmVybGF5I0dyb3VuZE92ZXJsYXkuY2xpY2tcbiAgICovXG4gIEBPdXRwdXQoKVxuICBtYXBDbGljazogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4oJ2NsaWNrJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2ltYWdlLW92ZXJsYXlcbiAgICogI0dyb3VuZE92ZXJsYXkuZGJsY2xpY2tcbiAgICovXG4gIEBPdXRwdXQoKVxuICBtYXBEYmxjbGljazogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4oJ2RibGNsaWNrJyk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBfbWFwOiBHb29nbGVNYXAsIHByaXZhdGUgcmVhZG9ubHkgX25nWm9uZTogTmdab25lKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICghdGhpcy51cmwpIHtcbiAgICAgIHRocm93IEVycm9yKCdBbiBpbWFnZSB1cmwgaXMgcmVxdWlyZWQnKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLmJvdW5kcykge1xuICAgICAgdGhyb3cgRXJyb3IoJ0ltYWdlIGJvdW5kcyBhcmUgcmVxdWlyZWQnKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuX21hcC5faXNCcm93c2VyKSB7XG4gICAgICB0aGlzLl9jb21iaW5lT3B0aW9ucygpLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKG9wdGlvbnMgPT4ge1xuICAgICAgICAvLyBDcmVhdGUgdGhlIG9iamVjdCBvdXRzaWRlIHRoZSB6b25lIHNvIGl0cyBldmVudHMgZG9uJ3QgdHJpZ2dlciBjaGFuZ2UgZGV0ZWN0aW9uLlxuICAgICAgICAvLyBXZSdsbCBicmluZyBpdCBiYWNrIGluIGluc2lkZSB0aGUgYE1hcEV2ZW50TWFuYWdlcmAgb25seSBmb3IgdGhlIGV2ZW50cyB0aGF0IHRoZVxuICAgICAgICAvLyB1c2VyIGhhcyBzdWJzY3JpYmVkIHRvLlxuICAgICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuZ3JvdW5kT3ZlcmxheSA9IG5ldyBnb29nbGUubWFwcy5Hcm91bmRPdmVybGF5KHRoaXMudXJsLCB0aGlzLmJvdW5kcywgb3B0aW9ucyk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgICB0aGlzLmdyb3VuZE92ZXJsYXkhLnNldE1hcCh0aGlzLl9tYXAuZ29vZ2xlTWFwISk7XG4gICAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5zZXRUYXJnZXQodGhpcy5ncm91bmRPdmVybGF5KTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLl93YXRjaEZvck9wYWNpdHlDaGFuZ2VzKCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmRlc3Ryb3koKTtcbiAgICB0aGlzLl9kZXN0cm95ZWQubmV4dCgpO1xuICAgIHRoaXMuX2Rlc3Ryb3llZC5jb21wbGV0ZSgpO1xuICAgIGlmICh0aGlzLmdyb3VuZE92ZXJsYXkpIHtcbiAgICAgIHRoaXMuZ3JvdW5kT3ZlcmxheS5zZXRNYXAobnVsbCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2ltYWdlLW92ZXJsYXlcbiAgICogI0dyb3VuZE92ZXJsYXkuZ2V0Qm91bmRzXG4gICAqL1xuICBnZXRCb3VuZHMoKTogZ29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmdyb3VuZE92ZXJsYXkhLmdldEJvdW5kcygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2ltYWdlLW92ZXJsYXlcbiAgICogI0dyb3VuZE92ZXJsYXkuZ2V0T3BhY2l0eVxuICAgKi9cbiAgZ2V0T3BhY2l0eSgpOiBudW1iZXIge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMuZ3JvdW5kT3ZlcmxheSEuZ2V0T3BhY2l0eSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2ltYWdlLW92ZXJsYXlcbiAgICogI0dyb3VuZE92ZXJsYXkuZ2V0VXJsXG4gICAqL1xuICBnZXRVcmwoKTogc3RyaW5nIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmdyb3VuZE92ZXJsYXkhLmdldFVybCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBfY29tYmluZU9wdGlvbnMoKTogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Hcm91bmRPdmVybGF5T3B0aW9ucz4ge1xuICAgIHJldHVybiB0aGlzLl9vcGFjaXR5LnBpcGUobWFwKG9wYWNpdHkgPT4ge1xuICAgICAgY29uc3QgY29tYmluZWRPcHRpb25zOiBnb29nbGUubWFwcy5Hcm91bmRPdmVybGF5T3B0aW9ucyA9IHtcbiAgICAgICAgY2xpY2thYmxlOiB0aGlzLmNsaWNrYWJsZSxcbiAgICAgICAgb3BhY2l0eSxcbiAgICAgIH07XG4gICAgICByZXR1cm4gY29tYmluZWRPcHRpb25zO1xuICAgIH0pKTtcbiAgfVxuXG4gIHByaXZhdGUgX3dhdGNoRm9yT3BhY2l0eUNoYW5nZXMoKSB7XG4gICAgdGhpcy5fb3BhY2l0eS5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKS5zdWJzY3JpYmUob3BhY2l0eSA9PiB7XG4gICAgICBpZiAob3BhY2l0eSkge1xuICAgICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgICB0aGlzLmdyb3VuZE92ZXJsYXkhLnNldE9wYWNpdHkob3BhY2l0eSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF9hc3NlcnRJbml0aWFsaXplZCgpIHtcbiAgICBpZiAoIXRoaXMuX21hcC5nb29nbGVNYXApIHtcbiAgICAgIHRocm93IEVycm9yKFxuICAgICAgICAgICdDYW5ub3QgYWNjZXNzIEdvb2dsZSBNYXAgaW5mb3JtYXRpb24gYmVmb3JlIHRoZSBBUEkgaGFzIGJlZW4gaW5pdGlhbGl6ZWQuICcgK1xuICAgICAgICAgICdQbGVhc2Ugd2FpdCBmb3IgdGhlIEFQSSB0byBsb2FkIGJlZm9yZSB0cnlpbmcgdG8gaW50ZXJhY3Qgd2l0aCBpdC4nKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLmdyb3VuZE92ZXJsYXkpIHtcbiAgICAgIHRocm93IEVycm9yKFxuICAgICAgICAgICdDYW5ub3QgaW50ZXJhY3Qgd2l0aCBhIEdvb2dsZSBNYXAgR3JvdW5kT3ZlcmxheSBiZWZvcmUgaXQgaGFzIGJlZW4gaW5pdGlhbGl6ZWQuICcgK1xuICAgICAgICAgICdQbGVhc2Ugd2FpdCBmb3IgdGhlIEdyb3VuZE92ZXJsYXkgdG8gbG9hZCBiZWZvcmUgdHJ5aW5nIHRvIGludGVyYWN0IHdpdGggaXQuJyk7XG4gICAgfVxuICB9XG59XG4iXX0=