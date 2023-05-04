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
class MapTransitLayer extends MapBaseLayer {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MapTransitLayer, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: MapTransitLayer, selector: "map-transit-layer", exportAs: ["mapTransitLayer"], usesInheritance: true, ngImport: i0 }); }
}
export { MapTransitLayer };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MapTransitLayer, decorators: [{
            type: Directive,
            args: [{
                    selector: 'map-transit-layer',
                    exportAs: 'mapTransitLayer',
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLXRyYW5zaXQtbGF5ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvZ29vZ2xlLW1hcHMvbWFwLXRyYW5zaXQtbGF5ZXIvbWFwLXRyYW5zaXQtbGF5ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBU0EscUNBQXFDO0FBVHJDOzs7Ozs7R0FNRztBQUVILHlFQUF5RTtBQUN6RSxxQ0FBcUM7QUFFckMsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUV4QyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7O0FBRS9DOzs7O0dBSUc7QUFDSCxNQUlhLGVBQWdCLFNBQVEsWUFBWTtJQVE1QixpQkFBaUI7UUFDbEMsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDckQsQ0FBQztJQUVrQixPQUFPO1FBQ3hCLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO1FBQy9CLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBVSxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUVrQixTQUFTO1FBQzFCLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNyQixJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNoQztJQUNILENBQUM7SUFFTyx1QkFBdUI7UUFDN0IsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDdEIsTUFBTSxLQUFLLENBQ1Qsa0ZBQWtGO2dCQUNoRiw4RUFBOEUsQ0FDakYsQ0FBQztTQUNIO0lBQ0gsQ0FBQzs4R0E5QlUsZUFBZTtrR0FBZixlQUFlOztTQUFmLGVBQWU7MkZBQWYsZUFBZTtrQkFKM0IsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsbUJBQW1CO29CQUM3QixRQUFRLEVBQUUsaUJBQWlCO2lCQUM1QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vLyBXb3JrYXJvdW5kIGZvcjogaHR0cHM6Ly9naXRodWIuY29tL2JhemVsYnVpbGQvcnVsZXNfbm9kZWpzL2lzc3Vlcy8xMjY1XG4vLy8gPHJlZmVyZW5jZSB0eXBlcz1cImdvb2dsZS5tYXBzXCIgLz5cblxuaW1wb3J0IHtEaXJlY3RpdmV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge01hcEJhc2VMYXllcn0gZnJvbSAnLi4vbWFwLWJhc2UtbGF5ZXInO1xuXG4vKipcbiAqIEFuZ3VsYXIgY29tcG9uZW50IHRoYXQgcmVuZGVycyBhIEdvb2dsZSBNYXBzIFRyYW5zaXQgTGF5ZXIgdmlhIHRoZSBHb29nbGUgTWFwcyBKYXZhU2NyaXB0IEFQSS5cbiAqXG4gKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjVHJhbnNpdExheWVyXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hcC10cmFuc2l0LWxheWVyJyxcbiAgZXhwb3J0QXM6ICdtYXBUcmFuc2l0TGF5ZXInLFxufSlcbmV4cG9ydCBjbGFzcyBNYXBUcmFuc2l0TGF5ZXIgZXh0ZW5kcyBNYXBCYXNlTGF5ZXIge1xuICAvKipcbiAgICogVGhlIHVuZGVybHlpbmcgZ29vZ2xlLm1hcHMuVHJhbnNpdExheWVyIG9iamVjdC5cbiAgICpcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI1RyYW5zaXRMYXllclxuICAgKi9cbiAgdHJhbnNpdExheWVyPzogZ29vZ2xlLm1hcHMuVHJhbnNpdExheWVyO1xuXG4gIHByb3RlY3RlZCBvdmVycmlkZSBfaW5pdGlhbGl6ZU9iamVjdCgpIHtcbiAgICB0aGlzLnRyYW5zaXRMYXllciA9IG5ldyBnb29nbGUubWFwcy5UcmFuc2l0TGF5ZXIoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBvdmVycmlkZSBfc2V0TWFwKCkge1xuICAgIHRoaXMuX2Fzc2VydExheWVySW5pdGlhbGl6ZWQoKTtcbiAgICB0aGlzLnRyYW5zaXRMYXllci5zZXRNYXAodGhpcy5fbWFwLmdvb2dsZU1hcCEpO1xuICB9XG5cbiAgcHJvdGVjdGVkIG92ZXJyaWRlIF91bnNldE1hcCgpIHtcbiAgICBpZiAodGhpcy50cmFuc2l0TGF5ZXIpIHtcbiAgICAgIHRoaXMudHJhbnNpdExheWVyLnNldE1hcChudWxsKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9hc3NlcnRMYXllckluaXRpYWxpemVkKCk6IGFzc2VydHMgdGhpcyBpcyB7dHJhbnNpdExheWVyOiBnb29nbGUubWFwcy5UcmFuc2l0TGF5ZXJ9IHtcbiAgICBpZiAoIXRoaXMudHJhbnNpdExheWVyKSB7XG4gICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgJ0Nhbm5vdCBpbnRlcmFjdCB3aXRoIGEgR29vZ2xlIE1hcCBUcmFuc2l0IExheWVyIGJlZm9yZSBpdCBoYXMgYmVlbiBpbml0aWFsaXplZC4gJyArXG4gICAgICAgICAgJ1BsZWFzZSB3YWl0IGZvciB0aGUgVHJhbnNpdCBMYXllciB0byBsb2FkIGJlZm9yZSB0cnlpbmcgdG8gaW50ZXJhY3Qgd2l0aCBpdC4nLFxuICAgICAgKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==