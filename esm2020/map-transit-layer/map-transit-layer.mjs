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
import { Directive } from '@angular/core';
import { MapBaseLayer } from '../map-base-layer';
import * as i0 from "@angular/core";
/**
 * Angular component that renders a Google Maps Transit Layer via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/map#TransitLayer
 */
export class MapTransitLayer extends MapBaseLayer {
    _initializeObject() {
        this.transitLayer = new google.maps.TransitLayer();
    }
    _setMap() {
        this._assertLayerInitialized();
        this.transitLayer.setMap(this._map.googleMap);
    }
    _unsetMap() {
        if (this.transitLayer) {
            this.transitLayer.setMap(null);
        }
    }
    _assertLayerInitialized() {
        if (!this.transitLayer) {
            throw Error('Cannot interact with a Google Map Transit Layer before it has been initialized. ' +
                'Please wait for the Transit Layer to load before trying to interact with it.');
        }
    }
}
MapTransitLayer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.0-rc.0", ngImport: i0, type: MapTransitLayer, deps: null, target: i0.ɵɵFactoryTarget.Directive });
MapTransitLayer.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.1.0-rc.0", type: MapTransitLayer, selector: "map-transit-layer", exportAs: ["mapTransitLayer"], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.0-rc.0", ngImport: i0, type: MapTransitLayer, decorators: [{
            type: Directive,
            args: [{
                    selector: 'map-transit-layer',
                    exportAs: 'mapTransitLayer',
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLXRyYW5zaXQtbGF5ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvZ29vZ2xlLW1hcHMvbWFwLXRyYW5zaXQtbGF5ZXIvbWFwLXRyYW5zaXQtbGF5ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBU0EscUNBQXFDO0FBVHJDOzs7Ozs7R0FNRztBQUVILHlFQUF5RTtBQUN6RSxxQ0FBcUM7QUFFckMsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUV4QyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7O0FBRS9DOzs7O0dBSUc7QUFLSCxNQUFNLE9BQU8sZUFBZ0IsU0FBUSxZQUFZO0lBUTVCLGlCQUFpQjtRQUNsQyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUNyRCxDQUFDO0lBRWtCLE9BQU87UUFDeEIsSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7UUFDL0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFVLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBRWtCLFNBQVM7UUFDMUIsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ3JCLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ2hDO0lBQ0gsQ0FBQztJQUVPLHVCQUF1QjtRQUM3QixJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRTtZQUN0QixNQUFNLEtBQUssQ0FDVCxrRkFBa0Y7Z0JBQ2hGLDhFQUE4RSxDQUNqRixDQUFDO1NBQ0g7SUFDSCxDQUFDOztpSEE5QlUsZUFBZTtxR0FBZixlQUFlO2dHQUFmLGVBQWU7a0JBSjNCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLG1CQUFtQjtvQkFDN0IsUUFBUSxFQUFFLGlCQUFpQjtpQkFDNUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLy8gV29ya2Fyb3VuZCBmb3I6IGh0dHBzOi8vZ2l0aHViLmNvbS9iYXplbGJ1aWxkL3J1bGVzX25vZGVqcy9pc3N1ZXMvMTI2NVxuLy8vIDxyZWZlcmVuY2UgdHlwZXM9XCJnb29nbGUubWFwc1wiIC8+XG5cbmltcG9ydCB7RGlyZWN0aXZlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtNYXBCYXNlTGF5ZXJ9IGZyb20gJy4uL21hcC1iYXNlLWxheWVyJztcblxuLyoqXG4gKiBBbmd1bGFyIGNvbXBvbmVudCB0aGF0IHJlbmRlcnMgYSBHb29nbGUgTWFwcyBUcmFuc2l0IExheWVyIHZpYSB0aGUgR29vZ2xlIE1hcHMgSmF2YVNjcmlwdCBBUEkuXG4gKlxuICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI1RyYW5zaXRMYXllclxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXAtdHJhbnNpdC1sYXllcicsXG4gIGV4cG9ydEFzOiAnbWFwVHJhbnNpdExheWVyJyxcbn0pXG5leHBvcnQgY2xhc3MgTWFwVHJhbnNpdExheWVyIGV4dGVuZHMgTWFwQmFzZUxheWVyIHtcbiAgLyoqXG4gICAqIFRoZSB1bmRlcmx5aW5nIGdvb2dsZS5tYXBzLlRyYW5zaXRMYXllciBvYmplY3QuXG4gICAqXG4gICAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNUcmFuc2l0TGF5ZXJcbiAgICovXG4gIHRyYW5zaXRMYXllcj86IGdvb2dsZS5tYXBzLlRyYW5zaXRMYXllcjtcblxuICBwcm90ZWN0ZWQgb3ZlcnJpZGUgX2luaXRpYWxpemVPYmplY3QoKSB7XG4gICAgdGhpcy50cmFuc2l0TGF5ZXIgPSBuZXcgZ29vZ2xlLm1hcHMuVHJhbnNpdExheWVyKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgb3ZlcnJpZGUgX3NldE1hcCgpIHtcbiAgICB0aGlzLl9hc3NlcnRMYXllckluaXRpYWxpemVkKCk7XG4gICAgdGhpcy50cmFuc2l0TGF5ZXIuc2V0TWFwKHRoaXMuX21hcC5nb29nbGVNYXAhKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBvdmVycmlkZSBfdW5zZXRNYXAoKSB7XG4gICAgaWYgKHRoaXMudHJhbnNpdExheWVyKSB7XG4gICAgICB0aGlzLnRyYW5zaXRMYXllci5zZXRNYXAobnVsbCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfYXNzZXJ0TGF5ZXJJbml0aWFsaXplZCgpOiBhc3NlcnRzIHRoaXMgaXMge3RyYW5zaXRMYXllcjogZ29vZ2xlLm1hcHMuVHJhbnNpdExheWVyfSB7XG4gICAgaWYgKCF0aGlzLnRyYW5zaXRMYXllcikge1xuICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICdDYW5ub3QgaW50ZXJhY3Qgd2l0aCBhIEdvb2dsZSBNYXAgVHJhbnNpdCBMYXllciBiZWZvcmUgaXQgaGFzIGJlZW4gaW5pdGlhbGl6ZWQuICcgK1xuICAgICAgICAgICdQbGVhc2Ugd2FpdCBmb3IgdGhlIFRyYW5zaXQgTGF5ZXIgdG8gbG9hZCBiZWZvcmUgdHJ5aW5nIHRvIGludGVyYWN0IHdpdGggaXQuJyxcbiAgICAgICk7XG4gICAgfVxuICB9XG59XG4iXX0=