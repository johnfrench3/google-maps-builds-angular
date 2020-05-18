/**
 * @fileoverview added by tsickle
 * Generated from: src/google-maps/map-circle/map-circle.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/// <reference types="googlemaps" />
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
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
let MapCircle = /** @class */ (() => {
    /**
     * Angular component that renders a Google Maps Circle via the Google Maps JavaScript API.
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Circle
     */
    class MapCircle {
        /**
         * @param {?} _map
         * @param {?} _ngZone
         */
        constructor(_map, _ngZone) {
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
        // initialized in ngOnInit
        /**
         * @param {?} options
         * @return {?}
         */
        set options(options) {
            this._options.next(options || {});
        }
        /**
         * @param {?} center
         * @return {?}
         */
        set center(center) {
            this._center.next(center);
        }
        /**
         * @param {?} radius
         * @return {?}
         */
        set radius(radius) {
            this._radius.next(radius);
        }
        /**
         * @return {?}
         */
        ngOnInit() {
            if (this._map._isBrowser) {
                this._combineOptions().pipe(take(1)).subscribe((/**
                 * @param {?} options
                 * @return {?}
                 */
                options => {
                    // Create the object outside the zone so its events don't trigger change detection.
                    // We'll bring it back in inside the `MapEventManager` only for the events that the
                    // user has subscribed to.
                    this._ngZone.runOutsideAngular((/**
                     * @return {?}
                     */
                    () => {
                        this.circle = new google.maps.Circle(options);
                    }));
                    this._assertInitialized();
                    this.circle.setMap((/** @type {?} */ (this._map.googleMap)));
                    this._eventManager.setTarget(this.circle);
                }));
                this._watchForOptionsChanges();
                this._watchForCenterChanges();
                this._watchForRadiusChanges();
            }
        }
        /**
         * @return {?}
         */
        ngOnDestroy() {
            this._eventManager.destroy();
            this._destroyed.next();
            this._destroyed.complete();
            if (this.circle) {
                this.circle.setMap(null);
            }
        }
        /**
         * @see
         * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.getBounds
         * @return {?}
         */
        getBounds() {
            this._assertInitialized();
            return this.circle.getBounds();
        }
        /**
         * @see
         * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.getCenter
         * @return {?}
         */
        getCenter() {
            this._assertInitialized();
            return this.circle.getCenter();
        }
        /**
         * @see
         * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.getDraggable
         * @return {?}
         */
        getDraggable() {
            this._assertInitialized();
            return this.circle.getDraggable();
        }
        /**
         * @see
         * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.getEditable
         * @return {?}
         */
        getEditable() {
            this._assertInitialized();
            return this.circle.getEditable();
        }
        /**
         * @see
         * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.getCenter
         * @return {?}
         */
        getRadius() {
            this._assertInitialized();
            return this.circle.getRadius();
        }
        /**
         * @see
         * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.getVisible
         * @return {?}
         */
        getVisible() {
            this._assertInitialized();
            return this.circle.getVisible();
        }
        /**
         * @private
         * @return {?}
         */
        _combineOptions() {
            return combineLatest([this._options, this._center, this._radius])
                .pipe(map((/**
             * @param {?} __0
             * @return {?}
             */
            ([options, center, radius]) => {
                /** @type {?} */
                const combinedOptions = Object.assign(Object.assign({}, options), { center: center || options.center, radius: radius !== undefined ? radius : options.radius });
                return combinedOptions;
            })));
        }
        /**
         * @private
         * @return {?}
         */
        _watchForOptionsChanges() {
            this._options.pipe(takeUntil(this._destroyed)).subscribe((/**
             * @param {?} options
             * @return {?}
             */
            options => {
                this._assertInitialized();
                this.circle.setOptions(options);
            }));
        }
        /**
         * @private
         * @return {?}
         */
        _watchForCenterChanges() {
            this._center.pipe(takeUntil(this._destroyed)).subscribe((/**
             * @param {?} center
             * @return {?}
             */
            center => {
                if (center) {
                    this._assertInitialized();
                    this.circle.setCenter(center);
                }
            }));
        }
        /**
         * @private
         * @return {?}
         */
        _watchForRadiusChanges() {
            this._radius.pipe(takeUntil(this._destroyed)).subscribe((/**
             * @param {?} radius
             * @return {?}
             */
            radius => {
                if (radius !== undefined) {
                    this._assertInitialized();
                    this.circle.setRadius(radius);
                }
            }));
        }
        /**
         * @private
         * @return {?}
         */
        _assertInitialized() {
            if (!this._map.googleMap) {
                throw Error('Cannot access Google Map information before the API has been initialized. ' +
                    'Please wait for the API to load before trying to interact with it.');
            }
            if (!this.circle) {
                throw Error('Cannot interact with a Google Map Circle before it has been ' +
                    'initialized. Please wait for the Circle to load before trying to interact with it.');
            }
        }
    }
    MapCircle.decorators = [
        { type: Directive, args: [{
                    selector: 'map-circle',
                },] }
    ];
    /** @nocollapse */
    MapCircle.ctorParameters = () => [
        { type: GoogleMap },
        { type: NgZone }
    ];
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
})();
export { MapCircle };
if (false) {
    /**
     * @type {?}
     * @private
     */
    MapCircle.prototype._eventManager;
    /**
     * @type {?}
     * @private
     */
    MapCircle.prototype._options;
    /**
     * @type {?}
     * @private
     */
    MapCircle.prototype._center;
    /**
     * @type {?}
     * @private
     */
    MapCircle.prototype._radius;
    /**
     * @type {?}
     * @private
     */
    MapCircle.prototype._destroyed;
    /**
     * Underlying google.maps.Circle object.
     *
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Circle
     * @type {?}
     */
    MapCircle.prototype.circle;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.center_changed
     * @type {?}
     */
    MapCircle.prototype.centerChanged;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.click
     * @type {?}
     */
    MapCircle.prototype.circleClick;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.dblclick
     * @type {?}
     */
    MapCircle.prototype.circleDblclick;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.drag
     * @type {?}
     */
    MapCircle.prototype.circleDrag;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.dragend
     * @type {?}
     */
    MapCircle.prototype.circleDragend;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.dragstart
     * @type {?}
     */
    MapCircle.prototype.circleDragstart;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.mousedown
     * @type {?}
     */
    MapCircle.prototype.circleMousedown;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.mousemove
     * @type {?}
     */
    MapCircle.prototype.circleMousemove;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.mouseout
     * @type {?}
     */
    MapCircle.prototype.circleMouseout;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.mouseover
     * @type {?}
     */
    MapCircle.prototype.circleMouseover;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.mouseup
     * @type {?}
     */
    MapCircle.prototype.circleMouseup;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.radius_changed
     * @type {?}
     */
    MapCircle.prototype.radiusChanged;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.rightclick
     * @type {?}
     */
    MapCircle.prototype.circleRightclick;
    /**
     * @type {?}
     * @private
     */
    MapCircle.prototype._map;
    /**
     * @type {?}
     * @private
     */
    MapCircle.prototype._ngZone;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWNpcmNsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9nb29nbGUtbWFwcy9tYXAtY2lyY2xlL21hcC1jaXJjbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFTQSxvQ0FBb0M7Ozs7Ozs7Ozs7QUFFcEMsT0FBTyxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFxQixNQUFNLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDbEYsT0FBTyxFQUFDLGVBQWUsRUFBRSxhQUFhLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUN6RSxPQUFPLEVBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUVwRCxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDbkQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHNCQUFzQixDQUFDOzs7OztBQU1yRDs7Ozs7SUFBQSxNQUdhLFNBQVM7Ozs7O1FBcUlwQixZQUE2QixJQUFlLEVBQW1CLE9BQWU7WUFBakQsU0FBSSxHQUFKLElBQUksQ0FBVztZQUFtQixZQUFPLEdBQVAsT0FBTyxDQUFRO1lBcEl0RSxrQkFBYSxHQUFHLElBQUksZUFBZSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN6QyxhQUFRLEdBQUcsSUFBSSxlQUFlLENBQTRCLEVBQUUsQ0FBQyxDQUFDO1lBQzlELFlBQU8sR0FDcEIsSUFBSSxlQUFlLENBQXlELFNBQVMsQ0FBQyxDQUFDO1lBQzFFLFlBQU8sR0FBRyxJQUFJLGVBQWUsQ0FBbUIsU0FBUyxDQUFDLENBQUM7WUFFM0QsZUFBVSxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7Ozs7O1lBNkJsRCxrQkFBYSxHQUFxQixJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBTyxnQkFBZ0IsQ0FBQyxDQUFDOzs7OztZQU81RixnQkFBVyxHQUNQLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUF5QixPQUFPLENBQUMsQ0FBQzs7Ozs7WUFPdkUsbUJBQWMsR0FDVixJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBeUIsVUFBVSxDQUFDLENBQUM7Ozs7O1lBTzFFLGVBQVUsR0FDTixJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBeUIsTUFBTSxDQUFDLENBQUM7Ozs7O1lBT3RFLGtCQUFhLEdBQ1QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQXlCLFNBQVMsQ0FBQyxDQUFDOzs7OztZQU96RSxvQkFBZSxHQUNYLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUF5QixXQUFXLENBQUMsQ0FBQzs7Ozs7WUFPM0Usb0JBQWUsR0FDWCxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBeUIsV0FBVyxDQUFDLENBQUM7Ozs7O1lBTzNFLG9CQUFlLEdBQ1gsSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQXlCLFdBQVcsQ0FBQyxDQUFDOzs7OztZQU8zRSxtQkFBYyxHQUNWLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUF5QixVQUFVLENBQUMsQ0FBQzs7Ozs7WUFPMUUsb0JBQWUsR0FDWCxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBeUIsV0FBVyxDQUFDLENBQUM7Ozs7O1lBTzNFLGtCQUFhLEdBQ1QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQXlCLFNBQVMsQ0FBQyxDQUFDOzs7OztZQU96RSxrQkFBYSxHQUFxQixJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBTyxnQkFBZ0IsQ0FBQyxDQUFDOzs7OztZQU81RixxQkFBZ0IsR0FDWixJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBeUIsWUFBWSxDQUFDLENBQUM7UUFFSyxDQUFDOzs7Ozs7UUFySGxGLElBQ0ksT0FBTyxDQUFDLE9BQWtDO1lBQzVDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsQ0FBQztRQUNwQyxDQUFDOzs7OztRQUVELElBQ0ksTUFBTSxDQUFDLE1BQW9EO1lBQzdELElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzVCLENBQUM7Ozs7O1FBRUQsSUFDSSxNQUFNLENBQUMsTUFBYztZQUN2QixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM1QixDQUFDOzs7O1FBMEdELFFBQVE7WUFDTixJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFO2dCQUN4QixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVM7Ozs7Z0JBQUMsT0FBTyxDQUFDLEVBQUU7b0JBQ3ZELG1GQUFtRjtvQkFDbkYsbUZBQW1GO29CQUNuRiwwQkFBMEI7b0JBQzFCLElBQUksQ0FBQyxPQUFPLENBQUMsaUJBQWlCOzs7b0JBQUMsR0FBRyxFQUFFO3dCQUNsQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQ2hELENBQUMsRUFBQyxDQUFDO29CQUNILElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO29CQUMxQixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxtQkFBQSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBQyxDQUFDLENBQUM7b0JBQ3pDLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDNUMsQ0FBQyxFQUFDLENBQUM7Z0JBRUgsSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7Z0JBQy9CLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO2dCQUM5QixJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQzthQUMvQjtRQUNILENBQUM7Ozs7UUFFRCxXQUFXO1lBQ1QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUM3QixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDM0IsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO2dCQUNmLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQzFCO1FBQ0gsQ0FBQzs7Ozs7O1FBTUQsU0FBUztZQUNQLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQzFCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNqQyxDQUFDOzs7Ozs7UUFNRCxTQUFTO1lBQ1AsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFDMUIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2pDLENBQUM7Ozs7OztRQU1ELFlBQVk7WUFDVixJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUMxQixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDcEMsQ0FBQzs7Ozs7O1FBTUQsV0FBVztZQUNULElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQzFCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNuQyxDQUFDOzs7Ozs7UUFNRCxTQUFTO1lBQ1AsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFDMUIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2pDLENBQUM7Ozs7OztRQU1ELFVBQVU7WUFDUixJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUMxQixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDbEMsQ0FBQzs7Ozs7UUFFTyxlQUFlO1lBQ3JCLE9BQU8sYUFBYSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztpQkFDNUQsSUFBSSxDQUFDLEdBQUc7Ozs7WUFBQyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsRUFBRSxFQUFFOztzQkFDaEMsZUFBZSxtQ0FDaEIsT0FBTyxLQUNWLE1BQU0sRUFBRSxNQUFNLElBQUksT0FBTyxDQUFDLE1BQU0sRUFDaEMsTUFBTSxFQUFFLE1BQU0sS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FDdkQ7Z0JBQ0QsT0FBTyxlQUFlLENBQUM7WUFDekIsQ0FBQyxFQUFDLENBQUMsQ0FBQztRQUNWLENBQUM7Ozs7O1FBRU8sdUJBQXVCO1lBQzdCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxTQUFTOzs7O1lBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ2pFLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO2dCQUMxQixJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNsQyxDQUFDLEVBQUMsQ0FBQztRQUNMLENBQUM7Ozs7O1FBRU8sc0JBQXNCO1lBQzVCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxTQUFTOzs7O1lBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQy9ELElBQUksTUFBTSxFQUFFO29CQUNWLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO29CQUMxQixJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztpQkFDL0I7WUFDSCxDQUFDLEVBQUMsQ0FBQztRQUNMLENBQUM7Ozs7O1FBRU8sc0JBQXNCO1lBQzVCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxTQUFTOzs7O1lBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQy9ELElBQUksTUFBTSxLQUFLLFNBQVMsRUFBRTtvQkFDeEIsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7b0JBQzFCLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2lCQUMvQjtZQUNILENBQUMsRUFBQyxDQUFDO1FBQ0wsQ0FBQzs7Ozs7UUFFTyxrQkFBa0I7WUFDeEIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO2dCQUN4QixNQUFNLEtBQUssQ0FDVCw0RUFBNEU7b0JBQzVFLG9FQUFvRSxDQUFDLENBQUM7YUFDekU7WUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFDaEIsTUFBTSxLQUFLLENBQ1QsOERBQThEO29CQUM5RCxvRkFBb0YsQ0FBQyxDQUFDO2FBQ3pGO1FBQ0gsQ0FBQzs7O2dCQTdRRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLFlBQVk7aUJBQ3ZCOzs7O2dCQVRPLFNBQVM7Z0JBSlMsTUFBTTs7OzBCQThCN0IsS0FBSzt5QkFLTCxLQUFLO3lCQUtMLEtBQUs7Z0NBU0wsTUFBTTs4QkFPTixNQUFNO2lDQVFOLE1BQU07NkJBUU4sTUFBTTtnQ0FRTixNQUFNO2tDQVFOLE1BQU07a0NBUU4sTUFBTTtrQ0FRTixNQUFNO2lDQVFOLE1BQU07a0NBUU4sTUFBTTtnQ0FRTixNQUFNO2dDQVFOLE1BQU07bUNBT04sTUFBTTs7SUEwSVQsZ0JBQUM7S0FBQTtTQTNRWSxTQUFTOzs7Ozs7SUFDcEIsa0NBQTBEOzs7OztJQUMxRCw2QkFBK0U7Ozs7O0lBQy9FLDRCQUMyRjs7Ozs7SUFDM0YsNEJBQTRFOzs7OztJQUU1RSwrQkFBa0Q7Ozs7Ozs7SUFPbEQsMkJBQTRCOzs7Ozs7SUFxQjVCLGtDQUM0Rjs7Ozs7O0lBTTVGLGdDQUV1RTs7Ozs7O0lBTXZFLG1DQUUwRTs7Ozs7O0lBTTFFLCtCQUVzRTs7Ozs7O0lBTXRFLGtDQUV5RTs7Ozs7O0lBTXpFLG9DQUUyRTs7Ozs7O0lBTTNFLG9DQUUyRTs7Ozs7O0lBTTNFLG9DQUUyRTs7Ozs7O0lBTTNFLG1DQUUwRTs7Ozs7O0lBTTFFLG9DQUUyRTs7Ozs7O0lBTTNFLGtDQUV5RTs7Ozs7O0lBTXpFLGtDQUM0Rjs7Ozs7O0lBTTVGLHFDQUU0RTs7Ozs7SUFFaEUseUJBQWdDOzs7OztJQUFFLDRCQUFnQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vLyBXb3JrYXJvdW5kIGZvcjogaHR0cHM6Ly9naXRodWIuY29tL2JhemVsYnVpbGQvcnVsZXNfbm9kZWpzL2lzc3Vlcy8xMjY1XG4vLy8gPHJlZmVyZW5jZSB0eXBlcz1cImdvb2dsZW1hcHNcIiAvPlxuXG5pbXBvcnQge0RpcmVjdGl2ZSwgSW5wdXQsIE5nWm9uZSwgT25EZXN0cm95LCBPbkluaXQsIE91dHB1dH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0JlaGF2aW9yU3ViamVjdCwgY29tYmluZUxhdGVzdCwgT2JzZXJ2YWJsZSwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge21hcCwgdGFrZSwgdGFrZVVudGlsfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7R29vZ2xlTWFwfSBmcm9tICcuLi9nb29nbGUtbWFwL2dvb2dsZS1tYXAnO1xuaW1wb3J0IHtNYXBFdmVudE1hbmFnZXJ9IGZyb20gJy4uL21hcC1ldmVudC1tYW5hZ2VyJztcblxuLyoqXG4gKiBBbmd1bGFyIGNvbXBvbmVudCB0aGF0IHJlbmRlcnMgYSBHb29nbGUgTWFwcyBDaXJjbGUgdmlhIHRoZSBHb29nbGUgTWFwcyBKYXZhU2NyaXB0IEFQSS5cbiAqIEBzZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI0NpcmNsZVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXAtY2lyY2xlJyxcbn0pXG5leHBvcnQgY2xhc3MgTWFwQ2lyY2xlIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICBwcml2YXRlIF9ldmVudE1hbmFnZXIgPSBuZXcgTWFwRXZlbnRNYW5hZ2VyKHRoaXMuX25nWm9uZSk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX29wdGlvbnMgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PGdvb2dsZS5tYXBzLkNpcmNsZU9wdGlvbnM+KHt9KTtcbiAgcHJpdmF0ZSByZWFkb25seSBfY2VudGVyID1cbiAgICAgIG5ldyBCZWhhdmlvclN1YmplY3Q8Z29vZ2xlLm1hcHMuTGF0TG5nfGdvb2dsZS5tYXBzLkxhdExuZ0xpdGVyYWx8dW5kZWZpbmVkPih1bmRlZmluZWQpO1xuICBwcml2YXRlIHJlYWRvbmx5IF9yYWRpdXMgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PG51bWJlcnx1bmRlZmluZWQ+KHVuZGVmaW5lZCk7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBfZGVzdHJveWVkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKipcbiAgICogVW5kZXJseWluZyBnb29nbGUubWFwcy5DaXJjbGUgb2JqZWN0LlxuICAgKlxuICAgKiBAc2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNDaXJjbGVcbiAgICovXG4gIGNpcmNsZT86IGdvb2dsZS5tYXBzLkNpcmNsZTsgIC8vIGluaXRpYWxpemVkIGluIG5nT25Jbml0XG5cbiAgQElucHV0KClcbiAgc2V0IG9wdGlvbnMob3B0aW9uczogZ29vZ2xlLm1hcHMuQ2lyY2xlT3B0aW9ucykge1xuICAgIHRoaXMuX29wdGlvbnMubmV4dChvcHRpb25zIHx8IHt9KTtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIHNldCBjZW50ZXIoY2VudGVyOiBnb29nbGUubWFwcy5MYXRMbmd8Z29vZ2xlLm1hcHMuTGF0TG5nTGl0ZXJhbCkge1xuICAgIHRoaXMuX2NlbnRlci5uZXh0KGNlbnRlcik7XG4gIH1cblxuICBASW5wdXQoKVxuICBzZXQgcmFkaXVzKHJhZGl1czogbnVtYmVyKSB7XG4gICAgdGhpcy5fcmFkaXVzLm5leHQocmFkaXVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAc2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNDaXJjbGUuY2VudGVyX2NoYW5nZWRcbiAgICovXG4gIEBPdXRwdXQoKVxuICBjZW50ZXJDaGFuZ2VkOiBPYnNlcnZhYmxlPHZvaWQ+ID0gdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCdjZW50ZXJfY2hhbmdlZCcpO1xuXG4gIC8qKlxuICAgKiBAc2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNDaXJjbGUuY2xpY2tcbiAgICovXG4gIEBPdXRwdXQoKVxuICBjaXJjbGVDbGljazogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4oJ2NsaWNrJyk7XG5cbiAgLyoqXG4gICAqIEBzZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI0NpcmNsZS5kYmxjbGlja1xuICAgKi9cbiAgQE91dHB1dCgpXG4gIGNpcmNsZURibGNsaWNrOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PignZGJsY2xpY2snKTtcblxuICAvKipcbiAgICogQHNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jQ2lyY2xlLmRyYWdcbiAgICovXG4gIEBPdXRwdXQoKVxuICBjaXJjbGVEcmFnOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PignZHJhZycpO1xuXG4gIC8qKlxuICAgKiBAc2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNDaXJjbGUuZHJhZ2VuZFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIGNpcmNsZURyYWdlbmQ6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+KCdkcmFnZW5kJyk7XG5cbiAgLyoqXG4gICAqIEBzZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI0NpcmNsZS5kcmFnc3RhcnRcbiAgICovXG4gIEBPdXRwdXQoKVxuICBjaXJjbGVEcmFnc3RhcnQ6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+KCdkcmFnc3RhcnQnKTtcblxuICAvKipcbiAgICogQHNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jQ2lyY2xlLm1vdXNlZG93blxuICAgKi9cbiAgQE91dHB1dCgpXG4gIGNpcmNsZU1vdXNlZG93bjogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4oJ21vdXNlZG93bicpO1xuXG4gIC8qKlxuICAgKiBAc2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNDaXJjbGUubW91c2Vtb3ZlXG4gICAqL1xuICBAT3V0cHV0KClcbiAgY2lyY2xlTW91c2Vtb3ZlOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PignbW91c2Vtb3ZlJyk7XG5cbiAgLyoqXG4gICAqIEBzZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI0NpcmNsZS5tb3VzZW91dFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIGNpcmNsZU1vdXNlb3V0OiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PignbW91c2VvdXQnKTtcblxuICAvKipcbiAgICogQHNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jQ2lyY2xlLm1vdXNlb3ZlclxuICAgKi9cbiAgQE91dHB1dCgpXG4gIGNpcmNsZU1vdXNlb3ZlcjogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4oJ21vdXNlb3ZlcicpO1xuXG4gIC8qKlxuICAgKiBAc2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNDaXJjbGUubW91c2V1cFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIGNpcmNsZU1vdXNldXA6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+KCdtb3VzZXVwJyk7XG5cbiAgLyoqXG4gICAqIEBzZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI0NpcmNsZS5yYWRpdXNfY2hhbmdlZFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIHJhZGl1c0NoYW5nZWQ6IE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ3JhZGl1c19jaGFuZ2VkJyk7XG5cbiAgLyoqXG4gICAqIEBzZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI0NpcmNsZS5yaWdodGNsaWNrXG4gICAqL1xuICBAT3V0cHV0KClcbiAgY2lyY2xlUmlnaHRjbGljazogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4oJ3JpZ2h0Y2xpY2snKTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IF9tYXA6IEdvb2dsZU1hcCwgcHJpdmF0ZSByZWFkb25seSBfbmdab25lOiBOZ1pvbmUpIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKHRoaXMuX21hcC5faXNCcm93c2VyKSB7XG4gICAgICB0aGlzLl9jb21iaW5lT3B0aW9ucygpLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKG9wdGlvbnMgPT4ge1xuICAgICAgICAvLyBDcmVhdGUgdGhlIG9iamVjdCBvdXRzaWRlIHRoZSB6b25lIHNvIGl0cyBldmVudHMgZG9uJ3QgdHJpZ2dlciBjaGFuZ2UgZGV0ZWN0aW9uLlxuICAgICAgICAvLyBXZSdsbCBicmluZyBpdCBiYWNrIGluIGluc2lkZSB0aGUgYE1hcEV2ZW50TWFuYWdlcmAgb25seSBmb3IgdGhlIGV2ZW50cyB0aGF0IHRoZVxuICAgICAgICAvLyB1c2VyIGhhcyBzdWJzY3JpYmVkIHRvLlxuICAgICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuY2lyY2xlID0gbmV3IGdvb2dsZS5tYXBzLkNpcmNsZShvcHRpb25zKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgICAgIHRoaXMuY2lyY2xlLnNldE1hcCh0aGlzLl9tYXAuZ29vZ2xlTWFwISk7XG4gICAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5zZXRUYXJnZXQodGhpcy5jaXJjbGUpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuX3dhdGNoRm9yT3B0aW9uc0NoYW5nZXMoKTtcbiAgICAgIHRoaXMuX3dhdGNoRm9yQ2VudGVyQ2hhbmdlcygpO1xuICAgICAgdGhpcy5fd2F0Y2hGb3JSYWRpdXNDaGFuZ2VzKCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmRlc3Ryb3koKTtcbiAgICB0aGlzLl9kZXN0cm95ZWQubmV4dCgpO1xuICAgIHRoaXMuX2Rlc3Ryb3llZC5jb21wbGV0ZSgpO1xuICAgIGlmICh0aGlzLmNpcmNsZSkge1xuICAgICAgdGhpcy5jaXJjbGUuc2V0TWFwKG51bGwpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAc2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNDaXJjbGUuZ2V0Qm91bmRzXG4gICAqL1xuICBnZXRCb3VuZHMoKTogZ29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmNpcmNsZS5nZXRCb3VuZHMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAc2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNDaXJjbGUuZ2V0Q2VudGVyXG4gICAqL1xuICBnZXRDZW50ZXIoKTogZ29vZ2xlLm1hcHMuTGF0TG5nIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmNpcmNsZS5nZXRDZW50ZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAc2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNDaXJjbGUuZ2V0RHJhZ2dhYmxlXG4gICAqL1xuICBnZXREcmFnZ2FibGUoKTogYm9vbGVhbiB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5jaXJjbGUuZ2V0RHJhZ2dhYmxlKCk7XG4gIH1cblxuICAvKipcbiAgICogQHNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jQ2lyY2xlLmdldEVkaXRhYmxlXG4gICAqL1xuICBnZXRFZGl0YWJsZSgpOiBib29sZWFuIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmNpcmNsZS5nZXRFZGl0YWJsZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBzZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI0NpcmNsZS5nZXRDZW50ZXJcbiAgICovXG4gIGdldFJhZGl1cygpOiBudW1iZXIge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMuY2lyY2xlLmdldFJhZGl1cygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBzZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI0NpcmNsZS5nZXRWaXNpYmxlXG4gICAqL1xuICBnZXRWaXNpYmxlKCk6IGJvb2xlYW4ge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMuY2lyY2xlLmdldFZpc2libGUoKTtcbiAgfVxuXG4gIHByaXZhdGUgX2NvbWJpbmVPcHRpb25zKCk6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuQ2lyY2xlT3B0aW9ucz4ge1xuICAgIHJldHVybiBjb21iaW5lTGF0ZXN0KFt0aGlzLl9vcHRpb25zLCB0aGlzLl9jZW50ZXIsIHRoaXMuX3JhZGl1c10pXG4gICAgICAgIC5waXBlKG1hcCgoW29wdGlvbnMsIGNlbnRlciwgcmFkaXVzXSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGNvbWJpbmVkT3B0aW9uczogZ29vZ2xlLm1hcHMuQ2lyY2xlT3B0aW9ucyA9IHtcbiAgICAgICAgICAgIC4uLm9wdGlvbnMsXG4gICAgICAgICAgICBjZW50ZXI6IGNlbnRlciB8fCBvcHRpb25zLmNlbnRlcixcbiAgICAgICAgICAgIHJhZGl1czogcmFkaXVzICE9PSB1bmRlZmluZWQgPyByYWRpdXMgOiBvcHRpb25zLnJhZGl1cyxcbiAgICAgICAgICB9O1xuICAgICAgICAgIHJldHVybiBjb21iaW5lZE9wdGlvbnM7XG4gICAgICAgIH0pKTtcbiAgfVxuXG4gIHByaXZhdGUgX3dhdGNoRm9yT3B0aW9uc0NoYW5nZXMoKSB7XG4gICAgdGhpcy5fb3B0aW9ucy5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKS5zdWJzY3JpYmUob3B0aW9ucyA9PiB7XG4gICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgdGhpcy5jaXJjbGUuc2V0T3B0aW9ucyhvcHRpb25zKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3dhdGNoRm9yQ2VudGVyQ2hhbmdlcygpIHtcbiAgICB0aGlzLl9jZW50ZXIucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKGNlbnRlciA9PiB7XG4gICAgICBpZiAoY2VudGVyKSB7XG4gICAgICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgICAgIHRoaXMuY2lyY2xlLnNldENlbnRlcihjZW50ZXIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfd2F0Y2hGb3JSYWRpdXNDaGFuZ2VzKCkge1xuICAgIHRoaXMuX3JhZGl1cy5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKS5zdWJzY3JpYmUocmFkaXVzID0+IHtcbiAgICAgIGlmIChyYWRpdXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgICB0aGlzLmNpcmNsZS5zZXRSYWRpdXMocmFkaXVzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2Fzc2VydEluaXRpYWxpemVkKCk6IGFzc2VydHMgdGhpcyBpcyB7Y2lyY2xlOiBnb29nbGUubWFwcy5DaXJjbGV9IHtcbiAgICBpZiAoIXRoaXMuX21hcC5nb29nbGVNYXApIHtcbiAgICAgIHRocm93IEVycm9yKFxuICAgICAgICAnQ2Fubm90IGFjY2VzcyBHb29nbGUgTWFwIGluZm9ybWF0aW9uIGJlZm9yZSB0aGUgQVBJIGhhcyBiZWVuIGluaXRpYWxpemVkLiAnICtcbiAgICAgICAgJ1BsZWFzZSB3YWl0IGZvciB0aGUgQVBJIHRvIGxvYWQgYmVmb3JlIHRyeWluZyB0byBpbnRlcmFjdCB3aXRoIGl0LicpO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuY2lyY2xlKSB7XG4gICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgJ0Nhbm5vdCBpbnRlcmFjdCB3aXRoIGEgR29vZ2xlIE1hcCBDaXJjbGUgYmVmb3JlIGl0IGhhcyBiZWVuICcgK1xuICAgICAgICAnaW5pdGlhbGl6ZWQuIFBsZWFzZSB3YWl0IGZvciB0aGUgQ2lyY2xlIHRvIGxvYWQgYmVmb3JlIHRyeWluZyB0byBpbnRlcmFjdCB3aXRoIGl0LicpO1xuICAgIH1cbiAgfVxufVxuIl19