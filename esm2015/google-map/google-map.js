/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="googlemaps" />
import { ChangeDetectionStrategy, Component, ElementRef, Input, Output, ViewEncapsulation, Inject, PLATFORM_ID, NgZone, } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { MapEventManager } from '../map-event-manager';
/** default options set to the Googleplex */
export const DEFAULT_OPTIONS = {
    center: { lat: 37.421995, lng: -122.084092 },
    zoom: 17,
    // Note: the type conversion here isn't necessary for our CI, but it resolves a g3 failure.
    mapTypeId: 'roadmap'
};
/** Arbitrary default height for the map element */
export const DEFAULT_HEIGHT = '500px';
/** Arbitrary default width for the map element */
export const DEFAULT_WIDTH = '500px';
/**
 * Angular component that renders a Google Map via the Google Maps JavaScript
 * API.
 * @see https://developers.google.com/maps/documentation/javascript/reference/
 */
export class GoogleMap {
    constructor(_elementRef, _ngZone, platformId) {
        this._elementRef = _elementRef;
        this._ngZone = _ngZone;
        this._eventManager = new MapEventManager(this._ngZone);
        /** Height of the map. Set this to `null` if you'd like to control the height through CSS. */
        this.height = DEFAULT_HEIGHT;
        /** Width of the map. Set this to `null` if you'd like to control the width through CSS. */
        this.width = DEFAULT_WIDTH;
        this._options = DEFAULT_OPTIONS;
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.bounds_changed
         */
        this.boundsChanged = this._eventManager.getLazyEmitter('bounds_changed');
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.center_changed
         */
        this.centerChanged = this._eventManager.getLazyEmitter('center_changed');
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.click
         */
        this.mapClick = this._eventManager
            .getLazyEmitter('click');
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.dblclick
         */
        this.mapDblclick = this._eventManager.getLazyEmitter('dblclick');
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.drag
         */
        this.mapDrag = this._eventManager.getLazyEmitter('drag');
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.dragend
         */
        this.mapDragend = this._eventManager.getLazyEmitter('dragend');
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.dragstart
         */
        this.mapDragstart = this._eventManager.getLazyEmitter('dragstart');
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.heading_changed
         */
        this.headingChanged = this._eventManager.getLazyEmitter('heading_changed');
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.idle
         */
        this.idle = this._eventManager.getLazyEmitter('idle');
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.maptypeid_changed
         */
        this.maptypeidChanged = this._eventManager.getLazyEmitter('maptypeid_changed');
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.mousemove
         */
        this.mapMousemove = this._eventManager.getLazyEmitter('mousemove');
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.mouseout
         */
        this.mapMouseout = this._eventManager.getLazyEmitter('mouseout');
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.mouseover
         */
        this.mapMouseover = this._eventManager.getLazyEmitter('mouseover');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/map#Map.projection_changed
         */
        this.projectionChanged = this._eventManager.getLazyEmitter('projection_changed');
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.rightclick
         */
        this.mapRightclick = this._eventManager.getLazyEmitter('rightclick');
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.tilesloaded
         */
        this.tilesloaded = this._eventManager.getLazyEmitter('tilesloaded');
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.tilt_changed
         */
        this.tiltChanged = this._eventManager.getLazyEmitter('tilt_changed');
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.zoom_changed
         */
        this.zoomChanged = this._eventManager.getLazyEmitter('zoom_changed');
        this._isBrowser = isPlatformBrowser(platformId);
        if (this._isBrowser) {
            const googleMapsWindow = window;
            if (!googleMapsWindow.google && (typeof ngDevMode === 'undefined' || ngDevMode)) {
                throw Error('Namespace google not found, cannot construct embedded google ' +
                    'map. Please install the Google Maps JavaScript API: ' +
                    'https://developers.google.com/maps/documentation/javascript/' +
                    'tutorial#Loading_the_Maps_API');
            }
        }
    }
    set center(center) {
        this._center = center;
    }
    set zoom(zoom) {
        this._zoom = zoom;
    }
    set options(options) {
        this._options = options || DEFAULT_OPTIONS;
    }
    ngOnChanges(changes) {
        if (changes['height'] || changes['width']) {
            this._setSize();
        }
        const googleMap = this.googleMap;
        if (googleMap) {
            if (changes['options']) {
                googleMap.setOptions(this._combineOptions());
            }
            if (changes['center'] && this._center) {
                googleMap.setCenter(this._center);
            }
            // Note that the zoom can be zero.
            if (changes['zoom'] && this._zoom != null) {
                googleMap.setZoom(this._zoom);
            }
            if (changes['mapTypeId'] && this.mapTypeId) {
                googleMap.setMapTypeId(this.mapTypeId);
            }
        }
    }
    ngOnInit() {
        // It should be a noop during server-side rendering.
        if (this._isBrowser) {
            this._mapEl = this._elementRef.nativeElement.querySelector('.map-container');
            this._setSize();
            // Create the object outside the zone so its events don't trigger change detection.
            // We'll bring it back in inside the `MapEventManager` only for the events that the
            // user has subscribed to.
            this._ngZone.runOutsideAngular(() => {
                this.googleMap = new google.maps.Map(this._mapEl, this._combineOptions());
            });
            this._eventManager.setTarget(this.googleMap);
        }
    }
    ngOnDestroy() {
        this._eventManager.destroy();
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.fitBounds
     */
    fitBounds(bounds, padding) {
        this._assertInitialized();
        this.googleMap.fitBounds(bounds, padding);
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.panBy
     */
    panBy(x, y) {
        this._assertInitialized();
        this.googleMap.panBy(x, y);
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.panTo
     */
    panTo(latLng) {
        this._assertInitialized();
        this.googleMap.panTo(latLng);
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.panToBounds
     */
    panToBounds(latLngBounds, padding) {
        this._assertInitialized();
        this.googleMap.panToBounds(latLngBounds, padding);
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getBounds
     */
    getBounds() {
        this._assertInitialized();
        return this.googleMap.getBounds() || null;
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getCenter
     */
    getCenter() {
        this._assertInitialized();
        return this.googleMap.getCenter();
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getClickableIcons
     */
    getClickableIcons() {
        this._assertInitialized();
        return this.googleMap.getClickableIcons();
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getHeading
     */
    getHeading() {
        this._assertInitialized();
        return this.googleMap.getHeading();
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getMapTypeId
     */
    getMapTypeId() {
        this._assertInitialized();
        return this.googleMap.getMapTypeId();
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getProjection
     */
    getProjection() {
        this._assertInitialized();
        return this.googleMap.getProjection();
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getStreetView
     */
    getStreetView() {
        this._assertInitialized();
        return this.googleMap.getStreetView();
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getTilt
     */
    getTilt() {
        this._assertInitialized();
        return this.googleMap.getTilt();
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getZoom
     */
    getZoom() {
        this._assertInitialized();
        return this.googleMap.getZoom();
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.controls
     */
    get controls() {
        this._assertInitialized();
        return this.googleMap.controls;
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.data
     */
    get data() {
        this._assertInitialized();
        return this.googleMap.data;
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.mapTypes
     */
    get mapTypes() {
        this._assertInitialized();
        return this.googleMap.mapTypes;
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.overlayMapTypes
     */
    get overlayMapTypes() {
        this._assertInitialized();
        return this.googleMap.overlayMapTypes;
    }
    _setSize() {
        if (this._mapEl) {
            const styles = this._mapEl.style;
            styles.height =
                this.height === null ? '' : (coerceCssPixelValue(this.height) || DEFAULT_HEIGHT);
            styles.width = this.width === null ? '' : (coerceCssPixelValue(this.width) || DEFAULT_WIDTH);
        }
    }
    /** Combines the center and zoom and the other map options into a single object */
    _combineOptions() {
        var _a, _b;
        const options = this._options || {};
        return Object.assign(Object.assign({}, options), { 
            // It's important that we set **some** kind of `center` and `zoom`, otherwise
            // Google Maps will render a blank rectangle which looks broken.
            center: this._center || options.center || DEFAULT_OPTIONS.center, zoom: (_b = (_a = this._zoom) !== null && _a !== void 0 ? _a : options.zoom) !== null && _b !== void 0 ? _b : DEFAULT_OPTIONS.zoom, 
            // Passing in an undefined `mapTypeId` seems to break tile loading
            // so make sure that we have some kind of default (see #22082).
            mapTypeId: this.mapTypeId || options.mapTypeId || DEFAULT_OPTIONS.mapTypeId });
    }
    /** Asserts that the map has been initialized. */
    _assertInitialized() {
        if (!this.googleMap && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw Error('Cannot access Google Map information before the API has been initialized. ' +
                'Please wait for the API to load before trying to interact with it.');
        }
    }
}
GoogleMap.decorators = [
    { type: Component, args: [{
                selector: 'google-map',
                exportAs: 'googleMap',
                changeDetection: ChangeDetectionStrategy.OnPush,
                template: '<div class="map-container"></div><ng-content></ng-content>',
                encapsulation: ViewEncapsulation.None
            },] }
];
GoogleMap.ctorParameters = () => [
    { type: ElementRef },
    { type: NgZone },
    { type: Object, decorators: [{ type: Inject, args: [PLATFORM_ID,] }] }
];
GoogleMap.propDecorators = {
    height: [{ type: Input }],
    width: [{ type: Input }],
    mapTypeId: [{ type: Input }],
    center: [{ type: Input }],
    zoom: [{ type: Input }],
    options: [{ type: Input }],
    boundsChanged: [{ type: Output }],
    centerChanged: [{ type: Output }],
    mapClick: [{ type: Output }],
    mapDblclick: [{ type: Output }],
    mapDrag: [{ type: Output }],
    mapDragend: [{ type: Output }],
    mapDragstart: [{ type: Output }],
    headingChanged: [{ type: Output }],
    idle: [{ type: Output }],
    maptypeidChanged: [{ type: Output }],
    mapMousemove: [{ type: Output }],
    mapMouseout: [{ type: Output }],
    mapMouseover: [{ type: Output }],
    projectionChanged: [{ type: Output }],
    mapRightclick: [{ type: Output }],
    tilesloaded: [{ type: Output }],
    tiltChanged: [{ type: Output }],
    zoomChanged: [{ type: Output }]
};
const cssUnitsPattern = /([A-Za-z%]+)$/;
/** Coerces a value to a CSS pixel value. */
function coerceCssPixelValue(value) {
    if (value == null) {
        return '';
    }
    return cssUnitsPattern.test(value) ? value : `${value}px`;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29vZ2xlLW1hcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9nb29nbGUtbWFwcy9nb29nbGUtbWFwL2dvb2dsZS1tYXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgseUVBQXlFO0FBQ3pFLG9DQUFvQztBQUVwQyxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsS0FBSyxFQUlMLE1BQU0sRUFDTixpQkFBaUIsRUFDakIsTUFBTSxFQUNOLFdBQVcsRUFDWCxNQUFNLEdBRVAsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDbEQsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUNoQyxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFNckQsNENBQTRDO0FBQzVDLE1BQU0sQ0FBQyxNQUFNLGVBQWUsR0FBMkI7SUFDckQsTUFBTSxFQUFFLEVBQUMsR0FBRyxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxVQUFVLEVBQUM7SUFDMUMsSUFBSSxFQUFFLEVBQUU7SUFDUiwyRkFBMkY7SUFDM0YsU0FBUyxFQUFFLFNBQTZDO0NBQ3pELENBQUM7QUFFRixtREFBbUQ7QUFDbkQsTUFBTSxDQUFDLE1BQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQztBQUN0QyxrREFBa0Q7QUFDbEQsTUFBTSxDQUFDLE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQztBQUVyQzs7OztHQUlHO0FBUUgsTUFBTSxPQUFPLFNBQVM7SUE0S3BCLFlBQ21CLFdBQXVCLEVBQ2hDLE9BQWUsRUFDRixVQUFrQjtRQUZ0QixnQkFBVyxHQUFYLFdBQVcsQ0FBWTtRQUNoQyxZQUFPLEdBQVAsT0FBTyxDQUFRO1FBN0tqQixrQkFBYSxHQUFvQixJQUFJLGVBQWUsQ0FBQyxJQUFJLENBQUMs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LFFBQVEsRUFBRSw0REFBNEQ7Z0JBQ3RFLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2FBQ3RDOzs7WUE1Q0MsVUFBVTtZQVNWLE1BQU07WUFtTjZCLE1BQU0sdUJBQXRDLE1BQU0sU0FBQyxXQUFXOzs7cUJBaEtwQixLQUFLO29CQUdMLEtBQUs7d0JBTUwsS0FBSztxQkFFTCxLQUFLO21CQU1MLEtBQUs7c0JBTUwsS0FBSzs0QkFVTCxNQUFNOzRCQU9OLE1BQU07dUJBT04sTUFBTTswQkFRTixNQUFNO3NCQU9OLE1BQU07eUJBT04sTUFBTTsyQkFPTixNQUFNOzZCQU9OLE1BQU07bUJBT04sTUFBTTsrQkFPTixNQUFNOzJCQU9OLE1BQU07MEJBUU4sTUFBTTsyQkFPTixNQUFNO2dDQU9OLE1BQU07NEJBT04sTUFBTTswQkFPTixNQUFNOzBCQU9OLE1BQU07MEJBT04sTUFBTTs7QUFtUVQsTUFBTSxlQUFlLEdBQUcsZUFBZSxDQUFDO0FBRXhDLDRDQUE0QztBQUM1QyxTQUFTLG1CQUFtQixDQUFDLEtBQVU7SUFDckMsSUFBSSxLQUFLLElBQUksSUFBSSxFQUFFO1FBQ2pCLE9BQU8sRUFBRSxDQUFDO0tBQ1g7SUFFRCxPQUFPLGVBQWUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLElBQUksQ0FBQztBQUM1RCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8vIFdvcmthcm91bmQgZm9yOiBodHRwczovL2dpdGh1Yi5jb20vYmF6ZWxidWlsZC9ydWxlc19ub2RlanMvaXNzdWVzLzEyNjVcbi8vLyA8cmVmZXJlbmNlIHR5cGVzPVwiZ29vZ2xlbWFwc1wiIC8+XG5cbmltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBJbmplY3QsXG4gIFBMQVRGT1JNX0lELFxuICBOZ1pvbmUsXG4gIFNpbXBsZUNoYW5nZXMsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtpc1BsYXRmb3JtQnJvd3Nlcn0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XG5pbXBvcnQge01hcEV2ZW50TWFuYWdlcn0gZnJvbSAnLi4vbWFwLWV2ZW50LW1hbmFnZXInO1xuXG5pbnRlcmZhY2UgR29vZ2xlTWFwc1dpbmRvdyBleHRlbmRzIFdpbmRvdyB7XG4gIGdvb2dsZT86IHR5cGVvZiBnb29nbGU7XG59XG5cbi8qKiBkZWZhdWx0IG9wdGlvbnMgc2V0IHRvIHRoZSBHb29nbGVwbGV4ICovXG5leHBvcnQgY29uc3QgREVGQVVMVF9PUFRJT05TOiBnb29nbGUubWFwcy5NYXBPcHRpb25zID0ge1xuICBjZW50ZXI6IHtsYXQ6IDM3LjQyMTk5NSwgbG5nOiAtMTIyLjA4NDA5Mn0sXG4gIHpvb206IDE3LFxuICAvLyBOb3RlOiB0aGUgdHlwZSBjb252ZXJzaW9uIGhlcmUgaXNuJ3QgbmVjZXNzYXJ5IGZvciBvdXIgQ0ksIGJ1dCBpdCByZXNvbHZlcyBhIGczIGZhaWx1cmUuXG4gIG1hcFR5cGVJZDogJ3JvYWRtYXAnIGFzIHVua25vd24gYXMgZ29vZ2xlLm1hcHMuTWFwVHlwZUlkXG59O1xuXG4vKiogQXJiaXRyYXJ5IGRlZmF1bHQgaGVpZ2h0IGZvciB0aGUgbWFwIGVsZW1lbnQgKi9cbmV4cG9ydCBjb25zdCBERUZBVUxUX0hFSUdIVCA9ICc1MDBweCc7XG4vKiogQXJiaXRyYXJ5IGRlZmF1bHQgd2lkdGggZm9yIHRoZSBtYXAgZWxlbWVudCAqL1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfV0lEVEggPSAnNTAwcHgnO1xuXG4vKipcbiAqIEFuZ3VsYXIgY29tcG9uZW50IHRoYXQgcmVuZGVycyBhIEdvb2dsZSBNYXAgdmlhIHRoZSBHb29nbGUgTWFwcyBKYXZhU2NyaXB0XG4gKiBBUEkuXG4gKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZ29vZ2xlLW1hcCcsXG4gIGV4cG9ydEFzOiAnZ29vZ2xlTWFwJyxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cIm1hcC1jb250YWluZXJcIj48L2Rpdj48bmctY29udGVudD48L25nLWNvbnRlbnQ+JyxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbn0pXG5leHBvcnQgY2xhc3MgR29vZ2xlTWFwIGltcGxlbWVudHMgT25DaGFuZ2VzLCBPbkluaXQsIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX2V2ZW50TWFuYWdlcjogTWFwRXZlbnRNYW5hZ2VyID0gbmV3IE1hcEV2ZW50TWFuYWdlcih0aGlzLl9uZ1pvbmUpO1xuICBwcml2YXRlIF9tYXBFbDogSFRNTEVsZW1lbnQ7XG5cbiAgLyoqXG4gICAqIFRoZSB1bmRlcmx5aW5nIGdvb2dsZS5tYXBzLk1hcCBvYmplY3RcbiAgICpcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcFxuICAgKi9cbiAgZ29vZ2xlTWFwPzogZ29vZ2xlLm1hcHMuTWFwO1xuXG4gIC8qKiBXaGV0aGVyIHdlJ3JlIGN1cnJlbnRseSByZW5kZXJpbmcgaW5zaWRlIGEgYnJvd3Nlci4gKi9cbiAgX2lzQnJvd3NlcjogYm9vbGVhbjtcblxuICAvKiogSGVpZ2h0IG9mIHRoZSBtYXAuIFNldCB0aGlzIHRvIGBudWxsYCBpZiB5b3UnZCBsaWtlIHRvIGNvbnRyb2wgdGhlIGhlaWdodCB0aHJvdWdoIENTUy4gKi9cbiAgQElucHV0KCkgaGVpZ2h0OiBzdHJpbmcgfCBudW1iZXIgfCBudWxsID0gREVGQVVMVF9IRUlHSFQ7XG5cbiAgLyoqIFdpZHRoIG9mIHRoZSBtYXAuIFNldCB0aGlzIHRvIGBudWxsYCBpZiB5b3UnZCBsaWtlIHRvIGNvbnRyb2wgdGhlIHdpZHRoIHRocm91Z2ggQ1NTLiAqL1xuICBASW5wdXQoKSB3aWR0aDogc3RyaW5nIHwgbnVtYmVyIHwgbnVsbCA9IERFRkFVTFRfV0lEVEg7XG5cbiAgLyoqXG4gICAqIFR5cGUgb2YgbWFwIHRoYXQgc2hvdWxkIGJlIHJlbmRlcmVkLiBFLmcuIGh5YnJpZCBtYXAsIHRlcnJhaW4gbWFwIGV0Yy5cbiAgICogU2VlOiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcFR5cGVJZFxuICAgKi9cbiAgQElucHV0KCkgbWFwVHlwZUlkOiBnb29nbGUubWFwcy5NYXBUeXBlSWQgfCB1bmRlZmluZWQ7XG5cbiAgQElucHV0KClcbiAgc2V0IGNlbnRlcihjZW50ZXI6IGdvb2dsZS5tYXBzLkxhdExuZ0xpdGVyYWx8Z29vZ2xlLm1hcHMuTGF0TG5nKSB7XG4gICAgdGhpcy5fY2VudGVyID0gY2VudGVyO1xuICB9XG4gIHByaXZhdGUgX2NlbnRlcjogZ29vZ2xlLm1hcHMuTGF0TG5nTGl0ZXJhbHxnb29nbGUubWFwcy5MYXRMbmc7XG5cbiAgQElucHV0KClcbiAgc2V0IHpvb20oem9vbTogbnVtYmVyKSB7XG4gICAgdGhpcy5fem9vbSA9IHpvb207XG4gIH1cbiAgcHJpdmF0ZSBfem9vbTogbnVtYmVyO1xuXG4gIEBJbnB1dCgpXG4gIHNldCBvcHRpb25zKG9wdGlvbnM6IGdvb2dsZS5tYXBzLk1hcE9wdGlvbnMpIHtcbiAgICB0aGlzLl9vcHRpb25zID0gb3B0aW9ucyB8fCBERUZBVUxUX09QVElPTlM7XG4gIH1cbiAgcHJpdmF0ZSBfb3B0aW9ucyA9IERFRkFVTFRfT1BUSU9OUztcblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLmJvdW5kc19jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgYm91bmRzQ2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2JvdW5kc19jaGFuZ2VkJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5jZW50ZXJfY2hhbmdlZFxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGNlbnRlckNoYW5nZWQ6IE9ic2VydmFibGU8dm9pZD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCdjZW50ZXJfY2hhbmdlZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuY2xpY2tcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBtYXBDbGljazogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50fGdvb2dsZS5tYXBzLkljb25Nb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXJcbiAgICAgICAgICAuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudHxnb29nbGUubWFwcy5JY29uTW91c2VFdmVudD4oJ2NsaWNrJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5kYmxjbGlja1xuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG1hcERibGNsaWNrOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PignZGJsY2xpY2snKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLmRyYWdcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBtYXBEcmFnOiBPYnNlcnZhYmxlPHZvaWQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPignZHJhZycpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuZHJhZ2VuZFxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG1hcERyYWdlbmQ6IE9ic2VydmFibGU8dm9pZD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCdkcmFnZW5kJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5kcmFnc3RhcnRcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBtYXBEcmFnc3RhcnQ6IE9ic2VydmFibGU8dm9pZD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCdkcmFnc3RhcnQnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLmhlYWRpbmdfY2hhbmdlZFxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGhlYWRpbmdDaGFuZ2VkOiBPYnNlcnZhYmxlPHZvaWQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPignaGVhZGluZ19jaGFuZ2VkJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5pZGxlXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgaWRsZTogT2JzZXJ2YWJsZTx2b2lkPiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2lkbGUnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLm1hcHR5cGVpZF9jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgbWFwdHlwZWlkQ2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ21hcHR5cGVpZF9jaGFuZ2VkJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5tb3VzZW1vdmVcbiAgICovXG4gIEBPdXRwdXQoKVxuICByZWFkb25seSBtYXBNb3VzZW1vdmU6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+KCdtb3VzZW1vdmUnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLm1vdXNlb3V0XG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgbWFwTW91c2VvdXQ6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+KCdtb3VzZW91dCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAubW91c2VvdmVyXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgbWFwTW91c2VvdmVyOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PignbW91c2VvdmVyJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAucHJvamVjdGlvbl9jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgcHJvamVjdGlvbkNoYW5nZWQ6IE9ic2VydmFibGU8dm9pZD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCdwcm9qZWN0aW9uX2NoYW5nZWQnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLnJpZ2h0Y2xpY2tcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBtYXBSaWdodGNsaWNrOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PigncmlnaHRjbGljaycpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAudGlsZXNsb2FkZWRcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSB0aWxlc2xvYWRlZDogT2JzZXJ2YWJsZTx2b2lkPiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ3RpbGVzbG9hZGVkJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC50aWx0X2NoYW5nZWRcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSB0aWx0Q2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ3RpbHRfY2hhbmdlZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuem9vbV9jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgem9vbUNoYW5nZWQ6IE9ic2VydmFibGU8dm9pZD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCd6b29tX2NoYW5nZWQnKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9lbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lLFxuICAgIEBJbmplY3QoUExBVEZPUk1fSUQpIHBsYXRmb3JtSWQ6IE9iamVjdCkge1xuXG4gICAgdGhpcy5faXNCcm93c2VyID0gaXNQbGF0Zm9ybUJyb3dzZXIocGxhdGZvcm1JZCk7XG5cbiAgICBpZiAodGhpcy5faXNCcm93c2VyKSB7XG4gICAgICBjb25zdCBnb29nbGVNYXBzV2luZG93OiBHb29nbGVNYXBzV2luZG93ID0gd2luZG93O1xuICAgICAgaWYgKCFnb29nbGVNYXBzV2luZG93Lmdvb2dsZSAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICAgICdOYW1lc3BhY2UgZ29vZ2xlIG5vdCBmb3VuZCwgY2Fubm90IGNvbnN0cnVjdCBlbWJlZGRlZCBnb29nbGUgJyArXG4gICAgICAgICAgICAnbWFwLiBQbGVhc2UgaW5zdGFsbCB0aGUgR29vZ2xlIE1hcHMgSmF2YVNjcmlwdCBBUEk6ICcgK1xuICAgICAgICAgICAgJ2h0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0LycgK1xuICAgICAgICAgICAgJ3R1dG9yaWFsI0xvYWRpbmdfdGhlX01hcHNfQVBJJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChjaGFuZ2VzWydoZWlnaHQnXSB8fCBjaGFuZ2VzWyd3aWR0aCddKSB7XG4gICAgICB0aGlzLl9zZXRTaXplKCk7XG4gICAgfVxuXG4gICAgY29uc3QgZ29vZ2xlTWFwID0gdGhpcy5nb29nbGVNYXA7XG5cbiAgICBpZiAoZ29vZ2xlTWFwKSB7XG4gICAgICBpZiAoY2hhbmdlc1snb3B0aW9ucyddKSB7XG4gICAgICAgIGdvb2dsZU1hcC5zZXRPcHRpb25zKHRoaXMuX2NvbWJpbmVPcHRpb25zKCkpO1xuICAgICAgfVxuXG4gICAgICBpZiAoY2hhbmdlc1snY2VudGVyJ10gJiYgdGhpcy5fY2VudGVyKSB7XG4gICAgICAgIGdvb2dsZU1hcC5zZXRDZW50ZXIodGhpcy5fY2VudGVyKTtcbiAgICAgIH1cblxuICAgICAgLy8gTm90ZSB0aGF0IHRoZSB6b29tIGNhbiBiZSB6ZXJvLlxuICAgICAgaWYgKGNoYW5nZXNbJ3pvb20nXSAmJiB0aGlzLl96b29tICE9IG51bGwpIHtcbiAgICAgICAgZ29vZ2xlTWFwLnNldFpvb20odGhpcy5fem9vbSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChjaGFuZ2VzWydtYXBUeXBlSWQnXSAmJiB0aGlzLm1hcFR5cGVJZCkge1xuICAgICAgICBnb29nbGVNYXAuc2V0TWFwVHlwZUlkKHRoaXMubWFwVHlwZUlkKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICAvLyBJdCBzaG91bGQgYmUgYSBub29wIGR1cmluZyBzZXJ2ZXItc2lkZSByZW5kZXJpbmcuXG4gICAgaWYgKHRoaXMuX2lzQnJvd3Nlcikge1xuICAgICAgdGhpcy5fbWFwRWwgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLm1hcC1jb250YWluZXInKSE7XG4gICAgICB0aGlzLl9zZXRTaXplKCk7XG5cbiAgICAgIC8vIENyZWF0ZSB0aGUgb2JqZWN0IG91dHNpZGUgdGhlIHpvbmUgc28gaXRzIGV2ZW50cyBkb24ndCB0cmlnZ2VyIGNoYW5nZSBkZXRlY3Rpb24uXG4gICAgICAvLyBXZSdsbCBicmluZyBpdCBiYWNrIGluIGluc2lkZSB0aGUgYE1hcEV2ZW50TWFuYWdlcmAgb25seSBmb3IgdGhlIGV2ZW50cyB0aGF0IHRoZVxuICAgICAgLy8gdXNlciBoYXMgc3Vic2NyaWJlZCB0by5cbiAgICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgIHRoaXMuZ29vZ2xlTWFwID0gbmV3IGdvb2dsZS5tYXBzLk1hcCh0aGlzLl9tYXBFbCwgdGhpcy5fY29tYmluZU9wdGlvbnMoKSk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5zZXRUYXJnZXQodGhpcy5nb29nbGVNYXApO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5kZXN0cm95KCk7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLmZpdEJvdW5kc1xuICAgKi9cbiAgZml0Qm91bmRzKFxuICAgICAgYm91bmRzOiBnb29nbGUubWFwcy5MYXRMbmdCb3VuZHN8Z29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzTGl0ZXJhbCxcbiAgICAgIHBhZGRpbmc/OiBudW1iZXJ8Z29vZ2xlLm1hcHMuUGFkZGluZykge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgdGhpcy5nb29nbGVNYXAuZml0Qm91bmRzKGJvdW5kcywgcGFkZGluZyk7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLnBhbkJ5XG4gICAqL1xuICBwYW5CeSh4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgdGhpcy5nb29nbGVNYXAucGFuQnkoeCwgeSk7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLnBhblRvXG4gICAqL1xuICBwYW5UbyhsYXRMbmc6IGdvb2dsZS5tYXBzLkxhdExuZ3xnb29nbGUubWFwcy5MYXRMbmdMaXRlcmFsKSB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICB0aGlzLmdvb2dsZU1hcC5wYW5UbyhsYXRMbmcpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5wYW5Ub0JvdW5kc1xuICAgKi9cbiAgcGFuVG9Cb3VuZHMoXG4gICAgICBsYXRMbmdCb3VuZHM6IGdvb2dsZS5tYXBzLkxhdExuZ0JvdW5kc3xnb29nbGUubWFwcy5MYXRMbmdCb3VuZHNMaXRlcmFsLFxuICAgICAgcGFkZGluZz86IG51bWJlcnxnb29nbGUubWFwcy5QYWRkaW5nKSB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICB0aGlzLmdvb2dsZU1hcC5wYW5Ub0JvdW5kcyhsYXRMbmdCb3VuZHMsIHBhZGRpbmcpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5nZXRCb3VuZHNcbiAgICovXG4gIGdldEJvdW5kcygpOiBnb29nbGUubWFwcy5MYXRMbmdCb3VuZHN8bnVsbCB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5nb29nbGVNYXAuZ2V0Qm91bmRzKCkgfHwgbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuZ2V0Q2VudGVyXG4gICAqL1xuICBnZXRDZW50ZXIoKTogZ29vZ2xlLm1hcHMuTGF0TG5nIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmdvb2dsZU1hcC5nZXRDZW50ZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuZ2V0Q2xpY2thYmxlSWNvbnNcbiAgICovXG4gIGdldENsaWNrYWJsZUljb25zKCk6IGJvb2xlYW4ge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMuZ29vZ2xlTWFwLmdldENsaWNrYWJsZUljb25zKCk7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLmdldEhlYWRpbmdcbiAgICovXG4gIGdldEhlYWRpbmcoKTogbnVtYmVyIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmdvb2dsZU1hcC5nZXRIZWFkaW5nKCk7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLmdldE1hcFR5cGVJZFxuICAgKi9cbiAgZ2V0TWFwVHlwZUlkKCk6IGdvb2dsZS5tYXBzLk1hcFR5cGVJZHxzdHJpbmcge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMuZ29vZ2xlTWFwLmdldE1hcFR5cGVJZCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5nZXRQcm9qZWN0aW9uXG4gICAqL1xuICBnZXRQcm9qZWN0aW9uKCk6IGdvb2dsZS5tYXBzLlByb2plY3Rpb258bnVsbCB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5nb29nbGVNYXAuZ2V0UHJvamVjdGlvbigpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5nZXRTdHJlZXRWaWV3XG4gICAqL1xuICBnZXRTdHJlZXRWaWV3KCk6IGdvb2dsZS5tYXBzLlN0cmVldFZpZXdQYW5vcmFtYSB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5nb29nbGVNYXAuZ2V0U3RyZWV0VmlldygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5nZXRUaWx0XG4gICAqL1xuICBnZXRUaWx0KCk6IG51bWJlciB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5nb29nbGVNYXAuZ2V0VGlsdCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5nZXRab29tXG4gICAqL1xuICBnZXRab29tKCk6IG51bWJlciB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5nb29nbGVNYXAuZ2V0Wm9vbSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5jb250cm9sc1xuICAgKi9cbiAgZ2V0IGNvbnRyb2xzKCk6IGdvb2dsZS5tYXBzLk1WQ0FycmF5PE5vZGU+W10ge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMuZ29vZ2xlTWFwLmNvbnRyb2xzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5kYXRhXG4gICAqL1xuICBnZXQgZGF0YSgpOiBnb29nbGUubWFwcy5EYXRhIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmdvb2dsZU1hcC5kYXRhO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5tYXBUeXBlc1xuICAgKi9cbiAgZ2V0IG1hcFR5cGVzKCk6IGdvb2dsZS5tYXBzLk1hcFR5cGVSZWdpc3RyeSB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5nb29nbGVNYXAubWFwVHlwZXM7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLm92ZXJsYXlNYXBUeXBlc1xuICAgKi9cbiAgZ2V0IG92ZXJsYXlNYXBUeXBlcygpOiBnb29nbGUubWFwcy5NVkNBcnJheTxnb29nbGUubWFwcy5NYXBUeXBlPiB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5nb29nbGVNYXAub3ZlcmxheU1hcFR5cGVzO1xuICB9XG5cbiAgcHJpdmF0ZSBfc2V0U2l6ZSgpIHtcbiAgICBpZiAodGhpcy5fbWFwRWwpIHtcbiAgICAgIGNvbnN0IHN0eWxlcyA9IHRoaXMuX21hcEVsLnN0eWxlO1xuICAgICAgc3R5bGVzLmhlaWdodCA9XG4gICAgICAgICAgdGhpcy5oZWlnaHQgPT09IG51bGwgPyAnJyA6IChjb2VyY2VDc3NQaXhlbFZhbHVlKHRoaXMuaGVpZ2h0KSB8fCBERUZBVUxUX0hFSUdIVCk7XG4gICAgICBzdHlsZXMud2lkdGggPSB0aGlzLndpZHRoID09PSBudWxsID8gJycgOiAoY29lcmNlQ3NzUGl4ZWxWYWx1ZSh0aGlzLndpZHRoKSB8fCBERUZBVUxUX1dJRFRIKTtcbiAgICB9XG4gIH1cblxuICAvKiogQ29tYmluZXMgdGhlIGNlbnRlciBhbmQgem9vbSBhbmQgdGhlIG90aGVyIG1hcCBvcHRpb25zIGludG8gYSBzaW5nbGUgb2JqZWN0ICovXG4gIHByaXZhdGUgX2NvbWJpbmVPcHRpb25zKCk6IGdvb2dsZS5tYXBzLk1hcE9wdGlvbnMge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLl9vcHRpb25zIHx8IHt9O1xuICAgIHJldHVybiB7XG4gICAgICAuLi5vcHRpb25zLFxuICAgICAgLy8gSXQncyBpbXBvcnRhbnQgdGhhdCB3ZSBzZXQgKipzb21lKioga2luZCBvZiBgY2VudGVyYCBhbmQgYHpvb21gLCBvdGhlcndpc2VcbiAgICAgIC8vIEdvb2dsZSBNYXBzIHdpbGwgcmVuZGVyIGEgYmxhbmsgcmVjdGFuZ2xlIHdoaWNoIGxvb2tzIGJyb2tlbi5cbiAgICAgIGNlbnRlcjogdGhpcy5fY2VudGVyIHx8IG9wdGlvbnMuY2VudGVyIHx8IERFRkFVTFRfT1BUSU9OUy5jZW50ZXIsXG4gICAgICB6b29tOiB0aGlzLl96b29tID8/IG9wdGlvbnMuem9vbSA/PyBERUZBVUxUX09QVElPTlMuem9vbSxcbiAgICAgIC8vIFBhc3NpbmcgaW4gYW4gdW5kZWZpbmVkIGBtYXBUeXBlSWRgIHNlZW1zIHRvIGJyZWFrIHRpbGUgbG9hZGluZ1xuICAgICAgLy8gc28gbWFrZSBzdXJlIHRoYXQgd2UgaGF2ZSBzb21lIGtpbmQgb2YgZGVmYXVsdCAoc2VlICMyMjA4MikuXG4gICAgICBtYXBUeXBlSWQ6IHRoaXMubWFwVHlwZUlkIHx8IG9wdGlvbnMubWFwVHlwZUlkIHx8IERFRkFVTFRfT1BUSU9OUy5tYXBUeXBlSWRcbiAgICB9O1xuICB9XG5cbiAgLyoqIEFzc2VydHMgdGhhdCB0aGUgbWFwIGhhcyBiZWVuIGluaXRpYWxpemVkLiAqL1xuICBwcml2YXRlIF9hc3NlcnRJbml0aWFsaXplZCgpOiBhc3NlcnRzIHRoaXMgaXMge2dvb2dsZU1hcDogZ29vZ2xlLm1hcHMuTWFwfSB7XG4gICAgaWYgKCF0aGlzLmdvb2dsZU1hcCAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgdGhyb3cgRXJyb3IoJ0Nhbm5vdCBhY2Nlc3MgR29vZ2xlIE1hcCBpbmZvcm1hdGlvbiBiZWZvcmUgdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZC4gJyArXG4gICAgICAgICAgICAgICAgICAnUGxlYXNlIHdhaXQgZm9yIHRoZSBBUEkgdG8gbG9hZCBiZWZvcmUgdHJ5aW5nIHRvIGludGVyYWN0IHdpdGggaXQuJyk7XG4gICAgfVxuICB9XG59XG5cbmNvbnN0IGNzc1VuaXRzUGF0dGVybiA9IC8oW0EtWmEteiVdKykkLztcblxuLyoqIENvZXJjZXMgYSB2YWx1ZSB0byBhIENTUyBwaXhlbCB2YWx1ZS4gKi9cbmZ1bmN0aW9uIGNvZXJjZUNzc1BpeGVsVmFsdWUodmFsdWU6IGFueSk6IHN0cmluZyB7XG4gIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG5cbiAgcmV0dXJuIGNzc1VuaXRzUGF0dGVybi50ZXN0KHZhbHVlKSA/IHZhbHVlIDogYCR7dmFsdWV9cHhgO1xufVxuIl19