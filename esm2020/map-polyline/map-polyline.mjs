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
import { Directive, Input, Output, NgZone } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { GoogleMap } from '../google-map/google-map';
import { MapEventManager } from '../map-event-manager';
import * as i0 from "@angular/core";
import * as i1 from "../google-map/google-map";
/**
 * Angular component that renders a Google Maps Polyline via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline
 */
export class MapPolyline {
    set options(options) {
        this._options.next(options || {});
    }
    set path(path) {
        this._path.next(path);
    }
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
    ngOnInit() {
        if (this._map._isBrowser) {
            this._combineOptions()
                .pipe(take(1))
                .subscribe(options => {
                // Create the object outside the zone so its events don't trigger change detection.
                // We'll bring it back in inside the `MapEventManager` only for the events that the
                // user has subscribed to.
                this._ngZone.runOutsideAngular(() => (this.polyline = new google.maps.Polyline(options)));
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
            const combinedOptions = {
                ...options,
                path: path || options.path,
            };
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
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
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
}
MapPolyline.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.0-rc.0", ngImport: i0, type: MapPolyline, deps: [{ token: i1.GoogleMap }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive });
MapPolyline.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.0-rc.0", type: MapPolyline, selector: "map-polyline", inputs: { options: "options", path: "path" }, outputs: { polylineClick: "polylineClick", polylineDblclick: "polylineDblclick", polylineDrag: "polylineDrag", polylineDragend: "polylineDragend", polylineDragstart: "polylineDragstart", polylineMousedown: "polylineMousedown", polylineMousemove: "polylineMousemove", polylineMouseout: "polylineMouseout", polylineMouseover: "polylineMouseover", polylineMouseup: "polylineMouseup", polylineRightclick: "polylineRightclick" }, exportAs: ["mapPolyline"], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.0-rc.0", ngImport: i0, type: MapPolyline, decorators: [{
            type: Directive,
            args: [{
                    selector: 'map-polyline',
                    exportAs: 'mapPolyline',
                }]
        }], ctorParameters: function () { return [{ type: i1.GoogleMap }, { type: i0.NgZone }]; }, propDecorators: { options: [{
                type: Input
            }], path: [{
                type: Input
            }], polylineClick: [{
                type: Output
            }], polylineDblclick: [{
                type: Output
            }], polylineDrag: [{
                type: Output
            }], polylineDragend: [{
                type: Output
            }], polylineDragstart: [{
                type: Output
            }], polylineMousedown: [{
                type: Output
            }], polylineMousemove: [{
                type: Output
            }], polylineMouseout: [{
                type: Output
            }], polylineMouseover: [{
                type: Output
            }], polylineMouseup: [{
                type: Output
            }], polylineRightclick: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLXBvbHlsaW5lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2dvb2dsZS1tYXBzL21hcC1wb2x5bGluZS9tYXAtcG9seWxpbmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBU0EscUNBQXFDO0FBVHJDOzs7Ozs7R0FNRztBQUVILHlFQUF5RTtBQUN6RSxxQ0FBcUM7QUFFckMsT0FBTyxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQXFCLE1BQU0sRUFBRSxNQUFNLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDbEYsT0FBTyxFQUFDLGVBQWUsRUFBRSxhQUFhLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUN6RSxPQUFPLEVBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUVwRCxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDbkQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHNCQUFzQixDQUFDOzs7QUFFckQ7Ozs7R0FJRztBQUtILE1BQU0sT0FBTyxXQUFXO0lBbUJ0QixJQUNJLE9BQU8sQ0FBQyxPQUFvQztRQUM5QyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVELElBQ0ksSUFBSSxDQUNOLElBRytCO1FBRS9CLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3hCLENBQUM7SUFvRUQsWUFBNkIsSUFBZSxFQUFVLE9BQWU7UUFBeEMsU0FBSSxHQUFKLElBQUksQ0FBVztRQUFVLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFuRzdELGtCQUFhLEdBQUcsSUFBSSxlQUFlLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3pDLGFBQVEsR0FBRyxJQUFJLGVBQWUsQ0FBOEIsRUFBRSxDQUFD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TUFBTTtnQkFNWSxpQkFBaUI7c0JBQW5DLE1BQU07Z0JBTVksZUFBZTtzQkFBakMsTUFBTTtnQkFNWSxrQkFBa0I7c0JBQXBDLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLy8gV29ya2Fyb3VuZCBmb3I6IGh0dHBzOi8vZ2l0aHViLmNvbS9iYXplbGJ1aWxkL3J1bGVzX25vZGVqcy9pc3N1ZXMvMTI2NVxuLy8vIDxyZWZlcmVuY2UgdHlwZXM9XCJnb29nbGUubWFwc1wiIC8+XG5cbmltcG9ydCB7RGlyZWN0aXZlLCBJbnB1dCwgT25EZXN0cm95LCBPbkluaXQsIE91dHB1dCwgTmdab25lfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7QmVoYXZpb3JTdWJqZWN0LCBjb21iaW5lTGF0ZXN0LCBPYnNlcnZhYmxlLCBTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7bWFwLCB0YWtlLCB0YWtlVW50aWx9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtHb29nbGVNYXB9IGZyb20gJy4uL2dvb2dsZS1tYXAvZ29vZ2xlLW1hcCc7XG5pbXBvcnQge01hcEV2ZW50TWFuYWdlcn0gZnJvbSAnLi4vbWFwLWV2ZW50LW1hbmFnZXInO1xuXG4vKipcbiAqIEFuZ3VsYXIgY29tcG9uZW50IHRoYXQgcmVuZGVycyBhIEdvb2dsZSBNYXBzIFBvbHlsaW5lIHZpYSB0aGUgR29vZ2xlIE1hcHMgSmF2YVNjcmlwdCBBUEkuXG4gKlxuICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNQb2x5bGluZVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXAtcG9seWxpbmUnLFxuICBleHBvcnRBczogJ21hcFBvbHlsaW5lJyxcbn0pXG5leHBvcnQgY2xhc3MgTWFwUG9seWxpbmUgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX2V2ZW50TWFuYWdlciA9IG5ldyBNYXBFdmVudE1hbmFnZXIodGhpcy5fbmdab25lKTtcbiAgcHJpdmF0ZSByZWFkb25seSBfb3B0aW9ucyA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Z29vZ2xlLm1hcHMuUG9seWxpbmVPcHRpb25zPih7fSk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX3BhdGggPSBuZXcgQmVoYXZpb3JTdWJqZWN0PFxuICAgIHwgZ29vZ2xlLm1hcHMuTVZDQXJyYXk8Z29vZ2xlLm1hcHMuTGF0TG5nPlxuICAgIHwgZ29vZ2xlLm1hcHMuTGF0TG5nW11cbiAgICB8IGdvb2dsZS5tYXBzLkxhdExuZ0xpdGVyYWxbXVxuICAgIHwgdW5kZWZpbmVkXG4gID4odW5kZWZpbmVkKTtcblxuICBwcml2YXRlIHJlYWRvbmx5IF9kZXN0cm95ZWQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKlxuICAgKiBUaGUgdW5kZXJseWluZyBnb29nbGUubWFwcy5Qb2x5bGluZSBvYmplY3QuXG4gICAqXG4gICAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jUG9seWxpbmVcbiAgICovXG4gIHBvbHlsaW5lPzogZ29vZ2xlLm1hcHMuUG9seWxpbmU7XG5cbiAgQElucHV0KClcbiAgc2V0IG9wdGlvbnMob3B0aW9uczogZ29vZ2xlLm1hcHMuUG9seWxpbmVPcHRpb25zKSB7XG4gICAgdGhpcy5fb3B0aW9ucy5uZXh0KG9wdGlvbnMgfHwge30pO1xuICB9XG5cbiAgQElucHV0KClcbiAgc2V0IHBhdGgoXG4gICAgcGF0aDpcbiAgICAgIHwgZ29vZ2xlLm1hcHMuTVZDQXJyYXk8Z29vZ2xlLm1hcHMuTGF0TG5nPlxuICAgICAgfCBnb29nbGUubWFwcy5MYXRMbmdbXVxuICAgICAgfCBnb29nbGUubWFwcy5MYXRMbmdMaXRlcmFsW10sXG4gICkge1xuICAgIHRoaXMuX3BhdGgubmV4dChwYXRoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI1BvbHlsaW5lLmNsaWNrXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgcG9seWxpbmVDbGljazogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Qb2x5TW91c2VFdmVudD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Qb2x5TW91c2VFdmVudD4oJ2NsaWNrJyk7XG5cbiAgLyoqXG4gICAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jUG9seWxpbmUuZGJsY2xpY2tcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBwb2x5bGluZURibGNsaWNrOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLlBvbHlNb3VzZUV2ZW50PiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLlBvbHlNb3VzZUV2ZW50PignZGJsY2xpY2snKTtcblxuICAvKipcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNQb2x5bGluZS5kcmFnXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgcG9seWxpbmVEcmFnOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4oJ2RyYWcnKTtcblxuICAvKipcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNQb2x5bGluZS5kcmFnZW5kXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgcG9seWxpbmVEcmFnZW5kOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4oJ2RyYWdlbmQnKTtcblxuICAvKipcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNQb2x5bGluZS5kcmFnc3RhcnRcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBwb2x5bGluZURyYWdzdGFydDogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+KCdkcmFnc3RhcnQnKTtcblxuICAvKipcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNQb2x5bGluZS5tb3VzZWRvd25cbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBwb2x5bGluZU1vdXNlZG93bjogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Qb2x5TW91c2VFdmVudD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Qb2x5TW91c2VFdmVudD4oJ21vdXNlZG93bicpO1xuXG4gIC8qKlxuICAgKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI1BvbHlsaW5lLm1vdXNlbW92ZVxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHBvbHlsaW5lTW91c2Vtb3ZlOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLlBvbHlNb3VzZUV2ZW50PiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLlBvbHlNb3VzZUV2ZW50PignbW91c2Vtb3ZlJyk7XG5cbiAgLyoqXG4gICAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jUG9seWxpbmUubW91c2VvdXRcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBwb2x5bGluZU1vdXNlb3V0OiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLlBvbHlNb3VzZUV2ZW50PiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLlBvbHlNb3VzZUV2ZW50PignbW91c2VvdXQnKTtcblxuICAvKipcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNQb2x5bGluZS5tb3VzZW92ZXJcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBwb2x5bGluZU1vdXNlb3ZlcjogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Qb2x5TW91c2VFdmVudD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Qb2x5TW91c2VFdmVudD4oJ21vdXNlb3ZlcicpO1xuXG4gIC8qKlxuICAgKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI1BvbHlsaW5lLm1vdXNldXBcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBwb2x5bGluZU1vdXNldXA6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuUG9seU1vdXNlRXZlbnQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuUG9seU1vdXNlRXZlbnQ+KCdtb3VzZXVwJyk7XG5cbiAgLyoqXG4gICAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jUG9seWxpbmUucmlnaHRjbGlja1xuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHBvbHlsaW5lUmlnaHRjbGljazogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Qb2x5TW91c2VFdmVudD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Qb2x5TW91c2VFdmVudD4oJ3JpZ2h0Y2xpY2snKTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IF9tYXA6IEdvb2dsZU1hcCwgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUpIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKHRoaXMuX21hcC5faXNCcm93c2VyKSB7XG4gICAgICB0aGlzLl9jb21iaW5lT3B0aW9ucygpXG4gICAgICAgIC5waXBlKHRha2UoMSkpXG4gICAgICAgIC5zdWJzY3JpYmUob3B0aW9ucyA9PiB7XG4gICAgICAgICAgLy8gQ3JlYXRlIHRoZSBvYmplY3Qgb3V0c2lkZSB0aGUgem9uZSBzbyBpdHMgZXZlbnRzIGRvbid0IHRyaWdnZXIgY2hhbmdlIGRldGVjdGlvbi5cbiAgICAgICAgICAvLyBXZSdsbCBicmluZyBpdCBiYWNrIGluIGluc2lkZSB0aGUgYE1hcEV2ZW50TWFuYWdlcmAgb25seSBmb3IgdGhlIGV2ZW50cyB0aGF0IHRoZVxuICAgICAgICAgIC8vIHVzZXIgaGFzIHN1YnNjcmliZWQgdG8uXG4gICAgICAgICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+ICh0aGlzLnBvbHlsaW5lID0gbmV3IGdvb2dsZS5tYXBzLlBvbHlsaW5lKG9wdGlvbnMpKSk7XG4gICAgICAgICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICAgICAgICB0aGlzLnBvbHlsaW5lLnNldE1hcCh0aGlzLl9tYXAuZ29vZ2xlTWFwISk7XG4gICAgICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLnNldFRhcmdldCh0aGlzLnBvbHlsaW5lKTtcbiAgICAgICAgfSk7XG5cbiAgICAgIHRoaXMuX3dhdGNoRm9yT3B0aW9uc0NoYW5nZXMoKTtcbiAgICAgIHRoaXMuX3dhdGNoRm9yUGF0aENoYW5nZXMoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZGVzdHJveSgpO1xuICAgIHRoaXMuX2Rlc3Ryb3llZC5uZXh0KCk7XG4gICAgdGhpcy5fZGVzdHJveWVkLmNvbXBsZXRlKCk7XG4gICAgaWYgKHRoaXMucG9seWxpbmUpIHtcbiAgICAgIHRoaXMucG9seWxpbmUuc2V0TWFwKG51bGwpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI1BvbHlsaW5lLmdldERyYWdnYWJsZVxuICAgKi9cbiAgZ2V0RHJhZ2dhYmxlKCk6IGJvb2xlYW4ge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMucG9seWxpbmUuZ2V0RHJhZ2dhYmxlKCk7XG4gIH1cblxuICAvKipcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNQb2x5bGluZS5nZXRFZGl0YWJsZVxuICAgKi9cbiAgZ2V0RWRpdGFibGUoKTogYm9vbGVhbiB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5wb2x5bGluZS5nZXRFZGl0YWJsZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jUG9seWxpbmUuZ2V0UGF0aFxuICAgKi9cbiAgZ2V0UGF0aCgpOiBnb29nbGUubWFwcy5NVkNBcnJheTxnb29nbGUubWFwcy5MYXRMbmc+IHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLnBvbHlsaW5lLmdldFBhdGgoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI1BvbHlsaW5lLmdldFZpc2libGVcbiAgICovXG4gIGdldFZpc2libGUoKTogYm9vbGVhbiB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5wb2x5bGluZS5nZXRWaXNpYmxlKCk7XG4gIH1cblxuICBwcml2YXRlIF9jb21iaW5lT3B0aW9ucygpOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLlBvbHlsaW5lT3B0aW9ucz4ge1xuICAgIHJldHVybiBjb21iaW5lTGF0ZXN0KFt0aGlzLl9vcHRpb25zLCB0aGlzLl9wYXRoXSkucGlwZShcbiAgICAgIG1hcCgoW29wdGlvbnMsIHBhdGhdKSA9PiB7XG4gICAgICAgIGNvbnN0IGNvbWJpbmVkT3B0aW9uczogZ29vZ2xlLm1hcHMuUG9seWxpbmVPcHRpb25zID0ge1xuICAgICAgICAgIC4uLm9wdGlvbnMsXG4gICAgICAgICAgcGF0aDogcGF0aCB8fCBvcHRpb25zLnBhdGgsXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBjb21iaW5lZE9wdGlvbnM7XG4gICAgICB9KSxcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBfd2F0Y2hGb3JPcHRpb25zQ2hhbmdlcygpIHtcbiAgICB0aGlzLl9vcHRpb25zLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpLnN1YnNjcmliZShvcHRpb25zID0+IHtcbiAgICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgICB0aGlzLnBvbHlsaW5lLnNldE9wdGlvbnMob3B0aW9ucyk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF93YXRjaEZvclBhdGhDaGFuZ2VzKCkge1xuICAgIHRoaXMuX3BhdGgucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKHBhdGggPT4ge1xuICAgICAgaWYgKHBhdGgpIHtcbiAgICAgICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICAgICAgdGhpcy5wb2x5bGluZS5zZXRQYXRoKHBhdGgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfYXNzZXJ0SW5pdGlhbGl6ZWQoKTogYXNzZXJ0cyB0aGlzIGlzIHtwb2x5bGluZTogZ29vZ2xlLm1hcHMuUG9seWxpbmV9IHtcbiAgICBpZiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSB7XG4gICAgICBpZiAoIXRoaXMuX21hcC5nb29nbGVNYXApIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICAgJ0Nhbm5vdCBhY2Nlc3MgR29vZ2xlIE1hcCBpbmZvcm1hdGlvbiBiZWZvcmUgdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZC4gJyArXG4gICAgICAgICAgICAnUGxlYXNlIHdhaXQgZm9yIHRoZSBBUEkgdG8gbG9hZCBiZWZvcmUgdHJ5aW5nIHRvIGludGVyYWN0IHdpdGggaXQuJyxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5wb2x5bGluZSkge1xuICAgICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICAnQ2Fubm90IGludGVyYWN0IHdpdGggYSBHb29nbGUgTWFwIFBvbHlsaW5lIGJlZm9yZSBpdCBoYXMgYmVlbiAnICtcbiAgICAgICAgICAgICdpbml0aWFsaXplZC4gUGxlYXNlIHdhaXQgZm9yIHRoZSBQb2x5bGluZSB0byBsb2FkIGJlZm9yZSB0cnlpbmcgdG8gaW50ZXJhY3Qgd2l0aCBpdC4nLFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19