/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate, __metadata } from "tslib";
// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="googlemaps" />
import { Directive, Input, Output, NgZone, } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { GoogleMap } from '../google-map/google-map';
import { MapEventManager } from '../map-event-manager';
/**
 * Angular component that renders a Google Maps Polyline via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline
 */
let MapPolyline = /** @class */ (() => {
    let MapPolyline = class MapPolyline {
        constructor(_map, _ngZone) {
            this._map = _map;
            this._ngZone = _ngZone;
            this._eventManager = new MapEventManager(this._ngZone);
            this._options = new BehaviorSubject({});
            this._path = new BehaviorSubject(undefined);
            this._destroyed = new Subject();
            /**
             * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.click
             */
            this.polylineClick = this._eventManager.getLazyEmitter('click');
            /**
             * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.dblclick
             */
            this.polylineDblclick = this._eventManager.getLazyEmitter('dblclick');
            /**
             * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.drag
             */
            this.polylineDrag = this._eventManager.getLazyEmitter('drag');
            /**
             * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.dragend
             */
            this.polylineDragend = this._eventManager.getLazyEmitter('dragend');
            /**
             * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.dragstart
             */
            this.polylineDragstart = this._eventManager.getLazyEmitter('dragstart');
            /**
             * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.mousedown
             */
            this.polylineMousedown = this._eventManager.getLazyEmitter('mousedown');
            /**
             * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.mousemove
             */
            this.polylineMousemove = this._eventManager.getLazyEmitter('mousemove');
            /**
             * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.mouseout
             */
            this.polylineMouseout = this._eventManager.getLazyEmitter('mouseout');
            /**
             * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.mouseover
             */
            this.polylineMouseover = this._eventManager.getLazyEmitter('mouseover');
            /**
             * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.mouseup
             */
            this.polylineMouseup = this._eventManager.getLazyEmitter('mouseup');
            /**
             * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.rightclick
             */
            this.polylineRightclick = this._eventManager.getLazyEmitter('rightclick');
        }
        set options(options) {
            this._options.next(options || {});
        }
        set path(path) {
            this._path.next(path);
        }
        ngOnInit() {
            if (this._map._isBrowser) {
                this._combineOptions().pipe(take(1)).subscribe(options => {
                    // Create the object outside the zone so its events don't trigger change detection.
                    // We'll bring it back in inside the `MapEventManager` only for the events that the
                    // user has subscribed to.
                    this._ngZone.runOutsideAngular(() => this.polyline = new google.maps.Polyline(options));
                    this._assertInitialized();
                    this.polyline.setMap(this._map.googleMap);
                    this._eventManager.setTarget(this.polyline);
                });
                this._watchForOptionsChanges();
                this._watchForPathChanges();
            }
        }
        ngOnDestroy() {
            this._eventManager.destroy();
            this._destroyed.next();
            this._destroyed.complete();
            if (this.polyline) {
                this.polyline.setMap(null);
            }
        }
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.getDraggable
         */
        getDraggable() {
            this._assertInitialized();
            return this.polyline.getDraggable();
        }
        /**
         * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.getEditable
         */
        getEditable() {
            this._assertInitialized();
            return this.polyline.getEditable();
        }
        /**
         * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.getPath
         */
        getPath() {
            this._assertInitialized();
            // @breaking-change 11.0.0 Make the return value nullable.
            return this.polyline.getPath();
        }
        /**
         * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.getVisible
         */
        getVisible() {
            this._assertInitialized();
            return this.polyline.getVisible();
        }
        _combineOptions() {
            return combineLatest([this._options, this._path]).pipe(map(([options, path]) => {
                const combinedOptions = Object.assign(Object.assign({}, options), { path: path || options.path });
                return combinedOptions;
            }));
        }
        _watchForOptionsChanges() {
            this._options.pipe(takeUntil(this._destroyed)).subscribe(options => {
                this._assertInitialized();
                this.polyline.setOptions(options);
            });
        }
        _watchForPathChanges() {
            this._path.pipe(takeUntil(this._destroyed)).subscribe(path => {
                if (path) {
                    this._assertInitialized();
                    this.polyline.setPath(path);
                }
            });
        }
        _assertInitialized() {
            if (!this._map.googleMap) {
                throw Error('Cannot access Google Map information before the API has been initialized. ' +
                    'Please wait for the API to load before trying to interact with it.');
            }
            if (!this.polyline) {
                throw Error('Cannot interact with a Google Map Polyline before it has been ' +
                    'initialized. Please wait for the Polyline to load before trying to interact with it.');
            }
        }
    };
    __decorate([
        Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], MapPolyline.prototype, "options", null);
    __decorate([
        Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], MapPolyline.prototype, "path", null);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapPolyline.prototype, "polylineClick", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapPolyline.prototype, "polylineDblclick", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapPolyline.prototype, "polylineDrag", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapPolyline.prototype, "polylineDragend", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapPolyline.prototype, "polylineDragstart", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapPolyline.prototype, "polylineMousedown", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapPolyline.prototype, "polylineMousemove", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapPolyline.prototype, "polylineMouseout", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapPolyline.prototype, "polylineMouseover", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapPolyline.prototype, "polylineMouseup", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapPolyline.prototype, "polylineRightclick", void 0);
    MapPolyline = __decorate([
        Directive({
            selector: 'map-polyline',
        }),
        __metadata("design:paramtypes", [GoogleMap,
            NgZone])
    ], MapPolyline);
    return MapPolyline;
})();
export { MapPolyline };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLXBvbHlsaW5lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2dvb2dsZS1tYXBzL21hcC1wb2x5bGluZS9tYXAtcG9seWxpbmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILHlFQUF5RTtBQUN6RSxvQ0FBb0M7QUFFcEMsT0FBTyxFQUNMLFNBQVMsRUFDVCxLQUFLLEVBR0wsTUFBTSxFQUNOLE1BQU0sR0FDUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsZUFBZSxFQUFFLGFBQWEsRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQ3pFLE9BQU8sRUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRXBELE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUNuRCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFFckQ7Ozs7R0FJRztBQUlIO0lBQUEsSUFBYSxXQUFXLEdBQXhCLE1BQWEsV0FBVztRQXdHdEIsWUFDbUIsSUFBZSxFQUN4QixPQUFlO1lBRE4sU0FBSSxHQUFKLElBQUksQ0FBVztZQUN4QixZQUFPLEdBQVAsT0FBTyxDQUFRO1lBekdqQixrQkFBYSxHQUFHLElBQUksZUFBZSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN6QyxhQUFRLEdBQUcsSUFBSSxlQUFlLENBQThCLEVBQUUsQ0FBQyxDQUFDO1lBQ2hFLFVBQUssR0FDbEIsSUFBSSxlQUFlLENBQ3dDLFNBQVMsQ0FBQyxDQUFDO1lBRXpELGVBQVUsR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO1lBb0JsRDs7ZUFFRztZQUVILGtCQUFhLEdBQ1QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQTZCLE9BQU8sQ0FBQyxDQUFDO1lBRTNFOztlQUVHO1lBRUgscUJBQWdCLEdBQ1osSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQTZCLFVBQVUsQ0FBQyxDQUFDO1lBRTlFOztlQUVHO1lBRUgsaUJBQVksR0FDUixJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBeUIsTUFBTSxDQUFDLENBQUM7WUFFdEU7O2VBRUc7WUFFSCxvQkFBZSxHQUNYLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUF5QixTQUFTLENBQUMsQ0FBQztZQUV6RTs7ZUFFRztZQUVILHNCQUFpQixHQUNiLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUF5QixXQUFXLENBQUMsQ0FBQztZQUUzRTs7ZUFFRztZQUVILHNCQUFpQixHQUNiLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUE2QixXQUFXLENBQUMsQ0FBQztZQUUvRTs7ZUFFRztZQUVILHNCQUFpQixHQUNiLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUE2QixXQUFXLENBQUMsQ0FBQztZQUUvRTs7ZUFFRztZQUVILHFCQUFnQixHQUNaLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUE2QixVQUFVLENBQUMsQ0FBQztZQUU5RTs7ZUFFRztZQUVILHNCQUFpQixHQUNiLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUE2QixXQUFXLENBQUMsQ0FBQztZQUUvRTs7ZUFFRztZQUVILG9CQUFlLEdBQ1gsSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQTZCLFNBQVMsQ0FBQyxDQUFDO1lBRTdFOztlQUVHO1lBRUgsdUJBQWtCLEdBQ2QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQTZCLFlBQVksQ0FBQyxDQUFDO1FBSXBELENBQUM7UUF6RjdCLElBQUksT0FBTyxDQUFDLE9BQW9DO1lBQzlDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsQ0FBQztRQUNwQyxDQUFDO1FBR0QsSUFBSSxJQUFJLENBQUMsSUFDMkI7WUFDbEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEIsQ0FBQztRQW1GRCxRQUFRO1lBQ04sSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRTtnQkFDeEIsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEVBQUU7b0JBQ3ZELG1GQUFtRjtvQkFDbkYsbUZBQW1GO29CQUNuRiwwQkFBMEI7b0JBQzFCLElBQUksQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQ3hGLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO29CQUMxQixJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVUsQ0FBQyxDQUFDO29CQUMzQyxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQzlDLENBQUMsQ0FBQyxDQUFDO2dCQUVILElBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO2dCQUMvQixJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQzthQUM3QjtRQUNILENBQUM7UUFFRCxXQUFXO1lBQ1QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUM3QixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDM0IsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUNqQixJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUM1QjtRQUNILENBQUM7UUFFRDs7O1dBR0c7UUFDSCxZQUFZO1lBQ1YsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFDMUIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3RDLENBQUM7UUFFRDs7V0FFRztRQUNILFdBQVc7WUFDVCxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUMxQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDckMsQ0FBQztRQUVEOztXQUVHO1FBQ0gsT0FBTztZQUNMLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQzFCLDBEQUEwRDtZQUMxRCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDakMsQ0FBQztRQUVEOztXQUVHO1FBQ0gsVUFBVTtZQUNSLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQzFCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUNwQyxDQUFDO1FBRU8sZUFBZTtZQUNyQixPQUFPLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUU7Z0JBQzdFLE1BQU0sZUFBZSxtQ0FDaEIsT0FBTyxLQUNWLElBQUksRUFBRSxJQUFJLElBQUksT0FBTyxDQUFDLElBQUksR0FDM0IsQ0FBQztnQkFDRixPQUFPLGVBQWUsQ0FBQztZQUN6QixDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ04sQ0FBQztRQUVPLHVCQUF1QjtZQUM3QixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNqRSxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztnQkFDMUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDcEMsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBRU8sb0JBQW9CO1lBQzFCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQzNELElBQUksSUFBSSxFQUFFO29CQUNSLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO29CQUMxQixJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDN0I7WUFDSCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7UUFFTyxrQkFBa0I7WUFDeEIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO2dCQUN4QixNQUFNLEtBQUssQ0FDUCw0RUFBNEU7b0JBQzVFLG9FQUFvRSxDQUFDLENBQUM7YUFDM0U7WUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDbEIsTUFBTSxLQUFLLENBQ1AsZ0VBQWdFO29CQUNoRSxzRkFBc0YsQ0FBQyxDQUFDO2FBQzdGO1FBQ0gsQ0FBQztLQUNGLENBQUE7SUE3TEM7UUFEQyxLQUFLLEVBQUU7Ozs4Q0FHUDtJQUdEO1FBREMsS0FBSyxFQUFFOzs7MkNBSVA7SUFNRDtRQURDLE1BQU0sRUFBRTtrQ0FDTSxVQUFVO3NEQUNrRDtJQU0zRTtRQURDLE1BQU0sRUFBRTtrQ0FDUyxVQUFVO3lEQUNrRDtJQU05RTtRQURDLE1BQU0sRUFBRTtrQ0FDSyxVQUFVO3FEQUM4QztJQU10RTtRQURDLE1BQU0sRUFBRTtrQ0FDUSxVQUFVO3dEQUM4QztJQU16RTtRQURDLE1BQU0sRUFBRTtrQ0FDVSxVQUFVOzBEQUM4QztJQU0zRTtRQURDLE1BQU0sRUFBRTtrQ0FDVSxVQUFVOzBEQUNrRDtJQU0vRTtRQURDLE1BQU0sRUFBRTtrQ0FDVSxVQUFVOzBEQUNrRDtJQU0vRTtRQURDLE1BQU0sRUFBRTtrQ0FDUyxVQUFVO3lEQUNrRDtJQU05RTtRQURDLE1BQU0sRUFBRTtrQ0FDVSxVQUFVOzBEQUNrRDtJQU0vRTtRQURDLE1BQU0sRUFBRTtrQ0FDUSxVQUFVO3dEQUNrRDtJQU03RTtRQURDLE1BQU0sRUFBRTtrQ0FDVyxVQUFVOzJEQUNrRDtJQXRHckUsV0FBVztRQUh2QixTQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsY0FBYztTQUN6QixDQUFDO3lDQTBHeUIsU0FBUztZQUNmLE1BQU07T0ExR2QsV0FBVyxDQThNdkI7SUFBRCxrQkFBQztLQUFBO1NBOU1ZLFdBQVciLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLy8gV29ya2Fyb3VuZCBmb3I6IGh0dHBzOi8vZ2l0aHViLmNvbS9iYXplbGJ1aWxkL3J1bGVzX25vZGVqcy9pc3N1ZXMvMTI2NVxuLy8vIDxyZWZlcmVuY2UgdHlwZXM9XCJnb29nbGVtYXBzXCIgLz5cblxuaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgTmdab25lLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7QmVoYXZpb3JTdWJqZWN0LCBjb21iaW5lTGF0ZXN0LCBPYnNlcnZhYmxlLCBTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7bWFwLCB0YWtlLCB0YWtlVW50aWx9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtHb29nbGVNYXB9IGZyb20gJy4uL2dvb2dsZS1tYXAvZ29vZ2xlLW1hcCc7XG5pbXBvcnQge01hcEV2ZW50TWFuYWdlcn0gZnJvbSAnLi4vbWFwLWV2ZW50LW1hbmFnZXInO1xuXG4vKipcbiAqIEFuZ3VsYXIgY29tcG9uZW50IHRoYXQgcmVuZGVycyBhIEdvb2dsZSBNYXBzIFBvbHlsaW5lIHZpYSB0aGUgR29vZ2xlIE1hcHMgSmF2YVNjcmlwdCBBUEkuXG4gKlxuICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNQb2x5bGluZVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXAtcG9seWxpbmUnLFxufSlcbmV4cG9ydCBjbGFzcyBNYXBQb2x5bGluZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfZXZlbnRNYW5hZ2VyID0gbmV3IE1hcEV2ZW50TWFuYWdlcih0aGlzLl9uZ1pvbmUpO1xuICBwcml2YXRlIHJlYWRvbmx5IF9vcHRpb25zID0gbmV3IEJlaGF2aW9yU3ViamVjdDxnb29nbGUubWFwcy5Qb2x5bGluZU9wdGlvbnM+KHt9KTtcbiAgcHJpdmF0ZSByZWFkb25seSBfcGF0aCA9XG4gICAgICBuZXcgQmVoYXZpb3JTdWJqZWN0PGdvb2dsZS5tYXBzLk1WQ0FycmF5PGdvb2dsZS5tYXBzLkxhdExuZz58Z29vZ2xlLm1hcHMuTGF0TG5nW118XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGdvb2dsZS5tYXBzLkxhdExuZ0xpdGVyYWxbXXx1bmRlZmluZWQ+KHVuZGVmaW5lZCk7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBfZGVzdHJveWVkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKipcbiAgICogVGhlIHVuZGVybHlpbmcgZ29vZ2xlLm1hcHMuUG9seWxpbmUgb2JqZWN0LlxuICAgKlxuICAgKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI1BvbHlsaW5lXG4gICAqL1xuICBwb2x5bGluZT86IGdvb2dsZS5tYXBzLlBvbHlsaW5lO1xuXG4gIEBJbnB1dCgpXG4gIHNldCBvcHRpb25zKG9wdGlvbnM6IGdvb2dsZS5tYXBzLlBvbHlsaW5lT3B0aW9ucykge1xuICAgIHRoaXMuX29wdGlvbnMubmV4dChvcHRpb25zIHx8IHt9KTtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIHNldCBwYXRoKHBhdGg6IGdvb2dsZS5tYXBzLk1WQ0FycmF5PGdvb2dsZS5tYXBzLkxhdExuZz58Z29vZ2xlLm1hcHMuTGF0TG5nW118XG4gICAgICAgICAgIGdvb2dsZS5tYXBzLkxhdExuZ0xpdGVyYWxbXSkge1xuICAgIHRoaXMuX3BhdGgubmV4dChwYXRoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI1BvbHlsaW5lLmNsaWNrXG4gICAqL1xuICBAT3V0cHV0KClcbiAgcG9seWxpbmVDbGljazogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Qb2x5TW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLlBvbHlNb3VzZUV2ZW50PignY2xpY2snKTtcblxuICAvKipcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNQb2x5bGluZS5kYmxjbGlja1xuICAgKi9cbiAgQE91dHB1dCgpXG4gIHBvbHlsaW5lRGJsY2xpY2s6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuUG9seU1vdXNlRXZlbnQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Qb2x5TW91c2VFdmVudD4oJ2RibGNsaWNrJyk7XG5cbiAgLyoqXG4gICAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jUG9seWxpbmUuZHJhZ1xuICAgKi9cbiAgQE91dHB1dCgpXG4gIHBvbHlsaW5lRHJhZzogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4oJ2RyYWcnKTtcblxuICAvKipcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNQb2x5bGluZS5kcmFnZW5kXG4gICAqL1xuICBAT3V0cHV0KClcbiAgcG9seWxpbmVEcmFnZW5kOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PignZHJhZ2VuZCcpO1xuXG4gIC8qKlxuICAgKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI1BvbHlsaW5lLmRyYWdzdGFydFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIHBvbHlsaW5lRHJhZ3N0YXJ0OiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PignZHJhZ3N0YXJ0Jyk7XG5cbiAgLyoqXG4gICAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jUG9seWxpbmUubW91c2Vkb3duXG4gICAqL1xuICBAT3V0cHV0KClcbiAgcG9seWxpbmVNb3VzZWRvd246IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuUG9seU1vdXNlRXZlbnQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Qb2x5TW91c2VFdmVudD4oJ21vdXNlZG93bicpO1xuXG4gIC8qKlxuICAgKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI1BvbHlsaW5lLm1vdXNlbW92ZVxuICAgKi9cbiAgQE91dHB1dCgpXG4gIHBvbHlsaW5lTW91c2Vtb3ZlOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLlBvbHlNb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuUG9seU1vdXNlRXZlbnQ+KCdtb3VzZW1vdmUnKTtcblxuICAvKipcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNQb2x5bGluZS5tb3VzZW91dFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIHBvbHlsaW5lTW91c2VvdXQ6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuUG9seU1vdXNlRXZlbnQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Qb2x5TW91c2VFdmVudD4oJ21vdXNlb3V0Jyk7XG5cbiAgLyoqXG4gICAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jUG9seWxpbmUubW91c2VvdmVyXG4gICAqL1xuICBAT3V0cHV0KClcbiAgcG9seWxpbmVNb3VzZW92ZXI6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuUG9seU1vdXNlRXZlbnQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Qb2x5TW91c2VFdmVudD4oJ21vdXNlb3ZlcicpO1xuXG4gIC8qKlxuICAgKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI1BvbHlsaW5lLm1vdXNldXBcbiAgICovXG4gIEBPdXRwdXQoKVxuICBwb2x5bGluZU1vdXNldXA6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuUG9seU1vdXNlRXZlbnQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Qb2x5TW91c2VFdmVudD4oJ21vdXNldXAnKTtcblxuICAvKipcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNQb2x5bGluZS5yaWdodGNsaWNrXG4gICAqL1xuICBAT3V0cHV0KClcbiAgcG9seWxpbmVSaWdodGNsaWNrOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLlBvbHlNb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuUG9seU1vdXNlRXZlbnQ+KCdyaWdodGNsaWNrJyk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByZWFkb25seSBfbWFwOiBHb29nbGVNYXAsXG4gICAgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUpIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKHRoaXMuX21hcC5faXNCcm93c2VyKSB7XG4gICAgICB0aGlzLl9jb21iaW5lT3B0aW9ucygpLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKG9wdGlvbnMgPT4ge1xuICAgICAgICAvLyBDcmVhdGUgdGhlIG9iamVjdCBvdXRzaWRlIHRoZSB6b25lIHNvIGl0cyBldmVudHMgZG9uJ3QgdHJpZ2dlciBjaGFuZ2UgZGV0ZWN0aW9uLlxuICAgICAgICAvLyBXZSdsbCBicmluZyBpdCBiYWNrIGluIGluc2lkZSB0aGUgYE1hcEV2ZW50TWFuYWdlcmAgb25seSBmb3IgdGhlIGV2ZW50cyB0aGF0IHRoZVxuICAgICAgICAvLyB1c2VyIGhhcyBzdWJzY3JpYmVkIHRvLlxuICAgICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4gdGhpcy5wb2x5bGluZSA9IG5ldyBnb29nbGUubWFwcy5Qb2x5bGluZShvcHRpb25zKSk7XG4gICAgICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgICAgIHRoaXMucG9seWxpbmUuc2V0TWFwKHRoaXMuX21hcC5nb29nbGVNYXAhKTtcbiAgICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLnNldFRhcmdldCh0aGlzLnBvbHlsaW5lKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLl93YXRjaEZvck9wdGlvbnNDaGFuZ2VzKCk7XG4gICAgICB0aGlzLl93YXRjaEZvclBhdGhDaGFuZ2VzKCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmRlc3Ryb3koKTtcbiAgICB0aGlzLl9kZXN0cm95ZWQubmV4dCgpO1xuICAgIHRoaXMuX2Rlc3Ryb3llZC5jb21wbGV0ZSgpO1xuICAgIGlmICh0aGlzLnBvbHlsaW5lKSB7XG4gICAgICB0aGlzLnBvbHlsaW5lLnNldE1hcChudWxsKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNQb2x5bGluZS5nZXREcmFnZ2FibGVcbiAgICovXG4gIGdldERyYWdnYWJsZSgpOiBib29sZWFuIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLnBvbHlsaW5lLmdldERyYWdnYWJsZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jUG9seWxpbmUuZ2V0RWRpdGFibGVcbiAgICovXG4gIGdldEVkaXRhYmxlKCk6IGJvb2xlYW4ge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMucG9seWxpbmUuZ2V0RWRpdGFibGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI1BvbHlsaW5lLmdldFBhdGhcbiAgICovXG4gIGdldFBhdGgoKTogZ29vZ2xlLm1hcHMuTVZDQXJyYXk8Z29vZ2xlLm1hcHMuTGF0TG5nPiB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDExLjAuMCBNYWtlIHRoZSByZXR1cm4gdmFsdWUgbnVsbGFibGUuXG4gICAgcmV0dXJuIHRoaXMucG9seWxpbmUuZ2V0UGF0aCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jUG9seWxpbmUuZ2V0VmlzaWJsZVxuICAgKi9cbiAgZ2V0VmlzaWJsZSgpOiBib29sZWFuIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLnBvbHlsaW5lLmdldFZpc2libGUoKTtcbiAgfVxuXG4gIHByaXZhdGUgX2NvbWJpbmVPcHRpb25zKCk6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuUG9seWxpbmVPcHRpb25zPiB7XG4gICAgcmV0dXJuIGNvbWJpbmVMYXRlc3QoW3RoaXMuX29wdGlvbnMsIHRoaXMuX3BhdGhdKS5waXBlKG1hcCgoW29wdGlvbnMsIHBhdGhdKSA9PiB7XG4gICAgICBjb25zdCBjb21iaW5lZE9wdGlvbnM6IGdvb2dsZS5tYXBzLlBvbHlsaW5lT3B0aW9ucyA9IHtcbiAgICAgICAgLi4ub3B0aW9ucyxcbiAgICAgICAgcGF0aDogcGF0aCB8fCBvcHRpb25zLnBhdGgsXG4gICAgICB9O1xuICAgICAgcmV0dXJuIGNvbWJpbmVkT3B0aW9ucztcbiAgICB9KSk7XG4gIH1cblxuICBwcml2YXRlIF93YXRjaEZvck9wdGlvbnNDaGFuZ2VzKCkge1xuICAgIHRoaXMuX29wdGlvbnMucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKG9wdGlvbnMgPT4ge1xuICAgICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICAgIHRoaXMucG9seWxpbmUuc2V0T3B0aW9ucyhvcHRpb25zKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3dhdGNoRm9yUGF0aENoYW5nZXMoKSB7XG4gICAgdGhpcy5fcGF0aC5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKS5zdWJzY3JpYmUocGF0aCA9PiB7XG4gICAgICBpZiAocGF0aCkge1xuICAgICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgICB0aGlzLnBvbHlsaW5lLnNldFBhdGgocGF0aCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF9hc3NlcnRJbml0aWFsaXplZCgpOiBhc3NlcnRzIHRoaXMgaXMge3BvbHlsaW5lOiBnb29nbGUubWFwcy5Qb2x5bGluZX0ge1xuICAgIGlmICghdGhpcy5fbWFwLmdvb2dsZU1hcCkge1xuICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICAgJ0Nhbm5vdCBhY2Nlc3MgR29vZ2xlIE1hcCBpbmZvcm1hdGlvbiBiZWZvcmUgdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZC4gJyArXG4gICAgICAgICAgJ1BsZWFzZSB3YWl0IGZvciB0aGUgQVBJIHRvIGxvYWQgYmVmb3JlIHRyeWluZyB0byBpbnRlcmFjdCB3aXRoIGl0LicpO1xuICAgIH1cbiAgICBpZiAoIXRoaXMucG9seWxpbmUpIHtcbiAgICAgIHRocm93IEVycm9yKFxuICAgICAgICAgICdDYW5ub3QgaW50ZXJhY3Qgd2l0aCBhIEdvb2dsZSBNYXAgUG9seWxpbmUgYmVmb3JlIGl0IGhhcyBiZWVuICcgK1xuICAgICAgICAgICdpbml0aWFsaXplZC4gUGxlYXNlIHdhaXQgZm9yIHRoZSBQb2x5bGluZSB0byBsb2FkIGJlZm9yZSB0cnlpbmcgdG8gaW50ZXJhY3Qgd2l0aCBpdC4nKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==