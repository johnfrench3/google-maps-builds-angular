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
import { Directive, Input, NgZone, Output } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { GoogleMap } from '../google-map/google-map';
import { MapEventManager } from '../map-event-manager';
/**
 * Angular component that renders a Google Maps Circle via the Google Maps JavaScript API.
 * @see developers.google.com/maps/documentation/javascript/reference/polygon#Circle
 */
var MapCircle = /** @class */ (function () {
    function MapCircle(_map, _ngZone) {
        this._map = _map;
        this._ngZone = _ngZone;
        this._eventManager = new MapEventManager(this._ngZone);
        this._options = new BehaviorSubject({});
        this._center = new BehaviorSubject(undefined);
        this._radius = new BehaviorSubject(undefined);
        this._destroyed = new Subject();
        /**
         * @see
         * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.center_changed
         */
        this.centerChanged = this._eventManager.getLazyEmitter('center_changed');
        /**
         * @see
         * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.click
         */
        this.circleClick = this._eventManager.getLazyEmitter('click');
        /**
         * @see
         * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.dblclick
         */
        this.circleDblclick = this._eventManager.getLazyEmitter('dblclick');
        /**
         * @see
         * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.drag
         */
        this.circleDrag = this._eventManager.getLazyEmitter('drag');
        /**
         * @see
         * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.dragend
         */
        this.circleDragend = this._eventManager.getLazyEmitter('dragend');
        /**
         * @see
         * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.dragstart
         */
        this.circleDragstart = this._eventManager.getLazyEmitter('dragstart');
        /**
         * @see
         * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.mousedown
         */
        this.circleMousedown = this._eventManager.getLazyEmitter('mousedown');
        /**
         * @see
         * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.mousemove
         */
        this.circleMousemove = this._eventManager.getLazyEmitter('mousemove');
        /**
         * @see
         * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.mouseout
         */
        this.circleMouseout = this._eventManager.getLazyEmitter('mouseout');
        /**
         * @see
         * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.mouseover
         */
        this.circleMouseover = this._eventManager.getLazyEmitter('mouseover');
        /**
         * @see
         * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.mouseup
         */
        this.circleMouseup = this._eventManager.getLazyEmitter('mouseup');
        /**
         * @see
         * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.radius_changed
         */
        this.radiusChanged = this._eventManager.getLazyEmitter('radius_changed');
        /**
         * @see
         * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.rightclick
         */
        this.circleRightclick = this._eventManager.getLazyEmitter('rightclick');
    }
    Object.defineProperty(MapCircle.prototype, "options", {
        set: function (options) {
            this._options.next(options || {});
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapCircle.prototype, "center", {
        set: function (center) {
            this._center.next(center);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapCircle.prototype, "radius", {
        set: function (radius) {
            this._radius.next(radius);
        },
        enumerable: true,
        configurable: true
    });
    MapCircle.prototype.ngOnInit = function () {
        var _this = this;
        var combinedOptionsChanges = this._combineOptions();
        combinedOptionsChanges.pipe(take(1)).subscribe(function (options) {
            // Create the object outside the zone so its events don't trigger change detection.
            // We'll bring it back in inside the `MapEventManager` only for the events that the
            // user has subscribed to.
            _this._ngZone.runOutsideAngular(function () {
                _this.circle = new google.maps.Circle(options);
            });
            _this.circle.setMap(_this._map._googleMap);
            _this._eventManager.setTarget(_this.circle);
        });
        this._watchForOptionsChanges();
        this._watchForCenterChanges();
        this._watchForRadiusChanges();
    };
    MapCircle.prototype.ngOnDestroy = function () {
        this._eventManager.destroy();
        this._destroyed.next();
        this._destroyed.complete();
        this.circle.setMap(null);
    };
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.getBounds
     */
    MapCircle.prototype.getBounds = function () {
        return this.circle.getBounds();
    };
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.getCenter
     */
    MapCircle.prototype.getCenter = function () {
        return this.circle.getCenter();
    };
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.getDraggable
     */
    MapCircle.prototype.getDraggable = function () {
        return this.circle.getDraggable();
    };
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.getEditable
     */
    MapCircle.prototype.getEditable = function () {
        return this.circle.getEditable();
    };
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.getCenter
     */
    MapCircle.prototype.getRadius = function () {
        return this.circle.getRadius();
    };
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.getVisible
     */
    MapCircle.prototype.getVisible = function () {
        return this.circle.getVisible();
    };
    MapCircle.prototype._combineOptions = function () {
        return combineLatest([this._options, this._center, this._radius])
            .pipe(map(function (_a) {
            var _b = __read(_a, 3), options = _b[0], center = _b[1], radius = _b[2];
            var combinedOptions = __assign(__assign({}, options), { center: center || options.center, radius: radius !== undefined ? radius : options.radius });
            return combinedOptions;
        }));
    };
    MapCircle.prototype._watchForOptionsChanges = function () {
        var _this = this;
        this._options.pipe(takeUntil(this._destroyed)).subscribe(function (options) {
            _this.circle.setOptions(options);
        });
    };
    MapCircle.prototype._watchForCenterChanges = function () {
        var _this = this;
        this._center.pipe(takeUntil(this._destroyed)).subscribe(function (center) {
            if (center) {
                _this.circle.setCenter(center);
            }
        });
    };
    MapCircle.prototype._watchForRadiusChanges = function () {
        var _this = this;
        this._radius.pipe(takeUntil(this._destroyed)).subscribe(function (radius) {
            if (radius !== undefined) {
                _this.circle.setRadius(radius);
            }
        });
    };
    MapCircle.decorators = [
        { type: Directive, args: [{
                    selector: 'map-circle',
                },] }
    ];
    /** @nocollapse */
    MapCircle.ctorParameters = function () { return [
        { type: GoogleMap },
        { type: NgZone }
    ]; };
    MapCircle.propDecorators = {
        options: [{ type: Input }],
        center: [{ type: Input }],
        radius: [{ type: Input }],
        centerChanged: [{ type: Output }],
        circleClick: [{ type: Output }],
        circleDblclick: [{ type: Output }],
        circleDrag: [{ type: Output }],
        circleDragend: [{ type: Output }],
        circleDragstart: [{ type: Output }],
        circleMousedown: [{ type: Output }],
        circleMousemove: [{ type: Output }],
        circleMouseout: [{ type: Output }],
        circleMouseover: [{ type: Output }],
        circleMouseup: [{ type: Output }],
        radiusChanged: [{ type: Output }],
        circleRightclick: [{ type: Output }]
    };
    return MapCircle;
}());
export { MapCircle };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWNpcmNsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9nb29nbGUtbWFwcy9tYXAtY2lyY2xlL21hcC1jaXJjbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILHlFQUF5RTtBQUN6RSxvQ0FBb0M7QUFFcEMsT0FBTyxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFxQixNQUFNLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDbEYsT0FBTyxFQUFDLGVBQWUsRUFBRSxhQUFhLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUN6RSxPQUFPLEVBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUVwRCxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDbkQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBRXJEOzs7R0FHRztBQUNIO0lBd0lFLG1CQUE2QixJQUFlLEVBQW1CLE9BQWU7UUFBakQsU0FBSSxHQUFKLElBQUksQ0FBVztRQUFtQixZQUFPLEdBQVAsT0FBTyxDQUFRO1FBcEl0RSxrQkFBYSxHQUFHLElBQUksZUFBZSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN6QyxhQUFRLEdBQUcsSUFBSSxlQUFlLENBQTRCLEVBQUUsQ0FBQyxDQUFDO1FBQzlELFlBQU8sR0FDcEIsSUFBSSxlQUFlLENBQXlELFNBQVMsQ0FBQyxDQUFDO1FBQzFFLFlBQU8sR0FBRyxJQUFJLGVBQWUsQ0FBbUIsU0FBUyxDQUFDLENBQUM7UUFFM0QsZUFBVSxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7UUF3QmxEOzs7V0FHRztRQUVILGtCQUFhLEdBQXFCLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFPLGdCQUFnQixDQUFDLENB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QUM7SUFDTCxDQUFDOztnQkFwUEYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxZQUFZO2lCQUN2Qjs7OztnQkFUTyxTQUFTO2dCQUpTLE1BQU07OzswQkE4QjdCLEtBQUs7eUJBS0wsS0FBSzt5QkFLTCxLQUFLO2dDQVNMLE1BQU07OEJBT04sTUFBTTtpQ0FRTixNQUFNOzZCQVFOLE1BQU07Z0NBUU4sTUFBTTtrQ0FRTixNQUFNO2tDQVFOLE1BQU07a0NBUU4sTUFBTTtpQ0FRTixNQUFNO2tDQVFOLE1BQU07Z0NBUU4sTUFBTTtnQ0FRTixNQUFNO21DQU9OLE1BQU07O0lBaUhULGdCQUFDO0NBQUEsQUFyUEQsSUFxUEM7U0FsUFksU0FBUyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vLyBXb3JrYXJvdW5kIGZvcjogaHR0cHM6Ly9naXRodWIuY29tL2JhemVsYnVpbGQvcnVsZXNfbm9kZWpzL2lzc3Vlcy8xMjY1XG4vLy8gPHJlZmVyZW5jZSB0eXBlcz1cImdvb2dsZW1hcHNcIiAvPlxuXG5pbXBvcnQge0RpcmVjdGl2ZSwgSW5wdXQsIE5nWm9uZSwgT25EZXN0cm95LCBPbkluaXQsIE91dHB1dH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0JlaGF2aW9yU3ViamVjdCwgY29tYmluZUxhdGVzdCwgT2JzZXJ2YWJsZSwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge21hcCwgdGFrZSwgdGFrZVVudGlsfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7R29vZ2xlTWFwfSBmcm9tICcuLi9nb29nbGUtbWFwL2dvb2dsZS1tYXAnO1xuaW1wb3J0IHtNYXBFdmVudE1hbmFnZXJ9IGZyb20gJy4uL21hcC1ldmVudC1tYW5hZ2VyJztcblxuLyoqXG4gKiBBbmd1bGFyIGNvbXBvbmVudCB0aGF0IHJlbmRlcnMgYSBHb29nbGUgTWFwcyBDaXJjbGUgdmlhIHRoZSBHb29nbGUgTWFwcyBKYXZhU2NyaXB0IEFQSS5cbiAqIEBzZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI0NpcmNsZVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXAtY2lyY2xlJyxcbn0pXG5leHBvcnQgY2xhc3MgTWFwQ2lyY2xlIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICBwcml2YXRlIF9ldmVudE1hbmFnZXIgPSBuZXcgTWFwRXZlbnRNYW5hZ2VyKHRoaXMuX25nWm9uZSk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX29wdGlvbnMgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PGdvb2dsZS5tYXBzLkNpcmNsZU9wdGlvbnM+KHt9KTtcbiAgcHJpdmF0ZSByZWFkb25seSBfY2VudGVyID1cbiAgICAgIG5ldyBCZWhhdmlvclN1YmplY3Q8Z29vZ2xlLm1hcHMuTGF0TG5nfGdvb2dsZS5tYXBzLkxhdExuZ0xpdGVyYWx8dW5kZWZpbmVkPih1bmRlZmluZWQpO1xuICBwcml2YXRlIHJlYWRvbmx5IF9yYWRpdXMgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PG51bWJlcnx1bmRlZmluZWQ+KHVuZGVmaW5lZCk7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBfZGVzdHJveWVkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKipcbiAgICogVW5kZXJseWluZyBnb29nbGUubWFwcy5DaXJjbGUgb2JqZWN0LlxuICAgKlxuICAgKiBAc2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNDaXJjbGVcbiAgICovXG4gIGNpcmNsZTogZ29vZ2xlLm1hcHMuQ2lyY2xlOyAgLy8gaW5pdGlhbGl6ZWQgaW4gbmdPbkluaXRcblxuICBASW5wdXQoKVxuICBzZXQgb3B0aW9ucyhvcHRpb25zOiBnb29nbGUubWFwcy5DaXJjbGVPcHRpb25zKSB7XG4gICAgdGhpcy5fb3B0aW9ucy5uZXh0KG9wdGlvbnMgfHwge30pO1xuICB9XG5cbiAgQElucHV0KClcbiAgc2V0IGNlbnRlcihjZW50ZXI6IGdvb2dsZS5tYXBzLkxhdExuZ3xnb29nbGUubWFwcy5MYXRMbmdMaXRlcmFsKSB7XG4gICAgdGhpcy5fY2VudGVyLm5leHQoY2VudGVyKTtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIHNldCByYWRpdXMocmFkaXVzOiBudW1iZXIpIHtcbiAgICB0aGlzLl9yYWRpdXMubmV4dChyYWRpdXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBzZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI0NpcmNsZS5jZW50ZXJfY2hhbmdlZFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIGNlbnRlckNoYW5nZWQ6IE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2NlbnRlcl9jaGFuZ2VkJyk7XG5cbiAgLyoqXG4gICAqIEBzZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI0NpcmNsZS5jbGlja1xuICAgKi9cbiAgQE91dHB1dCgpXG4gIGNpcmNsZUNsaWNrOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PignY2xpY2snKTtcblxuICAvKipcbiAgICogQHNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jQ2lyY2xlLmRibGNsaWNrXG4gICAqL1xuICBAT3V0cHV0KClcbiAgY2lyY2xlRGJsY2xpY2s6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+KCdkYmxjbGljaycpO1xuXG4gIC8qKlxuICAgKiBAc2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNDaXJjbGUuZHJhZ1xuICAgKi9cbiAgQE91dHB1dCgpXG4gIGNpcmNsZURyYWc6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+KCdkcmFnJyk7XG5cbiAgLyoqXG4gICAqIEBzZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI0NpcmNsZS5kcmFnZW5kXG4gICAqL1xuICBAT3V0cHV0KClcbiAgY2lyY2xlRHJhZ2VuZDogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4oJ2RyYWdlbmQnKTtcblxuICAvKipcbiAgICogQHNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jQ2lyY2xlLmRyYWdzdGFydFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIGNpcmNsZURyYWdzdGFydDogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4oJ2RyYWdzdGFydCcpO1xuXG4gIC8qKlxuICAgKiBAc2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNDaXJjbGUubW91c2Vkb3duXG4gICAqL1xuICBAT3V0cHV0KClcbiAgY2lyY2xlTW91c2Vkb3duOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PignbW91c2Vkb3duJyk7XG5cbiAgLyoqXG4gICAqIEBzZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI0NpcmNsZS5tb3VzZW1vdmVcbiAgICovXG4gIEBPdXRwdXQoKVxuICBjaXJjbGVNb3VzZW1vdmU6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+KCdtb3VzZW1vdmUnKTtcblxuICAvKipcbiAgICogQHNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jQ2lyY2xlLm1vdXNlb3V0XG4gICAqL1xuICBAT3V0cHV0KClcbiAgY2lyY2xlTW91c2VvdXQ6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+KCdtb3VzZW91dCcpO1xuXG4gIC8qKlxuICAgKiBAc2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNDaXJjbGUubW91c2VvdmVyXG4gICAqL1xuICBAT3V0cHV0KClcbiAgY2lyY2xlTW91c2VvdmVyOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PignbW91c2VvdmVyJyk7XG5cbiAgLyoqXG4gICAqIEBzZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI0NpcmNsZS5tb3VzZXVwXG4gICAqL1xuICBAT3V0cHV0KClcbiAgY2lyY2xlTW91c2V1cDogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4oJ21vdXNldXAnKTtcblxuICAvKipcbiAgICogQHNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jQ2lyY2xlLnJhZGl1c19jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KClcbiAgcmFkaXVzQ2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9IHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPigncmFkaXVzX2NoYW5nZWQnKTtcblxuICAvKipcbiAgICogQHNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jQ2lyY2xlLnJpZ2h0Y2xpY2tcbiAgICovXG4gIEBPdXRwdXQoKVxuICBjaXJjbGVSaWdodGNsaWNrOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PigncmlnaHRjbGljaycpO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgX21hcDogR29vZ2xlTWFwLCBwcml2YXRlIHJlYWRvbmx5IF9uZ1pvbmU6IE5nWm9uZSkge31cblxuICBuZ09uSW5pdCgpIHtcbiAgICBjb25zdCBjb21iaW5lZE9wdGlvbnNDaGFuZ2VzID0gdGhpcy5fY29tYmluZU9wdGlvbnMoKTtcblxuICAgIGNvbWJpbmVkT3B0aW9uc0NoYW5nZXMucGlwZSh0YWtlKDEpKS5zdWJzY3JpYmUob3B0aW9ucyA9PiB7XG4gICAgICAvLyBDcmVhdGUgdGhlIG9iamVjdCBvdXRzaWRlIHRoZSB6b25lIHNvIGl0cyBldmVudHMgZG9uJ3QgdHJpZ2dlciBjaGFuZ2UgZGV0ZWN0aW9uLlxuICAgICAgLy8gV2UnbGwgYnJpbmcgaXQgYmFjayBpbiBpbnNpZGUgdGhlIGBNYXBFdmVudE1hbmFnZXJgIG9ubHkgZm9yIHRoZSBldmVudHMgdGhhdCB0aGVcbiAgICAgIC8vIHVzZXIgaGFzIHN1YnNjcmliZWQgdG8uXG4gICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICB0aGlzLmNpcmNsZSA9IG5ldyBnb29nbGUubWFwcy5DaXJjbGUob3B0aW9ucyk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuY2lyY2xlLnNldE1hcCh0aGlzLl9tYXAuX2dvb2dsZU1hcCk7XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuc2V0VGFyZ2V0KHRoaXMuY2lyY2xlKTtcbiAgICB9KTtcblxuICAgIHRoaXMuX3dhdGNoRm9yT3B0aW9uc0NoYW5nZXMoKTtcbiAgICB0aGlzLl93YXRjaEZvckNlbnRlckNoYW5nZXMoKTtcbiAgICB0aGlzLl93YXRjaEZvclJhZGl1c0NoYW5nZXMoKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5kZXN0cm95KCk7XG4gICAgdGhpcy5fZGVzdHJveWVkLm5leHQoKTtcbiAgICB0aGlzLl9kZXN0cm95ZWQuY29tcGxldGUoKTtcbiAgICB0aGlzLmNpcmNsZS5zZXRNYXAobnVsbCk7XG4gIH1cblxuICAvKipcbiAgICogQHNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jQ2lyY2xlLmdldEJvdW5kc1xuICAgKi9cbiAgZ2V0Qm91bmRzKCk6IGdvb2dsZS5tYXBzLkxhdExuZ0JvdW5kcyB7XG4gICAgcmV0dXJuIHRoaXMuY2lyY2xlLmdldEJvdW5kcygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBzZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI0NpcmNsZS5nZXRDZW50ZXJcbiAgICovXG4gIGdldENlbnRlcigpOiBnb29nbGUubWFwcy5MYXRMbmcge1xuICAgIHJldHVybiB0aGlzLmNpcmNsZS5nZXRDZW50ZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAc2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNDaXJjbGUuZ2V0RHJhZ2dhYmxlXG4gICAqL1xuICBnZXREcmFnZ2FibGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuY2lyY2xlLmdldERyYWdnYWJsZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBzZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI0NpcmNsZS5nZXRFZGl0YWJsZVxuICAgKi9cbiAgZ2V0RWRpdGFibGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuY2lyY2xlLmdldEVkaXRhYmxlKCk7XG4gIH1cblxuICAvKipcbiAgICogQHNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jQ2lyY2xlLmdldENlbnRlclxuICAgKi9cbiAgZ2V0UmFkaXVzKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuY2lyY2xlLmdldFJhZGl1cygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBzZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI0NpcmNsZS5nZXRWaXNpYmxlXG4gICAqL1xuICBnZXRWaXNpYmxlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmNpcmNsZS5nZXRWaXNpYmxlKCk7XG4gIH1cblxuICBwcml2YXRlIF9jb21iaW5lT3B0aW9ucygpOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLkNpcmNsZU9wdGlvbnM+IHtcbiAgICByZXR1cm4gY29tYmluZUxhdGVzdChbdGhpcy5fb3B0aW9ucywgdGhpcy5fY2VudGVyLCB0aGlzLl9yYWRpdXNdKVxuICAgICAgICAucGlwZShtYXAoKFtvcHRpb25zLCBjZW50ZXIsIHJhZGl1c10pID0+IHtcbiAgICAgICAgICBjb25zdCBjb21iaW5lZE9wdGlvbnM6IGdvb2dsZS5tYXBzLkNpcmNsZU9wdGlvbnMgPSB7XG4gICAgICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgICAgICAgY2VudGVyOiBjZW50ZXIgfHwgb3B0aW9ucy5jZW50ZXIsXG4gICAgICAgICAgICByYWRpdXM6IHJhZGl1cyAhPT0gdW5kZWZpbmVkID8gcmFkaXVzIDogb3B0aW9ucy5yYWRpdXMsXG4gICAgICAgICAgfTtcbiAgICAgICAgICByZXR1cm4gY29tYmluZWRPcHRpb25zO1xuICAgICAgICB9KSk7XG4gIH1cblxuICBwcml2YXRlIF93YXRjaEZvck9wdGlvbnNDaGFuZ2VzKCkge1xuICAgIHRoaXMuX29wdGlvbnMucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKG9wdGlvbnMgPT4ge1xuICAgICAgdGhpcy5jaXJjbGUuc2V0T3B0aW9ucyhvcHRpb25zKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3dhdGNoRm9yQ2VudGVyQ2hhbmdlcygpIHtcbiAgICB0aGlzLl9jZW50ZXIucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKGNlbnRlciA9PiB7XG4gICAgICBpZiAoY2VudGVyKSB7XG4gICAgICAgIHRoaXMuY2lyY2xlLnNldENlbnRlcihjZW50ZXIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfd2F0Y2hGb3JSYWRpdXNDaGFuZ2VzKCkge1xuICAgIHRoaXMuX3JhZGl1cy5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKS5zdWJzY3JpYmUocmFkaXVzID0+IHtcbiAgICAgIGlmIChyYWRpdXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLmNpcmNsZS5zZXRSYWRpdXMocmFkaXVzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIl19