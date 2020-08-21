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
 * Angular component that renders a Google Maps Bicycling Layer via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/map#BicyclingLayer
 */
export class MapBicyclingLayer extends MapBaseLayer {
    _initializeObject() {
        this.bicyclingLayer = new google.maps.BicyclingLayer();
    }
    _setMap() {
        this._assertLayerInitialized();
        this.bicyclingLayer.setMap(this._map.googleMap);
    }
    _unsetMap() {
        if (this.bicyclingLayer) {
            this.bicyclingLayer.setMap(null);
        }
    }
    _assertLayerInitialized() {
        if (!this.bicyclingLayer) {
            throw Error('Cannot interact with a Google Map Bicycling Layer before it has been initialized. ' +
                'Please wait for the Transit Layer to load before trying to interact with it.');
        }
    }
}
MapBicyclingLayer.decorators = [
    { type: Directive, args: [{
                selector: 'map-bicycling-layer',
                exportAs: 'mapBicyclingLayer',
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWJpY3ljbGluZy1sYXllci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9nb29nbGUtbWFwcy9tYXAtYmljeWNsaW5nLWxheWVyL21hcC1iaWN5Y2xpbmctbGF5ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgseUVBQXlFO0FBQ3pFLG9DQUFvQztBQUVwQyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRXhDLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUUvQzs7OztHQUlHO0FBS0gsTUFBTSxPQUFPLGlCQUFrQixTQUFRLFlBQVk7SUFRdkMsaUJBQWlCO1FBQ3pCLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQ3pELENBQUM7SUFFUyxPQUFPO1FBQ2YsSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7UUFDL0IsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFVLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBRVMsU0FBUztRQUNqQixJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDdkIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDbEM7SUFDSCxDQUFDO0lBRU8sdUJBQXVCO1FBQzdCLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQ3hCLE1BQU0sS0FBSyxDQUNQLG9GQUFvRjtnQkFDcEYsOEVBQThFLENBQUMsQ0FBQztTQUNyRjtJQUNILENBQUM7OztZQWpDRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLHFCQUFxQjtnQkFDL0IsUUFBUSxFQUFFLG1CQUFtQjthQUM5QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vLyBXb3JrYXJvdW5kIGZvcjogaHR0cHM6Ly9naXRodWIuY29tL2JhemVsYnVpbGQvcnVsZXNfbm9kZWpzL2lzc3Vlcy8xMjY1XG4vLy8gPHJlZmVyZW5jZSB0eXBlcz1cImdvb2dsZW1hcHNcIiAvPlxuXG5pbXBvcnQge0RpcmVjdGl2ZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7TWFwQmFzZUxheWVyfSBmcm9tICcuLi9tYXAtYmFzZS1sYXllcic7XG5cbi8qKlxuICogQW5ndWxhciBjb21wb25lbnQgdGhhdCByZW5kZXJzIGEgR29vZ2xlIE1hcHMgQmljeWNsaW5nIExheWVyIHZpYSB0aGUgR29vZ2xlIE1hcHMgSmF2YVNjcmlwdCBBUEkuXG4gKlxuICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI0JpY3ljbGluZ0xheWVyXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hcC1iaWN5Y2xpbmctbGF5ZXInLFxuICBleHBvcnRBczogJ21hcEJpY3ljbGluZ0xheWVyJyxcbn0pXG5leHBvcnQgY2xhc3MgTWFwQmljeWNsaW5nTGF5ZXIgZXh0ZW5kcyBNYXBCYXNlTGF5ZXIge1xuICAvKipcbiAgICogVGhlIHVuZGVybHlpbmcgZ29vZ2xlLm1hcHMuQmljeWNsaW5nTGF5ZXIgb2JqZWN0LlxuICAgKlxuICAgKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjQmljeWNsaW5nTGF5ZXJcbiAgICovXG4gIGJpY3ljbGluZ0xheWVyPzogZ29vZ2xlLm1hcHMuQmljeWNsaW5nTGF5ZXI7XG5cbiAgcHJvdGVjdGVkIF9pbml0aWFsaXplT2JqZWN0KCkge1xuICAgIHRoaXMuYmljeWNsaW5nTGF5ZXIgPSBuZXcgZ29vZ2xlLm1hcHMuQmljeWNsaW5nTGF5ZXIoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfc2V0TWFwKCkge1xuICAgIHRoaXMuX2Fzc2VydExheWVySW5pdGlhbGl6ZWQoKTtcbiAgICB0aGlzLmJpY3ljbGluZ0xheWVyLnNldE1hcCh0aGlzLl9tYXAuZ29vZ2xlTWFwISk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX3Vuc2V0TWFwKCkge1xuICAgIGlmICh0aGlzLmJpY3ljbGluZ0xheWVyKSB7XG4gICAgICB0aGlzLmJpY3ljbGluZ0xheWVyLnNldE1hcChudWxsKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9hc3NlcnRMYXllckluaXRpYWxpemVkKCk6IGFzc2VydHMgdGhpcyBpcyB7YmljeWNsaW5nTGF5ZXI6IGdvb2dsZS5tYXBzLkJpY3ljbGluZ0xheWVyfSB7XG4gICAgaWYgKCF0aGlzLmJpY3ljbGluZ0xheWVyKSB7XG4gICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICAnQ2Fubm90IGludGVyYWN0IHdpdGggYSBHb29nbGUgTWFwIEJpY3ljbGluZyBMYXllciBiZWZvcmUgaXQgaGFzIGJlZW4gaW5pdGlhbGl6ZWQuICcgK1xuICAgICAgICAgICdQbGVhc2Ugd2FpdCBmb3IgdGhlIFRyYW5zaXQgTGF5ZXIgdG8gbG9hZCBiZWZvcmUgdHJ5aW5nIHRvIGludGVyYWN0IHdpdGggaXQuJyk7XG4gICAgfVxuICB9XG59XG4iXX0=