/**
 * @fileoverview added by tsickle
 * Generated from: src/google-maps/map-info-window/map-info-window.ts
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
import { Directive, ElementRef, Input, NgZone, Output, } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { GoogleMap } from '../google-map/google-map';
import { MapEventManager } from '../map-event-manager';
/**
 * Angular component that renders a Google Maps info window via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/info-window
 */
let MapInfoWindow = /** @class */ (() => {
    /**
     * Angular component that renders a Google Maps info window via the Google Maps JavaScript API.
     *
     * See developers.google.com/maps/documentation/javascript/reference/info-window
     */
    class MapInfoWindow {
        /**
         * @param {?} _googleMap
         * @param {?} _elementRef
         * @param {?} _ngZone
         */
        constructor(_googleMap, _elementRef, _ngZone) {
            this._googleMap = _googleMap;
            this._elementRef = _elementRef;
            this._ngZone = _ngZone;
            this._eventManager = new MapEventManager(this._ngZone);
            this._options = new BehaviorSubject({});
            this._position = new BehaviorSubject(undefined);
            this._destroy = new Subject();
            /**
             * See
             * developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.closeclick
             */
            this.closeclick = this._eventManager.getLazyEmitter('closeclick');
            /**
             * See
             * developers.google.com/maps/documentation/javascript/reference/info-window
             * #InfoWindow.content_changed
             */
            this.contentChanged = this._eventManager.getLazyEmitter('content_changed');
            /**
             * See
             * developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.domready
             */
            this.domready = this._eventManager.getLazyEmitter('domready');
            /**
             * See
             * developers.google.com/maps/documentation/javascript/reference/info-window
             * #InfoWindow.position_changed
             */
            this.positionChanged = this._eventManager.getLazyEmitter('position_changed');
            /**
             * See
             * developers.google.com/maps/documentation/javascript/reference/info-window
             * #InfoWindow.zindex_changed
             */
            this.zindexChanged = this._eventManager.getLazyEmitter('zindex_changed');
        }
        /**
         * @param {?} options
         * @return {?}
         */
        set options(options) {
            this._options.next(options || {});
        }
        /**
         * @param {?} position
         * @return {?}
         */
        set position(position) {
            this._position.next(position);
        }
        /**
         * @return {?}
         */
        ngOnInit() {
            if (this._googleMap._isBrowser) {
                /** @type {?} */
                const combinedOptionsChanges = this._combineOptions();
                combinedOptionsChanges.pipe(take(1)).subscribe((/**
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
                        this.infoWindow = new google.maps.InfoWindow(options);
                    }));
                    this._eventManager.setTarget(this.infoWindow);
                }));
                this._watchForOptionsChanges();
                this._watchForPositionChanges();
            }
        }
        /**
         * @return {?}
         */
        ngOnDestroy() {
            this._eventManager.destroy();
            this._destroy.next();
            this._destroy.complete();
            // If no info window has been created on the server, we do not try closing it.
            // On the server, an info window cannot be created and this would cause errors.
            if (this.infoWindow) {
                this.close();
            }
        }
        /**
         * See developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.close
         * @return {?}
         */
        close() {
            this._assertInitialized();
            this.infoWindow.close();
        }
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.getContent
         * @return {?}
         */
        getContent() {
            this._assertInitialized();
            return this.infoWindow.getContent();
        }
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/info-window
         * #InfoWindow.getPosition
         * @return {?}
         */
        getPosition() {
            this._assertInitialized();
            return this.infoWindow.getPosition();
        }
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.getZIndex
         * @return {?}
         */
        getZIndex() {
            this._assertInitialized();
            return this.infoWindow.getZIndex();
        }
        /**
         * Opens the MapInfoWindow using the provided MapMarker as the anchor. If the anchor is not set,
         * then the position property of the options input is used instead.
         * @param {?=} anchor
         * @return {?}
         */
        open(anchor) {
            this._assertInitialized();
            /** @type {?} */
            const marker = anchor ? anchor.marker : undefined;
            this._elementRef.nativeElement.style.display = '';
            this.infoWindow.open(this._googleMap.googleMap, marker);
        }
        /**
         * @private
         * @return {?}
         */
        _combineOptions() {
            return combineLatest([this._options, this._position]).pipe(map((/**
             * @param {?} __0
             * @return {?}
             */
            ([options, position]) => {
                /** @type {?} */
                const combinedOptions = Object.assign(Object.assign({}, options), { position: position || options.position, content: this._elementRef.nativeElement });
                return combinedOptions;
            })));
        }
        /**
         * @private
         * @return {?}
         */
        _watchForOptionsChanges() {
            this._options.pipe(takeUntil(this._destroy)).subscribe((/**
             * @param {?} options
             * @return {?}
             */
            options => {
                this._assertInitialized();
                this.infoWindow.setOptions(options);
            }));
        }
        /**
         * @private
         * @return {?}
         */
        _watchForPositionChanges() {
            this._position.pipe(takeUntil(this._destroy)).subscribe((/**
             * @param {?} position
             * @return {?}
             */
            position => {
                if (position) {
                    this._assertInitialized();
                    this.infoWindow.setPosition(position);
                }
            }));
        }
        /**
         * @private
         * @return {?}
         */
        _assertInitialized() {
            if (!this._googleMap.googleMap) {
                throw Error('Cannot access Google Map information before the API has been initialized. ' +
                    'Please wait for the API to load before trying to interact with it.');
            }
            if (!this.infoWindow) {
                throw Error('Cannot interact with a Google Map Info Window before it has been ' +
                    'initialized. Please wait for the Info Window to load before trying to interact with ' +
                    'it.');
            }
        }
    }
    MapInfoWindow.decorators = [
        { type: Directive, args: [{
                    selector: 'map-info-window',
                    host: { 'style': 'display: none' },
                },] }
    ];
    /** @nocollapse */
    MapInfoWindow.ctorParameters = () => [
        { type: GoogleMap },
        { type: ElementRef },
        { type: NgZone }
    ];
    MapInfoWindow.propDecorators = {
        options: [{ type: Input }],
        position: [{ type: Input }],
        closeclick: [{ type: Output }],
        contentChanged: [{ type: Output }],
        domready: [{ type: Output }],
        positionChanged: [{ type: Output }],
        zindexChanged: [{ type: Output }]
    };
    return MapInfoWindow;
})();
export { MapInfoWindow };
if (false) {
    /**
     * @type {?}
     * @private
     */
    MapInfoWindow.prototype._eventManager;
    /**
     * @type {?}
     * @private
     */
    MapInfoWindow.prototype._options;
    /**
     * @type {?}
     * @private
     */
    MapInfoWindow.prototype._position;
    /**
     * @type {?}
     * @private
     */
    MapInfoWindow.prototype._destroy;
    /**
     * Underlying google.maps.InfoWindow
     *
     * See developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow
     * @type {?}
     */
    MapInfoWindow.prototype.infoWindow;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.closeclick
     * @type {?}
     */
    MapInfoWindow.prototype.closeclick;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/info-window
     * #InfoWindow.content_changed
     * @type {?}
     */
    MapInfoWindow.prototype.contentChanged;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.domready
     * @type {?}
     */
    MapInfoWindow.prototype.domready;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/info-window
     * #InfoWindow.position_changed
     * @type {?}
     */
    MapInfoWindow.prototype.positionChanged;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/info-window
     * #InfoWindow.zindex_changed
     * @type {?}
     */
    MapInfoWindow.prototype.zindexChanged;
    /**
     * @type {?}
     * @private
     */
    MapInfoWindow.prototype._googleMap;
    /**
     * @type {?}
     * @private
     */
    MapInfoWindow.prototype._elementRef;
    /**
     * @type {?}
     * @private
     */
    MapInfoWindow.prototype._ngZone;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWluZm8td2luZG93LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2dvb2dsZS1tYXBzL21hcC1pbmZvLXdpbmRvdy9tYXAtaW5mby13aW5kb3cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFTQSxvQ0FBb0M7Ozs7Ozs7Ozs7QUFFcEMsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsS0FBSyxFQUNMLE1BQU0sRUFHTixNQUFNLEdBQ1AsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLGVBQWUsRUFBRSxhQUFhLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUN6RSxPQUFPLEVBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUVwRCxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDbkQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHNCQUFzQixDQUFDOzs7Ozs7QUFRckQ7Ozs7OztJQUFBLE1BSWEsYUFBYTs7Ozs7O1FBNER4QixZQUE2QixVQUFxQixFQUM5QixXQUFvQyxFQUNwQyxPQUFlO1lBRk4sZUFBVSxHQUFWLFVBQVUsQ0FBVztZQUM5QixnQkFBVyxHQUFYLFdBQVcsQ0FBeUI7WUFDcEMsWUFBTyxHQUFQLE9BQU8sQ0FBUTtZQTdEM0Isa0JBQWEsR0FBRyxJQUFJLGVBQWUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDekMsYUFBUSxHQUFHLElBQUksZUFBZSxDQUFnQyxFQUFFLENBQUMsQ0FBQztZQUNsRSxjQUFTLEdBQ3RCLElBQUksZUFBZSxDQUF5RCxTQUFTLENBQUMsQ0FBQztZQUMxRSxhQUFRLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQzs7Ozs7WUF1QnRDLGVBQVUsR0FBcUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQU8sWUFBWSxDQUFDLENB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QztvQkFDMUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7aUJBQ3ZDO1lBQ0gsQ0FBQyxFQUFDLENBQUM7UUFDTCxDQUFDOzs7OztRQUVPLGtCQUFrQjtZQUN4QixJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUU7Z0JBQzlCLE1BQU0sS0FBSyxDQUNQLDRFQUE0RTtvQkFDNUUsb0VBQW9FLENBQUMsQ0FBQzthQUMzRTtZQUNELElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFO2dCQUNwQixNQUFNLEtBQUssQ0FDUCxtRUFBbUU7b0JBQ25FLHNGQUFzRjtvQkFDdEYsS0FBSyxDQUFDLENBQUM7YUFDWjtRQUNILENBQUM7OztnQkExTEYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxpQkFBaUI7b0JBQzNCLElBQUksRUFBRSxFQUFDLE9BQU8sRUFBRSxlQUFlLEVBQUM7aUJBQ2pDOzs7O2dCQVpPLFNBQVM7Z0JBVmYsVUFBVTtnQkFFVixNQUFNOzs7MEJBbUNMLEtBQUs7MkJBS0wsS0FBSzs2QkFTTCxNQUFNO2lDQU9OLE1BQU07MkJBT04sTUFBTTtrQ0FPTixNQUFNO2dDQVFOLE1BQU07O0lBOEhULG9CQUFDO0tBQUE7U0F2TFksYUFBYTs7Ozs7O0lBQ3hCLHNDQUEwRDs7Ozs7SUFDMUQsaUNBQW1GOzs7OztJQUNuRixrQ0FDMkY7Ozs7O0lBQzNGLGlDQUFnRDs7Ozs7OztJQU9oRCxtQ0FBb0M7Ozs7OztJQWdCcEMsbUNBQStGOzs7Ozs7O0lBTy9GLHVDQUM4Rjs7Ozs7O0lBTTlGLGlDQUEyRjs7Ozs7OztJQU8zRix3Q0FDZ0c7Ozs7Ozs7SUFPaEcsc0NBQzRGOzs7OztJQUVoRixtQ0FBc0M7Ozs7O0lBQ3RDLG9DQUE0Qzs7Ozs7SUFDNUMsZ0NBQXVCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8vIFdvcmthcm91bmQgZm9yOiBodHRwczovL2dpdGh1Yi5jb20vYmF6ZWxidWlsZC9ydWxlc19ub2RlanMvaXNzdWVzLzEyNjVcbi8vLyA8cmVmZXJlbmNlIHR5cGVzPVwiZ29vZ2xlbWFwc1wiIC8+XG5cbmltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE91dHB1dCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0JlaGF2aW9yU3ViamVjdCwgY29tYmluZUxhdGVzdCwgT2JzZXJ2YWJsZSwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge21hcCwgdGFrZSwgdGFrZVVudGlsfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7R29vZ2xlTWFwfSBmcm9tICcuLi9nb29nbGUtbWFwL2dvb2dsZS1tYXAnO1xuaW1wb3J0IHtNYXBFdmVudE1hbmFnZXJ9IGZyb20gJy4uL21hcC1ldmVudC1tYW5hZ2VyJztcbmltcG9ydCB7TWFwTWFya2VyfSBmcm9tICcuLi9tYXAtbWFya2VyL21hcC1tYXJrZXInO1xuXG4vKipcbiAqIEFuZ3VsYXIgY29tcG9uZW50IHRoYXQgcmVuZGVycyBhIEdvb2dsZSBNYXBzIGluZm8gd2luZG93IHZpYSB0aGUgR29vZ2xlIE1hcHMgSmF2YVNjcmlwdCBBUEkuXG4gKlxuICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvaW5mby13aW5kb3dcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWFwLWluZm8td2luZG93JyxcbiAgaG9zdDogeydzdHlsZSc6ICdkaXNwbGF5OiBub25lJ30sXG59KVxuZXhwb3J0IGNsYXNzIE1hcEluZm9XaW5kb3cgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX2V2ZW50TWFuYWdlciA9IG5ldyBNYXBFdmVudE1hbmFnZXIodGhpcy5fbmdab25lKTtcbiAgcHJpdmF0ZSByZWFkb25seSBfb3B0aW9ucyA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Z29vZ2xlLm1hcHMuSW5mb1dpbmRvd09wdGlvbnM+KHt9KTtcbiAgcHJpdmF0ZSByZWFkb25seSBfcG9zaXRpb24gPVxuICAgICAgbmV3IEJlaGF2aW9yU3ViamVjdDxnb29nbGUubWFwcy5MYXRMbmdMaXRlcmFsfGdvb2dsZS5tYXBzLkxhdExuZ3x1bmRlZmluZWQ+KHVuZGVmaW5lZCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2Rlc3Ryb3kgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKlxuICAgKiBVbmRlcmx5aW5nIGdvb2dsZS5tYXBzLkluZm9XaW5kb3dcbiAgICpcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvaW5mby13aW5kb3cjSW5mb1dpbmRvd1xuICAgKi9cbiAgaW5mb1dpbmRvdz86IGdvb2dsZS5tYXBzLkluZm9XaW5kb3c7XG5cbiAgQElucHV0KClcbiAgc2V0IG9wdGlvbnMob3B0aW9uczogZ29vZ2xlLm1hcHMuSW5mb1dpbmRvd09wdGlvbnMpIHtcbiAgICB0aGlzLl9vcHRpb25zLm5leHQob3B0aW9ucyB8fCB7fSk7XG4gIH1cblxuICBASW5wdXQoKVxuICBzZXQgcG9zaXRpb24ocG9zaXRpb246IGdvb2dsZS5tYXBzLkxhdExuZ0xpdGVyYWx8Z29vZ2xlLm1hcHMuTGF0TG5nKSB7XG4gICAgdGhpcy5fcG9zaXRpb24ubmV4dChwb3NpdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvaW5mby13aW5kb3cjSW5mb1dpbmRvdy5jbG9zZWNsaWNrXG4gICAqL1xuICBAT3V0cHV0KCkgY2xvc2VjbGljazogT2JzZXJ2YWJsZTx2b2lkPiA9IHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPignY2xvc2VjbGljaycpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9pbmZvLXdpbmRvd1xuICAgKiAjSW5mb1dpbmRvdy5jb250ZW50X2NoYW5nZWRcbiAgICovXG4gIEBPdXRwdXQoKVxuICBjb250ZW50Q2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9IHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPignY29udGVudF9jaGFuZ2VkJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2luZm8td2luZG93I0luZm9XaW5kb3cuZG9tcmVhZHlcbiAgICovXG4gIEBPdXRwdXQoKSBkb21yZWFkeTogT2JzZXJ2YWJsZTx2b2lkPiA9IHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPignZG9tcmVhZHknKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvaW5mby13aW5kb3dcbiAgICogI0luZm9XaW5kb3cucG9zaXRpb25fY2hhbmdlZFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIHBvc2l0aW9uQ2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9IHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPigncG9zaXRpb25fY2hhbmdlZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9pbmZvLXdpbmRvd1xuICAgKiAjSW5mb1dpbmRvdy56aW5kZXhfY2hhbmdlZFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIHppbmRleENoYW5nZWQ6IE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ3ppbmRleF9jaGFuZ2VkJyk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBfZ29vZ2xlTWFwOiBHb29nbGVNYXAsXG4gICAgICAgICAgICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgICAgICAgICAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSkge31cblxuICBuZ09uSW5pdCgpIHtcbiAgICBpZiAodGhpcy5fZ29vZ2xlTWFwLl9pc0Jyb3dzZXIpIHtcbiAgICAgIGNvbnN0IGNvbWJpbmVkT3B0aW9uc0NoYW5nZXMgPSB0aGlzLl9jb21iaW5lT3B0aW9ucygpO1xuXG4gICAgICBjb21iaW5lZE9wdGlvbnNDaGFuZ2VzLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKG9wdGlvbnMgPT4ge1xuICAgICAgICAvLyBDcmVhdGUgdGhlIG9iamVjdCBvdXRzaWRlIHRoZSB6b25lIHNvIGl0cyBldmVudHMgZG9uJ3QgdHJpZ2dlciBjaGFuZ2UgZGV0ZWN0aW9uLlxuICAgICAgICAvLyBXZSdsbCBicmluZyBpdCBiYWNrIGluIGluc2lkZSB0aGUgYE1hcEV2ZW50TWFuYWdlcmAgb25seSBmb3IgdGhlIGV2ZW50cyB0aGF0IHRoZVxuICAgICAgICAvLyB1c2VyIGhhcyBzdWJzY3JpYmVkIHRvLlxuICAgICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuaW5mb1dpbmRvdyA9IG5ldyBnb29nbGUubWFwcy5JbmZvV2luZG93KG9wdGlvbnMpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLl9ldmVudE1hbmFnZXIuc2V0VGFyZ2V0KHRoaXMuaW5mb1dpbmRvdyk7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5fd2F0Y2hGb3JPcHRpb25zQ2hhbmdlcygpO1xuICAgICAgdGhpcy5fd2F0Y2hGb3JQb3NpdGlvbkNoYW5nZXMoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZGVzdHJveSgpO1xuICAgIHRoaXMuX2Rlc3Ryb3kubmV4dCgpO1xuICAgIHRoaXMuX2Rlc3Ryb3kuY29tcGxldGUoKTtcblxuICAgIC8vIElmIG5vIGluZm8gd2luZG93IGhhcyBiZWVuIGNyZWF0ZWQgb24gdGhlIHNlcnZlciwgd2UgZG8gbm90IHRyeSBjbG9zaW5nIGl0LlxuICAgIC8vIE9uIHRoZSBzZXJ2ZXIsIGFuIGluZm8gd2luZG93IGNhbm5vdCBiZSBjcmVhdGVkIGFuZCB0aGlzIHdvdWxkIGNhdXNlIGVycm9ycy5cbiAgICBpZiAodGhpcy5pbmZvV2luZG93KSB7XG4gICAgICB0aGlzLmNsb3NlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2luZm8td2luZG93I0luZm9XaW5kb3cuY2xvc2VcbiAgICovXG4gIGNsb3NlKCkge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgdGhpcy5pbmZvV2luZG93LmNsb3NlKCk7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvaW5mby13aW5kb3cjSW5mb1dpbmRvdy5nZXRDb250ZW50XG4gICAqL1xuICBnZXRDb250ZW50KCk6IHN0cmluZ3xOb2RlIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmluZm9XaW5kb3cuZ2V0Q29udGVudCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2luZm8td2luZG93XG4gICAqICNJbmZvV2luZG93LmdldFBvc2l0aW9uXG4gICAqL1xuICBnZXRQb3NpdGlvbigpOiBnb29nbGUubWFwcy5MYXRMbmd8bnVsbCB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5pbmZvV2luZG93LmdldFBvc2l0aW9uKCk7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvaW5mby13aW5kb3cjSW5mb1dpbmRvdy5nZXRaSW5kZXhcbiAgICovXG4gIGdldFpJbmRleCgpOiBudW1iZXIge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMuaW5mb1dpbmRvdy5nZXRaSW5kZXgoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPcGVucyB0aGUgTWFwSW5mb1dpbmRvdyB1c2luZyB0aGUgcHJvdmlkZWQgTWFwTWFya2VyIGFzIHRoZSBhbmNob3IuIElmIHRoZSBhbmNob3IgaXMgbm90IHNldCxcbiAgICogdGhlbiB0aGUgcG9zaXRpb24gcHJvcGVydHkgb2YgdGhlIG9wdGlvbnMgaW5wdXQgaXMgdXNlZCBpbnN0ZWFkLlxuICAgKi9cbiAgb3BlbihhbmNob3I/OiBNYXBNYXJrZXIpIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIGNvbnN0IG1hcmtlciA9IGFuY2hvciA/IGFuY2hvci5tYXJrZXIgOiB1bmRlZmluZWQ7XG4gICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnJztcbiAgICB0aGlzLmluZm9XaW5kb3cub3Blbih0aGlzLl9nb29nbGVNYXAuZ29vZ2xlTWFwLCBtYXJrZXIpO1xuICB9XG5cbiAgcHJpdmF0ZSBfY29tYmluZU9wdGlvbnMoKTogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5JbmZvV2luZG93T3B0aW9ucz4ge1xuICAgIHJldHVybiBjb21iaW5lTGF0ZXN0KFt0aGlzLl9vcHRpb25zLCB0aGlzLl9wb3NpdGlvbl0pLnBpcGUobWFwKChbb3B0aW9ucywgcG9zaXRpb25dKSA9PiB7XG4gICAgICBjb25zdCBjb21iaW5lZE9wdGlvbnM6IGdvb2dsZS5tYXBzLkluZm9XaW5kb3dPcHRpb25zID0ge1xuICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgICBwb3NpdGlvbjogcG9zaXRpb24gfHwgb3B0aW9ucy5wb3NpdGlvbixcbiAgICAgICAgY29udGVudDogdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LFxuICAgICAgfTtcbiAgICAgIHJldHVybiBjb21iaW5lZE9wdGlvbnM7XG4gICAgfSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBfd2F0Y2hGb3JPcHRpb25zQ2hhbmdlcygpIHtcbiAgICB0aGlzLl9vcHRpb25zLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kpKS5zdWJzY3JpYmUob3B0aW9ucyA9PiB7XG4gICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgdGhpcy5pbmZvV2luZG93LnNldE9wdGlvbnMob3B0aW9ucyk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF93YXRjaEZvclBvc2l0aW9uQ2hhbmdlcygpIHtcbiAgICB0aGlzLl9wb3NpdGlvbi5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95KSkuc3Vic2NyaWJlKHBvc2l0aW9uID0+IHtcbiAgICAgIGlmIChwb3NpdGlvbikge1xuICAgICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgICB0aGlzLmluZm9XaW5kb3cuc2V0UG9zaXRpb24ocG9zaXRpb24pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfYXNzZXJ0SW5pdGlhbGl6ZWQoKTogYXNzZXJ0cyB0aGlzIGlzIHtpbmZvV2luZG93OiBnb29nbGUubWFwcy5JbmZvV2luZG93fSB7XG4gICAgaWYgKCF0aGlzLl9nb29nbGVNYXAuZ29vZ2xlTWFwKSB7XG4gICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICAnQ2Fubm90IGFjY2VzcyBHb29nbGUgTWFwIGluZm9ybWF0aW9uIGJlZm9yZSB0aGUgQVBJIGhhcyBiZWVuIGluaXRpYWxpemVkLiAnICtcbiAgICAgICAgICAnUGxlYXNlIHdhaXQgZm9yIHRoZSBBUEkgdG8gbG9hZCBiZWZvcmUgdHJ5aW5nIHRvIGludGVyYWN0IHdpdGggaXQuJyk7XG4gICAgfVxuICAgIGlmICghdGhpcy5pbmZvV2luZG93KSB7XG4gICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICAnQ2Fubm90IGludGVyYWN0IHdpdGggYSBHb29nbGUgTWFwIEluZm8gV2luZG93IGJlZm9yZSBpdCBoYXMgYmVlbiAnICtcbiAgICAgICAgICAnaW5pdGlhbGl6ZWQuIFBsZWFzZSB3YWl0IGZvciB0aGUgSW5mbyBXaW5kb3cgdG8gbG9hZCBiZWZvcmUgdHJ5aW5nIHRvIGludGVyYWN0IHdpdGggJyArXG4gICAgICAgICAgJ2l0LicpO1xuICAgIH1cbiAgfVxufVxuIl19