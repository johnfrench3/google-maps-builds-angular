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
import { Directive, Input, NgZone, Output } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { GoogleMap } from '../google-map/google-map';
import { MapEventManager } from '../map-event-manager';
import * as i0 from "@angular/core";
import * as i1 from "../google-map/google-map";
/**
 * Angular component that renders a Google Maps Circle via the Google Maps JavaScript API.
 * @see developers.google.com/maps/documentation/javascript/reference/polygon#Circle
 */
export class MapCircle {
    set options(options) {
        this._options.next(options || {});
    }
    set center(center) {
        this._center.next(center);
    }
    set radius(radius) {
        this._radius.next(radius);
    }
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
    ngOnInit() {
        if (this._map._isBrowser) {
            this._combineOptions()
                .pipe(take(1))
                .subscribe(options => {
                // Create the object outside the zone so its events don't trigger change detection.
                // We'll bring it back in inside the `MapEventManager` only for the events that the
                // user has subscribed to.
                this._ngZone.runOutsideAngular(() => {
                    this.circle = new google.maps.Circle(options);
                });
                this._assertInitialized();
                this.circle.setMap(this._map.googleMap);
                this._eventManager.setTarget(this.circle);
            });
            this._watchForOptionsChanges();
            this._watchForCenterChanges();
            this._watchForRadiusChanges();
        }
    }
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
     */
    getBounds() {
        this._assertInitialized();
        return this.circle.getBounds();
    }
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.getCenter
     */
    getCenter() {
        this._assertInitialized();
        return this.circle.getCenter();
    }
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.getDraggable
     */
    getDraggable() {
        this._assertInitialized();
        return this.circle.getDraggable();
    }
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.getEditable
     */
    getEditable() {
        this._assertInitialized();
        return this.circle.getEditable();
    }
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.getRadius
     */
    getRadius() {
        this._assertInitialized();
        return this.circle.getRadius();
    }
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.getVisible
     */
    getVisible() {
        this._assertInitialized();
        return this.circle.getVisible();
    }
    _combineOptions() {
        return combineLatest([this._options, this._center, this._radius]).pipe(map(([options, center, radius]) => {
            const combinedOptions = {
                ...options,
                center: center || options.center,
                radius: radius !== undefined ? radius : options.radius,
            };
            return combinedOptions;
        }));
    }
    _watchForOptionsChanges() {
        this._options.pipe(takeUntil(this._destroyed)).subscribe(options => {
            this._assertInitialized();
            this.circle.setOptions(options);
        });
    }
    _watchForCenterChanges() {
        this._center.pipe(takeUntil(this._destroyed)).subscribe(center => {
            if (center) {
                this._assertInitialized();
                this.circle.setCenter(center);
            }
        });
    }
    _watchForRadiusChanges() {
        this._radius.pipe(takeUntil(this._destroyed)).subscribe(radius => {
            if (radius !== undefined) {
                this._assertInitialized();
                this.circle.setRadius(radius);
            }
        });
    }
    _assertInitialized() {
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
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
}
MapCircle.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.0-rc.0", ngImport: i0, type: MapCircle, deps: [{ token: i1.GoogleMap }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive });
MapCircle.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.0-rc.0", type: MapCircle, selector: "map-circle", inputs: { options: "options", center: "center", radius: "radius" }, outputs: { centerChanged: "centerChanged", circleClick: "circleClick", circleDblclick: "circleDblclick", circleDrag: "circleDrag", circleDragend: "circleDragend", circleDragstart: "circleDragstart", circleMousedown: "circleMousedown", circleMousemove: "circleMousemove", circleMouseout: "circleMouseout", circleMouseover: "circleMouseover", circleMouseup: "circleMouseup", radiusChanged: "radiusChanged", circleRightclick: "circleRightclick" }, exportAs: ["mapCircle"], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.0-rc.0", ngImport: i0, type: MapCircle, decorators: [{
            type: Directive,
            args: [{
                    selector: 'map-circle',
                    exportAs: 'mapCircle',
                }]
        }], ctorParameters: function () { return [{ type: i1.GoogleMap }, { type: i0.NgZone }]; }, propDecorators: { options: [{
                type: Input
            }], center: [{
                type: Input
            }], radius: [{
                type: Input
            }], centerChanged: [{
                type: Output
            }], circleClick: [{
                type: Output
            }], circleDblclick: [{
                type: Output
            }], circleDrag: [{
                type: Output
            }], circleDragend: [{
                type: Output
            }], circleDragstart: [{
                type: Output
            }], circleMousedown: [{
                type: Output
            }], circleMousemove: [{
                type: Output
            }], circleMouseout: [{
                type: Output
            }], circleMouseover: [{
                type: Output
            }], circleMouseup: [{
                type: Output
            }], radiusChanged: [{
                type: Output
            }], circleRightclick: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWNpcmNsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9nb29nbGUtbWFwcy9tYXAtY2lyY2xlL21hcC1jaXJjbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBU0EscUNBQXFDO0FBVHJDOzs7Ozs7R0FNRztBQUVILHlFQUF5RTtBQUN6RSxxQ0FBcUM7QUFFckMsT0FBTyxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFxQixNQUFNLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDbEYsT0FBTyxFQUFDLGVBQWUsRUFBRSxhQUFhLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUN6RSxPQUFPLEVBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUVwRCxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDbkQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHNCQUFzQixDQUFDOzs7QUFFckQ7OztHQUdHO0FBS0gsTUFBTSxPQUFPLFNBQVM7SUFpQnBCLElBQ0ksT0FBTyxDQUFDLE9BQWtDO1FBQzVDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBRUQsSUFDSSxNQUFNLENBQUMsTUFBc0Q7UUFDL0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUVELElBQ0ksTUFBTSxDQUFDLE1BQWM7UUFDdkIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQTZGRCxZQUE2QixJQUFlLEVBQW1CLE9BQWU7UUFBakQsU0FBSSxHQUFKLElBQUksQ0FBVztRQUFtQixZQUFPLEdBQVAsT0FBTyxDQUFRO1FBMUh0RSxrQkFBYSxHQUFH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QU07Z0JBT1ksZUFBZTtzQkFBakMsTUFBTTtnQkFPWSxlQUFlO3NCQUFqQyxNQUFNO2dCQU9ZLGNBQWM7c0JBQWhDLE1BQU07Z0JBT1ksZUFBZTtzQkFBakMsTUFBTTtnQkFPWSxhQUFhO3NCQUEvQixNQUFNO2dCQU9ZLGFBQWE7c0JBQS9CLE1BQU07Z0JBT1ksZ0JBQWdCO3NCQUFsQyxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8vIFdvcmthcm91bmQgZm9yOiBodHRwczovL2dpdGh1Yi5jb20vYmF6ZWxidWlsZC9ydWxlc19ub2RlanMvaXNzdWVzLzEyNjVcbi8vLyA8cmVmZXJlbmNlIHR5cGVzPVwiZ29vZ2xlLm1hcHNcIiAvPlxuXG5pbXBvcnQge0RpcmVjdGl2ZSwgSW5wdXQsIE5nWm9uZSwgT25EZXN0cm95LCBPbkluaXQsIE91dHB1dH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0JlaGF2aW9yU3ViamVjdCwgY29tYmluZUxhdGVzdCwgT2JzZXJ2YWJsZSwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge21hcCwgdGFrZSwgdGFrZVVudGlsfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7R29vZ2xlTWFwfSBmcm9tICcuLi9nb29nbGUtbWFwL2dvb2dsZS1tYXAnO1xuaW1wb3J0IHtNYXBFdmVudE1hbmFnZXJ9IGZyb20gJy4uL21hcC1ldmVudC1tYW5hZ2VyJztcblxuLyoqXG4gKiBBbmd1bGFyIGNvbXBvbmVudCB0aGF0IHJlbmRlcnMgYSBHb29nbGUgTWFwcyBDaXJjbGUgdmlhIHRoZSBHb29nbGUgTWFwcyBKYXZhU2NyaXB0IEFQSS5cbiAqIEBzZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI0NpcmNsZVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXAtY2lyY2xlJyxcbiAgZXhwb3J0QXM6ICdtYXBDaXJjbGUnLFxufSlcbmV4cG9ydCBjbGFzcyBNYXBDaXJjbGUgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX2V2ZW50TWFuYWdlciA9IG5ldyBNYXBFdmVudE1hbmFnZXIodGhpcy5fbmdab25lKTtcbiAgcHJpdmF0ZSByZWFkb25seSBfb3B0aW9ucyA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Z29vZ2xlLm1hcHMuQ2lyY2xlT3B0aW9ucz4oe30pO1xuICBwcml2YXRlIHJlYWRvbmx5IF9jZW50ZXIgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PFxuICAgIGdvb2dsZS5tYXBzLkxhdExuZyB8IGdvb2dsZS5tYXBzLkxhdExuZ0xpdGVyYWwgfCB1bmRlZmluZWRcbiAgPih1bmRlZmluZWQpO1xuICBwcml2YXRlIHJlYWRvbmx5IF9yYWRpdXMgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PG51bWJlciB8IHVuZGVmaW5lZD4odW5kZWZpbmVkKTtcblxuICBwcml2YXRlIHJlYWRvbmx5IF9kZXN0cm95ZWQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKlxuICAgKiBVbmRlcmx5aW5nIGdvb2dsZS5tYXBzLkNpcmNsZSBvYmplY3QuXG4gICAqXG4gICAqIEBzZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI0NpcmNsZVxuICAgKi9cbiAgY2lyY2xlPzogZ29vZ2xlLm1hcHMuQ2lyY2xlOyAvLyBpbml0aWFsaXplZCBpbiBuZ09uSW5pdFxuXG4gIEBJbnB1dCgpXG4gIHNldCBvcHRpb25zKG9wdGlvbnM6IGdvb2dsZS5tYXBzLkNpcmNsZU9wdGlvbnMpIHtcbiAgICB0aGlzLl9vcHRpb25zLm5leHQob3B0aW9ucyB8fCB7fSk7XG4gIH1cblxuICBASW5wdXQoKVxuICBzZXQgY2VudGVyKGNlbnRlcjogZ29vZ2xlLm1hcHMuTGF0TG5nIHwgZ29vZ2xlLm1hcHMuTGF0TG5nTGl0ZXJhbCkge1xuICAgIHRoaXMuX2NlbnRlci5uZXh0KGNlbnRlcik7XG4gIH1cblxuICBASW5wdXQoKVxuICBzZXQgcmFkaXVzKHJhZGl1czogbnVtYmVyKSB7XG4gICAgdGhpcy5fcmFkaXVzLm5leHQocmFkaXVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAc2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNDaXJjbGUuY2VudGVyX2NoYW5nZWRcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBjZW50ZXJDaGFuZ2VkOiBPYnNlcnZhYmxlPHZvaWQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2NlbnRlcl9jaGFuZ2VkJyk7XG5cbiAgLyoqXG4gICAqIEBzZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI0NpcmNsZS5jbGlja1xuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGNpcmNsZUNsaWNrOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4oJ2NsaWNrJyk7XG5cbiAgLyoqXG4gICAqIEBzZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI0NpcmNsZS5kYmxjbGlja1xuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGNpcmNsZURibGNsaWNrOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4oJ2RibGNsaWNrJyk7XG5cbiAgLyoqXG4gICAqIEBzZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI0NpcmNsZS5kcmFnXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgY2lyY2xlRHJhZzogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+KCdkcmFnJyk7XG5cbiAgLyoqXG4gICAqIEBzZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI0NpcmNsZS5kcmFnZW5kXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgY2lyY2xlRHJhZ2VuZDogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+KCdkcmFnZW5kJyk7XG5cbiAgLyoqXG4gICAqIEBzZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI0NpcmNsZS5kcmFnc3RhcnRcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBjaXJjbGVEcmFnc3RhcnQ6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PignZHJhZ3N0YXJ0Jyk7XG5cbiAgLyoqXG4gICAqIEBzZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI0NpcmNsZS5tb3VzZWRvd25cbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBjaXJjbGVNb3VzZWRvd246IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PignbW91c2Vkb3duJyk7XG5cbiAgLyoqXG4gICAqIEBzZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI0NpcmNsZS5tb3VzZW1vdmVcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBjaXJjbGVNb3VzZW1vdmU6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PignbW91c2Vtb3ZlJyk7XG5cbiAgLyoqXG4gICAqIEBzZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI0NpcmNsZS5tb3VzZW91dFxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGNpcmNsZU1vdXNlb3V0OiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4oJ21vdXNlb3V0Jyk7XG5cbiAgLyoqXG4gICAqIEBzZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI0NpcmNsZS5tb3VzZW92ZXJcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBjaXJjbGVNb3VzZW92ZXI6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PignbW91c2VvdmVyJyk7XG5cbiAgLyoqXG4gICAqIEBzZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI0NpcmNsZS5tb3VzZXVwXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgY2lyY2xlTW91c2V1cDogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+KCdtb3VzZXVwJyk7XG5cbiAgLyoqXG4gICAqIEBzZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI0NpcmNsZS5yYWRpdXNfY2hhbmdlZFxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHJhZGl1c0NoYW5nZWQ6IE9ic2VydmFibGU8dm9pZD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPigncmFkaXVzX2NoYW5nZWQnKTtcblxuICAvKipcbiAgICogQHNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jQ2lyY2xlLnJpZ2h0Y2xpY2tcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBjaXJjbGVSaWdodGNsaWNrOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4oJ3JpZ2h0Y2xpY2snKTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IF9tYXA6IEdvb2dsZU1hcCwgcHJpdmF0ZSByZWFkb25seSBfbmdab25lOiBOZ1pvbmUpIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKHRoaXMuX21hcC5faXNCcm93c2VyKSB7XG4gICAgICB0aGlzLl9jb21iaW5lT3B0aW9ucygpXG4gICAgICAgIC5waXBlKHRha2UoMSkpXG4gICAgICAgIC5zdWJzY3JpYmUob3B0aW9ucyA9PiB7XG4gICAgICAgICAgLy8gQ3JlYXRlIHRoZSBvYmplY3Qgb3V0c2lkZSB0aGUgem9uZSBzbyBpdHMgZXZlbnRzIGRvbid0IHRyaWdnZXIgY2hhbmdlIGRldGVjdGlvbi5cbiAgICAgICAgICAvLyBXZSdsbCBicmluZyBpdCBiYWNrIGluIGluc2lkZSB0aGUgYE1hcEV2ZW50TWFuYWdlcmAgb25seSBmb3IgdGhlIGV2ZW50cyB0aGF0IHRoZVxuICAgICAgICAgIC8vIHVzZXIgaGFzIHN1YnNjcmliZWQgdG8uXG4gICAgICAgICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2lyY2xlID0gbmV3IGdvb2dsZS5tYXBzLkNpcmNsZShvcHRpb25zKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgICAgIHRoaXMuY2lyY2xlLnNldE1hcCh0aGlzLl9tYXAuZ29vZ2xlTWFwISk7XG4gICAgICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLnNldFRhcmdldCh0aGlzLmNpcmNsZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICB0aGlzLl93YXRjaEZvck9wdGlvbnNDaGFuZ2VzKCk7XG4gICAgICB0aGlzLl93YXRjaEZvckNlbnRlckNoYW5nZXMoKTtcbiAgICAgIHRoaXMuX3dhdGNoRm9yUmFkaXVzQ2hhbmdlcygpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5kZXN0cm95KCk7XG4gICAgdGhpcy5fZGVzdHJveWVkLm5leHQoKTtcbiAgICB0aGlzLl9kZXN0cm95ZWQuY29tcGxldGUoKTtcbiAgICBpZiAodGhpcy5jaXJjbGUpIHtcbiAgICAgIHRoaXMuY2lyY2xlLnNldE1hcChudWxsKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jQ2lyY2xlLmdldEJvdW5kc1xuICAgKi9cbiAgZ2V0Qm91bmRzKCk6IGdvb2dsZS5tYXBzLkxhdExuZ0JvdW5kcyB8IG51bGwge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMuY2lyY2xlLmdldEJvdW5kcygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBzZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI0NpcmNsZS5nZXRDZW50ZXJcbiAgICovXG4gIGdldENlbnRlcigpOiBnb29nbGUubWFwcy5MYXRMbmcgfCBudWxsIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmNpcmNsZS5nZXRDZW50ZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAc2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNDaXJjbGUuZ2V0RHJhZ2dhYmxlXG4gICAqL1xuICBnZXREcmFnZ2FibGUoKTogYm9vbGVhbiB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5jaXJjbGUuZ2V0RHJhZ2dhYmxlKCk7XG4gIH1cblxuICAvKipcbiAgICogQHNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jQ2lyY2xlLmdldEVkaXRhYmxlXG4gICAqL1xuICBnZXRFZGl0YWJsZSgpOiBib29sZWFuIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmNpcmNsZS5nZXRFZGl0YWJsZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBzZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI0NpcmNsZS5nZXRSYWRpdXNcbiAgICovXG4gIGdldFJhZGl1cygpOiBudW1iZXIge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMuY2lyY2xlLmdldFJhZGl1cygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBzZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI0NpcmNsZS5nZXRWaXNpYmxlXG4gICAqL1xuICBnZXRWaXNpYmxlKCk6IGJvb2xlYW4ge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMuY2lyY2xlLmdldFZpc2libGUoKTtcbiAgfVxuXG4gIHByaXZhdGUgX2NvbWJpbmVPcHRpb25zKCk6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuQ2lyY2xlT3B0aW9ucz4ge1xuICAgIHJldHVybiBjb21iaW5lTGF0ZXN0KFt0aGlzLl9vcHRpb25zLCB0aGlzLl9jZW50ZXIsIHRoaXMuX3JhZGl1c10pLnBpcGUoXG4gICAgICBtYXAoKFtvcHRpb25zLCBjZW50ZXIsIHJhZGl1c10pID0+IHtcbiAgICAgICAgY29uc3QgY29tYmluZWRPcHRpb25zOiBnb29nbGUubWFwcy5DaXJjbGVPcHRpb25zID0ge1xuICAgICAgICAgIC4uLm9wdGlvbnMsXG4gICAgICAgICAgY2VudGVyOiBjZW50ZXIgfHwgb3B0aW9ucy5jZW50ZXIsXG4gICAgICAgICAgcmFkaXVzOiByYWRpdXMgIT09IHVuZGVmaW5lZCA/IHJhZGl1cyA6IG9wdGlvbnMucmFkaXVzLFxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gY29tYmluZWRPcHRpb25zO1xuICAgICAgfSksXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgX3dhdGNoRm9yT3B0aW9uc0NoYW5nZXMoKSB7XG4gICAgdGhpcy5fb3B0aW9ucy5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKS5zdWJzY3JpYmUob3B0aW9ucyA9PiB7XG4gICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgdGhpcy5jaXJjbGUuc2V0T3B0aW9ucyhvcHRpb25zKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3dhdGNoRm9yQ2VudGVyQ2hhbmdlcygpIHtcbiAgICB0aGlzLl9jZW50ZXIucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKGNlbnRlciA9PiB7XG4gICAgICBpZiAoY2VudGVyKSB7XG4gICAgICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgICAgIHRoaXMuY2lyY2xlLnNldENlbnRlcihjZW50ZXIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfd2F0Y2hGb3JSYWRpdXNDaGFuZ2VzKCkge1xuICAgIHRoaXMuX3JhZGl1cy5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKS5zdWJzY3JpYmUocmFkaXVzID0+IHtcbiAgICAgIGlmIChyYWRpdXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgICB0aGlzLmNpcmNsZS5zZXRSYWRpdXMocmFkaXVzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2Fzc2VydEluaXRpYWxpemVkKCk6IGFzc2VydHMgdGhpcyBpcyB7Y2lyY2xlOiBnb29nbGUubWFwcy5DaXJjbGV9IHtcbiAgICBpZiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSB7XG4gICAgICBpZiAoIXRoaXMuX21hcC5nb29nbGVNYXApIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICAgJ0Nhbm5vdCBhY2Nlc3MgR29vZ2xlIE1hcCBpbmZvcm1hdGlvbiBiZWZvcmUgdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZC4gJyArXG4gICAgICAgICAgICAnUGxlYXNlIHdhaXQgZm9yIHRoZSBBUEkgdG8gbG9hZCBiZWZvcmUgdHJ5aW5nIHRvIGludGVyYWN0IHdpdGggaXQuJyxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5jaXJjbGUpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICAgJ0Nhbm5vdCBpbnRlcmFjdCB3aXRoIGEgR29vZ2xlIE1hcCBDaXJjbGUgYmVmb3JlIGl0IGhhcyBiZWVuICcgK1xuICAgICAgICAgICAgJ2luaXRpYWxpemVkLiBQbGVhc2Ugd2FpdCBmb3IgdGhlIENpcmNsZSB0byBsb2FkIGJlZm9yZSB0cnlpbmcgdG8gaW50ZXJhY3Qgd2l0aCBpdC4nLFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19