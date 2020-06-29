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
 *
 * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline
 */
export class MapPolyline {
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
}
MapPolyline.decorators = [
    { type: Directive, args: [{
                selector: 'map-polyline',
                exportAs: 'mapPolyline',
            },] }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLXBvbHlsaW5lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2dvb2dsZS1tYXBzL21hcC1wb2x5bGluZS9tYXAtcG9seWxpbmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgseUVBQXlFO0FBQ3pFLG9DQUFvQztBQUVwQyxPQUFPLEVBQ0wsU0FBUyxFQUNULEtBQUssRUFHTCxNQUFNLEVBQ04sTUFBTSxHQUNQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxlQUFlLEVBQUUsYUFBYSxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDekUsT0FBTyxFQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFcEQsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQ25ELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUVyRDs7OztHQUlHO0FBS0gsTUFBTSxPQUFPLFdBQVc7SUF3R3RCLFlBQ21CLElBQWUsRUFDeEIsT0FBZTtRQUROLFNBQUksR0FBSixJQUFJLENBQVc7UUFDeEIsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQXpHakIsa0JBQWEsR0FBRyxJQUFJLGVBQWUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDekMsYUFBUSxHQUFHLElBQUksZUFBZSxDQUE4QixFQUFFLENBQUMsQ0FBQztRQUNoRSxVQUFLLEdBQ2xCLElBQUksZUFBZSxDQUN3QyxTQUFTLENBQUMsQ0FBQztRQUV6RCxlQUFVLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQztRQW9CbEQ7O1dBRUc7UUFFSCxrQkFBYSxHQUNULElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUE2QixPQUFPLENBQUMsQ0FBQztRQUUzRTs7V0FFRztRQUVILHFCQUFnQixHQUNaLElBQUksQ0FB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QjtRQUMxQixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQzNELElBQUksSUFBSSxFQUFFO2dCQUNSLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO2dCQUMxQixJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUM3QjtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVPLGtCQUFrQjtRQUN4QixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDeEIsTUFBTSxLQUFLLENBQ1AsNEVBQTRFO2dCQUM1RSxvRUFBb0UsQ0FBQyxDQUFDO1NBQzNFO1FBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDbEIsTUFBTSxLQUFLLENBQ1AsZ0VBQWdFO2dCQUNoRSxzRkFBc0YsQ0FBQyxDQUFDO1NBQzdGO0lBQ0gsQ0FBQzs7O1lBak5GLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsY0FBYztnQkFDeEIsUUFBUSxFQUFFLGFBQWE7YUFDeEI7OztZQVhPLFNBQVM7WUFMZixNQUFNOzs7c0JBaUNMLEtBQUs7bUJBS0wsS0FBSzs0QkFTTCxNQUFNOytCQU9OLE1BQU07MkJBT04sTUFBTTs4QkFPTixNQUFNO2dDQU9OLE1BQU07Z0NBT04sTUFBTTtnQ0FPTixNQUFNOytCQU9OLE1BQU07Z0NBT04sTUFBTTs4QkFPTixNQUFNO2lDQU9OLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLy8gV29ya2Fyb3VuZCBmb3I6IGh0dHBzOi8vZ2l0aHViLmNvbS9iYXplbGJ1aWxkL3J1bGVzX25vZGVqcy9pc3N1ZXMvMTI2NVxuLy8vIDxyZWZlcmVuY2UgdHlwZXM9XCJnb29nbGVtYXBzXCIgLz5cblxuaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgTmdab25lLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7QmVoYXZpb3JTdWJqZWN0LCBjb21iaW5lTGF0ZXN0LCBPYnNlcnZhYmxlLCBTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7bWFwLCB0YWtlLCB0YWtlVW50aWx9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtHb29nbGVNYXB9IGZyb20gJy4uL2dvb2dsZS1tYXAvZ29vZ2xlLW1hcCc7XG5pbXBvcnQge01hcEV2ZW50TWFuYWdlcn0gZnJvbSAnLi4vbWFwLWV2ZW50LW1hbmFnZXInO1xuXG4vKipcbiAqIEFuZ3VsYXIgY29tcG9uZW50IHRoYXQgcmVuZGVycyBhIEdvb2dsZSBNYXBzIFBvbHlsaW5lIHZpYSB0aGUgR29vZ2xlIE1hcHMgSmF2YVNjcmlwdCBBUEkuXG4gKlxuICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNQb2x5bGluZVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXAtcG9seWxpbmUnLFxuICBleHBvcnRBczogJ21hcFBvbHlsaW5lJyxcbn0pXG5leHBvcnQgY2xhc3MgTWFwUG9seWxpbmUgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX2V2ZW50TWFuYWdlciA9IG5ldyBNYXBFdmVudE1hbmFnZXIodGhpcy5fbmdab25lKTtcbiAgcHJpdmF0ZSByZWFkb25seSBfb3B0aW9ucyA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Z29vZ2xlLm1hcHMuUG9seWxpbmVPcHRpb25zPih7fSk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX3BhdGggPVxuICAgICAgbmV3IEJlaGF2aW9yU3ViamVjdDxnb29nbGUubWFwcy5NVkNBcnJheTxnb29nbGUubWFwcy5MYXRMbmc+fGdvb2dsZS5tYXBzLkxhdExuZ1tdfFxuICAgICAgICAgICAgICAgICAgICAgICAgICBnb29nbGUubWFwcy5MYXRMbmdMaXRlcmFsW118dW5kZWZpbmVkPih1bmRlZmluZWQpO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgX2Rlc3Ryb3llZCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqXG4gICAqIFRoZSB1bmRlcmx5aW5nIGdvb2dsZS5tYXBzLlBvbHlsaW5lIG9iamVjdC5cbiAgICpcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNQb2x5bGluZVxuICAgKi9cbiAgcG9seWxpbmU/OiBnb29nbGUubWFwcy5Qb2x5bGluZTtcblxuICBASW5wdXQoKVxuICBzZXQgb3B0aW9ucyhvcHRpb25zOiBnb29nbGUubWFwcy5Qb2x5bGluZU9wdGlvbnMpIHtcbiAgICB0aGlzLl9vcHRpb25zLm5leHQob3B0aW9ucyB8fCB7fSk7XG4gIH1cblxuICBASW5wdXQoKVxuICBzZXQgcGF0aChwYXRoOiBnb29nbGUubWFwcy5NVkNBcnJheTxnb29nbGUubWFwcy5MYXRMbmc+fGdvb2dsZS5tYXBzLkxhdExuZ1tdfFxuICAgICAgICAgICBnb29nbGUubWFwcy5MYXRMbmdMaXRlcmFsW10pIHtcbiAgICB0aGlzLl9wYXRoLm5leHQocGF0aCk7XG4gIH1cblxuICAvKipcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNQb2x5bGluZS5jbGlja1xuICAgKi9cbiAgQE91dHB1dCgpXG4gIHBvbHlsaW5lQ2xpY2s6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuUG9seU1vdXNlRXZlbnQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Qb2x5TW91c2VFdmVudD4oJ2NsaWNrJyk7XG5cbiAgLyoqXG4gICAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jUG9seWxpbmUuZGJsY2xpY2tcbiAgICovXG4gIEBPdXRwdXQoKVxuICBwb2x5bGluZURibGNsaWNrOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLlBvbHlNb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuUG9seU1vdXNlRXZlbnQ+KCdkYmxjbGljaycpO1xuXG4gIC8qKlxuICAgKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI1BvbHlsaW5lLmRyYWdcbiAgICovXG4gIEBPdXRwdXQoKVxuICBwb2x5bGluZURyYWc6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+KCdkcmFnJyk7XG5cbiAgLyoqXG4gICAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jUG9seWxpbmUuZHJhZ2VuZFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIHBvbHlsaW5lRHJhZ2VuZDogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4oJ2RyYWdlbmQnKTtcblxuICAvKipcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNQb2x5bGluZS5kcmFnc3RhcnRcbiAgICovXG4gIEBPdXRwdXQoKVxuICBwb2x5bGluZURyYWdzdGFydDogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4oJ2RyYWdzdGFydCcpO1xuXG4gIC8qKlxuICAgKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI1BvbHlsaW5lLm1vdXNlZG93blxuICAgKi9cbiAgQE91dHB1dCgpXG4gIHBvbHlsaW5lTW91c2Vkb3duOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLlBvbHlNb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuUG9seU1vdXNlRXZlbnQ+KCdtb3VzZWRvd24nKTtcblxuICAvKipcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNQb2x5bGluZS5tb3VzZW1vdmVcbiAgICovXG4gIEBPdXRwdXQoKVxuICBwb2x5bGluZU1vdXNlbW92ZTogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Qb2x5TW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLlBvbHlNb3VzZUV2ZW50PignbW91c2Vtb3ZlJyk7XG5cbiAgLyoqXG4gICAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jUG9seWxpbmUubW91c2VvdXRcbiAgICovXG4gIEBPdXRwdXQoKVxuICBwb2x5bGluZU1vdXNlb3V0OiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLlBvbHlNb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuUG9seU1vdXNlRXZlbnQ+KCdtb3VzZW91dCcpO1xuXG4gIC8qKlxuICAgKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI1BvbHlsaW5lLm1vdXNlb3ZlclxuICAgKi9cbiAgQE91dHB1dCgpXG4gIHBvbHlsaW5lTW91c2VvdmVyOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLlBvbHlNb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuUG9seU1vdXNlRXZlbnQ+KCdtb3VzZW92ZXInKTtcblxuICAvKipcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNQb2x5bGluZS5tb3VzZXVwXG4gICAqL1xuICBAT3V0cHV0KClcbiAgcG9seWxpbmVNb3VzZXVwOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLlBvbHlNb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuUG9seU1vdXNlRXZlbnQ+KCdtb3VzZXVwJyk7XG5cbiAgLyoqXG4gICAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jUG9seWxpbmUucmlnaHRjbGlja1xuICAgKi9cbiAgQE91dHB1dCgpXG4gIHBvbHlsaW5lUmlnaHRjbGljazogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Qb2x5TW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLlBvbHlNb3VzZUV2ZW50PigncmlnaHRjbGljaycpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVhZG9ubHkgX21hcDogR29vZ2xlTWFwLFxuICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICh0aGlzLl9tYXAuX2lzQnJvd3Nlcikge1xuICAgICAgdGhpcy5fY29tYmluZU9wdGlvbnMoKS5waXBlKHRha2UoMSkpLnN1YnNjcmliZShvcHRpb25zID0+IHtcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBvYmplY3Qgb3V0c2lkZSB0aGUgem9uZSBzbyBpdHMgZXZlbnRzIGRvbid0IHRyaWdnZXIgY2hhbmdlIGRldGVjdGlvbi5cbiAgICAgICAgLy8gV2UnbGwgYnJpbmcgaXQgYmFjayBpbiBpbnNpZGUgdGhlIGBNYXBFdmVudE1hbmFnZXJgIG9ubHkgZm9yIHRoZSBldmVudHMgdGhhdCB0aGVcbiAgICAgICAgLy8gdXNlciBoYXMgc3Vic2NyaWJlZCB0by5cbiAgICAgICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHRoaXMucG9seWxpbmUgPSBuZXcgZ29vZ2xlLm1hcHMuUG9seWxpbmUob3B0aW9ucykpO1xuICAgICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgICB0aGlzLnBvbHlsaW5lLnNldE1hcCh0aGlzLl9tYXAuZ29vZ2xlTWFwISk7XG4gICAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5zZXRUYXJnZXQodGhpcy5wb2x5bGluZSk7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5fd2F0Y2hGb3JPcHRpb25zQ2hhbmdlcygpO1xuICAgICAgdGhpcy5fd2F0Y2hGb3JQYXRoQ2hhbmdlcygpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5kZXN0cm95KCk7XG4gICAgdGhpcy5fZGVzdHJveWVkLm5leHQoKTtcbiAgICB0aGlzLl9kZXN0cm95ZWQuY29tcGxldGUoKTtcbiAgICBpZiAodGhpcy5wb2x5bGluZSkge1xuICAgICAgdGhpcy5wb2x5bGluZS5zZXRNYXAobnVsbCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jUG9seWxpbmUuZ2V0RHJhZ2dhYmxlXG4gICAqL1xuICBnZXREcmFnZ2FibGUoKTogYm9vbGVhbiB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5wb2x5bGluZS5nZXREcmFnZ2FibGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI1BvbHlsaW5lLmdldEVkaXRhYmxlXG4gICAqL1xuICBnZXRFZGl0YWJsZSgpOiBib29sZWFuIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLnBvbHlsaW5lLmdldEVkaXRhYmxlKCk7XG4gIH1cblxuICAvKipcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNQb2x5bGluZS5nZXRQYXRoXG4gICAqL1xuICBnZXRQYXRoKCk6IGdvb2dsZS5tYXBzLk1WQ0FycmF5PGdvb2dsZS5tYXBzLkxhdExuZz4ge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgLy8gQGJyZWFraW5nLWNoYW5nZSAxMS4wLjAgTWFrZSB0aGUgcmV0dXJuIHZhbHVlIG51bGxhYmxlLlxuICAgIHJldHVybiB0aGlzLnBvbHlsaW5lLmdldFBhdGgoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI1BvbHlsaW5lLmdldFZpc2libGVcbiAgICovXG4gIGdldFZpc2libGUoKTogYm9vbGVhbiB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5wb2x5bGluZS5nZXRWaXNpYmxlKCk7XG4gIH1cblxuICBwcml2YXRlIF9jb21iaW5lT3B0aW9ucygpOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLlBvbHlsaW5lT3B0aW9ucz4ge1xuICAgIHJldHVybiBjb21iaW5lTGF0ZXN0KFt0aGlzLl9vcHRpb25zLCB0aGlzLl9wYXRoXSkucGlwZShtYXAoKFtvcHRpb25zLCBwYXRoXSkgPT4ge1xuICAgICAgY29uc3QgY29tYmluZWRPcHRpb25zOiBnb29nbGUubWFwcy5Qb2x5bGluZU9wdGlvbnMgPSB7XG4gICAgICAgIC4uLm9wdGlvbnMsXG4gICAgICAgIHBhdGg6IHBhdGggfHwgb3B0aW9ucy5wYXRoLFxuICAgICAgfTtcbiAgICAgIHJldHVybiBjb21iaW5lZE9wdGlvbnM7XG4gICAgfSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBfd2F0Y2hGb3JPcHRpb25zQ2hhbmdlcygpIHtcbiAgICB0aGlzLl9vcHRpb25zLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpLnN1YnNjcmliZShvcHRpb25zID0+IHtcbiAgICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgICB0aGlzLnBvbHlsaW5lLnNldE9wdGlvbnMob3B0aW9ucyk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF93YXRjaEZvclBhdGhDaGFuZ2VzKCkge1xuICAgIHRoaXMuX3BhdGgucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKHBhdGggPT4ge1xuICAgICAgaWYgKHBhdGgpIHtcbiAgICAgICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICAgICAgdGhpcy5wb2x5bGluZS5zZXRQYXRoKHBhdGgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfYXNzZXJ0SW5pdGlhbGl6ZWQoKTogYXNzZXJ0cyB0aGlzIGlzIHtwb2x5bGluZTogZ29vZ2xlLm1hcHMuUG9seWxpbmV9IHtcbiAgICBpZiAoIXRoaXMuX21hcC5nb29nbGVNYXApIHtcbiAgICAgIHRocm93IEVycm9yKFxuICAgICAgICAgICdDYW5ub3QgYWNjZXNzIEdvb2dsZSBNYXAgaW5mb3JtYXRpb24gYmVmb3JlIHRoZSBBUEkgaGFzIGJlZW4gaW5pdGlhbGl6ZWQuICcgK1xuICAgICAgICAgICdQbGVhc2Ugd2FpdCBmb3IgdGhlIEFQSSB0byBsb2FkIGJlZm9yZSB0cnlpbmcgdG8gaW50ZXJhY3Qgd2l0aCBpdC4nKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLnBvbHlsaW5lKSB7XG4gICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICAnQ2Fubm90IGludGVyYWN0IHdpdGggYSBHb29nbGUgTWFwIFBvbHlsaW5lIGJlZm9yZSBpdCBoYXMgYmVlbiAnICtcbiAgICAgICAgICAnaW5pdGlhbGl6ZWQuIFBsZWFzZSB3YWl0IGZvciB0aGUgUG9seWxpbmUgdG8gbG9hZCBiZWZvcmUgdHJ5aW5nIHRvIGludGVyYWN0IHdpdGggaXQuJyk7XG4gICAgfVxuICB9XG59XG4iXX0=