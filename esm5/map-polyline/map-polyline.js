/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __assign, __read } from "tslib";
// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="googlemaps" />
import { Directive, Input, Output, NgZone, } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { GoogleMap } from '../google-map/google-map';
import { MapEventManager } from '../map-event-manager';
/**
 * Angular component that renders a Google Maps Polyline via the Google Maps JavaScript API.
 * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polyline
 */
var MapPolyline = /** @class */ (function () {
    function MapPolyline(_map, _ngZone) {
        this._map = _map;
        this._ngZone = _ngZone;
        this._eventManager = new MapEventManager(this._ngZone);
        this._options = new BehaviorSubject({});
        this._path = new BehaviorSubject(undefined);
        this._destroyed = new Subject();
        /**
         * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.click
         */
        this.polylineClick = this._eventManager.getLazyEmitter('click');
        /**
         * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.dblclick
         */
        this.polylineDblclick = this._eventManager.getLazyEmitter('dblclick');
        /**
         * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.drag
         */
        this.polylineDrag = this._eventManager.getLazyEmitter('drag');
        /**
         * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.dragend
         */
        this.polylineDragend = this._eventManager.getLazyEmitter('dragend');
        /**
         * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.dragstart
         */
        this.polylineDragstart = this._eventManager.getLazyEmitter('dragstart');
        /**
         * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.mousedown
         */
        this.polylineMousedown = this._eventManager.getLazyEmitter('mousedown');
        /**
         * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.mousemove
         */
        this.polylineMousemove = this._eventManager.getLazyEmitter('mousemove');
        /**
         * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.mouseout
         */
        this.polylineMouseout = this._eventManager.getLazyEmitter('mouseout');
        /**
         * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.mouseover
         */
        this.polylineMouseover = this._eventManager.getLazyEmitter('mouseover');
        /**
         * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.mouseup
         */
        this.polylineMouseup = this._eventManager.getLazyEmitter('mouseup');
        /**
         * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.rightclick
         */
        this.polylineRightclick = this._eventManager.getLazyEmitter('rightclick');
    }
    Object.defineProperty(MapPolyline.prototype, "options", {
        set: function (options) {
            this._options.next(options || {});
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapPolyline.prototype, "path", {
        set: function (path) {
            this._path.next(path);
        },
        enumerable: true,
        configurable: true
    });
    MapPolyline.prototype.ngOnInit = function () {
        var _this = this;
        if (this._map._isBrowser) {
            var combinedOptionsChanges = this._combineOptions();
            combinedOptionsChanges.pipe(take(1)).subscribe(function (options) {
                // Create the object outside the zone so its events don't trigger change detection.
                // We'll bring it back in inside the `MapEventManager` only for the events that the
                // user has subscribed to.
                _this._ngZone.runOutsideAngular(function () { return _this._polyline = new google.maps.Polyline(options); });
                _this._polyline.setMap(_this._map._googleMap);
                _this._eventManager.setTarget(_this._polyline);
            });
            this._watchForOptionsChanges();
            this._watchForPathChanges();
        }
    };
    MapPolyline.prototype.ngOnDestroy = function () {
        this._eventManager.destroy();
        this._destroyed.next();
        this._destroyed.complete();
        if (this._polyline) {
            this._polyline.setMap(null);
        }
    };
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.getDraggable
     */
    MapPolyline.prototype.getDraggable = function () {
        return this._polyline ? this._polyline.getDraggable() : false;
    };
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.getEditable
     */
    MapPolyline.prototype.getEditable = function () {
        return this._polyline ? this._polyline.getEditable() : false;
    };
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.getPath
     */
    MapPolyline.prototype.getPath = function () {
        // @breaking-change 11.0.0 Make the return value nullable.
        return this._polyline ? this._polyline.getPath() : null;
    };
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.getVisible
     */
    MapPolyline.prototype.getVisible = function () {
        return this._polyline ? this._polyline.getVisible() : false;
    };
    MapPolyline.prototype._combineOptions = function () {
        return combineLatest([this._options, this._path]).pipe(map(function (_a) {
            var _b = __read(_a, 2), options = _b[0], path = _b[1];
            var combinedOptions = __assign(__assign({}, options), { path: path || options.path });
            return combinedOptions;
        }));
    };
    MapPolyline.prototype._watchForOptionsChanges = function () {
        var _this = this;
        this._options.pipe(takeUntil(this._destroyed)).subscribe(function (options) {
            if (_this._polyline) {
                _this._polyline.setOptions(options);
            }
        });
    };
    MapPolyline.prototype._watchForPathChanges = function () {
        var _this = this;
        this._path.pipe(takeUntil(this._destroyed)).subscribe(function (path) {
            if (path && _this._polyline) {
                _this._polyline.setPath(path);
            }
        });
    };
    MapPolyline.decorators = [
        { type: Directive, args: [{
                    selector: 'map-polyline',
                },] }
    ];
    /** @nocollapse */
    MapPolyline.ctorParameters = function () { return [
        { type: GoogleMap },
        { type: NgZone }
    ]; };
    MapPolyline.propDecorators = {
        options: [{ type: Input }],
        path: [{ type: Input }],
        polylineClick: [{ type: Output }],
        polylineDblclick: [{ type: Output }],
        polylineDrag: [{ type: Output }],
        polylineDragend: [{ type: Output }],
        polylineDragstart: [{ type: Output }],
        polylineMousedown: [{ type: Output }],
        polylineMousemove: [{ type: Output }],
        polylineMouseout: [{ type: Output }],
        polylineMouseover: [{ type: Output }],
        polylineMouseup: [{ type: Output }],
        polylineRightclick: [{ type: Output }]
    };
    return MapPolyline;
}());
export { MapPolyline };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLXBvbHlsaW5lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2dvb2dsZS1tYXBzL21hcC1wb2x5bGluZS9tYXAtcG9seWxpbmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILHlFQUF5RTtBQUN6RSxvQ0FBb0M7QUFFcEMsT0FBTyxFQUNMLFNBQVMsRUFDVCxLQUFLLEVBR0wsTUFBTSxFQUNOLE1BQU0sR0FDUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsZUFBZSxFQUFFLGFBQWEsRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQ3pFLE9BQU8sRUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRXBELE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUNuRCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFFckQ7OztHQUdHO0FBQ0g7SUFzR0UscUJBQ21CLElBQWUsRUFDeEIsT0FBZTtRQUROLFNBQUksR0FBSixJQUFJLENBQVc7UUFDeEIsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQXBHakIsa0JBQWEsR0FBRyxJQUFJLGVBQWUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDekMsYUFBUSxHQUFHLElBQUksZUFBZSxDQUE4QixFQUFFLENBQUMsQ0FBQztRQUNoRSxVQUFLLEdBQ2xCLElBQUksZUFBZSxDQUN3QyxTQUFTLENBQUMsQ0FBQztRQUV6RCxlQUFVLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQztRQWVsRDs7V0FFRztRQUVILGtCQUFhLEdBQ1QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQTZCLE9BQU8sQ0FBQyxDQUFDO1FBRTNFOztXQUVHO1FBRUgscUJBQWdCLEdBQ1osSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQTZCLFVBQVUsQ0FBQyxDQUFDO1FBRTlFOztXQUVHO1FBRUgsaUJBQVksR0FDUixJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBeUIsTUFBTSxDQUFDLENBQUM7UUFFdEU7O1dBRUc7UUFFSCxvQkFBZSxHQUNYLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUF5QixTQUFTLENBQUMsQ0FBQztRQUV6RTs7V0FFRztRQUVILHNCQUFpQixHQUNiLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUF5QixXQUFXLENBQUMsQ0FBQztRQUUzRTs7V0FFRztRQUVILHNCQUFpQixHQUNiLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUE2QixXQUFXLENBQUMsQ0FBQztRQUUvRTs7V0FFRztRQUVILHNCQUFpQixHQUNiLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUE2QixXQUFXLENBQUMsQ0FBQztRQUUvRTs7V0FFRztRQUVILHFCQUFnQixHQUNaLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUE2QixVQUFVLENBQUMsQ0FBQztRQUU5RTs7V0FFRztRQUVILHNCQUFpQixHQUNiLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUE2QixXQUFXLENBQUMsQ0FBQztRQUUvRTs7V0FFRztRQUVILG9CQUFlLEdBQ1gsSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQTZCLFNBQVMsQ0FBQyxDQUFDO1FBRTdFOztXQUVHO1FBRUgsdUJBQWtCLEdBQ2QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQTZCLFlBQVksQ0FBQyxDQUFDO0lBSXBELENBQUM7SUExRjdCLHNCQUNJLGdDQUFPO2FBRFgsVUFDWSxPQUFvQztZQUM5QyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLENBQUM7UUFDcEMsQ0FBQzs7O09BQUE7SUFFRCxzQkFDSSw2QkFBSTthQURSLFVBQ1MsSUFDMkI7WUFDbEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEIsQ0FBQzs7O09BQUE7SUFtRkQsOEJBQVEsR0FBUjtRQUFBLGlCQWdCQztRQWZDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDeEIsSUFBTSxzQkFBc0IsR0FBRyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7WUFFdEQsc0JBQXNCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxVQUFBLE9BQU87Z0JBQ3BELG1GQUFtRjtnQkFDbkYsbUZBQW1GO2dCQUNuRiwwQkFBMEI7Z0JBQzFCLEtBQUksQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsY0FBTSxPQUFBLEtBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBbEQsQ0FBa0QsQ0FBQyxDQUFDO2dCQUN6RixLQUFJLENBQUMsU0FBVSxDQUFDLE1BQU0sQ0FBQyxLQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUM3QyxLQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxLQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDL0MsQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztZQUMvQixJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztTQUM3QjtJQUNILENBQUM7SUFFRCxpQ0FBVyxHQUFYO1FBQ0UsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUM3QixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDM0IsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2xCLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzdCO0lBQ0gsQ0FBQztJQUVEOzs7T0FHRztJQUNILGtDQUFZLEdBQVo7UUFDRSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztJQUNoRSxDQUFDO0lBRUQ7O09BRUc7SUFDSCxpQ0FBVyxHQUFYO1FBQ0UsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7SUFDL0QsQ0FBQztJQUVEOztPQUVHO0lBQ0gsNkJBQU8sR0FBUDtRQUNFLDBEQUEwRDtRQUMxRCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUssQ0FBQztJQUMzRCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxnQ0FBVSxHQUFWO1FBQ0UsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7SUFDOUQsQ0FBQztJQUVPLHFDQUFlLEdBQXZCO1FBQ0UsT0FBTyxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBQyxFQUFlO2dCQUFmLGtCQUFlLEVBQWQsZUFBTyxFQUFFLFlBQUk7WUFDeEUsSUFBTSxlQUFlLHlCQUNoQixPQUFPLEtBQ1YsSUFBSSxFQUFFLElBQUksSUFBSSxPQUFPLENBQUMsSUFBSSxHQUMzQixDQUFDO1lBQ0YsT0FBTyxlQUFlLENBQUM7UUFDekIsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNOLENBQUM7SUFFTyw2Q0FBdUIsR0FBL0I7UUFBQSxpQkFNQztRQUxDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBQSxPQUFPO1lBQzlELElBQUksS0FBSSxDQUFDLFNBQVMsRUFBRTtnQkFDbEIsS0FBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDcEM7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFTywwQ0FBb0IsR0FBNUI7UUFBQSxpQkFNQztRQUxDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBQSxJQUFJO1lBQ3hELElBQUksSUFBSSxJQUFJLEtBQUksQ0FBQyxTQUFTLEVBQUU7Z0JBQzFCLEtBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQzlCO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDOztnQkEzTEYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxjQUFjO2lCQUN6Qjs7OztnQkFUTyxTQUFTO2dCQUxmLE1BQU07OzswQkEwQkwsS0FBSzt1QkFLTCxLQUFLO2dDQVNMLE1BQU07bUNBT04sTUFBTTsrQkFPTixNQUFNO2tDQU9OLE1BQU07b0NBT04sTUFBTTtvQ0FPTixNQUFNO29DQU9OLE1BQU07bUNBT04sTUFBTTtvQ0FPTixNQUFNO2tDQU9OLE1BQU07cUNBT04sTUFBTTs7SUEwRlQsa0JBQUM7Q0FBQSxBQTVMRCxJQTRMQztTQXpMWSxXQUFXIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8vIFdvcmthcm91bmQgZm9yOiBodHRwczovL2dpdGh1Yi5jb20vYmF6ZWxidWlsZC9ydWxlc19ub2RlanMvaXNzdWVzLzEyNjVcbi8vLyA8cmVmZXJlbmNlIHR5cGVzPVwiZ29vZ2xlbWFwc1wiIC8+XG5cbmltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgSW5wdXQsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIE5nWm9uZSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0JlaGF2aW9yU3ViamVjdCwgY29tYmluZUxhdGVzdCwgT2JzZXJ2YWJsZSwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge21hcCwgdGFrZSwgdGFrZVVudGlsfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7R29vZ2xlTWFwfSBmcm9tICcuLi9nb29nbGUtbWFwL2dvb2dsZS1tYXAnO1xuaW1wb3J0IHtNYXBFdmVudE1hbmFnZXJ9IGZyb20gJy4uL21hcC1ldmVudC1tYW5hZ2VyJztcblxuLyoqXG4gKiBBbmd1bGFyIGNvbXBvbmVudCB0aGF0IHJlbmRlcnMgYSBHb29nbGUgTWFwcyBQb2x5bGluZSB2aWEgdGhlIEdvb2dsZSBNYXBzIEphdmFTY3JpcHQgQVBJLlxuICogQHNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jUG9seWxpbmVcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWFwLXBvbHlsaW5lJyxcbn0pXG5leHBvcnQgY2xhc3MgTWFwUG9seWxpbmUgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX2V2ZW50TWFuYWdlciA9IG5ldyBNYXBFdmVudE1hbmFnZXIodGhpcy5fbmdab25lKTtcbiAgcHJpdmF0ZSByZWFkb25seSBfb3B0aW9ucyA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Z29vZ2xlLm1hcHMuUG9seWxpbmVPcHRpb25zPih7fSk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX3BhdGggPVxuICAgICAgbmV3IEJlaGF2aW9yU3ViamVjdDxnb29nbGUubWFwcy5NVkNBcnJheTxnb29nbGUubWFwcy5MYXRMbmc+fGdvb2dsZS5tYXBzLkxhdExuZ1tdfFxuICAgICAgICAgICAgICAgICAgICAgICAgICBnb29nbGUubWFwcy5MYXRMbmdMaXRlcmFsW118dW5kZWZpbmVkPih1bmRlZmluZWQpO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgX2Rlc3Ryb3llZCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgX3BvbHlsaW5lPzogZ29vZ2xlLm1hcHMuUG9seWxpbmU7IC8vIGluaXRpYWxpemVkIGluIG5nT25Jbml0XG5cbiAgQElucHV0KClcbiAgc2V0IG9wdGlvbnMob3B0aW9uczogZ29vZ2xlLm1hcHMuUG9seWxpbmVPcHRpb25zKSB7XG4gICAgdGhpcy5fb3B0aW9ucy5uZXh0KG9wdGlvbnMgfHwge30pO1xuICB9XG5cbiAgQElucHV0KClcbiAgc2V0IHBhdGgocGF0aDogZ29vZ2xlLm1hcHMuTVZDQXJyYXk8Z29vZ2xlLm1hcHMuTGF0TG5nPnxnb29nbGUubWFwcy5MYXRMbmdbXXxcbiAgICAgICAgICAgZ29vZ2xlLm1hcHMuTGF0TG5nTGl0ZXJhbFtdKSB7XG4gICAgdGhpcy5fcGF0aC5uZXh0KHBhdGgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBzZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI1BvbHlsaW5lLmNsaWNrXG4gICAqL1xuICBAT3V0cHV0KClcbiAgcG9seWxpbmVDbGljazogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Qb2x5TW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLlBvbHlNb3VzZUV2ZW50PignY2xpY2snKTtcblxuICAvKipcbiAgICogQHNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jUG9seWxpbmUuZGJsY2xpY2tcbiAgICovXG4gIEBPdXRwdXQoKVxuICBwb2x5bGluZURibGNsaWNrOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLlBvbHlNb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuUG9seU1vdXNlRXZlbnQ+KCdkYmxjbGljaycpO1xuXG4gIC8qKlxuICAgKiBAc2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNQb2x5bGluZS5kcmFnXG4gICAqL1xuICBAT3V0cHV0KClcbiAgcG9seWxpbmVEcmFnOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PignZHJhZycpO1xuXG4gIC8qKlxuICAgKiBAc2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNQb2x5bGluZS5kcmFnZW5kXG4gICAqL1xuICBAT3V0cHV0KClcbiAgcG9seWxpbmVEcmFnZW5kOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PignZHJhZ2VuZCcpO1xuXG4gIC8qKlxuICAgKiBAc2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNQb2x5bGluZS5kcmFnc3RhcnRcbiAgICovXG4gIEBPdXRwdXQoKVxuICBwb2x5bGluZURyYWdzdGFydDogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4oJ2RyYWdzdGFydCcpO1xuXG4gIC8qKlxuICAgKiBAc2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNQb2x5bGluZS5tb3VzZWRvd25cbiAgICovXG4gIEBPdXRwdXQoKVxuICBwb2x5bGluZU1vdXNlZG93bjogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Qb2x5TW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLlBvbHlNb3VzZUV2ZW50PignbW91c2Vkb3duJyk7XG5cbiAgLyoqXG4gICAqIEBzZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI1BvbHlsaW5lLm1vdXNlbW92ZVxuICAgKi9cbiAgQE91dHB1dCgpXG4gIHBvbHlsaW5lTW91c2Vtb3ZlOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLlBvbHlNb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuUG9seU1vdXNlRXZlbnQ+KCdtb3VzZW1vdmUnKTtcblxuICAvKipcbiAgICogQHNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jUG9seWxpbmUubW91c2VvdXRcbiAgICovXG4gIEBPdXRwdXQoKVxuICBwb2x5bGluZU1vdXNlb3V0OiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLlBvbHlNb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuUG9seU1vdXNlRXZlbnQ+KCdtb3VzZW91dCcpO1xuXG4gIC8qKlxuICAgKiBAc2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNQb2x5bGluZS5tb3VzZW92ZXJcbiAgICovXG4gIEBPdXRwdXQoKVxuICBwb2x5bGluZU1vdXNlb3ZlcjogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Qb2x5TW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLlBvbHlNb3VzZUV2ZW50PignbW91c2VvdmVyJyk7XG5cbiAgLyoqXG4gICAqIEBzZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI1BvbHlsaW5lLm1vdXNldXBcbiAgICovXG4gIEBPdXRwdXQoKVxuICBwb2x5bGluZU1vdXNldXA6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuUG9seU1vdXNlRXZlbnQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Qb2x5TW91c2VFdmVudD4oJ21vdXNldXAnKTtcblxuICAvKipcbiAgICogQHNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jUG9seWxpbmUucmlnaHRjbGlja1xuICAgKi9cbiAgQE91dHB1dCgpXG4gIHBvbHlsaW5lUmlnaHRjbGljazogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Qb2x5TW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLlBvbHlNb3VzZUV2ZW50PigncmlnaHRjbGljaycpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVhZG9ubHkgX21hcDogR29vZ2xlTWFwLFxuICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICh0aGlzLl9tYXAuX2lzQnJvd3Nlcikge1xuICAgICAgY29uc3QgY29tYmluZWRPcHRpb25zQ2hhbmdlcyA9IHRoaXMuX2NvbWJpbmVPcHRpb25zKCk7XG5cbiAgICAgIGNvbWJpbmVkT3B0aW9uc0NoYW5nZXMucGlwZSh0YWtlKDEpKS5zdWJzY3JpYmUob3B0aW9ucyA9PiB7XG4gICAgICAgIC8vIENyZWF0ZSB0aGUgb2JqZWN0IG91dHNpZGUgdGhlIHpvbmUgc28gaXRzIGV2ZW50cyBkb24ndCB0cmlnZ2VyIGNoYW5nZSBkZXRlY3Rpb24uXG4gICAgICAgIC8vIFdlJ2xsIGJyaW5nIGl0IGJhY2sgaW4gaW5zaWRlIHRoZSBgTWFwRXZlbnRNYW5hZ2VyYCBvbmx5IGZvciB0aGUgZXZlbnRzIHRoYXQgdGhlXG4gICAgICAgIC8vIHVzZXIgaGFzIHN1YnNjcmliZWQgdG8uXG4gICAgICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB0aGlzLl9wb2x5bGluZSA9IG5ldyBnb29nbGUubWFwcy5Qb2x5bGluZShvcHRpb25zKSk7XG4gICAgICAgIHRoaXMuX3BvbHlsaW5lIS5zZXRNYXAodGhpcy5fbWFwLl9nb29nbGVNYXApO1xuICAgICAgICB0aGlzLl9ldmVudE1hbmFnZXIuc2V0VGFyZ2V0KHRoaXMuX3BvbHlsaW5lKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLl93YXRjaEZvck9wdGlvbnNDaGFuZ2VzKCk7XG4gICAgICB0aGlzLl93YXRjaEZvclBhdGhDaGFuZ2VzKCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmRlc3Ryb3koKTtcbiAgICB0aGlzLl9kZXN0cm95ZWQubmV4dCgpO1xuICAgIHRoaXMuX2Rlc3Ryb3llZC5jb21wbGV0ZSgpO1xuICAgIGlmICh0aGlzLl9wb2x5bGluZSkge1xuICAgICAgdGhpcy5fcG9seWxpbmUuc2V0TWFwKG51bGwpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAc2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNQb2x5bGluZS5nZXREcmFnZ2FibGVcbiAgICovXG4gIGdldERyYWdnYWJsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fcG9seWxpbmUgPyB0aGlzLl9wb2x5bGluZS5nZXREcmFnZ2FibGUoKSA6IGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEBzZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI1BvbHlsaW5lLmdldEVkaXRhYmxlXG4gICAqL1xuICBnZXRFZGl0YWJsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fcG9seWxpbmUgPyB0aGlzLl9wb2x5bGluZS5nZXRFZGl0YWJsZSgpIDogZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogQHNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jUG9seWxpbmUuZ2V0UGF0aFxuICAgKi9cbiAgZ2V0UGF0aCgpOiBnb29nbGUubWFwcy5NVkNBcnJheTxnb29nbGUubWFwcy5MYXRMbmc+IHtcbiAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDExLjAuMCBNYWtlIHRoZSByZXR1cm4gdmFsdWUgbnVsbGFibGUuXG4gICAgcmV0dXJuIHRoaXMuX3BvbHlsaW5lID8gdGhpcy5fcG9seWxpbmUuZ2V0UGF0aCgpIDogbnVsbCE7XG4gIH1cblxuICAvKipcbiAgICogQHNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jUG9seWxpbmUuZ2V0VmlzaWJsZVxuICAgKi9cbiAgZ2V0VmlzaWJsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fcG9seWxpbmUgPyB0aGlzLl9wb2x5bGluZS5nZXRWaXNpYmxlKCkgOiBmYWxzZTtcbiAgfVxuXG4gIHByaXZhdGUgX2NvbWJpbmVPcHRpb25zKCk6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuUG9seWxpbmVPcHRpb25zPiB7XG4gICAgcmV0dXJuIGNvbWJpbmVMYXRlc3QoW3RoaXMuX29wdGlvbnMsIHRoaXMuX3BhdGhdKS5waXBlKG1hcCgoW29wdGlvbnMsIHBhdGhdKSA9PiB7XG4gICAgICBjb25zdCBjb21iaW5lZE9wdGlvbnM6IGdvb2dsZS5tYXBzLlBvbHlsaW5lT3B0aW9ucyA9IHtcbiAgICAgICAgLi4ub3B0aW9ucyxcbiAgICAgICAgcGF0aDogcGF0aCB8fCBvcHRpb25zLnBhdGgsXG4gICAgICB9O1xuICAgICAgcmV0dXJuIGNvbWJpbmVkT3B0aW9ucztcbiAgICB9KSk7XG4gIH1cblxuICBwcml2YXRlIF93YXRjaEZvck9wdGlvbnNDaGFuZ2VzKCkge1xuICAgIHRoaXMuX29wdGlvbnMucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKG9wdGlvbnMgPT4ge1xuICAgICAgaWYgKHRoaXMuX3BvbHlsaW5lKSB7XG4gICAgICAgIHRoaXMuX3BvbHlsaW5lLnNldE9wdGlvbnMob3B0aW9ucyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF93YXRjaEZvclBhdGhDaGFuZ2VzKCkge1xuICAgIHRoaXMuX3BhdGgucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKHBhdGggPT4ge1xuICAgICAgaWYgKHBhdGggJiYgdGhpcy5fcG9seWxpbmUpIHtcbiAgICAgICAgdGhpcy5fcG9seWxpbmUuc2V0UGF0aChwYXRoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIl19