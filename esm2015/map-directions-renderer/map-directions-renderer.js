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
import { Observable } from 'rxjs';
import { GoogleMap } from '../google-map/google-map';
import { MapEventManager } from '../map-event-manager';
/**
 * Angular component that renders a Google Maps Directions Renderer via the Google Maps
 * JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/directions#DirectionsRenderer
 */
export class MapDirectionsRenderer {
    constructor(_googleMap, _ngZone) {
        this._googleMap = _googleMap;
        this._ngZone = _ngZone;
        this._eventManager = new MapEventManager(this._ngZone);
        /**
         * See developers.google.com/maps/documentation/javascript/reference/directions
         * #DirectionsRenderer.directions_changed
         */
        this.directionsChanged = this._eventManager.getLazyEmitter('directions_changed');
    }
    /**
     * See developers.google.com/maps/documentation/javascript/reference/directions
     * #DirectionsRendererOptions.directions
     */
    set directions(directions) {
        this._directions = directions;
    }
    /**
     * See developers.google.com/maps/documentation/javascript/reference/directions
     * #DirectionsRendererOptions
     */
    set options(options) {
        this._options = options;
    }
    ngOnInit() {
        if (this._googleMap._isBrowser) {
            // Create the object outside the zone so its events don't trigger change detection.
            // We'll bring it back in inside the `MapEventManager` only for the events that the
            // user has subscribed to.
            this._ngZone.runOutsideAngular(() => {
                this.directionsRenderer = new google.maps.DirectionsRenderer(this._combineOptions());
            });
            this._assertInitialized();
            this.directionsRenderer.setMap(this._googleMap.googleMap);
            this._eventManager.setTarget(this.directionsRenderer);
        }
    }
    ngOnChanges(changes) {
        if (this.directionsRenderer) {
            if (changes['options']) {
                this.directionsRenderer.setOptions(this._combineOptions());
            }
            if (changes['directions'] && this._directions !== undefined) {
                this.directionsRenderer.setDirections(this._directions);
            }
        }
    }
    ngOnDestroy() {
        this._eventManager.destroy();
        if (this.directionsRenderer) {
            this.directionsRenderer.setMap(null);
        }
    }
    /**
     * See developers.google.com/maps/documentation/javascript/reference/directions
     * #DirectionsRenderer.getDirections
     */
    getDirections() {
        this._assertInitialized();
        return this.directionsRenderer.getDirections();
    }
    /**
     * See developers.google.com/maps/documentation/javascript/reference/directions
     * #DirectionsRenderer.getPanel
     */
    getPanel() {
        this._assertInitialized();
        return this.directionsRenderer.getPanel();
    }
    /**
     * See developers.google.com/maps/documentation/javascript/reference/directions
     * #DirectionsRenderer.getRouteIndex
     */
    getRouteIndex() {
        this._assertInitialized();
        return this.directionsRenderer.getRouteIndex();
    }
    _combineOptions() {
        const options = this._options || {};
        return Object.assign(Object.assign({}, options), { directions: this._directions || options.directions, map: this._googleMap.googleMap });
    }
    _assertInitialized() {
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
            if (!this._googleMap.googleMap) {
                throw Error('Cannot access Google Map information before the API has been initialized. ' +
                    'Please wait for the API to load before trying to interact with it.');
            }
            if (!this.directionsRenderer) {
                throw Error('Cannot interact with a Google Map Directions Renderer before it has been ' +
                    'initialized. Please wait for the Directions Renderer to load before trying ' +
                    'to interact with it.');
            }
        }
    }
}
MapDirectionsRenderer.decorators = [
    { type: Directive, args: [{
                selector: 'map-directions-renderer',
                exportAs: 'mapDirectionsRenderer',
            },] }
];
MapDirectionsRenderer.ctorParameters = () => [
    { type: GoogleMap },
    { type: NgZone }
];
MapDirectionsRenderer.propDecorators = {
    directions: [{ type: Input }],
    options: [{ type: Input }],
    directionsChanged: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWRpcmVjdGlvbnMtcmVuZGVyZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvZ29vZ2xlLW1hcHMvbWFwLWRpcmVjdGlvbnMtcmVuZGVyZXIvbWFwLWRpcmVjdGlvbnMtcmVuZGVyZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgseUVBQXlFO0FBQ3pFLG9DQUFvQztBQUVwQyxPQUFPLEVBQ0wsU0FBUyxFQUNULEtBQUssRUFDTCxNQUFNLEVBSU4sTUFBTSxFQUVQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDaEMsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQ25ELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUVyRDs7Ozs7R0FLRztBQUtILE1BQU0sT0FBTyxxQkFBcUI7SUFrQ2hDLFlBQTZCLFVBQXFCLEVBQVUsT0FBZTtRQUE5QyxlQUFVLEdBQVYsVUFBVSxDQUFXO1FBQVUsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQWpDbkUsa0JBQWEsR0FBRyxJQUFJLGVBQWUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFzQjFEOzs7V0FHRztRQUVNLHNCQUFpQixHQUN0QixJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBTyxvQkFBb0IsQ0FBQyxDQUFDO0lBS1ksQ0FBQztJQS9CL0U7OztPQUdHO0lBQ0gsSUFDSSxVQUFVLENBQUMsVUFBd0M7UUFDckQsSUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUM7SUFDaEMsQ0FBQztJQUdEOzs7T0FHRztJQUNILElBQ0ksT0FBTyxDQUFDLE9BQThDO1FBQ3hELElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO0lBQzFCLENBQUM7SUFnQkQsUUFBUTtRQUNOLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FB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VUwsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vLyBXb3JrYXJvdW5kIGZvcjogaHR0cHM6Ly9naXRodWIuY29tL2JhemVsYnVpbGQvcnVsZXNfbm9kZWpzL2lzc3Vlcy8xMjY1XG4vLy8gPHJlZmVyZW5jZSB0eXBlcz1cImdvb2dsZW1hcHNcIiAvPlxuXG5pbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgU2ltcGxlQ2hhbmdlc1xufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XG5pbXBvcnQge0dvb2dsZU1hcH0gZnJvbSAnLi4vZ29vZ2xlLW1hcC9nb29nbGUtbWFwJztcbmltcG9ydCB7TWFwRXZlbnRNYW5hZ2VyfSBmcm9tICcuLi9tYXAtZXZlbnQtbWFuYWdlcic7XG5cbi8qKlxuICogQW5ndWxhciBjb21wb25lbnQgdGhhdCByZW5kZXJzIGEgR29vZ2xlIE1hcHMgRGlyZWN0aW9ucyBSZW5kZXJlciB2aWEgdGhlIEdvb2dsZSBNYXBzXG4gKiBKYXZhU2NyaXB0IEFQSS5cbiAqXG4gKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9kaXJlY3Rpb25zI0RpcmVjdGlvbnNSZW5kZXJlclxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXAtZGlyZWN0aW9ucy1yZW5kZXJlcicsXG4gIGV4cG9ydEFzOiAnbWFwRGlyZWN0aW9uc1JlbmRlcmVyJyxcbn0pXG5leHBvcnQgY2xhc3MgTWFwRGlyZWN0aW9uc1JlbmRlcmVyIGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX2V2ZW50TWFuYWdlciA9IG5ldyBNYXBFdmVudE1hbmFnZXIodGhpcy5fbmdab25lKTtcblxuICAvKipcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvZGlyZWN0aW9uc1xuICAgKiAjRGlyZWN0aW9uc1JlbmRlcmVyT3B0aW9ucy5kaXJlY3Rpb25zXG4gICAqL1xuICBASW5wdXQoKVxuICBzZXQgZGlyZWN0aW9ucyhkaXJlY3Rpb25zOiBnb29nbGUubWFwcy5EaXJlY3Rpb25zUmVzdWx0KSB7XG4gICAgdGhpcy5fZGlyZWN0aW9ucyA9IGRpcmVjdGlvbnM7XG4gIH1cbiAgcHJpdmF0ZSBfZGlyZWN0aW9uczogZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1Jlc3VsdDtcblxuICAvKipcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvZGlyZWN0aW9uc1xuICAgKiAjRGlyZWN0aW9uc1JlbmRlcmVyT3B0aW9uc1xuICAgKi9cbiAgQElucHV0KClcbiAgc2V0IG9wdGlvbnMob3B0aW9uczogZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1JlbmRlcmVyT3B0aW9ucykge1xuICAgIHRoaXMuX29wdGlvbnMgPSBvcHRpb25zO1xuICB9XG4gIHByaXZhdGUgX29wdGlvbnM6IGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNSZW5kZXJlck9wdGlvbnM7XG5cbiAgLyoqXG4gICAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2RpcmVjdGlvbnNcbiAgICogI0RpcmVjdGlvbnNSZW5kZXJlci5kaXJlY3Rpb25zX2NoYW5nZWRcbiAgICovXG4gIEBPdXRwdXQoKVxuICByZWFkb25seSBkaXJlY3Rpb25zQ2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2RpcmVjdGlvbnNfY2hhbmdlZCcpO1xuXG4gIC8qKiBUaGUgdW5kZXJseWluZyBnb29nbGUubWFwcy5EaXJlY3Rpb25zUmVuZGVyZXIgb2JqZWN0LiAqL1xuICBkaXJlY3Rpb25zUmVuZGVyZXI/OiBnb29nbGUubWFwcy5EaXJlY3Rpb25zUmVuZGVyZXI7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBfZ29vZ2xlTWFwOiBHb29nbGVNYXAsIHByaXZhdGUgX25nWm9uZTogTmdab25lKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICh0aGlzLl9nb29nbGVNYXAuX2lzQnJvd3Nlcikge1xuICAgICAgLy8gQ3JlYXRlIHRoZSBvYmplY3Qgb3V0c2lkZSB0aGUgem9uZSBzbyBpdHMgZXZlbnRzIGRvbid0IHRyaWdnZXIgY2hhbmdlIGRldGVjdGlvbi5cbiAgICAgIC8vIFdlJ2xsIGJyaW5nIGl0IGJhY2sgaW4gaW5zaWRlIHRoZSBgTWFwRXZlbnRNYW5hZ2VyYCBvbmx5IGZvciB0aGUgZXZlbnRzIHRoYXQgdGhlXG4gICAgICAvLyB1c2VyIGhhcyBzdWJzY3JpYmVkIHRvLlxuICAgICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgdGhpcy5kaXJlY3Rpb25zUmVuZGVyZXIgPSBuZXcgZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1JlbmRlcmVyKHRoaXMuX2NvbWJpbmVPcHRpb25zKCkpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgdGhpcy5kaXJlY3Rpb25zUmVuZGVyZXIuc2V0TWFwKHRoaXMuX2dvb2dsZU1hcC5nb29nbGVNYXAhKTtcbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5zZXRUYXJnZXQodGhpcy5kaXJlY3Rpb25zUmVuZGVyZXIpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAodGhpcy5kaXJlY3Rpb25zUmVuZGVyZXIpIHtcbiAgICAgIGlmIChjaGFuZ2VzWydvcHRpb25zJ10pIHtcbiAgICAgICAgdGhpcy5kaXJlY3Rpb25zUmVuZGVyZXIuc2V0T3B0aW9ucyh0aGlzLl9jb21iaW5lT3B0aW9ucygpKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNoYW5nZXNbJ2RpcmVjdGlvbnMnXSAmJiB0aGlzLl9kaXJlY3Rpb25zICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5kaXJlY3Rpb25zUmVuZGVyZXIuc2V0RGlyZWN0aW9ucyh0aGlzLl9kaXJlY3Rpb25zKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZGVzdHJveSgpO1xuICAgIGlmICh0aGlzLmRpcmVjdGlvbnNSZW5kZXJlcikge1xuICAgICAgdGhpcy5kaXJlY3Rpb25zUmVuZGVyZXIuc2V0TWFwKG51bGwpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9kaXJlY3Rpb25zXG4gICAqICNEaXJlY3Rpb25zUmVuZGVyZXIuZ2V0RGlyZWN0aW9uc1xuICAgKi9cbiAgZ2V0RGlyZWN0aW9ucygpOiBnb29nbGUubWFwcy5EaXJlY3Rpb25zUmVzdWx0IHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmRpcmVjdGlvbnNSZW5kZXJlci5nZXREaXJlY3Rpb25zKCk7XG4gIH1cblxuICAvKipcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvZGlyZWN0aW9uc1xuICAgKiAjRGlyZWN0aW9uc1JlbmRlcmVyLmdldFBhbmVsXG4gICAqL1xuICBnZXRQYW5lbCgpOiBOb2RlIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmRpcmVjdGlvbnNSZW5kZXJlci5nZXRQYW5lbCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2RpcmVjdGlvbnNcbiAgICogI0RpcmVjdGlvbnNSZW5kZXJlci5nZXRSb3V0ZUluZGV4XG4gICAqL1xuICBnZXRSb3V0ZUluZGV4KCk6IG51bWJlciB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5kaXJlY3Rpb25zUmVuZGVyZXIuZ2V0Um91dGVJbmRleCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBfY29tYmluZU9wdGlvbnMoKTogZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1JlbmRlcmVyT3B0aW9ucyB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMuX29wdGlvbnMgfHwge307XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgICBkaXJlY3Rpb25zOiB0aGlzLl9kaXJlY3Rpb25zIHx8IG9wdGlvbnMuZGlyZWN0aW9ucyxcbiAgICAgIG1hcDogdGhpcy5fZ29vZ2xlTWFwLmdvb2dsZU1hcCxcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBfYXNzZXJ0SW5pdGlhbGl6ZWQoKTpcbiAgICAgIGFzc2VydHMgdGhpcyBpcyB7ZGlyZWN0aW9uc1JlbmRlcmVyOiBnb29nbGUubWFwcy5EaXJlY3Rpb25zUmVuZGVyZXJ9IHtcbiAgICBpZiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSB7XG4gICAgICBpZiAoIXRoaXMuX2dvb2dsZU1hcC5nb29nbGVNYXApIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICAgICAnQ2Fubm90IGFjY2VzcyBHb29nbGUgTWFwIGluZm9ybWF0aW9uIGJlZm9yZSB0aGUgQVBJIGhhcyBiZWVuIGluaXRpYWxpemVkLiAnICtcbiAgICAgICAgICAgICdQbGVhc2Ugd2FpdCBmb3IgdGhlIEFQSSB0byBsb2FkIGJlZm9yZSB0cnlpbmcgdG8gaW50ZXJhY3Qgd2l0aCBpdC4nKTtcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5kaXJlY3Rpb25zUmVuZGVyZXIpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICAgICAnQ2Fubm90IGludGVyYWN0IHdpdGggYSBHb29nbGUgTWFwIERpcmVjdGlvbnMgUmVuZGVyZXIgYmVmb3JlIGl0IGhhcyBiZWVuICcgK1xuICAgICAgICAgICAgJ2luaXRpYWxpemVkLiBQbGVhc2Ugd2FpdCBmb3IgdGhlIERpcmVjdGlvbnMgUmVuZGVyZXIgdG8gbG9hZCBiZWZvcmUgdHJ5aW5nICcgK1xuICAgICAgICAgICAgJ3RvIGludGVyYWN0IHdpdGggaXQuJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0=