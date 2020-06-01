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
let MapPolyline = /** @class */ (() => {
    class MapPolyline {
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
    return MapPolyline;
})();
export { MapPolyline };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLXBvbHlsaW5lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2dvb2dsZS1tYXBzL21hcC1wb2x5bGluZS9tYXAtcG9seWxpbmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgseUVBQXlFO0FBQ3pFLG9DQUFvQztBQUVwQyxPQUFPLEVBQ0wsU0FBUyxFQUNULEtBQUssRUFHTCxNQUFNLEVBQ04sTUFBTSxHQUNQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxlQUFlLEVBQUUsYUFBYSxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDekUsT0FBTyxFQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFcEQsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQ25ELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUVyRDs7OztHQUlHO0FBQ0g7SUFBQSxNQUdhLFdBQVc7UUF3R3RCLFlBQ21CLElBQWUsRUFDeEIsT0FBZTtZQUROLFNBQUksR0FBSixJQUFJLENBQVc7WUFDeEIsWUFBTyxHQUFQLE9BQU8sQ0FBUTtZQXpHakIsa0JBQWEsR0FBRyxJQUFJLGVBQWUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDekMsYUFBUSxHQUFHLElBQUksZUFBZSxDQUE4QixFQUFFLENBQUMsQ0FBQztZQUNoRSxVQUFLLEdBQ2xCLElBQUksZUFBZSxDQUN3QyxTQUFTLENBQUMsQ0FBQztZQUV6RCxlQUFVLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQztZQW9CbEQ7O2VBRUc7WUFFSCxrQkFBYSxHQUNULElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUE2QixPQUFPLENBQUMsQ0FBQztZQUUzRTs7ZUFFRztZQUVILHFCQUFnQixHQUNaLElBQUksQ0FB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QUVPLG9CQUFvQjtZQUMxQixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUMzRCxJQUFJLElBQUksRUFBRTtvQkFDUixJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztvQkFDMUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQzdCO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBRU8sa0JBQWtCO1lBQ3hCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtnQkFDeEIsTUFBTSxLQUFLLENBQ1AsNEVBQTRFO29CQUM1RSxvRUFBb0UsQ0FBQyxDQUFDO2FBQzNFO1lBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ2xCLE1BQU0sS0FBSyxDQUNQLGdFQUFnRTtvQkFDaEUsc0ZBQXNGLENBQUMsQ0FBQzthQUM3RjtRQUNILENBQUM7OztnQkFoTkYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxjQUFjO2lCQUN6Qjs7OztnQkFWTyxTQUFTO2dCQUxmLE1BQU07OzswQkFnQ0wsS0FBSzt1QkFLTCxLQUFLO2dDQVNMLE1BQU07bUNBT04sTUFBTTsrQkFPTixNQUFNO2tDQU9OLE1BQU07b0NBT04sTUFBTTtvQ0FPTixNQUFNO29DQU9OLE1BQU07bUNBT04sTUFBTTtvQ0FPTixNQUFNO2tDQU9OLE1BQU07cUNBT04sTUFBTTs7SUEwR1Qsa0JBQUM7S0FBQTtTQTlNWSxXQUFXIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8vIFdvcmthcm91bmQgZm9yOiBodHRwczovL2dpdGh1Yi5jb20vYmF6ZWxidWlsZC9ydWxlc19ub2RlanMvaXNzdWVzLzEyNjVcbi8vLyA8cmVmZXJlbmNlIHR5cGVzPVwiZ29vZ2xlbWFwc1wiIC8+XG5cbmltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgSW5wdXQsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIE5nWm9uZSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0JlaGF2aW9yU3ViamVjdCwgY29tYmluZUxhdGVzdCwgT2JzZXJ2YWJsZSwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge21hcCwgdGFrZSwgdGFrZVVudGlsfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7R29vZ2xlTWFwfSBmcm9tICcuLi9nb29nbGUtbWFwL2dvb2dsZS1tYXAnO1xuaW1wb3J0IHtNYXBFdmVudE1hbmFnZXJ9IGZyb20gJy4uL21hcC1ldmVudC1tYW5hZ2VyJztcblxuLyoqXG4gKiBBbmd1bGFyIGNvbXBvbmVudCB0aGF0IHJlbmRlcnMgYSBHb29nbGUgTWFwcyBQb2x5bGluZSB2aWEgdGhlIEdvb2dsZSBNYXBzIEphdmFTY3JpcHQgQVBJLlxuICpcbiAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jUG9seWxpbmVcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWFwLXBvbHlsaW5lJyxcbn0pXG5leHBvcnQgY2xhc3MgTWFwUG9seWxpbmUgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX2V2ZW50TWFuYWdlciA9IG5ldyBNYXBFdmVudE1hbmFnZXIodGhpcy5fbmdab25lKTtcbiAgcHJpdmF0ZSByZWFkb25seSBfb3B0aW9ucyA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Z29vZ2xlLm1hcHMuUG9seWxpbmVPcHRpb25zPih7fSk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX3BhdGggPVxuICAgICAgbmV3IEJlaGF2aW9yU3ViamVjdDxnb29nbGUubWFwcy5NVkNBcnJheTxnb29nbGUubWFwcy5MYXRMbmc+fGdvb2dsZS5tYXBzLkxhdExuZ1tdfFxuICAgICAgICAgICAgICAgICAgICAgICAgICBnb29nbGUubWFwcy5MYXRMbmdMaXRlcmFsW118dW5kZWZpbmVkPih1bmRlZmluZWQpO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgX2Rlc3Ryb3llZCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqXG4gICAqIFRoZSB1bmRlcmx5aW5nIGdvb2dsZS5tYXBzLlBvbHlsaW5lIG9iamVjdC5cbiAgICpcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNQb2x5bGluZVxuICAgKi9cbiAgcG9seWxpbmU/OiBnb29nbGUubWFwcy5Qb2x5bGluZTtcblxuICBASW5wdXQoKVxuICBzZXQgb3B0aW9ucyhvcHRpb25zOiBnb29nbGUubWFwcy5Qb2x5bGluZU9wdGlvbnMpIHtcbiAgICB0aGlzLl9vcHRpb25zLm5leHQob3B0aW9ucyB8fCB7fSk7XG4gIH1cblxuICBASW5wdXQoKVxuICBzZXQgcGF0aChwYXRoOiBnb29nbGUubWFwcy5NVkNBcnJheTxnb29nbGUubWFwcy5MYXRMbmc+fGdvb2dsZS5tYXBzLkxhdExuZ1tdfFxuICAgICAgICAgICBnb29nbGUubWFwcy5MYXRMbmdMaXRlcmFsW10pIHtcbiAgICB0aGlzLl9wYXRoLm5leHQocGF0aCk7XG4gIH1cblxuICAvKipcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNQb2x5bGluZS5jbGlja1xuICAgKi9cbiAgQE91dHB1dCgpXG4gIHBvbHlsaW5lQ2xpY2s6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuUG9seU1vdXNlRXZlbnQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Qb2x5TW91c2VFdmVudD4oJ2NsaWNrJyk7XG5cbiAgLyoqXG4gICAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jUG9seWxpbmUuZGJsY2xpY2tcbiAgICovXG4gIEBPdXRwdXQoKVxuICBwb2x5bGluZURibGNsaWNrOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLlBvbHlNb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuUG9seU1vdXNlRXZlbnQ+KCdkYmxjbGljaycpO1xuXG4gIC8qKlxuICAgKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI1BvbHlsaW5lLmRyYWdcbiAgICovXG4gIEBPdXRwdXQoKVxuICBwb2x5bGluZURyYWc6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+KCdkcmFnJyk7XG5cbiAgLyoqXG4gICAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jUG9seWxpbmUuZHJhZ2VuZFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIHBvbHlsaW5lRHJhZ2VuZDogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4oJ2RyYWdlbmQnKTtcblxuICAvKipcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNQb2x5bGluZS5kcmFnc3RhcnRcbiAgICovXG4gIEBPdXRwdXQoKVxuICBwb2x5bGluZURyYWdzdGFydDogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4oJ2RyYWdzdGFydCcpO1xuXG4gIC8qKlxuICAgKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI1BvbHlsaW5lLm1vdXNlZG93blxuICAgKi9cbiAgQE91dHB1dCgpXG4gIHBvbHlsaW5lTW91c2Vkb3duOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLlBvbHlNb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuUG9seU1vdXNlRXZlbnQ+KCdtb3VzZWRvd24nKTtcblxuICAvKipcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNQb2x5bGluZS5tb3VzZW1vdmVcbiAgICovXG4gIEBPdXRwdXQoKVxuICBwb2x5bGluZU1vdXNlbW92ZTogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Qb2x5TW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLlBvbHlNb3VzZUV2ZW50PignbW91c2Vtb3ZlJyk7XG5cbiAgLyoqXG4gICAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jUG9seWxpbmUubW91c2VvdXRcbiAgICovXG4gIEBPdXRwdXQoKVxuICBwb2x5bGluZU1vdXNlb3V0OiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLlBvbHlNb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuUG9seU1vdXNlRXZlbnQ+KCdtb3VzZW91dCcpO1xuXG4gIC8qKlxuICAgKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI1BvbHlsaW5lLm1vdXNlb3ZlclxuICAgKi9cbiAgQE91dHB1dCgpXG4gIHBvbHlsaW5lTW91c2VvdmVyOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLlBvbHlNb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuUG9seU1vdXNlRXZlbnQ+KCdtb3VzZW92ZXInKTtcblxuICAvKipcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNQb2x5bGluZS5tb3VzZXVwXG4gICAqL1xuICBAT3V0cHV0KClcbiAgcG9seWxpbmVNb3VzZXVwOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLlBvbHlNb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuUG9seU1vdXNlRXZlbnQ+KCdtb3VzZXVwJyk7XG5cbiAgLyoqXG4gICAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jUG9seWxpbmUucmlnaHRjbGlja1xuICAgKi9cbiAgQE91dHB1dCgpXG4gIHBvbHlsaW5lUmlnaHRjbGljazogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Qb2x5TW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLlBvbHlNb3VzZUV2ZW50PigncmlnaHRjbGljaycpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVhZG9ubHkgX21hcDogR29vZ2xlTWFwLFxuICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICh0aGlzLl9tYXAuX2lzQnJvd3Nlcikge1xuICAgICAgdGhpcy5fY29tYmluZU9wdGlvbnMoKS5waXBlKHRha2UoMSkpLnN1YnNjcmliZShvcHRpb25zID0+IHtcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBvYmplY3Qgb3V0c2lkZSB0aGUgem9uZSBzbyBpdHMgZXZlbnRzIGRvbid0IHRyaWdnZXIgY2hhbmdlIGRldGVjdGlvbi5cbiAgICAgICAgLy8gV2UnbGwgYnJpbmcgaXQgYmFjayBpbiBpbnNpZGUgdGhlIGBNYXBFdmVudE1hbmFnZXJgIG9ubHkgZm9yIHRoZSBldmVudHMgdGhhdCB0aGVcbiAgICAgICAgLy8gdXNlciBoYXMgc3Vic2NyaWJlZCB0by5cbiAgICAgICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHRoaXMucG9seWxpbmUgPSBuZXcgZ29vZ2xlLm1hcHMuUG9seWxpbmUob3B0aW9ucykpO1xuICAgICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgICB0aGlzLnBvbHlsaW5lLnNldE1hcCh0aGlzLl9tYXAuZ29vZ2xlTWFwISk7XG4gICAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5zZXRUYXJnZXQodGhpcy5wb2x5bGluZSk7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5fd2F0Y2hGb3JPcHRpb25zQ2hhbmdlcygpO1xuICAgICAgdGhpcy5fd2F0Y2hGb3JQYXRoQ2hhbmdlcygpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5kZXN0cm95KCk7XG4gICAgdGhpcy5fZGVzdHJveWVkLm5leHQoKTtcbiAgICB0aGlzLl9kZXN0cm95ZWQuY29tcGxldGUoKTtcbiAgICBpZiAodGhpcy5wb2x5bGluZSkge1xuICAgICAgdGhpcy5wb2x5bGluZS5zZXRNYXAobnVsbCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3BvbHlnb24jUG9seWxpbmUuZ2V0RHJhZ2dhYmxlXG4gICAqL1xuICBnZXREcmFnZ2FibGUoKTogYm9vbGVhbiB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5wb2x5bGluZS5nZXREcmFnZ2FibGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI1BvbHlsaW5lLmdldEVkaXRhYmxlXG4gICAqL1xuICBnZXRFZGl0YWJsZSgpOiBib29sZWFuIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLnBvbHlsaW5lLmdldEVkaXRhYmxlKCk7XG4gIH1cblxuICAvKipcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvcG9seWdvbiNQb2x5bGluZS5nZXRQYXRoXG4gICAqL1xuICBnZXRQYXRoKCk6IGdvb2dsZS5tYXBzLk1WQ0FycmF5PGdvb2dsZS5tYXBzLkxhdExuZz4ge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgLy8gQGJyZWFraW5nLWNoYW5nZSAxMS4wLjAgTWFrZSB0aGUgcmV0dXJuIHZhbHVlIG51bGxhYmxlLlxuICAgIHJldHVybiB0aGlzLnBvbHlsaW5lLmdldFBhdGgoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9wb2x5Z29uI1BvbHlsaW5lLmdldFZpc2libGVcbiAgICovXG4gIGdldFZpc2libGUoKTogYm9vbGVhbiB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5wb2x5bGluZS5nZXRWaXNpYmxlKCk7XG4gIH1cblxuICBwcml2YXRlIF9jb21iaW5lT3B0aW9ucygpOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLlBvbHlsaW5lT3B0aW9ucz4ge1xuICAgIHJldHVybiBjb21iaW5lTGF0ZXN0KFt0aGlzLl9vcHRpb25zLCB0aGlzLl9wYXRoXSkucGlwZShtYXAoKFtvcHRpb25zLCBwYXRoXSkgPT4ge1xuICAgICAgY29uc3QgY29tYmluZWRPcHRpb25zOiBnb29nbGUubWFwcy5Qb2x5bGluZU9wdGlvbnMgPSB7XG4gICAgICAgIC4uLm9wdGlvbnMsXG4gICAgICAgIHBhdGg6IHBhdGggfHwgb3B0aW9ucy5wYXRoLFxuICAgICAgfTtcbiAgICAgIHJldHVybiBjb21iaW5lZE9wdGlvbnM7XG4gICAgfSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBfd2F0Y2hGb3JPcHRpb25zQ2hhbmdlcygpIHtcbiAgICB0aGlzLl9vcHRpb25zLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpLnN1YnNjcmliZShvcHRpb25zID0+IHtcbiAgICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgICB0aGlzLnBvbHlsaW5lLnNldE9wdGlvbnMob3B0aW9ucyk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF93YXRjaEZvclBhdGhDaGFuZ2VzKCkge1xuICAgIHRoaXMuX3BhdGgucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKHBhdGggPT4ge1xuICAgICAgaWYgKHBhdGgpIHtcbiAgICAgICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICAgICAgdGhpcy5wb2x5bGluZS5zZXRQYXRoKHBhdGgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfYXNzZXJ0SW5pdGlhbGl6ZWQoKTogYXNzZXJ0cyB0aGlzIGlzIHtwb2x5bGluZTogZ29vZ2xlLm1hcHMuUG9seWxpbmV9IHtcbiAgICBpZiAoIXRoaXMuX21hcC5nb29nbGVNYXApIHtcbiAgICAgIHRocm93IEVycm9yKFxuICAgICAgICAgICdDYW5ub3QgYWNjZXNzIEdvb2dsZSBNYXAgaW5mb3JtYXRpb24gYmVmb3JlIHRoZSBBUEkgaGFzIGJlZW4gaW5pdGlhbGl6ZWQuICcgK1xuICAgICAgICAgICdQbGVhc2Ugd2FpdCBmb3IgdGhlIEFQSSB0byBsb2FkIGJlZm9yZSB0cnlpbmcgdG8gaW50ZXJhY3Qgd2l0aCBpdC4nKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLnBvbHlsaW5lKSB7XG4gICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICAnQ2Fubm90IGludGVyYWN0IHdpdGggYSBHb29nbGUgTWFwIFBvbHlsaW5lIGJlZm9yZSBpdCBoYXMgYmVlbiAnICtcbiAgICAgICAgICAnaW5pdGlhbGl6ZWQuIFBsZWFzZSB3YWl0IGZvciB0aGUgUG9seWxpbmUgdG8gbG9hZCBiZWZvcmUgdHJ5aW5nIHRvIGludGVyYWN0IHdpdGggaXQuJyk7XG4gICAgfVxuICB9XG59XG4iXX0=