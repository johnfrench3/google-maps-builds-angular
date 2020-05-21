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
 * Angular component that renders a Google Maps Polygon via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon
 */
let MapPolygon = /** @class */ (() => {
    let MapPolygon = class MapPolygon {
        constructor(_map, _ngZone) {
            this._map = _map;
            this._ngZone = _ngZone;
            this._eventManager = new MapEventManager(this._ngZone);
            this._options = new BehaviorSubject({});
            this._paths = new BehaviorSubject(undefined);
            this._destroyed = new Subject();
            /**
             * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.click
             */
            this.polygonClick = this._eventManager.getLazyEmitter('click');
            /**
             * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.dblclick
             */
            this.polygonDblclick = this._eventManager.getLazyEmitter('dblclick');
            /**
             * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.drag
             */
            this.polygonDrag = this._eventManager.getLazyEmitter('drag');
            /**
             * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.dragend
             */
            this.polygonDragend = this._eventManager.getLazyEmitter('dragend');
            /**
             * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.dragstart
             */
            this.polygonDragstart = this._eventManager.getLazyEmitter('dragstart');
            /**
             * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.mousedown
             */
            this.polygonMousedown = this._eventManager.getLazyEmitter('mousedown');
            /**
             * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.mousemove
             */
            this.polygonMousemove = this._eventManager.getLazyEmitter('mousemove');
            /**
             * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.mouseout
             */
            this.polygonMouseout = this._eventManager.getLazyEmitter('mouseout');
            /**
             * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.mouseover
             */
            this.polygonMouseover = this._eventManager.getLazyEmitter('mouseover');
            /**
             * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.mouseup
             */
            this.polygonMouseup = this._eventManager.getLazyEmitter('mouseup');
            /**
             * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.rightclick
             */
            this.polygonRightclick = this._eventManager.getLazyEmitter('rightclick');
        }
        set options(options) {
            this._options.next(options || {});
        }
        set paths(paths) {
            this._paths.next(paths);
        }
        ngOnInit() {
            if (this._map._isBrowser) {
                this._combineOptions().pipe(take(1)).subscribe(options => {
                    // Create the object outside the zone so its events don't trigger change detection.
                    // We'll bring it back in inside the `MapEventManager` only for the events that the
                    // user has subscribed to.
                    this._ngZone.runOutsideAngular(() => {
                        this.polygon = new google.maps.Polygon(options);
                    });
                    this._assertInitialized();
                    this.polygon.setMap(this._map.googleMap);
                    this._eventManager.setTarget(this.polygon);
                });
                this._watchForOptionsChanges();
                this._watchForPathChanges();
            }
        }
        ngOnDestroy() {
            this._eventManager.destroy();
            this._destroyed.next();
            this._destroyed.complete();
            if (this.polygon) {
                this.polygon.setMap(null);
            }
        }
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.getDraggable
         */
        getDraggable() {
            this._assertInitialized();
            return this.polygon.getDraggable();
        }
        /**
         * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.getEditable
         */
        getEditable() {
            this._assertInitialized();
            return this.polygon.getEditable();
        }
        /**
         * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.getPath
         */
        getPath() {
            this._assertInitialized();
            return this.polygon.getPath();
        }
        /**
         * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.getPaths
         */
        getPaths() {
            this._assertInitialized();
            return this.polygon.getPaths();
        }
        /**
         * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.getVisible
         */
        getVisible() {
            this._assertInitialized();
            return this.polygon.getVisible();
        }
        _combineOptions() {
            return combineLatest([this._options, this._paths]).pipe(map(([options, paths]) => {
                const combinedOptions = Object.assign(Object.assign({}, options), { paths: paths || options.paths });
                return combinedOptions;
            }));
        }
        _watchForOptionsChanges() {
            this._options.pipe(takeUntil(this._destroyed)).subscribe(options => {
                this._assertInitialized();
                this.polygon.setOptions(options);
            });
        }
        _watchForPathChanges() {
            this._paths.pipe(takeUntil(this._destroyed)).subscribe(paths => {
                if (paths) {
                    this._assertInitialized();
                    this.polygon.setPaths(paths);
                }
            });
        }
        _assertInitialized() {
            if (!this._map.googleMap) {
                throw Error('Cannot access Google Map information before the API has been initialized. ' +
                    'Please wait for the API to load before trying to interact with it.');
            }
            if (!this.polygon) {
                throw Error('Cannot interact with a Google Map Polygon before it has been ' +
                    'initialized. Please wait for the Polygon to load before trying to interact with it.');
            }
        }
    };
    __decorate([
        Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], MapPolygon.prototype, "options", null);
    __decorate([
        Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], MapPolygon.prototype, "paths", null);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapPolygon.prototype, "polygonClick", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapPolygon.prototype, "polygonDblclick", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapPolygon.prototype, "polygonDrag", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapPolygon.prototype, "polygonDragend", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapPolygon.prototype, "polygonDragstart", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapPolygon.prototype, "polygonMousedown", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapPolygon.prototype, "polygonMousemove", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapPolygon.prototype, "polygonMouseout", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapPolygon.prototype, "polygonMouseover", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapPolygon.prototype, "polygonMouseup", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapPolygon.prototype, "polygonRightclick", void 0);
    MapPolygon = __decorate([
        Directive({
            selector: 'map-polygon',
        }),
        __metadata("design:paramtypes", [GoogleMap, NgZone])
    ], MapPolygon);
    return MapPolygon;
})();
export { MapPolygon };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLXBvbHlnb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvZ29vZ2xlLW1hcHMvbWFwLXBvbHlnb24vbWFwLXBvbHlnb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILHlFQUF5RTtBQUN6RSxvQ0FBb0M7QUFFcEMsT0FBTyxFQUNMLFNBQVMsRUFDVCxLQUFLLEVBR0wsTUFBTSxFQUNOLE1BQU0sR0FDUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsZUFBZSxFQUFFLGFBQWEsRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQ3pFLE9BQU8sRUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRXBELE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUNuRCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFFckQ7Ozs7R0FJRztBQUlIO0lBQUEsSUFBYSxVQUFVLEdBQXZCLE1BQWEsVUFBVTtRQTBHckIsWUFBNkIsSUFBZSxFQUFtQixPQUFlO1lBQWpELFNBQUksR0FBSixJQUFJLENBQVc7WUFBbUIsWUFBTyxHQUFQLE9BQU8sQ0FBUTtZQXpHdEUsa0JBQWEsR0FBRyxJQUFJLGVBQWUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDekMsYUFBUSxHQUFHLElBQUksZUFBZSxDQUE2QixFQUFFLENBQUMsQ0FBQztZQUMvRCxXQUFNLEdBQ25CLElBQUksZUFBZSxDQUV3QyxTQUFTLENBQUMsQ0FBQztZQUV6RCxlQUFVLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQztZQXFCbEQ7O2VBRUc7WUFFSCxpQkFBWSxHQUNSLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUE2QixPQUFPLENBQUMsQ0FBQztZQUUzRTs7ZUFFRztZQUVILG9CQUFlLEdBQ1gsSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQTZCLFVBQVUsQ0FBQyxDQUFDO1lBRTlFOztlQUVHO1lBRUgsZ0JBQVcsR0FDUCxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBeUIsTUFBTSxDQUFDLENBQUM7WUFFdEU7O2VBRUc7WUFFSCxtQkFBYyxHQUNWLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUF5QixTQUFTLENBQUMsQ0FBQztZQUV6RTs7ZUFFRztZQUVILHFCQUFnQixHQUNaLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUF5QixXQUFXLENBQUMsQ0FBQztZQUUzRTs7ZUFFRztZQUVILHFCQUFnQixHQUNaLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUE2QixXQUFXLENBQUMsQ0FBQztZQUUvRTs7ZUFFRztZQUVILHFCQUFnQixHQUNaLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUE2QixXQUFXLENBQUMsQ0FBQztZQUUvRTs7ZUFFRztZQUVILG9CQUFlLEdBQ1gsSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQTZCLFVBQVUsQ0FBQyxDQUFDO1lBRTlFOztlQUVHO1lBRUgscUJBQWdCLEdBQ1osSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQTZCLFdBQVcsQ0FBQyxDQUFDO1lBRS9FOztlQUVHO1lBRUgsbUJBQWMsR0FDVixJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBNkIsU0FBUyxDQUFDLENBQUM7WUFFN0U7O2VBRUc7WUFFSCxzQkFBaUIsR0FDYixJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBNkIsWUFBWSxDQUFDLENBQUM7UUFFQyxDQUFDO1FBeEZsRixJQUFJLE9BQU8sQ0FBQyxPQUFtQztZQUM3QyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLENBQUM7UUFDcEMsQ0FBQztRQUdELElBQUksS0FBSyxDQUFDLEtBRTJCO1lBQ25DLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzFCLENBQUM7UUFpRkQsUUFBUTtZQUNOLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUU7Z0JBQ3hCLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxFQUFFO29CQUN2RCxtRkFBbUY7b0JBQ25GLG1GQUFtRjtvQkFDbkYsMEJBQTBCO29CQUMxQixJQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRTt3QkFDbEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUNsRCxDQUFDLENBQUMsQ0FBQztvQkFDSCxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztvQkFDMUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFVLENBQUMsQ0FBQztvQkFDMUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUM3QyxDQUFDLENBQUMsQ0FBQztnQkFFSCxJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztnQkFDL0IsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7YUFDN0I7UUFDSCxDQUFDO1FBRUQsV0FBVztZQUNULElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDN0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUN2QixJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQzNCLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtnQkFDaEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDM0I7UUFDSCxDQUFDO1FBRUQ7OztXQUdHO1FBQ0gsWUFBWTtZQUNWLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQzFCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNyQyxDQUFDO1FBRUQ7O1dBRUc7UUFDSCxXQUFXO1lBQ1QsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFDMUIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3BDLENBQUM7UUFFRDs7V0FFRztRQUNILE9BQU87WUFDTCxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUMxQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDaEMsQ0FBQztRQUVEOztXQUVHO1FBQ0gsUUFBUTtZQUNOLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQzFCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNqQyxDQUFDO1FBRUQ7O1dBRUc7UUFDSCxVQUFVO1lBQ1IsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFDMUIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ25DLENBQUM7UUFFTyxlQUFlO1lBQ3JCLE9BQU8sYUFBYSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLEVBQUUsRUFBRTtnQkFDL0UsTUFBTSxlQUFlLG1DQUNoQixPQUFPLEtBQ1YsS0FBSyxFQUFFLEtBQUssSUFBSSxPQUFPLENBQUMsS0FBSyxHQUM5QixDQUFDO2dCQUNGLE9BQU8sZUFBZSxDQUFDO1lBQ3pCLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDTixDQUFDO1FBRU8sdUJBQXVCO1lBQzdCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ2pFLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO2dCQUMxQixJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNuQyxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7UUFFTyxvQkFBb0I7WUFDMUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDN0QsSUFBSSxLQUFLLEVBQUU7b0JBQ1QsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7b0JBQzFCLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO2lCQUM5QjtZQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUVPLGtCQUFrQjtZQUN4QixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7Z0JBQ3hCLE1BQU0sS0FBSyxDQUNQLDRFQUE0RTtvQkFDNUUsb0VBQW9FLENBQUMsQ0FBQzthQUMzRTtZQUNELElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO2dCQUNqQixNQUFNLEtBQUssQ0FDUCwrREFBK0Q7b0JBQy9ELHFGQUFxRixDQUFDLENBQUM7YUFDNUY7UUFDSCxDQUFDO0tBQ0YsQ0FBQTtJQXJNQztRQURDLEtBQUssRUFBRTs7OzZDQUdQO0lBR0Q7UUFEQyxLQUFLLEVBQUU7OzsyQ0FLUDtJQU1EO1FBREMsTUFBTSxFQUFFO2tDQUNLLFVBQVU7b0RBQ21EO0lBTTNFO1FBREMsTUFBTSxFQUFFO2tDQUNRLFVBQVU7dURBQ21EO0lBTTlFO1FBREMsTUFBTSxFQUFFO2tDQUNJLFVBQVU7bURBQytDO0lBTXRFO1FBREMsTUFBTSxFQUFFO2tDQUNPLFVBQVU7c0RBQytDO0lBTXpFO1FBREMsTUFBTSxFQUFFO2tDQUNTLFVBQVU7d0RBQytDO0lBTTNFO1FBREMsTUFBTSxFQUFFO2tDQUNTLFVBQVU7d0RBQ21EO0lBTS9FO1FBREMsTUFBTSxFQUFFO2tDQUNTLFVBQVU7d0RBQ21EO0lBTS9FO1FBREMsTUFBTSxFQUFFO2tDQUNRLFVBQVU7dURBQ21EO0lBTTlFO1FBREMsTUFBTSxFQUFFO2tDQUNTLFVBQVU7d0RBQ21EO0lBTS9FO1FBREMsTUFBTSxFQUFFO2tDQUNPLFVBQVU7c0RBQ21EO0lBTTdFO1FBREMsTUFBTSxFQUFFO2tDQUNVLFVBQVU7eURBQ21EO0lBeEdyRSxVQUFVO1FBSHRCLFNBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxhQUFhO1NBQ3hCLENBQUM7eUNBMkdtQyxTQUFTLEVBQTRCLE1BQU07T0ExR25FLFVBQVUsQ0F1TnRCO0lBQUQsaUJBQUM7S0FBQTtTQXZOWSxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8vIFdvcmthcm91bmQgZm9yOiBodHRwczovL2dpdGh1Yi5jb20vYmF6ZWxidWlsZC9ydWxlc19ub2RlanMvaXNzdWVzLzEyNjVcbi8vLyA8cmVmZXJlbmNlIHR5cGVzPVwiZ29vZ2xlbWFwc1wiIC8+XG5cbmltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgSW5wdXQsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIE5nWm9uZSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0JlaGF2aW9yU3ViamVjdCwgY29tYmluZUxhdGVzdCwgT2JzZXJ2YWJsZSwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge21hcCwgdGFrZSwgdGFrZVVudGlsfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7R29vZ2xlTWFwfSBmcm9tICcuLi9nb29nbGUtbWFwL2dvb2dsZS1tYXAnO1xuaW1wb3J0IHtNYXBFdmVudE1hbmFnZXJ9IGZyb20gJy4uL21hcC1ldmVudC1tYW5hZ2VyJztcblxuLyoqXG4gKiBBbmd1bGFyIGNvbXBvbmVudCB0aGF0IHJlbmRlcnMgYSBHb29nbGUgTWFwcyBQb2x5Z29uIHZpYSB0aGUgR29vZ2xlIE1hcHMgSmF2YVNjcmlwdCBBUEkuXG4gKlxuICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNQb2x5Z29uXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hcC1wb2x5Z29uJyxcbn0pXG5leHBvcnQgY2xhc3MgTWFwUG9seWdvbiBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfZXZlbnRNYW5hZ2VyID0gbmV3IE1hcEV2ZW50TWFuYWdlcih0aGlzLl9uZ1pvbmUpO1xuICBwcml2YXRlIHJlYWRvbmx5IF9vcHRpb25zID0gbmV3IEJlaGF2aW9yU3ViamVjdDxnb29nbGUubWFwcy5Qb2x5Z29uT3B0aW9ucz4oe30pO1xuICBwcml2YXRlIHJlYWRvbmx5IF9wYXRocyA9XG4gICAgICBuZXcgQmVoYXZpb3JTdWJqZWN0PGdvb2dsZS5tYXBzLk1WQ0FycmF5PGdvb2dsZS5tYXBzLk1WQ0FycmF5PGdvb2dsZS5tYXBzLkxhdExuZz4+fFxuICAgICAgICAgICAgICAgICAgICAgICAgICBnb29nbGUubWFwcy5NVkNBcnJheTxnb29nbGUubWFwcy5MYXRMbmc+fGdvb2dsZS5tYXBzLkxhdExuZ1tdfFxuICAgICAgICAgICAgICAgICAgICAgICAgICBnb29nbGUubWFwcy5MYXRMbmdMaXRlcmFsW118dW5kZWZpbmVkPih1bmRlZmluZWQpO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgX2Rlc3Ryb3llZCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqXG4gICAqIFRoZSB1bmRlcmx5aW5nIGdvb2dsZS5tYXBzLlBvbHlnb24gb2JqZWN0LlxuICAgKlxuICAgKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI1BvbHlnb25cbiAgICovXG4gIHBvbHlnb24/OiBnb29nbGUubWFwcy5Qb2x5Z29uO1xuXG4gIEBJbnB1dCgpXG4gIHNldCBvcHRpb25zKG9wdGlvbnM6IGdvb2dsZS5tYXBzLlBvbHlnb25PcHRpb25zKSB7XG4gICAgdGhpcy5fb3B0aW9ucy5uZXh0KG9wdGlvbnMgfHwge30pO1xuICB9XG5cbiAgQElucHV0KClcbiAgc2V0IHBhdGhzKHBhdGhzOiBnb29nbGUubWFwcy5NVkNBcnJheTxnb29nbGUubWFwcy5NVkNBcnJheTxnb29nbGUubWFwcy5MYXRMbmc+PnxcbiAgICAgICAgICAgIGdvb2dsZS5tYXBzLk1WQ0FycmF5PGdvb2dsZS5tYXBzLkxhdExuZz58Z29vZ2xlLm1hcHMuTGF0TG5nW118XG4gICAgICAgICAgICBnb29nbGUubWFwcy5MYXRMbmdMaXRlcmFsW10pIHtcbiAgICB0aGlzLl9wYXRocy5uZXh0KHBhdGhzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI1BvbHlnb24uY2xpY2tcbiAgICovXG4gIEBPdXRwdXQoKVxuICBwb2x5Z29uQ2xpY2s6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuUG9seU1vdXNlRXZlbnQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Qb2x5TW91c2VFdmVudD4oJ2NsaWNrJyk7XG5cbiAgLyoqXG4gICAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jUG9seWdvbi5kYmxjbGlja1xuICAgKi9cbiAgQE91dHB1dCgpXG4gIHBvbHlnb25EYmxjbGljazogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Qb2x5TW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLlBvbHlNb3VzZUV2ZW50PignZGJsY2xpY2snKTtcblxuICAvKipcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNQb2x5Z29uLmRyYWdcbiAgICovXG4gIEBPdXRwdXQoKVxuICBwb2x5Z29uRHJhZzogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4oJ2RyYWcnKTtcblxuICAvKipcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNQb2x5Z29uLmRyYWdlbmRcbiAgICovXG4gIEBPdXRwdXQoKVxuICBwb2x5Z29uRHJhZ2VuZDogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4oJ2RyYWdlbmQnKTtcblxuICAvKipcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNQb2x5Z29uLmRyYWdzdGFydFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIHBvbHlnb25EcmFnc3RhcnQ6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+KCdkcmFnc3RhcnQnKTtcblxuICAvKipcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNQb2x5Z29uLm1vdXNlZG93blxuICAgKi9cbiAgQE91dHB1dCgpXG4gIHBvbHlnb25Nb3VzZWRvd246IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuUG9seU1vdXNlRXZlbnQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Qb2x5TW91c2VFdmVudD4oJ21vdXNlZG93bicpO1xuXG4gIC8qKlxuICAgKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI1BvbHlnb24ubW91c2Vtb3ZlXG4gICAqL1xuICBAT3V0cHV0KClcbiAgcG9seWdvbk1vdXNlbW92ZTogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Qb2x5TW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLlBvbHlNb3VzZUV2ZW50PignbW91c2Vtb3ZlJyk7XG5cbiAgLyoqXG4gICAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jUG9seWdvbi5tb3VzZW91dFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIHBvbHlnb25Nb3VzZW91dDogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Qb2x5TW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLlBvbHlNb3VzZUV2ZW50PignbW91c2VvdXQnKTtcblxuICAvKipcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNQb2x5Z29uLm1vdXNlb3ZlclxuICAgKi9cbiAgQE91dHB1dCgpXG4gIHBvbHlnb25Nb3VzZW92ZXI6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuUG9seU1vdXNlRXZlbnQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Qb2x5TW91c2VFdmVudD4oJ21vdXNlb3ZlcicpO1xuXG4gIC8qKlxuICAgKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI1BvbHlnb24ubW91c2V1cFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIHBvbHlnb25Nb3VzZXVwOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLlBvbHlNb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuUG9seU1vdXNlRXZlbnQ+KCdtb3VzZXVwJyk7XG5cbiAgLyoqXG4gICAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jUG9seWdvbi5yaWdodGNsaWNrXG4gICAqL1xuICBAT3V0cHV0KClcbiAgcG9seWdvblJpZ2h0Y2xpY2s6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuUG9seU1vdXNlRXZlbnQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Qb2x5TW91c2VFdmVudD4oJ3JpZ2h0Y2xpY2snKTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IF9tYXA6IEdvb2dsZU1hcCwgcHJpdmF0ZSByZWFkb25seSBfbmdab25lOiBOZ1pvbmUpIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKHRoaXMuX21hcC5faXNCcm93c2VyKSB7XG4gICAgICB0aGlzLl9jb21iaW5lT3B0aW9ucygpLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKG9wdGlvbnMgPT4ge1xuICAgICAgICAvLyBDcmVhdGUgdGhlIG9iamVjdCBvdXRzaWRlIHRoZSB6b25lIHNvIGl0cyBldmVudHMgZG9uJ3QgdHJpZ2dlciBjaGFuZ2UgZGV0ZWN0aW9uLlxuICAgICAgICAvLyBXZSdsbCBicmluZyBpdCBiYWNrIGluIGluc2lkZSB0aGUgYE1hcEV2ZW50TWFuYWdlcmAgb25seSBmb3IgdGhlIGV2ZW50cyB0aGF0IHRoZVxuICAgICAgICAvLyB1c2VyIGhhcyBzdWJzY3JpYmVkIHRvLlxuICAgICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgIHRoaXMucG9seWdvbiA9IG5ldyBnb29nbGUubWFwcy5Qb2x5Z29uKG9wdGlvbnMpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICAgICAgdGhpcy5wb2x5Z29uLnNldE1hcCh0aGlzLl9tYXAuZ29vZ2xlTWFwISk7XG4gICAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5zZXRUYXJnZXQodGhpcy5wb2x5Z29uKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLl93YXRjaEZvck9wdGlvbnNDaGFuZ2VzKCk7XG4gICAgICB0aGlzLl93YXRjaEZvclBhdGhDaGFuZ2VzKCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmRlc3Ryb3koKTtcbiAgICB0aGlzLl9kZXN0cm95ZWQubmV4dCgpO1xuICAgIHRoaXMuX2Rlc3Ryb3llZC5jb21wbGV0ZSgpO1xuICAgIGlmICh0aGlzLnBvbHlnb24pIHtcbiAgICAgIHRoaXMucG9seWdvbi5zZXRNYXAobnVsbCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jUG9seWdvbi5nZXREcmFnZ2FibGVcbiAgICovXG4gIGdldERyYWdnYWJsZSgpOiBib29sZWFuIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLnBvbHlnb24uZ2V0RHJhZ2dhYmxlKCk7XG4gIH1cblxuICAvKipcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNQb2x5Z29uLmdldEVkaXRhYmxlXG4gICAqL1xuICBnZXRFZGl0YWJsZSgpOiBib29sZWFuIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLnBvbHlnb24uZ2V0RWRpdGFibGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI1BvbHlnb24uZ2V0UGF0aFxuICAgKi9cbiAgZ2V0UGF0aCgpOiBnb29nbGUubWFwcy5NVkNBcnJheTxnb29nbGUubWFwcy5MYXRMbmc+IHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLnBvbHlnb24uZ2V0UGF0aCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jUG9seWdvbi5nZXRQYXRoc1xuICAgKi9cbiAgZ2V0UGF0aHMoKTogZ29vZ2xlLm1hcHMuTVZDQXJyYXk8Z29vZ2xlLm1hcHMuTVZDQXJyYXk8Z29vZ2xlLm1hcHMuTGF0TG5nPj4ge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMucG9seWdvbi5nZXRQYXRocygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jUG9seWdvbi5nZXRWaXNpYmxlXG4gICAqL1xuICBnZXRWaXNpYmxlKCk6IGJvb2xlYW4ge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMucG9seWdvbi5nZXRWaXNpYmxlKCk7XG4gIH1cblxuICBwcml2YXRlIF9jb21iaW5lT3B0aW9ucygpOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLlBvbHlnb25PcHRpb25zPiB7XG4gICAgcmV0dXJuIGNvbWJpbmVMYXRlc3QoW3RoaXMuX29wdGlvbnMsIHRoaXMuX3BhdGhzXSkucGlwZShtYXAoKFtvcHRpb25zLCBwYXRoc10pID0+IHtcbiAgICAgIGNvbnN0IGNvbWJpbmVkT3B0aW9uczogZ29vZ2xlLm1hcHMuUG9seWdvbk9wdGlvbnMgPSB7XG4gICAgICAgIC4uLm9wdGlvbnMsXG4gICAgICAgIHBhdGhzOiBwYXRocyB8fCBvcHRpb25zLnBhdGhzLFxuICAgICAgfTtcbiAgICAgIHJldHVybiBjb21iaW5lZE9wdGlvbnM7XG4gICAgfSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBfd2F0Y2hGb3JPcHRpb25zQ2hhbmdlcygpIHtcbiAgICB0aGlzLl9vcHRpb25zLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpLnN1YnNjcmliZShvcHRpb25zID0+IHtcbiAgICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgICB0aGlzLnBvbHlnb24uc2V0T3B0aW9ucyhvcHRpb25zKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3dhdGNoRm9yUGF0aENoYW5nZXMoKSB7XG4gICAgdGhpcy5fcGF0aHMucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKHBhdGhzID0+IHtcbiAgICAgIGlmIChwYXRocykge1xuICAgICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgICB0aGlzLnBvbHlnb24uc2V0UGF0aHMocGF0aHMpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfYXNzZXJ0SW5pdGlhbGl6ZWQoKTogYXNzZXJ0cyB0aGlzIGlzIHtwb2x5Z29uOiBnb29nbGUubWFwcy5Qb2x5Z29ufSB7XG4gICAgaWYgKCF0aGlzLl9tYXAuZ29vZ2xlTWFwKSB7XG4gICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICAnQ2Fubm90IGFjY2VzcyBHb29nbGUgTWFwIGluZm9ybWF0aW9uIGJlZm9yZSB0aGUgQVBJIGhhcyBiZWVuIGluaXRpYWxpemVkLiAnICtcbiAgICAgICAgICAnUGxlYXNlIHdhaXQgZm9yIHRoZSBBUEkgdG8gbG9hZCBiZWZvcmUgdHJ5aW5nIHRvIGludGVyYWN0IHdpdGggaXQuJyk7XG4gICAgfVxuICAgIGlmICghdGhpcy5wb2x5Z29uKSB7XG4gICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICAnQ2Fubm90IGludGVyYWN0IHdpdGggYSBHb29nbGUgTWFwIFBvbHlnb24gYmVmb3JlIGl0IGhhcyBiZWVuICcgK1xuICAgICAgICAgICdpbml0aWFsaXplZC4gUGxlYXNlIHdhaXQgZm9yIHRoZSBQb2x5Z29uIHRvIGxvYWQgYmVmb3JlIHRyeWluZyB0byBpbnRlcmFjdCB3aXRoIGl0LicpO1xuICAgIH1cbiAgfVxufVxuIl19