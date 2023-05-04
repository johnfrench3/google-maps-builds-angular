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
 * Angular component that renders a Google Maps Bicycling Layer via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/map#BicyclingLayer
 */
class MapBicyclingLayer extends MapBaseLayer {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MapBicyclingLayer, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: MapBicyclingLayer, selector: "map-bicycling-layer", exportAs: ["mapBicyclingLayer"], usesInheritance: true, ngImport: i0 }); }
}
export { MapBicyclingLayer };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MapBicyclingLayer, decorators: [{
            type: Directive,
            args: [{
                    selector: 'map-bicycling-layer',
                    exportAs: 'mapBicyclingLayer',
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWJpY3ljbGluZy1sYXllci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9nb29nbGUtbWFwcy9tYXAtYmljeWNsaW5nLWxheWVyL21hcC1iaWN5Y2xpbmctbGF5ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBU0EscUNBQXFDO0FBVHJDOzs7Ozs7R0FNRztBQUVILHlFQUF5RTtBQUN6RSxxQ0FBcUM7QUFFckMsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUV4QyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7O0FBRS9DOzs7O0dBSUc7QUFDSCxNQUlhLGlCQUFrQixTQUFRLFlBQVk7SUFROUIsaUJBQWlCO1FBQ2xDLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQ3pELENBQUM7SUFFa0IsT0FBTztRQUN4QixJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztRQUMvQixJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVUsQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFFa0IsU0FBUztRQUMxQixJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDdkIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDbEM7SUFDSCxDQUFDO0lBRU8sdUJBQXVCO1FBQzdCLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQ3hCLE1BQU0sS0FBSyxDQUNULG9GQUFvRjtnQkFDbEYsOEVBQThFLENBQ2pGLENBQUM7U0FDSDtJQUNILENBQUM7OEdBOUJVLGlCQUFpQjtrR0FBakIsaUJBQWlCOztTQUFqQixpQkFBaUI7MkZBQWpCLGlCQUFpQjtrQkFKN0IsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUscUJBQXFCO29CQUMvQixRQUFRLEVBQUUsbUJBQW1CO2lCQUM5QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vLyBXb3JrYXJvdW5kIGZvcjogaHR0cHM6Ly9naXRodWIuY29tL2JhemVsYnVpbGQvcnVsZXNfbm9kZWpzL2lzc3Vlcy8xMjY1XG4vLy8gPHJlZmVyZW5jZSB0eXBlcz1cImdvb2dsZS5tYXBzXCIgLz5cblxuaW1wb3J0IHtEaXJlY3RpdmV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge01hcEJhc2VMYXllcn0gZnJvbSAnLi4vbWFwLWJhc2UtbGF5ZXInO1xuXG4vKipcbiAqIEFuZ3VsYXIgY29tcG9uZW50IHRoYXQgcmVuZGVycyBhIEdvb2dsZSBNYXBzIEJpY3ljbGluZyBMYXllciB2aWEgdGhlIEdvb2dsZSBNYXBzIEphdmFTY3JpcHQgQVBJLlxuICpcbiAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNCaWN5Y2xpbmdMYXllclxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXAtYmljeWNsaW5nLWxheWVyJyxcbiAgZXhwb3J0QXM6ICdtYXBCaWN5Y2xpbmdMYXllcicsXG59KVxuZXhwb3J0IGNsYXNzIE1hcEJpY3ljbGluZ0xheWVyIGV4dGVuZHMgTWFwQmFzZUxheWVyIHtcbiAgLyoqXG4gICAqIFRoZSB1bmRlcmx5aW5nIGdvb2dsZS5tYXBzLkJpY3ljbGluZ0xheWVyIG9iamVjdC5cbiAgICpcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI0JpY3ljbGluZ0xheWVyXG4gICAqL1xuICBiaWN5Y2xpbmdMYXllcj86IGdvb2dsZS5tYXBzLkJpY3ljbGluZ0xheWVyO1xuXG4gIHByb3RlY3RlZCBvdmVycmlkZSBfaW5pdGlhbGl6ZU9iamVjdCgpIHtcbiAgICB0aGlzLmJpY3ljbGluZ0xheWVyID0gbmV3IGdvb2dsZS5tYXBzLkJpY3ljbGluZ0xheWVyKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgb3ZlcnJpZGUgX3NldE1hcCgpIHtcbiAgICB0aGlzLl9hc3NlcnRMYXllckluaXRpYWxpemVkKCk7XG4gICAgdGhpcy5iaWN5Y2xpbmdMYXllci5zZXRNYXAodGhpcy5fbWFwLmdvb2dsZU1hcCEpO1xuICB9XG5cbiAgcHJvdGVjdGVkIG92ZXJyaWRlIF91bnNldE1hcCgpIHtcbiAgICBpZiAodGhpcy5iaWN5Y2xpbmdMYXllcikge1xuICAgICAgdGhpcy5iaWN5Y2xpbmdMYXllci5zZXRNYXAobnVsbCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfYXNzZXJ0TGF5ZXJJbml0aWFsaXplZCgpOiBhc3NlcnRzIHRoaXMgaXMge2JpY3ljbGluZ0xheWVyOiBnb29nbGUubWFwcy5CaWN5Y2xpbmdMYXllcn0ge1xuICAgIGlmICghdGhpcy5iaWN5Y2xpbmdMYXllcikge1xuICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICdDYW5ub3QgaW50ZXJhY3Qgd2l0aCBhIEdvb2dsZSBNYXAgQmljeWNsaW5nIExheWVyIGJlZm9yZSBpdCBoYXMgYmVlbiBpbml0aWFsaXplZC4gJyArXG4gICAgICAgICAgJ1BsZWFzZSB3YWl0IGZvciB0aGUgVHJhbnNpdCBMYXllciB0byBsb2FkIGJlZm9yZSB0cnlpbmcgdG8gaW50ZXJhY3Qgd2l0aCBpdC4nLFxuICAgICAgKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==