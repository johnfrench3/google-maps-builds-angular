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
import { Directive, Input, NgZone, Output, inject } from '@angular/core';
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
        this._eventManager = new MapEventManager(inject(NgZone));
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.0", ngImport: i0, type: MapCircle, deps: [{ token: i1.GoogleMap }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.1.0", type: MapCircle, selector: "map-circle", inputs: { options: "options", center: "center", radius: "radius" }, outputs: { centerChanged: "centerChanged", circleClick: "circleClick", circleDblclick: "circleDblclick", circleDrag: "circleDrag", circleDragend: "circleDragend", circleDragstart: "circleDragstart", circleMousedown: "circleMousedown", circleMousemove: "circleMousemove", circleMouseout: "circleMouseout", circleMouseover: "circleMouseover", circleMouseup: "circleMouseup", radiusChanged: "radiusChanged", circleRightclick: "circleRightclick" }, exportAs: ["mapCircle"], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.0", ngImport: i0, type: MapCircle, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWNpcmNsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9nb29nbGUtbWFwcy9tYXAtY2lyY2xlL21hcC1jaXJjbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBU0EscUNBQXFDO0FBVHJDOzs7Ozs7R0FNRztBQUVILHlFQUF5RTtBQUN6RSxxQ0FBcUM7QUFFckMsT0FBTyxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFxQixNQUFNLEVBQUUsTUFBTSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzFGLE9BQU8sRUFBQyxlQUFlLEVBQUUsYUFBYSxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDekUsT0FBTyxFQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFcEQsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQ25ELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQzs7O0FBRXJEOzs7R0FHRztBQUtILE1BQU0sT0FBTyxTQUFTO0lBaUJwQixJQUNJLE9BQU8sQ0FBQyxPQUFrQztRQUM1QyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVELElBQ0ksTUFBTSxDQUFDLE1BQXNEO1FBQy9ELElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFRCxJQUNJLE1BQU0sQ0FBQyxNQUFjO1FBQ3ZCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUE2RkQsWUFBNkIsSUFBZSxFQUFtQixPQUFlO1FBQWpELFNBQUksR0FBSixJQUFJLENBQVc7UUFBbUIsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQTFIdEUs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LGVBQWU7c0JBQWpDLE1BQU07Z0JBT1ksZUFBZTtzQkFBakMsTUFBTTtnQkFPWSxlQUFlO3NCQUFqQyxNQUFNO2dCQU9ZLGNBQWM7c0JBQWhDLE1BQU07Z0JBT1ksZUFBZTtzQkFBakMsTUFBTTtnQkFPWSxhQUFhO3NCQUEvQixNQUFNO2dCQU9ZLGFBQWE7c0JBQS9CLE1BQU07Z0JBT1ksZ0JBQWdCO3NCQUFsQyxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8vIFdvcmthcm91bmQgZm9yOiBodHRwczovL2dpdGh1Yi5jb20vYmF6ZWxidWlsZC9ydWxlc19ub2RlanMvaXNzdWVzLzEyNjVcbi8vLyA8cmVmZXJlbmNlIHR5cGVzPVwiZ29vZ2xlLm1hcHNcIiAvPlxuXG5pbXBvcnQge0RpcmVjdGl2ZSwgSW5wdXQsIE5nWm9uZSwgT25EZXN0cm95LCBPbkluaXQsIE91dHB1dCwgaW5qZWN0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7QmVoYXZpb3JTdWJqZWN0LCBjb21iaW5lTGF0ZXN0LCBPYnNlcnZhYmxlLCBTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7bWFwLCB0YWtlLCB0YWtlVW50aWx9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtHb29nbGVNYXB9IGZyb20gJy4uL2dvb2dsZS1tYXAvZ29vZ2xlLW1hcCc7XG5pbXBvcnQge01hcEV2ZW50TWFuYWdlcn0gZnJvbSAnLi4vbWFwLWV2ZW50LW1hbmFnZXInO1xuXG4vKipcbiAqIEFuZ3VsYXIgY29tcG9uZW50IHRoYXQgcmVuZGVycyBhIEdvb2dsZSBNYXBzIENpcmNsZSB2aWEgdGhlIEdvb2dsZSBNYXBzIEphdmFTY3JpcHQgQVBJLlxuICogQHNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jQ2lyY2xlXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hcC1jaXJjbGUnLFxuICBleHBvcnRBczogJ21hcENpcmNsZScsXG59KVxuZXhwb3J0IGNsYXNzIE1hcENpcmNsZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfZXZlbnRNYW5hZ2VyID0gbmV3IE1hcEV2ZW50TWFuYWdlcihpbmplY3QoTmdab25lKSk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX29wdGlvbnMgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PGdvb2dsZS5tYXBzLkNpcmNsZU9wdGlvbnM+KHt9KTtcbiAgcHJpdmF0ZSByZWFkb25seSBfY2VudGVyID0gbmV3IEJlaGF2aW9yU3ViamVjdDxcbiAgICBnb29nbGUubWFwcy5MYXRMbmcgfCBnb29nbGUubWFwcy5MYXRMbmdMaXRlcmFsIHwgdW5kZWZpbmVkXG4gID4odW5kZWZpbmVkKTtcbiAgcHJpdmF0ZSByZWFkb25seSBfcmFkaXVzID0gbmV3IEJlaGF2aW9yU3ViamVjdDxudW1iZXIgfCB1bmRlZmluZWQ+KHVuZGVmaW5lZCk7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBfZGVzdHJveWVkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKipcbiAgICogVW5kZXJseWluZyBnb29nbGUubWFwcy5DaXJjbGUgb2JqZWN0LlxuICAgKlxuICAgKiBAc2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNDaXJjbGVcbiAgICovXG4gIGNpcmNsZT86IGdvb2dsZS5tYXBzLkNpcmNsZTsgLy8gaW5pdGlhbGl6ZWQgaW4gbmdPbkluaXRcblxuICBASW5wdXQoKVxuICBzZXQgb3B0aW9ucyhvcHRpb25zOiBnb29nbGUubWFwcy5DaXJjbGVPcHRpb25zKSB7XG4gICAgdGhpcy5fb3B0aW9ucy5uZXh0KG9wdGlvbnMgfHwge30pO1xuICB9XG5cbiAgQElucHV0KClcbiAgc2V0IGNlbnRlcihjZW50ZXI6IGdvb2dsZS5tYXBzLkxhdExuZyB8IGdvb2dsZS5tYXBzLkxhdExuZ0xpdGVyYWwpIHtcbiAgICB0aGlzLl9jZW50ZXIubmV4dChjZW50ZXIpO1xuICB9XG5cbiAgQElucHV0KClcbiAgc2V0IHJhZGl1cyhyYWRpdXM6IG51bWJlcikge1xuICAgIHRoaXMuX3JhZGl1cy5uZXh0KHJhZGl1cyk7XG4gIH1cblxuICAvKipcbiAgICogQHNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jQ2lyY2xlLmNlbnRlcl9jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgY2VudGVyQ2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCdjZW50ZXJfY2hhbmdlZCcpO1xuXG4gIC8qKlxuICAgKiBAc2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNDaXJjbGUuY2xpY2tcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBjaXJjbGVDbGljazogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+KCdjbGljaycpO1xuXG4gIC8qKlxuICAgKiBAc2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNDaXJjbGUuZGJsY2xpY2tcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBjaXJjbGVEYmxjbGljazogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+KCdkYmxjbGljaycpO1xuXG4gIC8qKlxuICAgKiBAc2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNDaXJjbGUuZHJhZ1xuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGNpcmNsZURyYWc6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PignZHJhZycpO1xuXG4gIC8qKlxuICAgKiBAc2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNDaXJjbGUuZHJhZ2VuZFxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGNpcmNsZURyYWdlbmQ6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PignZHJhZ2VuZCcpO1xuXG4gIC8qKlxuICAgKiBAc2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNDaXJjbGUuZHJhZ3N0YXJ0XG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgY2lyY2xlRHJhZ3N0YXJ0OiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4oJ2RyYWdzdGFydCcpO1xuXG4gIC8qKlxuICAgKiBAc2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNDaXJjbGUubW91c2Vkb3duXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgY2lyY2xlTW91c2Vkb3duOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4oJ21vdXNlZG93bicpO1xuXG4gIC8qKlxuICAgKiBAc2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNDaXJjbGUubW91c2Vtb3ZlXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgY2lyY2xlTW91c2Vtb3ZlOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4oJ21vdXNlbW92ZScpO1xuXG4gIC8qKlxuICAgKiBAc2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNDaXJjbGUubW91c2VvdXRcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBjaXJjbGVNb3VzZW91dDogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+KCdtb3VzZW91dCcpO1xuXG4gIC8qKlxuICAgKiBAc2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNDaXJjbGUubW91c2VvdmVyXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgY2lyY2xlTW91c2VvdmVyOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4oJ21vdXNlb3ZlcicpO1xuXG4gIC8qKlxuICAgKiBAc2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNDaXJjbGUubW91c2V1cFxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGNpcmNsZU1vdXNldXA6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PignbW91c2V1cCcpO1xuXG4gIC8qKlxuICAgKiBAc2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNDaXJjbGUucmFkaXVzX2NoYW5nZWRcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSByYWRpdXNDaGFuZ2VkOiBPYnNlcnZhYmxlPHZvaWQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ3JhZGl1c19jaGFuZ2VkJyk7XG5cbiAgLyoqXG4gICAqIEBzZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI0NpcmNsZS5yaWdodGNsaWNrXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgY2lyY2xlUmlnaHRjbGljazogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+KCdyaWdodGNsaWNrJyk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBfbWFwOiBHb29nbGVNYXAsIHByaXZhdGUgcmVhZG9ubHkgX25nWm9uZTogTmdab25lKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICh0aGlzLl9tYXAuX2lzQnJvd3Nlcikge1xuICAgICAgdGhpcy5fY29tYmluZU9wdGlvbnMoKVxuICAgICAgICAucGlwZSh0YWtlKDEpKVxuICAgICAgICAuc3Vic2NyaWJlKG9wdGlvbnMgPT4ge1xuICAgICAgICAgIC8vIENyZWF0ZSB0aGUgb2JqZWN0IG91dHNpZGUgdGhlIHpvbmUgc28gaXRzIGV2ZW50cyBkb24ndCB0cmlnZ2VyIGNoYW5nZSBkZXRlY3Rpb24uXG4gICAgICAgICAgLy8gV2UnbGwgYnJpbmcgaXQgYmFjayBpbiBpbnNpZGUgdGhlIGBNYXBFdmVudE1hbmFnZXJgIG9ubHkgZm9yIHRoZSBldmVudHMgdGhhdCB0aGVcbiAgICAgICAgICAvLyB1c2VyIGhhcyBzdWJzY3JpYmVkIHRvLlxuICAgICAgICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNpcmNsZSA9IG5ldyBnb29nbGUubWFwcy5DaXJjbGUob3B0aW9ucyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICAgICAgICB0aGlzLmNpcmNsZS5zZXRNYXAodGhpcy5fbWFwLmdvb2dsZU1hcCEpO1xuICAgICAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5zZXRUYXJnZXQodGhpcy5jaXJjbGUpO1xuICAgICAgICB9KTtcblxuICAgICAgdGhpcy5fd2F0Y2hGb3JPcHRpb25zQ2hhbmdlcygpO1xuICAgICAgdGhpcy5fd2F0Y2hGb3JDZW50ZXJDaGFuZ2VzKCk7XG4gICAgICB0aGlzLl93YXRjaEZvclJhZGl1c0NoYW5nZXMoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZGVzdHJveSgpO1xuICAgIHRoaXMuX2Rlc3Ryb3llZC5uZXh0KCk7XG4gICAgdGhpcy5fZGVzdHJveWVkLmNvbXBsZXRlKCk7XG4gICAgaWYgKHRoaXMuY2lyY2xlKSB7XG4gICAgICB0aGlzLmNpcmNsZS5zZXRNYXAobnVsbCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBzZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI0NpcmNsZS5nZXRCb3VuZHNcbiAgICovXG4gIGdldEJvdW5kcygpOiBnb29nbGUubWFwcy5MYXRMbmdCb3VuZHMgfCBudWxsIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmNpcmNsZS5nZXRCb3VuZHMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAc2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNDaXJjbGUuZ2V0Q2VudGVyXG4gICAqL1xuICBnZXRDZW50ZXIoKTogZ29vZ2xlLm1hcHMuTGF0TG5nIHwgbnVsbCB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5jaXJjbGUuZ2V0Q2VudGVyKCk7XG4gIH1cblxuICAvKipcbiAgICogQHNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jQ2lyY2xlLmdldERyYWdnYWJsZVxuICAgKi9cbiAgZ2V0RHJhZ2dhYmxlKCk6IGJvb2xlYW4ge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMuY2lyY2xlLmdldERyYWdnYWJsZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBzZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI0NpcmNsZS5nZXRFZGl0YWJsZVxuICAgKi9cbiAgZ2V0RWRpdGFibGUoKTogYm9vbGVhbiB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5jaXJjbGUuZ2V0RWRpdGFibGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAc2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNDaXJjbGUuZ2V0UmFkaXVzXG4gICAqL1xuICBnZXRSYWRpdXMoKTogbnVtYmVyIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmNpcmNsZS5nZXRSYWRpdXMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAc2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNDaXJjbGUuZ2V0VmlzaWJsZVxuICAgKi9cbiAgZ2V0VmlzaWJsZSgpOiBib29sZWFuIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmNpcmNsZS5nZXRWaXNpYmxlKCk7XG4gIH1cblxuICBwcml2YXRlIF9jb21iaW5lT3B0aW9ucygpOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLkNpcmNsZU9wdGlvbnM+IHtcbiAgICByZXR1cm4gY29tYmluZUxhdGVzdChbdGhpcy5fb3B0aW9ucywgdGhpcy5fY2VudGVyLCB0aGlzLl9yYWRpdXNdKS5waXBlKFxuICAgICAgbWFwKChbb3B0aW9ucywgY2VudGVyLCByYWRpdXNdKSA9PiB7XG4gICAgICAgIGNvbnN0IGNvbWJpbmVkT3B0aW9uczogZ29vZ2xlLm1hcHMuQ2lyY2xlT3B0aW9ucyA9IHtcbiAgICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgICAgIGNlbnRlcjogY2VudGVyIHx8IG9wdGlvbnMuY2VudGVyLFxuICAgICAgICAgIHJhZGl1czogcmFkaXVzICE9PSB1bmRlZmluZWQgPyByYWRpdXMgOiBvcHRpb25zLnJhZGl1cyxcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGNvbWJpbmVkT3B0aW9ucztcbiAgICAgIH0pLFxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIF93YXRjaEZvck9wdGlvbnNDaGFuZ2VzKCkge1xuICAgIHRoaXMuX29wdGlvbnMucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKG9wdGlvbnMgPT4ge1xuICAgICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICAgIHRoaXMuY2lyY2xlLnNldE9wdGlvbnMob3B0aW9ucyk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF93YXRjaEZvckNlbnRlckNoYW5nZXMoKSB7XG4gICAgdGhpcy5fY2VudGVyLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpLnN1YnNjcmliZShjZW50ZXIgPT4ge1xuICAgICAgaWYgKGNlbnRlcikge1xuICAgICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgICB0aGlzLmNpcmNsZS5zZXRDZW50ZXIoY2VudGVyKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3dhdGNoRm9yUmFkaXVzQ2hhbmdlcygpIHtcbiAgICB0aGlzLl9yYWRpdXMucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKHJhZGl1cyA9PiB7XG4gICAgICBpZiAocmFkaXVzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICAgICAgdGhpcy5jaXJjbGUuc2V0UmFkaXVzKHJhZGl1cyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF9hc3NlcnRJbml0aWFsaXplZCgpOiBhc3NlcnRzIHRoaXMgaXMge2NpcmNsZTogZ29vZ2xlLm1hcHMuQ2lyY2xlfSB7XG4gICAgaWYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkge1xuICAgICAgaWYgKCF0aGlzLl9tYXAuZ29vZ2xlTWFwKSB7XG4gICAgICAgIHRocm93IEVycm9yKFxuICAgICAgICAgICdDYW5ub3QgYWNjZXNzIEdvb2dsZSBNYXAgaW5mb3JtYXRpb24gYmVmb3JlIHRoZSBBUEkgaGFzIGJlZW4gaW5pdGlhbGl6ZWQuICcgK1xuICAgICAgICAgICAgJ1BsZWFzZSB3YWl0IGZvciB0aGUgQVBJIHRvIGxvYWQgYmVmb3JlIHRyeWluZyB0byBpbnRlcmFjdCB3aXRoIGl0LicsXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMuY2lyY2xlKSB7XG4gICAgICAgIHRocm93IEVycm9yKFxuICAgICAgICAgICdDYW5ub3QgaW50ZXJhY3Qgd2l0aCBhIEdvb2dsZSBNYXAgQ2lyY2xlIGJlZm9yZSBpdCBoYXMgYmVlbiAnICtcbiAgICAgICAgICAgICdpbml0aWFsaXplZC4gUGxlYXNlIHdhaXQgZm9yIHRoZSBDaXJjbGUgdG8gbG9hZCBiZWZvcmUgdHJ5aW5nIHRvIGludGVyYWN0IHdpdGggaXQuJyxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==