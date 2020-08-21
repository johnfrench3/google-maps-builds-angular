/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="googlemaps" />
import { Directive, Input, NgZone, Output, } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { GoogleMap } from '../google-map/google-map';
import { MapEventManager } from '../map-event-manager';
/**
 * Angular component that renders a Google Maps KML Layer via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/kml#KmlLayer
 */
export class MapKmlLayer {
    constructor(_map, _ngZone) {
        this._map = _map;
        this._ngZone = _ngZone;
        this._eventManager = new MapEventManager(this._ngZone);
        this._options = new BehaviorSubject({});
        this._url = new BehaviorSubject('');
        this._destroyed = new Subject();
        /**
         * See developers.google.com/maps/documentation/javascript/reference/kml#KmlLayer.click
         */
        this.kmlClick = this._eventManager.getLazyEmitter('click');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/kml
         * #KmlLayer.defaultviewport_changed
         */
        this.defaultviewportChanged = this._eventManager.getLazyEmitter('defaultviewport_changed');
        /**
         * See developers.google.com/maps/documentation/javascript/reference/kml#KmlLayer.status_changed
         */
        this.statusChanged = this._eventManager.getLazyEmitter('status_changed');
    }
    set options(options) {
        this._options.next(options || {});
    }
    set url(url) {
        this._url.next(url);
    }
    ngOnInit() {
        if (this._map._isBrowser) {
            this._combineOptions().pipe(take(1)).subscribe(options => {
                // Create the object outside the zone so its events don't trigger change detection.
                // We'll bring it back in inside the `MapEventManager` only for the events that the
                // user has subscribed to.
                this._ngZone.runOutsideAngular(() => this.kmlLayer = new google.maps.KmlLayer(options));
                this._assertInitialized();
                this.kmlLayer.setMap(this._map.googleMap);
                this._eventManager.setTarget(this.kmlLayer);
            });
            this._watchForOptionsChanges();
            this._watchForUrlChanges();
        }
    }
    ngOnDestroy() {
        this._eventManager.destroy();
        this._destroyed.next();
        this._destroyed.complete();
        if (this.kmlLayer) {
            this.kmlLayer.setMap(null);
        }
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/kml#KmlLayer.getDefaultViewport
     */
    getDefaultViewport() {
        this._assertInitialized();
        return this.kmlLayer.getDefaultViewport();
    }
    /**
     * See developers.google.com/maps/documentation/javascript/reference/kml#KmlLayer.getMetadata
     */
    getMetadata() {
        this._assertInitialized();
        return this.kmlLayer.getMetadata();
    }
    /**
     * See developers.google.com/maps/documentation/javascript/reference/kml#KmlLayer.getStatus
     */
    getStatus() {
        this._assertInitialized();
        return this.kmlLayer.getStatus();
    }
    /**
     * See developers.google.com/maps/documentation/javascript/reference/kml#KmlLayer.getUrl
     */
    getUrl() {
        this._assertInitialized();
        return this.kmlLayer.getUrl();
    }
    /**
     * See developers.google.com/maps/documentation/javascript/reference/kml#KmlLayer.getZIndex
     */
    getZIndex() {
        this._assertInitialized();
        return this.kmlLayer.getZIndex();
    }
    _combineOptions() {
        return combineLatest([this._options, this._url]).pipe(map(([options, url]) => {
            const combinedOptions = Object.assign(Object.assign({}, options), { url: url || options.url });
            return combinedOptions;
        }));
    }
    _watchForOptionsChanges() {
        this._options.pipe(takeUntil(this._destroyed)).subscribe(options => {
            if (this.kmlLayer) {
                this._assertInitialized();
                this.kmlLayer.setOptions(options);
            }
        });
    }
    _watchForUrlChanges() {
        this._url.pipe(takeUntil(this._destroyed)).subscribe(url => {
            if (url && this.kmlLayer) {
                this._assertInitialized();
                this.kmlLayer.setUrl(url);
            }
        });
    }
    _assertInitialized() {
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
            if (!this._map.googleMap) {
                throw Error('Cannot access Google Map information before the API has been initialized. ' +
                    'Please wait for the API to load before trying to interact with it.');
            }
            if (!this.kmlLayer) {
                throw Error('Cannot interact with a Google Map KmlLayer before it has been ' +
                    'initialized. Please wait for the KmlLayer to load before trying to interact with it.');
            }
        }
    }
}
MapKmlLayer.decorators = [
    { type: Directive, args: [{
                selector: 'map-kml-layer',
                exportAs: 'mapKmlLayer',
            },] }
];
MapKmlLayer.ctorParameters = () => [
    { type: GoogleMap },
    { type: NgZone }
];
MapKmlLayer.propDecorators = {
    options: [{ type: Input }],
    url: [{ type: Input }],
    kmlClick: [{ type: Output }],
    defaultviewportChanged: [{ type: Output }],
    statusChanged: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWttbC1sYXllci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9nb29nbGUtbWFwcy9tYXAta21sLWxheWVyL21hcC1rbWwtbGF5ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgseUVBQXlFO0FBQ3pFLG9DQUFvQztBQUVwQyxPQUFPLEVBQ0wsU0FBUyxFQUNULEtBQUssRUFDTCxNQUFNLEVBR04sTUFBTSxHQUNQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxlQUFlLEVBQUUsYUFBYSxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDekUsT0FBTyxFQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFcEQsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQ25ELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUVyRDs7OztHQUlHO0FBS0gsTUFBTSxPQUFPLFdBQVc7SUE4Q3RCLFlBQTZCLElBQWUsRUFBVSxPQUFlO1FBQXhDLFNBQUksR0FBSixJQUFJLENBQVc7UUFBVSxZQUFPLEdBQVAsT0FBTyxDQUFRO1FBN0M3RCxrQkFBYSxHQUFHLElBQUksZUFBZSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN6QyxhQUFRLEdBQUcsSUFBSSxlQUFlLENBQThCLEVBQUUsQ0FBQyxDQUFDO1FBQ2hFLFNBQUksR0FBRyxJQUFJLGVBQWUsQ0FBUyxFQUFFLENBQUMsQ0FBQztRQUV2QyxlQUFVLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQztRQW1CbEQ7O1dBRUc7UUFFSCxhQUFRLEdBQ0osSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQTRCLE9BQU8sQ0FBQyxDQUFDO1FBRTFFOzs7O1dBSUc7UUFFSCwyQkFBc0IsR0FDbEIsSUFBSSxD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UUFBUSxFQUFFO2dCQUNsQixNQUFNLEtBQUssQ0FDUCxnRUFBZ0U7b0JBQ2hFLHNGQUFzRixDQUFDLENBQUM7YUFDN0Y7U0FDRjtJQUNILENBQUM7OztZQWhLRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGVBQWU7Z0JBQ3pCLFFBQVEsRUFBRSxhQUFhO2FBQ3hCOzs7WUFYTyxTQUFTO1lBUmYsTUFBTTs7O3NCQWtDTCxLQUFLO2tCQUtMLEtBQUs7dUJBUUwsTUFBTTtxQ0FTTixNQUFNOzRCQU9OLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLy8gV29ya2Fyb3VuZCBmb3I6IGh0dHBzOi8vZ2l0aHViLmNvbS9iYXplbGJ1aWxkL3J1bGVzX25vZGVqcy9pc3N1ZXMvMTI2NVxuLy8vIDxyZWZlcmVuY2UgdHlwZXM9XCJnb29nbGVtYXBzXCIgLz5cblxuaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3V0cHV0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7QmVoYXZpb3JTdWJqZWN0LCBjb21iaW5lTGF0ZXN0LCBPYnNlcnZhYmxlLCBTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7bWFwLCB0YWtlLCB0YWtlVW50aWx9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtHb29nbGVNYXB9IGZyb20gJy4uL2dvb2dsZS1tYXAvZ29vZ2xlLW1hcCc7XG5pbXBvcnQge01hcEV2ZW50TWFuYWdlcn0gZnJvbSAnLi4vbWFwLWV2ZW50LW1hbmFnZXInO1xuXG4vKipcbiAqIEFuZ3VsYXIgY29tcG9uZW50IHRoYXQgcmVuZGVycyBhIEdvb2dsZSBNYXBzIEtNTCBMYXllciB2aWEgdGhlIEdvb2dsZSBNYXBzIEphdmFTY3JpcHQgQVBJLlxuICpcbiAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2ttbCNLbWxMYXllclxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXAta21sLWxheWVyJyxcbiAgZXhwb3J0QXM6ICdtYXBLbWxMYXllcicsXG59KVxuZXhwb3J0IGNsYXNzIE1hcEttbExheWVyIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICBwcml2YXRlIF9ldmVudE1hbmFnZXIgPSBuZXcgTWFwRXZlbnRNYW5hZ2VyKHRoaXMuX25nWm9uZSk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX29wdGlvbnMgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PGdvb2dsZS5tYXBzLkttbExheWVyT3B0aW9ucz4oe30pO1xuICBwcml2YXRlIHJlYWRvbmx5IF91cmwgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PHN0cmluZz4oJycpO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgX2Rlc3Ryb3llZCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqXG4gICAqIFRoZSB1bmRlcmx5aW5nIGdvb2dsZS5tYXBzLkttbExheWVyIG9iamVjdC5cbiAgICpcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2Uva21sI0ttbExheWVyXG4gICAqL1xuICBrbWxMYXllcj86IGdvb2dsZS5tYXBzLkttbExheWVyO1xuXG4gIEBJbnB1dCgpXG4gIHNldCBvcHRpb25zKG9wdGlvbnM6IGdvb2dsZS5tYXBzLkttbExheWVyT3B0aW9ucykge1xuICAgIHRoaXMuX29wdGlvbnMubmV4dChvcHRpb25zIHx8IHt9KTtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIHNldCB1cmwodXJsOiBzdHJpbmcpIHtcbiAgICB0aGlzLl91cmwubmV4dCh1cmwpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2ttbCNLbWxMYXllci5jbGlja1xuICAgKi9cbiAgQE91dHB1dCgpXG4gIGttbENsaWNrOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLkttbE1vdXNlRXZlbnQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5LbWxNb3VzZUV2ZW50PignY2xpY2snKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2Uva21sXG4gICAqICNLbWxMYXllci5kZWZhdWx0dmlld3BvcnRfY2hhbmdlZFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIGRlZmF1bHR2aWV3cG9ydENoYW5nZWQ6IE9ic2VydmFibGU8dm9pZD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCdkZWZhdWx0dmlld3BvcnRfY2hhbmdlZCcpO1xuXG4gIC8qKlxuICAgKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9rbWwjS21sTGF5ZXIuc3RhdHVzX2NoYW5nZWRcbiAgICovXG4gIEBPdXRwdXQoKVxuICBzdGF0dXNDaGFuZ2VkOiBPYnNlcnZhYmxlPHZvaWQ+ID0gdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCdzdGF0dXNfY2hhbmdlZCcpO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgX21hcDogR29vZ2xlTWFwLCBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSkge31cblxuICBuZ09uSW5pdCgpIHtcbiAgICBpZiAodGhpcy5fbWFwLl9pc0Jyb3dzZXIpIHtcbiAgICAgIHRoaXMuX2NvbWJpbmVPcHRpb25zKCkucGlwZSh0YWtlKDEpKS5zdWJzY3JpYmUob3B0aW9ucyA9PiB7XG4gICAgICAgIC8vIENyZWF0ZSB0aGUgb2JqZWN0IG91dHNpZGUgdGhlIHpvbmUgc28gaXRzIGV2ZW50cyBkb24ndCB0cmlnZ2VyIGNoYW5nZSBkZXRlY3Rpb24uXG4gICAgICAgIC8vIFdlJ2xsIGJyaW5nIGl0IGJhY2sgaW4gaW5zaWRlIHRoZSBgTWFwRXZlbnRNYW5hZ2VyYCBvbmx5IGZvciB0aGUgZXZlbnRzIHRoYXQgdGhlXG4gICAgICAgIC8vIHVzZXIgaGFzIHN1YnNjcmliZWQgdG8uXG4gICAgICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB0aGlzLmttbExheWVyID0gbmV3IGdvb2dsZS5tYXBzLkttbExheWVyKG9wdGlvbnMpKTtcbiAgICAgICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICAgICAgdGhpcy5rbWxMYXllci5zZXRNYXAodGhpcy5fbWFwLmdvb2dsZU1hcCEpO1xuICAgICAgICB0aGlzLl9ldmVudE1hbmFnZXIuc2V0VGFyZ2V0KHRoaXMua21sTGF5ZXIpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuX3dhdGNoRm9yT3B0aW9uc0NoYW5nZXMoKTtcbiAgICAgIHRoaXMuX3dhdGNoRm9yVXJsQ2hhbmdlcygpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5kZXN0cm95KCk7XG4gICAgdGhpcy5fZGVzdHJveWVkLm5leHQoKTtcbiAgICB0aGlzLl9kZXN0cm95ZWQuY29tcGxldGUoKTtcbiAgICBpZiAodGhpcy5rbWxMYXllcikge1xuICAgICAgdGhpcy5rbWxMYXllci5zZXRNYXAobnVsbCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2ttbCNLbWxMYXllci5nZXREZWZhdWx0Vmlld3BvcnRcbiAgICovXG4gIGdldERlZmF1bHRWaWV3cG9ydCgpOiBnb29nbGUubWFwcy5MYXRMbmdCb3VuZHMge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMua21sTGF5ZXIuZ2V0RGVmYXVsdFZpZXdwb3J0KCk7XG4gIH1cblxuICAvKipcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2Uva21sI0ttbExheWVyLmdldE1ldGFkYXRhXG4gICAqL1xuICBnZXRNZXRhZGF0YSgpOiBnb29nbGUubWFwcy5LbWxMYXllck1ldGFkYXRhIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmttbExheWVyLmdldE1ldGFkYXRhKCk7XG4gIH1cblxuICAvKipcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2Uva21sI0ttbExheWVyLmdldFN0YXR1c1xuICAgKi9cbiAgZ2V0U3RhdHVzKCk6IGdvb2dsZS5tYXBzLkttbExheWVyU3RhdHVzIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmttbExheWVyLmdldFN0YXR1cygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2ttbCNLbWxMYXllci5nZXRVcmxcbiAgICovXG4gIGdldFVybCgpOiBzdHJpbmcge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMua21sTGF5ZXIuZ2V0VXJsKCk7XG4gIH1cblxuICAvKipcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2Uva21sI0ttbExheWVyLmdldFpJbmRleFxuICAgKi9cbiAgZ2V0WkluZGV4KCk6IG51bWJlciB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5rbWxMYXllci5nZXRaSW5kZXgoKTtcbiAgfVxuXG4gIHByaXZhdGUgX2NvbWJpbmVPcHRpb25zKCk6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuS21sTGF5ZXJPcHRpb25zPiB7XG4gICAgcmV0dXJuIGNvbWJpbmVMYXRlc3QoW3RoaXMuX29wdGlvbnMsIHRoaXMuX3VybF0pLnBpcGUobWFwKChbb3B0aW9ucywgdXJsXSkgPT4ge1xuICAgICAgY29uc3QgY29tYmluZWRPcHRpb25zOiBnb29nbGUubWFwcy5LbWxMYXllck9wdGlvbnMgPSB7XG4gICAgICAgIC4uLm9wdGlvbnMsXG4gICAgICAgIHVybDogdXJsIHx8IG9wdGlvbnMudXJsLFxuICAgICAgfTtcbiAgICAgIHJldHVybiBjb21iaW5lZE9wdGlvbnM7XG4gICAgfSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBfd2F0Y2hGb3JPcHRpb25zQ2hhbmdlcygpIHtcbiAgICB0aGlzLl9vcHRpb25zLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpLnN1YnNjcmliZShvcHRpb25zID0+IHtcbiAgICAgIGlmICh0aGlzLmttbExheWVyKSB7XG4gICAgICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgICAgIHRoaXMua21sTGF5ZXIuc2V0T3B0aW9ucyhvcHRpb25zKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3dhdGNoRm9yVXJsQ2hhbmdlcygpIHtcbiAgICB0aGlzLl91cmwucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKHVybCA9PiB7XG4gICAgICBpZiAodXJsICYmIHRoaXMua21sTGF5ZXIpIHtcbiAgICAgICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICAgICAgdGhpcy5rbWxMYXllci5zZXRVcmwodXJsKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2Fzc2VydEluaXRpYWxpemVkKCk6IGFzc2VydHMgdGhpcyBpcyB7IGttbExheWVyOiBnb29nbGUubWFwcy5LbWxMYXllciB9IHtcbiAgICBpZiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSB7XG4gICAgICBpZiAoIXRoaXMuX21hcC5nb29nbGVNYXApIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICAgICAnQ2Fubm90IGFjY2VzcyBHb29nbGUgTWFwIGluZm9ybWF0aW9uIGJlZm9yZSB0aGUgQVBJIGhhcyBiZWVuIGluaXRpYWxpemVkLiAnICtcbiAgICAgICAgICAgICdQbGVhc2Ugd2FpdCBmb3IgdGhlIEFQSSB0byBsb2FkIGJlZm9yZSB0cnlpbmcgdG8gaW50ZXJhY3Qgd2l0aCBpdC4nKTtcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5rbWxMYXllcikge1xuICAgICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICAgICdDYW5ub3QgaW50ZXJhY3Qgd2l0aCBhIEdvb2dsZSBNYXAgS21sTGF5ZXIgYmVmb3JlIGl0IGhhcyBiZWVuICcgK1xuICAgICAgICAgICAgJ2luaXRpYWxpemVkLiBQbGVhc2Ugd2FpdCBmb3IgdGhlIEttbExheWVyIHRvIGxvYWQgYmVmb3JlIHRyeWluZyB0byBpbnRlcmFjdCB3aXRoIGl0LicpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19