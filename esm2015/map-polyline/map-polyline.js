/**
 * @fileoverview added by tsickle
 * Generated from: src/google-maps/map-polyline/map-polyline.ts
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
import { Directive, Input, Output, NgZone, } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { GoogleMap } from '../google-map/google-map';
import { MapEventManager } from '../map-event-manager';
/**
 * Angular component that renders a Google Maps Polyline via the Google Maps JavaScript API.
 * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polyline
 */
export class MapPolyline {
    /**
     * @param {?} _map
     * @param {?} _ngZone
     */
    constructor(_map, _ngZone) {
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
    // initialized in ngOnInit
    /**
     * @param {?} options
     * @return {?}
     */
    set options(options) {
        this._options.next(options || {});
    }
    /**
     * @param {?} path
     * @return {?}
     */
    set path(path) {
        this._path.next(path);
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
                () => this._polyline = new google.maps.Polyline(options)));
                (/** @type {?} */ (this._polyline)).setMap(this._map._googleMap);
                this._eventManager.setTarget(this._polyline);
            }));
            this._watchForOptionsChanges();
            this._watchForPathChanges();
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._eventManager.destroy();
        this._destroyed.next();
        this._destroyed.complete();
        if (this._polyline) {
            this._polyline.setMap(null);
        }
    }
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.getDraggable
     * @return {?}
     */
    getDraggable() {
        return this._polyline ? this._polyline.getDraggable() : false;
    }
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.getEditable
     * @return {?}
     */
    getEditable() {
        return this._polyline ? this._polyline.getEditable() : false;
    }
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.getPath
     * @return {?}
     */
    getPath() {
        // @breaking-change 11.0.0 Make the return value nullable.
        return this._polyline ? this._polyline.getPath() : (/** @type {?} */ (null));
    }
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.getVisible
     * @return {?}
     */
    getVisible() {
        return this._polyline ? this._polyline.getVisible() : false;
    }
    /**
     * @private
     * @return {?}
     */
    _combineOptions() {
        return combineLatest([this._options, this._path]).pipe(map((/**
         * @param {?} __0
         * @return {?}
         */
        ([options, path]) => {
            /** @type {?} */
            const combinedOptions = Object.assign(Object.assign({}, options), { path: path || options.path });
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
            if (this._polyline) {
                this._polyline.setOptions(options);
            }
        }));
    }
    /**
     * @private
     * @return {?}
     */
    _watchForPathChanges() {
        this._path.pipe(takeUntil(this._destroyed)).subscribe((/**
         * @param {?} path
         * @return {?}
         */
        path => {
            if (path && this._polyline) {
                this._polyline.setPath(path);
            }
        }));
    }
}
MapPolyline.decorators = [
    { type: Directive, args: [{
                selector: 'map-polyline',
            },] }
];
/** @nocollapse */
MapPolyline.ctorParameters = () => [
    { type: GoogleMap },
    { type: NgZone }
];
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
if (false) {
    /**
     * @type {?}
     * @private
     */
    MapPolyline.prototype._eventManager;
    /**
     * @type {?}
     * @private
     */
    MapPolyline.prototype._options;
    /**
     * @type {?}
     * @private
     */
    MapPolyline.prototype._path;
    /**
     * @type {?}
     * @private
     */
    MapPolyline.prototype._destroyed;
    /** @type {?} */
    MapPolyline.prototype._polyline;
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.click
     * @type {?}
     */
    MapPolyline.prototype.polylineClick;
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.dblclick
     * @type {?}
     */
    MapPolyline.prototype.polylineDblclick;
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.drag
     * @type {?}
     */
    MapPolyline.prototype.polylineDrag;
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.dragend
     * @type {?}
     */
    MapPolyline.prototype.polylineDragend;
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.dragstart
     * @type {?}
     */
    MapPolyline.prototype.polylineDragstart;
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.mousedown
     * @type {?}
     */
    MapPolyline.prototype.polylineMousedown;
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.mousemove
     * @type {?}
     */
    MapPolyline.prototype.polylineMousemove;
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.mouseout
     * @type {?}
     */
    MapPolyline.prototype.polylineMouseout;
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.mouseover
     * @type {?}
     */
    MapPolyline.prototype.polylineMouseover;
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.mouseup
     * @type {?}
     */
    MapPolyline.prototype.polylineMouseup;
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.rightclick
     * @type {?}
     */
    MapPolyline.prototype.polylineRightclick;
    /**
     * @type {?}
     * @private
     */
    MapPolyline.prototype._map;
    /**
     * @type {?}
     * @private
     */
    MapPolyline.prototype._ngZone;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLXBvbHlsaW5lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2dvb2dsZS1tYXBzL21hcC1wb2x5bGluZS9tYXAtcG9seWxpbmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFTQSxvQ0FBb0M7Ozs7Ozs7Ozs7QUFFcEMsT0FBTyxFQUNMLFNBQVMsRUFDVCxLQUFLLEVBR0wsTUFBTSxFQUNOLE1BQU0sR0FDUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsZUFBZSxFQUFFLGFBQWEsRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQ3pFLE9BQU8sRUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRXBELE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUNuRCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7Ozs7O0FBU3JELE1BQU0sT0FBTyxXQUFXOzs7OztJQW1HdEIsWUFDbUIsSUFBZSxFQUN4QixPQUFlO1FBRE4sU0FBSSxHQUFKLElBQUksQ0FBVztRQUN4QixZQUFPLEdBQVAsT0FBTyxDQUFRO1FBcEdqQixrQkFBYSxHQUFHLElBQUksZUFBZSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN6QyxhQUFRLEdBQUcsSUFBSSxlQUFlLENBQThCLEVBQUUsQ0FBQyxDQUFDO1FBQ2hFLFVBQUssR0FDbEIsSUFBSSxlQUFlLENBQ3dDLFNBQVMsQ0FBQyxDQUFDO1FBRXpELGVBQVUsR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDOzs7O1FBbUJsRCxrQkFBYSxHQUNULElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUE2QixPQUFPLENBQUMsQ0FBQzs7OztRQU0zRSxxQkFBZ0IsR0FDWixJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBNkIsVUFBVSxDQUFDLENB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QUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFNBQVM7Ozs7UUFBQyxJQUFJLENBQUMsRUFBRTtZQUMzRCxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO2dCQUMxQixJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUM5QjtRQUNILENBQUMsRUFBQyxDQUFDO0lBQ0wsQ0FBQzs7O1lBekxGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsY0FBYzthQUN6Qjs7OztZQVRPLFNBQVM7WUFMZixNQUFNOzs7c0JBMEJMLEtBQUs7bUJBS0wsS0FBSzs0QkFTTCxNQUFNOytCQU9OLE1BQU07MkJBT04sTUFBTTs4QkFPTixNQUFNO2dDQU9OLE1BQU07Z0NBT04sTUFBTTtnQ0FPTixNQUFNOytCQU9OLE1BQU07Z0NBT04sTUFBTTs4QkFPTixNQUFNO2lDQU9OLE1BQU07Ozs7Ozs7SUE5RlAsb0NBQTBEOzs7OztJQUMxRCwrQkFBaUY7Ozs7O0lBQ2pGLDRCQUUwRTs7Ozs7SUFFMUUsaUNBQWtEOztJQUVsRCxnQ0FBaUM7Ozs7O0lBZ0JqQyxvQ0FFMkU7Ozs7O0lBSzNFLHVDQUU4RTs7Ozs7SUFLOUUsbUNBRXNFOzs7OztJQUt0RSxzQ0FFeUU7Ozs7O0lBS3pFLHdDQUUyRTs7Ozs7SUFLM0Usd0NBRStFOzs7OztJQUsvRSx3Q0FFK0U7Ozs7O0lBSy9FLHVDQUU4RTs7Ozs7SUFLOUUsd0NBRStFOzs7OztJQUsvRSxzQ0FFNkU7Ozs7O0lBSzdFLHlDQUVnRjs7Ozs7SUFHOUUsMkJBQWdDOzs7OztJQUNoQyw4QkFBdUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLy8gV29ya2Fyb3VuZCBmb3I6IGh0dHBzOi8vZ2l0aHViLmNvbS9iYXplbGJ1aWxkL3J1bGVzX25vZGVqcy9pc3N1ZXMvMTI2NVxuLy8vIDxyZWZlcmVuY2UgdHlwZXM9XCJnb29nbGVtYXBzXCIgLz5cblxuaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgTmdab25lLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7QmVoYXZpb3JTdWJqZWN0LCBjb21iaW5lTGF0ZXN0LCBPYnNlcnZhYmxlLCBTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7bWFwLCB0YWtlLCB0YWtlVW50aWx9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtHb29nbGVNYXB9IGZyb20gJy4uL2dvb2dsZS1tYXAvZ29vZ2xlLW1hcCc7XG5pbXBvcnQge01hcEV2ZW50TWFuYWdlcn0gZnJvbSAnLi4vbWFwLWV2ZW50LW1hbmFnZXInO1xuXG4vKipcbiAqIEFuZ3VsYXIgY29tcG9uZW50IHRoYXQgcmVuZGVycyBhIEdvb2dsZSBNYXBzIFBvbHlsaW5lIHZpYSB0aGUgR29vZ2xlIE1hcHMgSmF2YVNjcmlwdCBBUEkuXG4gKiBAc2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNQb2x5bGluZVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXAtcG9seWxpbmUnLFxufSlcbmV4cG9ydCBjbGFzcyBNYXBQb2x5bGluZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfZXZlbnRNYW5hZ2VyID0gbmV3IE1hcEV2ZW50TWFuYWdlcih0aGlzLl9uZ1pvbmUpO1xuICBwcml2YXRlIHJlYWRvbmx5IF9vcHRpb25zID0gbmV3IEJlaGF2aW9yU3ViamVjdDxnb29nbGUubWFwcy5Qb2x5bGluZU9wdGlvbnM+KHt9KTtcbiAgcHJpdmF0ZSByZWFkb25seSBfcGF0aCA9XG4gICAgICBuZXcgQmVoYXZpb3JTdWJqZWN0PGdvb2dsZS5tYXBzLk1WQ0FycmF5PGdvb2dsZS5tYXBzLkxhdExuZz58Z29vZ2xlLm1hcHMuTGF0TG5nW118XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGdvb2dsZS5tYXBzLkxhdExuZ0xpdGVyYWxbXXx1bmRlZmluZWQ+KHVuZGVmaW5lZCk7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBfZGVzdHJveWVkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICBfcG9seWxpbmU/OiBnb29nbGUubWFwcy5Qb2x5bGluZTsgLy8gaW5pdGlhbGl6ZWQgaW4gbmdPbkluaXRcblxuICBASW5wdXQoKVxuICBzZXQgb3B0aW9ucyhvcHRpb25zOiBnb29nbGUubWFwcy5Qb2x5bGluZU9wdGlvbnMpIHtcbiAgICB0aGlzLl9vcHRpb25zLm5leHQob3B0aW9ucyB8fCB7fSk7XG4gIH1cblxuICBASW5wdXQoKVxuICBzZXQgcGF0aChwYXRoOiBnb29nbGUubWFwcy5NVkNBcnJheTxnb29nbGUubWFwcy5MYXRMbmc+fGdvb2dsZS5tYXBzLkxhdExuZ1tdfFxuICAgICAgICAgICBnb29nbGUubWFwcy5MYXRMbmdMaXRlcmFsW10pIHtcbiAgICB0aGlzLl9wYXRoLm5leHQocGF0aCk7XG4gIH1cblxuICAvKipcbiAgICogQHNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jUG9seWxpbmUuY2xpY2tcbiAgICovXG4gIEBPdXRwdXQoKVxuICBwb2x5bGluZUNsaWNrOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLlBvbHlNb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuUG9seU1vdXNlRXZlbnQ+KCdjbGljaycpO1xuXG4gIC8qKlxuICAgKiBAc2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNQb2x5bGluZS5kYmxjbGlja1xuICAgKi9cbiAgQE91dHB1dCgpXG4gIHBvbHlsaW5lRGJsY2xpY2s6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuUG9seU1vdXNlRXZlbnQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Qb2x5TW91c2VFdmVudD4oJ2RibGNsaWNrJyk7XG5cbiAgLyoqXG4gICAqIEBzZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI1BvbHlsaW5lLmRyYWdcbiAgICovXG4gIEBPdXRwdXQoKVxuICBwb2x5bGluZURyYWc6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+KCdkcmFnJyk7XG5cbiAgLyoqXG4gICAqIEBzZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI1BvbHlsaW5lLmRyYWdlbmRcbiAgICovXG4gIEBPdXRwdXQoKVxuICBwb2x5bGluZURyYWdlbmQ6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+KCdkcmFnZW5kJyk7XG5cbiAgLyoqXG4gICAqIEBzZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI1BvbHlsaW5lLmRyYWdzdGFydFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIHBvbHlsaW5lRHJhZ3N0YXJ0OiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PignZHJhZ3N0YXJ0Jyk7XG5cbiAgLyoqXG4gICAqIEBzZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI1BvbHlsaW5lLm1vdXNlZG93blxuICAgKi9cbiAgQE91dHB1dCgpXG4gIHBvbHlsaW5lTW91c2Vkb3duOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLlBvbHlNb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuUG9seU1vdXNlRXZlbnQ+KCdtb3VzZWRvd24nKTtcblxuICAvKipcbiAgICogQHNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jUG9seWxpbmUubW91c2Vtb3ZlXG4gICAqL1xuICBAT3V0cHV0KClcbiAgcG9seWxpbmVNb3VzZW1vdmU6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuUG9seU1vdXNlRXZlbnQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Qb2x5TW91c2VFdmVudD4oJ21vdXNlbW92ZScpO1xuXG4gIC8qKlxuICAgKiBAc2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNQb2x5bGluZS5tb3VzZW91dFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIHBvbHlsaW5lTW91c2VvdXQ6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuUG9seU1vdXNlRXZlbnQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Qb2x5TW91c2VFdmVudD4oJ21vdXNlb3V0Jyk7XG5cbiAgLyoqXG4gICAqIEBzZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI1BvbHlsaW5lLm1vdXNlb3ZlclxuICAgKi9cbiAgQE91dHB1dCgpXG4gIHBvbHlsaW5lTW91c2VvdmVyOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLlBvbHlNb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuUG9seU1vdXNlRXZlbnQ+KCdtb3VzZW92ZXInKTtcblxuICAvKipcbiAgICogQHNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jUG9seWxpbmUubW91c2V1cFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIHBvbHlsaW5lTW91c2V1cDogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Qb2x5TW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLlBvbHlNb3VzZUV2ZW50PignbW91c2V1cCcpO1xuXG4gIC8qKlxuICAgKiBAc2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNQb2x5bGluZS5yaWdodGNsaWNrXG4gICAqL1xuICBAT3V0cHV0KClcbiAgcG9seWxpbmVSaWdodGNsaWNrOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLlBvbHlNb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuUG9seU1vdXNlRXZlbnQ+KCdyaWdodGNsaWNrJyk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByZWFkb25seSBfbWFwOiBHb29nbGVNYXAsXG4gICAgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUpIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKHRoaXMuX21hcC5faXNCcm93c2VyKSB7XG4gICAgICB0aGlzLl9jb21iaW5lT3B0aW9ucygpLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKG9wdGlvbnMgPT4ge1xuICAgICAgICAvLyBDcmVhdGUgdGhlIG9iamVjdCBvdXRzaWRlIHRoZSB6b25lIHNvIGl0cyBldmVudHMgZG9uJ3QgdHJpZ2dlciBjaGFuZ2UgZGV0ZWN0aW9uLlxuICAgICAgICAvLyBXZSdsbCBicmluZyBpdCBiYWNrIGluIGluc2lkZSB0aGUgYE1hcEV2ZW50TWFuYWdlcmAgb25seSBmb3IgdGhlIGV2ZW50cyB0aGF0IHRoZVxuICAgICAgICAvLyB1c2VyIGhhcyBzdWJzY3JpYmVkIHRvLlxuICAgICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4gdGhpcy5fcG9seWxpbmUgPSBuZXcgZ29vZ2xlLm1hcHMuUG9seWxpbmUob3B0aW9ucykpO1xuICAgICAgICB0aGlzLl9wb2x5bGluZSEuc2V0TWFwKHRoaXMuX21hcC5fZ29vZ2xlTWFwKTtcbiAgICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLnNldFRhcmdldCh0aGlzLl9wb2x5bGluZSk7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5fd2F0Y2hGb3JPcHRpb25zQ2hhbmdlcygpO1xuICAgICAgdGhpcy5fd2F0Y2hGb3JQYXRoQ2hhbmdlcygpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5kZXN0cm95KCk7XG4gICAgdGhpcy5fZGVzdHJveWVkLm5leHQoKTtcbiAgICB0aGlzLl9kZXN0cm95ZWQuY29tcGxldGUoKTtcbiAgICBpZiAodGhpcy5fcG9seWxpbmUpIHtcbiAgICAgIHRoaXMuX3BvbHlsaW5lLnNldE1hcChudWxsKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jUG9seWxpbmUuZ2V0RHJhZ2dhYmxlXG4gICAqL1xuICBnZXREcmFnZ2FibGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3BvbHlsaW5lID8gdGhpcy5fcG9seWxpbmUuZ2V0RHJhZ2dhYmxlKCkgOiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAc2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNQb2x5bGluZS5nZXRFZGl0YWJsZVxuICAgKi9cbiAgZ2V0RWRpdGFibGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3BvbHlsaW5lID8gdGhpcy5fcG9seWxpbmUuZ2V0RWRpdGFibGUoKSA6IGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEBzZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI1BvbHlsaW5lLmdldFBhdGhcbiAgICovXG4gIGdldFBhdGgoKTogZ29vZ2xlLm1hcHMuTVZDQXJyYXk8Z29vZ2xlLm1hcHMuTGF0TG5nPiB7XG4gICAgLy8gQGJyZWFraW5nLWNoYW5nZSAxMS4wLjAgTWFrZSB0aGUgcmV0dXJuIHZhbHVlIG51bGxhYmxlLlxuICAgIHJldHVybiB0aGlzLl9wb2x5bGluZSA/IHRoaXMuX3BvbHlsaW5lLmdldFBhdGgoKSA6IG51bGwhO1xuICB9XG5cbiAgLyoqXG4gICAqIEBzZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI1BvbHlsaW5lLmdldFZpc2libGVcbiAgICovXG4gIGdldFZpc2libGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3BvbHlsaW5lID8gdGhpcy5fcG9seWxpbmUuZ2V0VmlzaWJsZSgpIDogZmFsc2U7XG4gIH1cblxuICBwcml2YXRlIF9jb21iaW5lT3B0aW9ucygpOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLlBvbHlsaW5lT3B0aW9ucz4ge1xuICAgIHJldHVybiBjb21iaW5lTGF0ZXN0KFt0aGlzLl9vcHRpb25zLCB0aGlzLl9wYXRoXSkucGlwZShtYXAoKFtvcHRpb25zLCBwYXRoXSkgPT4ge1xuICAgICAgY29uc3QgY29tYmluZWRPcHRpb25zOiBnb29nbGUubWFwcy5Qb2x5bGluZU9wdGlvbnMgPSB7XG4gICAgICAgIC4uLm9wdGlvbnMsXG4gICAgICAgIHBhdGg6IHBhdGggfHwgb3B0aW9ucy5wYXRoLFxuICAgICAgfTtcbiAgICAgIHJldHVybiBjb21iaW5lZE9wdGlvbnM7XG4gICAgfSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBfd2F0Y2hGb3JPcHRpb25zQ2hhbmdlcygpIHtcbiAgICB0aGlzLl9vcHRpb25zLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpLnN1YnNjcmliZShvcHRpb25zID0+IHtcbiAgICAgIGlmICh0aGlzLl9wb2x5bGluZSkge1xuICAgICAgICB0aGlzLl9wb2x5bGluZS5zZXRPcHRpb25zKG9wdGlvbnMpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfd2F0Y2hGb3JQYXRoQ2hhbmdlcygpIHtcbiAgICB0aGlzLl9wYXRoLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpLnN1YnNjcmliZShwYXRoID0+IHtcbiAgICAgIGlmIChwYXRoICYmIHRoaXMuX3BvbHlsaW5lKSB7XG4gICAgICAgIHRoaXMuX3BvbHlsaW5lLnNldFBhdGgocGF0aCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==