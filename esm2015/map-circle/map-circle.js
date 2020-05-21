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
    let MapCircle = class MapCircle {
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
        set options(options) {
            this._options.next(options || {});
        }
        set center(center) {
            this._center.next(center);
        }
        set radius(radius) {
            this._radius.next(radius);
        }
        ngOnInit() {
            if (this._map._isBrowser) {
                this._combineOptions().pipe(take(1)).subscribe(options => {
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
         * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.getCenter
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
            return combineLatest([this._options, this._center, this._radius])
                .pipe(map(([options, center, radius]) => {
                const combinedOptions = Object.assign(Object.assign({}, options), { center: center || options.center, radius: radius !== undefined ? radius : options.radius });
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
            if (!this._map.googleMap) {
                throw Error('Cannot access Google Map information before the API has been initialized. ' +
                    'Please wait for the API to load before trying to interact with it.');
            }
            if (!this.circle) {
                throw Error('Cannot interact with a Google Map Circle before it has been ' +
                    'initialized. Please wait for the Circle to load before trying to interact with it.');
            }
        }
    };
    __decorate([
        Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], MapCircle.prototype, "options", null);
    __decorate([
        Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], MapCircle.prototype, "center", null);
    __decorate([
        Input(),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], MapCircle.prototype, "radius", null);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapCircle.prototype, "centerChanged", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapCircle.prototype, "circleClick", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapCircle.prototype, "circleDblclick", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapCircle.prototype, "circleDrag", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapCircle.prototype, "circleDragend", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapCircle.prototype, "circleDragstart", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapCircle.prototype, "circleMousedown", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapCircle.prototype, "circleMousemove", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapCircle.prototype, "circleMouseout", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapCircle.prototype, "circleMouseover", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapCircle.prototype, "circleMouseup", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapCircle.prototype, "radiusChanged", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapCircle.prototype, "circleRightclick", void 0);
    MapCircle = __decorate([
        Directive({
            selector: 'map-circle',
        }),
        __metadata("design:paramtypes", [GoogleMap, NgZone])
    ], MapCircle);
    return MapCircle;
})();
export { MapCircle };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWNpcmNsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9nb29nbGUtbWFwcy9tYXAtY2lyY2xlL21hcC1jaXJjbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILHlFQUF5RTtBQUN6RSxvQ0FBb0M7QUFFcEMsT0FBTyxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFxQixNQUFNLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDbEYsT0FBTyxFQUFDLGVBQWUsRUFBRSxhQUFhLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUN6RSxPQUFPLEVBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUVwRCxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDbkQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBRXJEOzs7R0FHRztBQUlIO0lBQUEsSUFBYSxTQUFTLEdBQXRCLE1BQWEsU0FBUztRQXFJcEIsWUFBNkIsSUFBZSxFQUFtQixPQUFlO1lBQWpELFNBQUksR0FBSixJQUFJLENBQVc7WUFBbUIsWUFBTyxHQUFQLE9BQU8sQ0FBUTtZQXBJdEUsa0JBQWEsR0FBRyxJQUFJLGVBQWUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDekMsYUFBUSxHQUFHLElBQUksZUFBZSxDQUE0QixFQUFFLENBQUMsQ0FBQztZQUM5RCxZQUFPLEdBQ3BCLElBQUksZUFBZSxDQUF5RCxTQUFTLENBQUMsQ0FBQztZQUMxRSxZQUFPLEdBQUcsSUFBSSxlQUFlLENBQW1CLFNBQVMsQ0FBQyxDQUFDO1lBRTNELGVBQVUsR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO1lBd0JsRDs7O2VBR0c7WUFFSCxrQkFBYSxHQUFxQixJQUFJLENBQUMsYUFBYSxDQUFDLGNB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QyxNQUFNLEVBQUU7a0NBQ1EsVUFBVTtzREFDZ0Q7SUFPM0U7UUFEQyxNQUFNLEVBQUU7a0NBQ08sVUFBVTtxREFDZ0Q7SUFPMUU7UUFEQyxNQUFNLEVBQUU7a0NBQ1EsVUFBVTtzREFDZ0Q7SUFPM0U7UUFEQyxNQUFNLEVBQUU7a0NBQ00sVUFBVTtvREFDZ0Q7SUFPekU7UUFEQyxNQUFNLEVBQUU7a0NBQ00sVUFBVTtvREFBbUU7SUFPNUY7UUFEQyxNQUFNLEVBQUU7a0NBQ1MsVUFBVTt1REFDZ0Q7SUFuSWpFLFNBQVM7UUFIckIsU0FBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLFlBQVk7U0FDdkIsQ0FBQzt5Q0FzSW1DLFNBQVMsRUFBNEIsTUFBTTtPQXJJbkUsU0FBUyxDQTJRckI7SUFBRCxnQkFBQztLQUFBO1NBM1FZLFNBQVMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLy8gV29ya2Fyb3VuZCBmb3I6IGh0dHBzOi8vZ2l0aHViLmNvbS9iYXplbGJ1aWxkL3J1bGVzX25vZGVqcy9pc3N1ZXMvMTI2NVxuLy8vIDxyZWZlcmVuY2UgdHlwZXM9XCJnb29nbGVtYXBzXCIgLz5cblxuaW1wb3J0IHtEaXJlY3RpdmUsIElucHV0LCBOZ1pvbmUsIE9uRGVzdHJveSwgT25Jbml0LCBPdXRwdXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtCZWhhdmlvclN1YmplY3QsIGNvbWJpbmVMYXRlc3QsIE9ic2VydmFibGUsIFN1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHttYXAsIHRha2UsIHRha2VVbnRpbH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQge0dvb2dsZU1hcH0gZnJvbSAnLi4vZ29vZ2xlLW1hcC9nb29nbGUtbWFwJztcbmltcG9ydCB7TWFwRXZlbnRNYW5hZ2VyfSBmcm9tICcuLi9tYXAtZXZlbnQtbWFuYWdlcic7XG5cbi8qKlxuICogQW5ndWxhciBjb21wb25lbnQgdGhhdCByZW5kZXJzIGEgR29vZ2xlIE1hcHMgQ2lyY2xlIHZpYSB0aGUgR29vZ2xlIE1hcHMgSmF2YVNjcmlwdCBBUEkuXG4gKiBAc2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNDaXJjbGVcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWFwLWNpcmNsZScsXG59KVxuZXhwb3J0IGNsYXNzIE1hcENpcmNsZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfZXZlbnRNYW5hZ2VyID0gbmV3IE1hcEV2ZW50TWFuYWdlcih0aGlzLl9uZ1pvbmUpO1xuICBwcml2YXRlIHJlYWRvbmx5IF9vcHRpb25zID0gbmV3IEJlaGF2aW9yU3ViamVjdDxnb29nbGUubWFwcy5DaXJjbGVPcHRpb25zPih7fSk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2NlbnRlciA9XG4gICAgICBuZXcgQmVoYXZpb3JTdWJqZWN0PGdvb2dsZS5tYXBzLkxhdExuZ3xnb29nbGUubWFwcy5MYXRMbmdMaXRlcmFsfHVuZGVmaW5lZD4odW5kZWZpbmVkKTtcbiAgcHJpdmF0ZSByZWFkb25seSBfcmFkaXVzID0gbmV3IEJlaGF2aW9yU3ViamVjdDxudW1iZXJ8dW5kZWZpbmVkPih1bmRlZmluZWQpO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgX2Rlc3Ryb3llZCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqXG4gICAqIFVuZGVybHlpbmcgZ29vZ2xlLm1hcHMuQ2lyY2xlIG9iamVjdC5cbiAgICpcbiAgICogQHNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jQ2lyY2xlXG4gICAqL1xuICBjaXJjbGU/OiBnb29nbGUubWFwcy5DaXJjbGU7ICAvLyBpbml0aWFsaXplZCBpbiBuZ09uSW5pdFxuXG4gIEBJbnB1dCgpXG4gIHNldCBvcHRpb25zKG9wdGlvbnM6IGdvb2dsZS5tYXBzLkNpcmNsZU9wdGlvbnMpIHtcbiAgICB0aGlzLl9vcHRpb25zLm5leHQob3B0aW9ucyB8fCB7fSk7XG4gIH1cblxuICBASW5wdXQoKVxuICBzZXQgY2VudGVyKGNlbnRlcjogZ29vZ2xlLm1hcHMuTGF0TG5nfGdvb2dsZS5tYXBzLkxhdExuZ0xpdGVyYWwpIHtcbiAgICB0aGlzLl9jZW50ZXIubmV4dChjZW50ZXIpO1xuICB9XG5cbiAgQElucHV0KClcbiAgc2V0IHJhZGl1cyhyYWRpdXM6IG51bWJlcikge1xuICAgIHRoaXMuX3JhZGl1cy5uZXh0KHJhZGl1cyk7XG4gIH1cblxuICAvKipcbiAgICogQHNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jQ2lyY2xlLmNlbnRlcl9jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KClcbiAgY2VudGVyQ2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9IHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPignY2VudGVyX2NoYW5nZWQnKTtcblxuICAvKipcbiAgICogQHNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jQ2lyY2xlLmNsaWNrXG4gICAqL1xuICBAT3V0cHV0KClcbiAgY2lyY2xlQ2xpY2s6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+KCdjbGljaycpO1xuXG4gIC8qKlxuICAgKiBAc2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNDaXJjbGUuZGJsY2xpY2tcbiAgICovXG4gIEBPdXRwdXQoKVxuICBjaXJjbGVEYmxjbGljazogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4oJ2RibGNsaWNrJyk7XG5cbiAgLyoqXG4gICAqIEBzZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI0NpcmNsZS5kcmFnXG4gICAqL1xuICBAT3V0cHV0KClcbiAgY2lyY2xlRHJhZzogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4oJ2RyYWcnKTtcblxuICAvKipcbiAgICogQHNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jQ2lyY2xlLmRyYWdlbmRcbiAgICovXG4gIEBPdXRwdXQoKVxuICBjaXJjbGVEcmFnZW5kOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PignZHJhZ2VuZCcpO1xuXG4gIC8qKlxuICAgKiBAc2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNDaXJjbGUuZHJhZ3N0YXJ0XG4gICAqL1xuICBAT3V0cHV0KClcbiAgY2lyY2xlRHJhZ3N0YXJ0OiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PignZHJhZ3N0YXJ0Jyk7XG5cbiAgLyoqXG4gICAqIEBzZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI0NpcmNsZS5tb3VzZWRvd25cbiAgICovXG4gIEBPdXRwdXQoKVxuICBjaXJjbGVNb3VzZWRvd246IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+KCdtb3VzZWRvd24nKTtcblxuICAvKipcbiAgICogQHNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jQ2lyY2xlLm1vdXNlbW92ZVxuICAgKi9cbiAgQE91dHB1dCgpXG4gIGNpcmNsZU1vdXNlbW92ZTogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4oJ21vdXNlbW92ZScpO1xuXG4gIC8qKlxuICAgKiBAc2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNDaXJjbGUubW91c2VvdXRcbiAgICovXG4gIEBPdXRwdXQoKVxuICBjaXJjbGVNb3VzZW91dDogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4oJ21vdXNlb3V0Jyk7XG5cbiAgLyoqXG4gICAqIEBzZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI0NpcmNsZS5tb3VzZW92ZXJcbiAgICovXG4gIEBPdXRwdXQoKVxuICBjaXJjbGVNb3VzZW92ZXI6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+KCdtb3VzZW92ZXInKTtcblxuICAvKipcbiAgICogQHNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jQ2lyY2xlLm1vdXNldXBcbiAgICovXG4gIEBPdXRwdXQoKVxuICBjaXJjbGVNb3VzZXVwOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PignbW91c2V1cCcpO1xuXG4gIC8qKlxuICAgKiBAc2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNDaXJjbGUucmFkaXVzX2NoYW5nZWRcbiAgICovXG4gIEBPdXRwdXQoKVxuICByYWRpdXNDaGFuZ2VkOiBPYnNlcnZhYmxlPHZvaWQ+ID0gdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCdyYWRpdXNfY2hhbmdlZCcpO1xuXG4gIC8qKlxuICAgKiBAc2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNDaXJjbGUucmlnaHRjbGlja1xuICAgKi9cbiAgQE91dHB1dCgpXG4gIGNpcmNsZVJpZ2h0Y2xpY2s6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+KCdyaWdodGNsaWNrJyk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBfbWFwOiBHb29nbGVNYXAsIHByaXZhdGUgcmVhZG9ubHkgX25nWm9uZTogTmdab25lKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICh0aGlzLl9tYXAuX2lzQnJvd3Nlcikge1xuICAgICAgdGhpcy5fY29tYmluZU9wdGlvbnMoKS5waXBlKHRha2UoMSkpLnN1YnNjcmliZShvcHRpb25zID0+IHtcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBvYmplY3Qgb3V0c2lkZSB0aGUgem9uZSBzbyBpdHMgZXZlbnRzIGRvbid0IHRyaWdnZXIgY2hhbmdlIGRldGVjdGlvbi5cbiAgICAgICAgLy8gV2UnbGwgYnJpbmcgaXQgYmFjayBpbiBpbnNpZGUgdGhlIGBNYXBFdmVudE1hbmFnZXJgIG9ubHkgZm9yIHRoZSBldmVudHMgdGhhdCB0aGVcbiAgICAgICAgLy8gdXNlciBoYXMgc3Vic2NyaWJlZCB0by5cbiAgICAgICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgICB0aGlzLmNpcmNsZSA9IG5ldyBnb29nbGUubWFwcy5DaXJjbGUob3B0aW9ucyk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgICB0aGlzLmNpcmNsZS5zZXRNYXAodGhpcy5fbWFwLmdvb2dsZU1hcCEpO1xuICAgICAgICB0aGlzLl9ldmVudE1hbmFnZXIuc2V0VGFyZ2V0KHRoaXMuY2lyY2xlKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLl93YXRjaEZvck9wdGlvbnNDaGFuZ2VzKCk7XG4gICAgICB0aGlzLl93YXRjaEZvckNlbnRlckNoYW5nZXMoKTtcbiAgICAgIHRoaXMuX3dhdGNoRm9yUmFkaXVzQ2hhbmdlcygpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5kZXN0cm95KCk7XG4gICAgdGhpcy5fZGVzdHJveWVkLm5leHQoKTtcbiAgICB0aGlzLl9kZXN0cm95ZWQuY29tcGxldGUoKTtcbiAgICBpZiAodGhpcy5jaXJjbGUpIHtcbiAgICAgIHRoaXMuY2lyY2xlLnNldE1hcChudWxsKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jQ2lyY2xlLmdldEJvdW5kc1xuICAgKi9cbiAgZ2V0Qm91bmRzKCk6IGdvb2dsZS5tYXBzLkxhdExuZ0JvdW5kcyB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5jaXJjbGUuZ2V0Qm91bmRzKCk7XG4gIH1cblxuICAvKipcbiAgICogQHNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jQ2lyY2xlLmdldENlbnRlclxuICAgKi9cbiAgZ2V0Q2VudGVyKCk6IGdvb2dsZS5tYXBzLkxhdExuZyB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5jaXJjbGUuZ2V0Q2VudGVyKCk7XG4gIH1cblxuICAvKipcbiAgICogQHNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jQ2lyY2xlLmdldERyYWdnYWJsZVxuICAgKi9cbiAgZ2V0RHJhZ2dhYmxlKCk6IGJvb2xlYW4ge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMuY2lyY2xlLmdldERyYWdnYWJsZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBzZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI0NpcmNsZS5nZXRFZGl0YWJsZVxuICAgKi9cbiAgZ2V0RWRpdGFibGUoKTogYm9vbGVhbiB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5jaXJjbGUuZ2V0RWRpdGFibGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAc2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNDaXJjbGUuZ2V0Q2VudGVyXG4gICAqL1xuICBnZXRSYWRpdXMoKTogbnVtYmVyIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmNpcmNsZS5nZXRSYWRpdXMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAc2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNDaXJjbGUuZ2V0VmlzaWJsZVxuICAgKi9cbiAgZ2V0VmlzaWJsZSgpOiBib29sZWFuIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmNpcmNsZS5nZXRWaXNpYmxlKCk7XG4gIH1cblxuICBwcml2YXRlIF9jb21iaW5lT3B0aW9ucygpOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLkNpcmNsZU9wdGlvbnM+IHtcbiAgICByZXR1cm4gY29tYmluZUxhdGVzdChbdGhpcy5fb3B0aW9ucywgdGhpcy5fY2VudGVyLCB0aGlzLl9yYWRpdXNdKVxuICAgICAgICAucGlwZShtYXAoKFtvcHRpb25zLCBjZW50ZXIsIHJhZGl1c10pID0+IHtcbiAgICAgICAgICBjb25zdCBjb21iaW5lZE9wdGlvbnM6IGdvb2dsZS5tYXBzLkNpcmNsZU9wdGlvbnMgPSB7XG4gICAgICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgICAgICAgY2VudGVyOiBjZW50ZXIgfHwgb3B0aW9ucy5jZW50ZXIsXG4gICAgICAgICAgICByYWRpdXM6IHJhZGl1cyAhPT0gdW5kZWZpbmVkID8gcmFkaXVzIDogb3B0aW9ucy5yYWRpdXMsXG4gICAgICAgICAgfTtcbiAgICAgICAgICByZXR1cm4gY29tYmluZWRPcHRpb25zO1xuICAgICAgICB9KSk7XG4gIH1cblxuICBwcml2YXRlIF93YXRjaEZvck9wdGlvbnNDaGFuZ2VzKCkge1xuICAgIHRoaXMuX29wdGlvbnMucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKG9wdGlvbnMgPT4ge1xuICAgICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICAgIHRoaXMuY2lyY2xlLnNldE9wdGlvbnMob3B0aW9ucyk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF93YXRjaEZvckNlbnRlckNoYW5nZXMoKSB7XG4gICAgdGhpcy5fY2VudGVyLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpLnN1YnNjcmliZShjZW50ZXIgPT4ge1xuICAgICAgaWYgKGNlbnRlcikge1xuICAgICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgICB0aGlzLmNpcmNsZS5zZXRDZW50ZXIoY2VudGVyKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3dhdGNoRm9yUmFkaXVzQ2hhbmdlcygpIHtcbiAgICB0aGlzLl9yYWRpdXMucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKHJhZGl1cyA9PiB7XG4gICAgICBpZiAocmFkaXVzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICAgICAgdGhpcy5jaXJjbGUuc2V0UmFkaXVzKHJhZGl1cyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF9hc3NlcnRJbml0aWFsaXplZCgpOiBhc3NlcnRzIHRoaXMgaXMge2NpcmNsZTogZ29vZ2xlLm1hcHMuQ2lyY2xlfSB7XG4gICAgaWYgKCF0aGlzLl9tYXAuZ29vZ2xlTWFwKSB7XG4gICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgJ0Nhbm5vdCBhY2Nlc3MgR29vZ2xlIE1hcCBpbmZvcm1hdGlvbiBiZWZvcmUgdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZC4gJyArXG4gICAgICAgICdQbGVhc2Ugd2FpdCBmb3IgdGhlIEFQSSB0byBsb2FkIGJlZm9yZSB0cnlpbmcgdG8gaW50ZXJhY3Qgd2l0aCBpdC4nKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLmNpcmNsZSkge1xuICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICdDYW5ub3QgaW50ZXJhY3Qgd2l0aCBhIEdvb2dsZSBNYXAgQ2lyY2xlIGJlZm9yZSBpdCBoYXMgYmVlbiAnICtcbiAgICAgICAgJ2luaXRpYWxpemVkLiBQbGVhc2Ugd2FpdCBmb3IgdGhlIENpcmNsZSB0byBsb2FkIGJlZm9yZSB0cnlpbmcgdG8gaW50ZXJhY3Qgd2l0aCBpdC4nKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==