/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="googlemaps" />
import { Directive } from '@angular/core';
import { MapBaseLayer } from '../map-base-layer';
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
MapTransitLayer.decorators = [
    { type: Directive, args: [{
                selector: 'map-transit-layer',
                exportAs: 'mapTransitLayer',
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLXRyYW5zaXQtbGF5ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvZ29vZ2xlLW1hcHMvbWFwLXRyYW5zaXQtbGF5ZXIvbWFwLXRyYW5zaXQtbGF5ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgseUVBQXlFO0FBQ3pFLG9DQUFvQztBQUVwQyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRXhDLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUUvQzs7OztHQUlHO0FBS0gsTUFBTSxPQUFPLGVBQWdCLFNBQVEsWUFBWTtJQVFyQyxpQkFBaUI7UUFDekIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDckQsQ0FBQztJQUVTLE9BQU87UUFDZixJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztRQUMvQixJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVUsQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFFUyxTQUFTO1FBQ2pCLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNyQixJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNoQztJQUNILENBQUM7SUFFTyx1QkFBdUI7UUFDN0IsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDdEIsTUFBTSxLQUFLLENBQ1Asa0ZBQWtGO2dCQUNsRiw4RUFBOEUsQ0FBQyxDQUFDO1NBQ3JGO0lBQ0gsQ0FBQzs7O1lBakNGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsbUJBQW1CO2dCQUM3QixRQUFRLEVBQUUsaUJBQWlCO2FBQzVCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8vIFdvcmthcm91bmQgZm9yOiBodHRwczovL2dpdGh1Yi5jb20vYmF6ZWxidWlsZC9ydWxlc19ub2RlanMvaXNzdWVzLzEyNjVcbi8vLyA8cmVmZXJlbmNlIHR5cGVzPVwiZ29vZ2xlbWFwc1wiIC8+XG5cbmltcG9ydCB7RGlyZWN0aXZlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtNYXBCYXNlTGF5ZXJ9IGZyb20gJy4uL21hcC1iYXNlLWxheWVyJztcblxuLyoqXG4gKiBBbmd1bGFyIGNvbXBvbmVudCB0aGF0IHJlbmRlcnMgYSBHb29nbGUgTWFwcyBUcmFuc2l0IExheWVyIHZpYSB0aGUgR29vZ2xlIE1hcHMgSmF2YVNjcmlwdCBBUEkuXG4gKlxuICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI1RyYW5zaXRMYXllclxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXAtdHJhbnNpdC1sYXllcicsXG4gIGV4cG9ydEFzOiAnbWFwVHJhbnNpdExheWVyJyxcbn0pXG5leHBvcnQgY2xhc3MgTWFwVHJhbnNpdExheWVyIGV4dGVuZHMgTWFwQmFzZUxheWVyIHtcbiAgLyoqXG4gICAqIFRoZSB1bmRlcmx5aW5nIGdvb2dsZS5tYXBzLlRyYW5zaXRMYXllciBvYmplY3QuXG4gICAqXG4gICAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNUcmFuc2l0TGF5ZXJcbiAgICovXG4gIHRyYW5zaXRMYXllcj86IGdvb2dsZS5tYXBzLlRyYW5zaXRMYXllcjtcblxuICBwcm90ZWN0ZWQgX2luaXRpYWxpemVPYmplY3QoKSB7XG4gICAgdGhpcy50cmFuc2l0TGF5ZXIgPSBuZXcgZ29vZ2xlLm1hcHMuVHJhbnNpdExheWVyKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX3NldE1hcCgpIHtcbiAgICB0aGlzLl9hc3NlcnRMYXllckluaXRpYWxpemVkKCk7XG4gICAgdGhpcy50cmFuc2l0TGF5ZXIuc2V0TWFwKHRoaXMuX21hcC5nb29nbGVNYXAhKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfdW5zZXRNYXAoKSB7XG4gICAgaWYgKHRoaXMudHJhbnNpdExheWVyKSB7XG4gICAgICB0aGlzLnRyYW5zaXRMYXllci5zZXRNYXAobnVsbCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfYXNzZXJ0TGF5ZXJJbml0aWFsaXplZCgpOiBhc3NlcnRzIHRoaXMgaXMge3RyYW5zaXRMYXllcjogZ29vZ2xlLm1hcHMuVHJhbnNpdExheWVyfSB7XG4gICAgaWYgKCF0aGlzLnRyYW5zaXRMYXllcikge1xuICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICAgJ0Nhbm5vdCBpbnRlcmFjdCB3aXRoIGEgR29vZ2xlIE1hcCBUcmFuc2l0IExheWVyIGJlZm9yZSBpdCBoYXMgYmVlbiBpbml0aWFsaXplZC4gJyArXG4gICAgICAgICAgJ1BsZWFzZSB3YWl0IGZvciB0aGUgVHJhbnNpdCBMYXllciB0byBsb2FkIGJlZm9yZSB0cnlpbmcgdG8gaW50ZXJhY3Qgd2l0aCBpdC4nKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==