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
MapBicyclingLayer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.0-rc.0", ngImport: i0, type: MapBicyclingLayer, deps: null, target: i0.ɵɵFactoryTarget.Directive });
MapBicyclingLayer.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.0-rc.0", type: MapBicyclingLayer, selector: "map-bicycling-layer", exportAs: ["mapBicyclingLayer"], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.0-rc.0", ngImport: i0, type: MapBicyclingLayer, decorators: [{
            type: Directive,
            args: [{
                    selector: 'map-bicycling-layer',
                    exportAs: 'mapBicyclingLayer',
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWJpY3ljbGluZy1sYXllci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9nb29nbGUtbWFwcy9tYXAtYmljeWNsaW5nLWxheWVyL21hcC1iaWN5Y2xpbmctbGF5ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBU0EscUNBQXFDO0FBVHJDOzs7Ozs7R0FNRztBQUVILHlFQUF5RTtBQUN6RSxxQ0FBcUM7QUFFckMsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUV4QyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7O0FBRS9DOzs7O0dBSUc7QUFLSCxNQUFNLE9BQU8saUJBQWtCLFNBQVEsWUFBWTtJQVE5QixpQkFBaUI7UUFDbEMsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDekQsQ0FBQztJQUVrQixPQUFPO1FBQ3hCLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO1FBQy9CLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBVSxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUVrQixTQUFTO1FBQzFCLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUN2QixJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNsQztJQUNILENBQUM7SUFFTyx1QkFBdUI7UUFDN0IsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDeEIsTUFBTSxLQUFLLENBQ1Qsb0ZBQW9GO2dCQUNsRiw4RUFBOEUsQ0FDakYsQ0FBQztTQUNIO0lBQ0gsQ0FBQzs7bUhBOUJVLGlCQUFpQjt1R0FBakIsaUJBQWlCO2dHQUFqQixpQkFBaUI7a0JBSjdCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLHFCQUFxQjtvQkFDL0IsUUFBUSxFQUFFLG1CQUFtQjtpQkFDOUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLy8gV29ya2Fyb3VuZCBmb3I6IGh0dHBzOi8vZ2l0aHViLmNvbS9iYXplbGJ1aWxkL3J1bGVzX25vZGVqcy9pc3N1ZXMvMTI2NVxuLy8vIDxyZWZlcmVuY2UgdHlwZXM9XCJnb29nbGUubWFwc1wiIC8+XG5cbmltcG9ydCB7RGlyZWN0aXZlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtNYXBCYXNlTGF5ZXJ9IGZyb20gJy4uL21hcC1iYXNlLWxheWVyJztcblxuLyoqXG4gKiBBbmd1bGFyIGNvbXBvbmVudCB0aGF0IHJlbmRlcnMgYSBHb29nbGUgTWFwcyBCaWN5Y2xpbmcgTGF5ZXIgdmlhIHRoZSBHb29nbGUgTWFwcyBKYXZhU2NyaXB0IEFQSS5cbiAqXG4gKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjQmljeWNsaW5nTGF5ZXJcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWFwLWJpY3ljbGluZy1sYXllcicsXG4gIGV4cG9ydEFzOiAnbWFwQmljeWNsaW5nTGF5ZXInLFxufSlcbmV4cG9ydCBjbGFzcyBNYXBCaWN5Y2xpbmdMYXllciBleHRlbmRzIE1hcEJhc2VMYXllciB7XG4gIC8qKlxuICAgKiBUaGUgdW5kZXJseWluZyBnb29nbGUubWFwcy5CaWN5Y2xpbmdMYXllciBvYmplY3QuXG4gICAqXG4gICAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNCaWN5Y2xpbmdMYXllclxuICAgKi9cbiAgYmljeWNsaW5nTGF5ZXI/OiBnb29nbGUubWFwcy5CaWN5Y2xpbmdMYXllcjtcblxuICBwcm90ZWN0ZWQgb3ZlcnJpZGUgX2luaXRpYWxpemVPYmplY3QoKSB7XG4gICAgdGhpcy5iaWN5Y2xpbmdMYXllciA9IG5ldyBnb29nbGUubWFwcy5CaWN5Y2xpbmdMYXllcigpO1xuICB9XG5cbiAgcHJvdGVjdGVkIG92ZXJyaWRlIF9zZXRNYXAoKSB7XG4gICAgdGhpcy5fYXNzZXJ0TGF5ZXJJbml0aWFsaXplZCgpO1xuICAgIHRoaXMuYmljeWNsaW5nTGF5ZXIuc2V0TWFwKHRoaXMuX21hcC5nb29nbGVNYXAhKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBvdmVycmlkZSBfdW5zZXRNYXAoKSB7XG4gICAgaWYgKHRoaXMuYmljeWNsaW5nTGF5ZXIpIHtcbiAgICAgIHRoaXMuYmljeWNsaW5nTGF5ZXIuc2V0TWFwKG51bGwpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2Fzc2VydExheWVySW5pdGlhbGl6ZWQoKTogYXNzZXJ0cyB0aGlzIGlzIHtiaWN5Y2xpbmdMYXllcjogZ29vZ2xlLm1hcHMuQmljeWNsaW5nTGF5ZXJ9IHtcbiAgICBpZiAoIXRoaXMuYmljeWNsaW5nTGF5ZXIpIHtcbiAgICAgIHRocm93IEVycm9yKFxuICAgICAgICAnQ2Fubm90IGludGVyYWN0IHdpdGggYSBHb29nbGUgTWFwIEJpY3ljbGluZyBMYXllciBiZWZvcmUgaXQgaGFzIGJlZW4gaW5pdGlhbGl6ZWQuICcgK1xuICAgICAgICAgICdQbGVhc2Ugd2FpdCBmb3IgdGhlIFRyYW5zaXQgTGF5ZXIgdG8gbG9hZCBiZWZvcmUgdHJ5aW5nIHRvIGludGVyYWN0IHdpdGggaXQuJyxcbiAgICAgICk7XG4gICAgfVxuICB9XG59XG4iXX0=