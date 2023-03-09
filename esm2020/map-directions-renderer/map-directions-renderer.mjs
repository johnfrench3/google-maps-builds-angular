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
import { Directive, Input, NgZone, Output, } from '@angular/core';
import { Observable } from 'rxjs';
import { GoogleMap } from '../google-map/google-map';
import { MapEventManager } from '../map-event-manager';
import * as i0 from "@angular/core";
import * as i1 from "../google-map/google-map";
/**
 * Angular component that renders a Google Maps Directions Renderer via the Google Maps
 * JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/directions#DirectionsRenderer
 */
class MapDirectionsRenderer {
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
        return {
            ...options,
            directions: this._directions || options.directions,
            map: this._googleMap.googleMap,
        };
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
MapDirectionsRenderer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0-next.2", ngImport: i0, type: MapDirectionsRenderer, deps: [{ token: i1.GoogleMap }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive });
MapDirectionsRenderer.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0-next.2", type: MapDirectionsRenderer, selector: "map-directions-renderer", inputs: { directions: "directions", options: "options" }, outputs: { directionsChanged: "directionsChanged" }, exportAs: ["mapDirectionsRenderer"], usesOnChanges: true, ngImport: i0 });
export { MapDirectionsRenderer };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0-next.2", ngImport: i0, type: MapDirectionsRenderer, decorators: [{
            type: Directive,
            args: [{
                    selector: 'map-directions-renderer',
                    exportAs: 'mapDirectionsRenderer',
                }]
        }], ctorParameters: function () { return [{ type: i1.GoogleMap }, { type: i0.NgZone }]; }, propDecorators: { directions: [{
                type: Input
            }], options: [{
                type: Input
            }], directionsChanged: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWRpcmVjdGlvbnMtcmVuZGVyZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvZ29vZ2xlLW1hcHMvbWFwLWRpcmVjdGlvbnMtcmVuZGVyZXIvbWFwLWRpcmVjdGlvbnMtcmVuZGVyZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBU0EscUNBQXFDO0FBVHJDOzs7Ozs7R0FNRztBQUVILHlFQUF5RTtBQUN6RSxxQ0FBcUM7QUFFckMsT0FBTyxFQUNMLFNBQVMsRUFDVCxLQUFLLEVBQ0wsTUFBTSxFQUlOLE1BQU0sR0FFUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQ2hDLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUNuRCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7OztBQUVyRDs7Ozs7R0FLRztBQUNILE1BSWEscUJBQXFCO0lBR2hDOzs7T0FHRztJQUNILElBQ0ksVUFBVSxDQUFDLFVBQXdDO1FBQ3JELElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO0lBQ2hDLENBQUM7SUFHRDs7O09BR0c7SUFDSCxJQUNJLE9BQU8sQ0FBQyxPQUE4QztRQUN4RCxJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztJQUMxQixDQUFDO0lBY0QsWUFBNkIsVUFBcUIsRUFBVSxPQUFlO1FBQTlDLGVBQVUsR0FBVixVQUFVLENBQVc7UUFBVSxZQUFPLEdBQVAsT0FBTyxDQUFRO1FBakNuRSxrQkFBYSxHQUFHLElBQUksZUFBZSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQXNCMUQ7OztXQUdHO1FBRU0sc0JBQWlCLEdBQ3hCLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFPLG9CQUFvQixDQUFDLENBQUM7SUFLYyxDQUFDO0lBRS9FLFFBQVE7UUFDTixJQUFJLElBQUksQ0FBQyxV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Q25DLFFBQVEsRUFBRSx1QkFBdUI7aUJBQ2xDO3FIQVNLLFVBQVU7c0JBRGIsS0FBSztnQkFXRixPQUFPO3NCQURWLEtBQUs7Z0JBV0csaUJBQWlCO3NCQUR6QixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8vIFdvcmthcm91bmQgZm9yOiBodHRwczovL2dpdGh1Yi5jb20vYmF6ZWxidWlsZC9ydWxlc19ub2RlanMvaXNzdWVzLzEyNjVcbi8vLyA8cmVmZXJlbmNlIHR5cGVzPVwiZ29vZ2xlLm1hcHNcIiAvPlxuXG5pbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgU2ltcGxlQ2hhbmdlcyxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtHb29nbGVNYXB9IGZyb20gJy4uL2dvb2dsZS1tYXAvZ29vZ2xlLW1hcCc7XG5pbXBvcnQge01hcEV2ZW50TWFuYWdlcn0gZnJvbSAnLi4vbWFwLWV2ZW50LW1hbmFnZXInO1xuXG4vKipcbiAqIEFuZ3VsYXIgY29tcG9uZW50IHRoYXQgcmVuZGVycyBhIEdvb2dsZSBNYXBzIERpcmVjdGlvbnMgUmVuZGVyZXIgdmlhIHRoZSBHb29nbGUgTWFwc1xuICogSmF2YVNjcmlwdCBBUEkuXG4gKlxuICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvZGlyZWN0aW9ucyNEaXJlY3Rpb25zUmVuZGVyZXJcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWFwLWRpcmVjdGlvbnMtcmVuZGVyZXInLFxuICBleHBvcnRBczogJ21hcERpcmVjdGlvbnNSZW5kZXJlcicsXG59KVxuZXhwb3J0IGNsYXNzIE1hcERpcmVjdGlvbnNSZW5kZXJlciBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuICBwcml2YXRlIF9ldmVudE1hbmFnZXIgPSBuZXcgTWFwRXZlbnRNYW5hZ2VyKHRoaXMuX25nWm9uZSk7XG5cbiAgLyoqXG4gICAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2RpcmVjdGlvbnNcbiAgICogI0RpcmVjdGlvbnNSZW5kZXJlck9wdGlvbnMuZGlyZWN0aW9uc1xuICAgKi9cbiAgQElucHV0KClcbiAgc2V0IGRpcmVjdGlvbnMoZGlyZWN0aW9uczogZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1Jlc3VsdCkge1xuICAgIHRoaXMuX2RpcmVjdGlvbnMgPSBkaXJlY3Rpb25zO1xuICB9XG4gIHByaXZhdGUgX2RpcmVjdGlvbnM6IGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNSZXN1bHQ7XG5cbiAgLyoqXG4gICAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2RpcmVjdGlvbnNcbiAgICogI0RpcmVjdGlvbnNSZW5kZXJlck9wdGlvbnNcbiAgICovXG4gIEBJbnB1dCgpXG4gIHNldCBvcHRpb25zKG9wdGlvbnM6IGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNSZW5kZXJlck9wdGlvbnMpIHtcbiAgICB0aGlzLl9vcHRpb25zID0gb3B0aW9ucztcbiAgfVxuICBwcml2YXRlIF9vcHRpb25zOiBnb29nbGUubWFwcy5EaXJlY3Rpb25zUmVuZGVyZXJPcHRpb25zO1xuXG4gIC8qKlxuICAgKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9kaXJlY3Rpb25zXG4gICAqICNEaXJlY3Rpb25zUmVuZGVyZXIuZGlyZWN0aW9uc19jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KClcbiAgcmVhZG9ubHkgZGlyZWN0aW9uc0NoYW5nZWQ6IE9ic2VydmFibGU8dm9pZD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPignZGlyZWN0aW9uc19jaGFuZ2VkJyk7XG5cbiAgLyoqIFRoZSB1bmRlcmx5aW5nIGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNSZW5kZXJlciBvYmplY3QuICovXG4gIGRpcmVjdGlvbnNSZW5kZXJlcj86IGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNSZW5kZXJlcjtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IF9nb29nbGVNYXA6IEdvb2dsZU1hcCwgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUpIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKHRoaXMuX2dvb2dsZU1hcC5faXNCcm93c2VyKSB7XG4gICAgICAvLyBDcmVhdGUgdGhlIG9iamVjdCBvdXRzaWRlIHRoZSB6b25lIHNvIGl0cyBldmVudHMgZG9uJ3QgdHJpZ2dlciBjaGFuZ2UgZGV0ZWN0aW9uLlxuICAgICAgLy8gV2UnbGwgYnJpbmcgaXQgYmFjayBpbiBpbnNpZGUgdGhlIGBNYXBFdmVudE1hbmFnZXJgIG9ubHkgZm9yIHRoZSBldmVudHMgdGhhdCB0aGVcbiAgICAgIC8vIHVzZXIgaGFzIHN1YnNjcmliZWQgdG8uXG4gICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICB0aGlzLmRpcmVjdGlvbnNSZW5kZXJlciA9IG5ldyBnb29nbGUubWFwcy5EaXJlY3Rpb25zUmVuZGVyZXIodGhpcy5fY29tYmluZU9wdGlvbnMoKSk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgICB0aGlzLmRpcmVjdGlvbnNSZW5kZXJlci5zZXRNYXAodGhpcy5fZ29vZ2xlTWFwLmdvb2dsZU1hcCEpO1xuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLnNldFRhcmdldCh0aGlzLmRpcmVjdGlvbnNSZW5kZXJlcik7XG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmICh0aGlzLmRpcmVjdGlvbnNSZW5kZXJlcikge1xuICAgICAgaWYgKGNoYW5nZXNbJ29wdGlvbnMnXSkge1xuICAgICAgICB0aGlzLmRpcmVjdGlvbnNSZW5kZXJlci5zZXRPcHRpb25zKHRoaXMuX2NvbWJpbmVPcHRpb25zKCkpO1xuICAgICAgfVxuXG4gICAgICBpZiAoY2hhbmdlc1snZGlyZWN0aW9ucyddICYmIHRoaXMuX2RpcmVjdGlvbnMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLmRpcmVjdGlvbnNSZW5kZXJlci5zZXREaXJlY3Rpb25zKHRoaXMuX2RpcmVjdGlvbnMpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5kZXN0cm95KCk7XG4gICAgaWYgKHRoaXMuZGlyZWN0aW9uc1JlbmRlcmVyKSB7XG4gICAgICB0aGlzLmRpcmVjdGlvbnNSZW5kZXJlci5zZXRNYXAobnVsbCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2RpcmVjdGlvbnNcbiAgICogI0RpcmVjdGlvbnNSZW5kZXJlci5nZXREaXJlY3Rpb25zXG4gICAqL1xuICBnZXREaXJlY3Rpb25zKCk6IGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNSZXN1bHQgfCBudWxsIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmRpcmVjdGlvbnNSZW5kZXJlci5nZXREaXJlY3Rpb25zKCk7XG4gIH1cblxuICAvKipcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvZGlyZWN0aW9uc1xuICAgKiAjRGlyZWN0aW9uc1JlbmRlcmVyLmdldFBhbmVsXG4gICAqL1xuICBnZXRQYW5lbCgpOiBOb2RlIHwgbnVsbCB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5kaXJlY3Rpb25zUmVuZGVyZXIuZ2V0UGFuZWwoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9kaXJlY3Rpb25zXG4gICAqICNEaXJlY3Rpb25zUmVuZGVyZXIuZ2V0Um91dGVJbmRleFxuICAgKi9cbiAgZ2V0Um91dGVJbmRleCgpOiBudW1iZXIge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMuZGlyZWN0aW9uc1JlbmRlcmVyLmdldFJvdXRlSW5kZXgoKTtcbiAgfVxuXG4gIHByaXZhdGUgX2NvbWJpbmVPcHRpb25zKCk6IGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNSZW5kZXJlck9wdGlvbnMge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLl9vcHRpb25zIHx8IHt9O1xuICAgIHJldHVybiB7XG4gICAgICAuLi5vcHRpb25zLFxuICAgICAgZGlyZWN0aW9uczogdGhpcy5fZGlyZWN0aW9ucyB8fCBvcHRpb25zLmRpcmVjdGlvbnMsXG4gICAgICBtYXA6IHRoaXMuX2dvb2dsZU1hcC5nb29nbGVNYXAsXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgX2Fzc2VydEluaXRpYWxpemVkKCk6IGFzc2VydHMgdGhpcyBpcyB7XG4gICAgZGlyZWN0aW9uc1JlbmRlcmVyOiBnb29nbGUubWFwcy5EaXJlY3Rpb25zUmVuZGVyZXI7XG4gIH0ge1xuICAgIGlmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpIHtcbiAgICAgIGlmICghdGhpcy5fZ29vZ2xlTWFwLmdvb2dsZU1hcCkge1xuICAgICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICAnQ2Fubm90IGFjY2VzcyBHb29nbGUgTWFwIGluZm9ybWF0aW9uIGJlZm9yZSB0aGUgQVBJIGhhcyBiZWVuIGluaXRpYWxpemVkLiAnICtcbiAgICAgICAgICAgICdQbGVhc2Ugd2FpdCBmb3IgdGhlIEFQSSB0byBsb2FkIGJlZm9yZSB0cnlpbmcgdG8gaW50ZXJhY3Qgd2l0aCBpdC4nLFxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLmRpcmVjdGlvbnNSZW5kZXJlcikge1xuICAgICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICAnQ2Fubm90IGludGVyYWN0IHdpdGggYSBHb29nbGUgTWFwIERpcmVjdGlvbnMgUmVuZGVyZXIgYmVmb3JlIGl0IGhhcyBiZWVuICcgK1xuICAgICAgICAgICAgJ2luaXRpYWxpemVkLiBQbGVhc2Ugd2FpdCBmb3IgdGhlIERpcmVjdGlvbnMgUmVuZGVyZXIgdG8gbG9hZCBiZWZvcmUgdHJ5aW5nICcgK1xuICAgICAgICAgICAgJ3RvIGludGVyYWN0IHdpdGggaXQuJyxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==