/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="googlemaps" />
/// <reference path="marker-clusterer-types.ts" />
import { ChangeDetectionStrategy, Component, ContentChildren, Input, NgZone, Output, QueryList, ViewEncapsulation } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GoogleMap } from '../google-map/google-map';
import { MapEventManager } from '../map-event-manager';
import { MapMarker } from '../map-marker/map-marker';
/** Default options for a clusterer. */
const DEFAULT_CLUSTERER_OPTIONS = {};
/**
 * Angular component for implementing a Google Maps Marker Clusterer.
 *
 * See https://developers.google.com/maps/documentation/javascript/marker-clustering
 */
export class MapMarkerClusterer {
    constructor(_googleMap, _ngZone) {
        this._googleMap = _googleMap;
        this._ngZone = _ngZone;
        this._currentMarkers = new Set();
        this._eventManager = new MapEventManager(this._ngZone);
        this._destroy = new Subject();
        this.ariaLabelFn = () => '';
        /**
         * See
         * googlemaps.github.io/v3-utility-library/modules/
         * _google_markerclustererplus.html#clusteringbegin
         */
        this.clusteringbegin = this._eventManager.getLazyEmitter('clusteringbegin');
        /**
         * See
         * googlemaps.github.io/v3-utility-library/modules/_google_markerclustererplus.html#clusteringend
         */
        this.clusteringend = this._eventManager.getLazyEmitter('clusteringend');
        /** Emits when a cluster has been clicked. */
        this.clusterClick = this._eventManager.getLazyEmitter('click');
        this._canInitialize = this._googleMap._isBrowser;
    }
    set averageCenter(averageCenter) {
        this._averageCenter = averageCenter;
    }
    set batchSizeIE(batchSizeIE) {
        this._batchSizeIE = batchSizeIE;
    }
    set calculator(calculator) {
        this._calculator = calculator;
    }
    set clusterClass(clusterClass) {
        this._clusterClass = clusterClass;
    }
    set enableRetinaIcons(enableRetinaIcons) {
        this._enableRetinaIcons = enableRetinaIcons;
    }
    set gridSize(gridSize) {
        this._gridSize = gridSize;
    }
    set ignoreHidden(ignoreHidden) {
        this._ignoreHidden = ignoreHidden;
    }
    set imageExtension(imageExtension) {
        this._imageExtension = imageExtension;
    }
    set imagePath(imagePath) {
        this._imagePath = imagePath;
    }
    set imageSizes(imageSizes) {
        this._imageSizes = imageSizes;
    }
    set maxZoom(maxZoom) {
        this._maxZoom = maxZoom;
    }
    set minimumClusterSize(minimumClusterSize) {
        this._minimumClusterSize = minimumClusterSize;
    }
    set styles(styles) {
        this._styles = styles;
    }
    set title(title) {
        this._title = title;
    }
    set zIndex(zIndex) {
        this._zIndex = zIndex;
    }
    set zoomOnClick(zoomOnClick) {
        this._zoomOnClick = zoomOnClick;
    }
    set options(options) {
        this._options = options;
    }
    ngOnInit() {
        if (this._canInitialize) {
            // Create the object outside the zone so its events don't trigger change detection.
            // We'll bring it back in inside the `MapEventManager` only for the events that the
            // user has subscribed to.
            this._ngZone.runOutsideAngular(() => {
                this.markerClusterer = new MarkerClusterer(this._googleMap.googleMap, [], this._combineOptions());
            });
            this._assertInitialized();
            this._eventManager.setTarget(this.markerClusterer);
        }
    }
    ngAfterContentInit() {
        if (this._canInitialize) {
            this._watchForMarkerChanges();
        }
    }
    ngOnChanges(changes) {
        const { markerClusterer: clusterer, ariaLabelFn, _averageCenter, _batchSizeIE, _calculator, _styles, _clusterClass, _enableRetinaIcons, _gridSize, _ignoreHidden, _imageExtension, _imagePath, _imageSizes, _maxZoom, _minimumClusterSize, _title, _zIndex, _zoomOnClick } = this;
        if (clusterer) {
            if (changes['options']) {
                clusterer.setOptions(this._combineOptions());
            }
            if (changes['ariaLabelFn']) {
                clusterer.ariaLabelFn = ariaLabelFn;
            }
            if (changes['averageCenter'] && _averageCenter !== undefined) {
                clusterer.setAverageCenter(_averageCenter);
            }
            if (changes['batchSizeIE'] && _batchSizeIE !== undefined) {
                clusterer.setBatchSizeIE(_batchSizeIE);
            }
            if (changes['calculator'] && !!_calculator) {
                clusterer.setCalculator(_calculator);
            }
            if (changes['clusterClass'] && _clusterClass !== undefined) {
                clusterer.setClusterClass(_clusterClass);
            }
            if (changes['enableRetinaIcons'] && _enableRetinaIcons !== undefined) {
                clusterer.setEnableRetinaIcons(_enableRetinaIcons);
            }
            if (changes['gridSize'] && _gridSize !== undefined) {
                clusterer.setGridSize(_gridSize);
            }
            if (changes['ignoreHidden'] && _ignoreHidden !== undefined) {
                clusterer.setIgnoreHidden(_ignoreHidden);
            }
            if (changes['imageExtension'] && _imageExtension !== undefined) {
                clusterer.setImageExtension(_imageExtension);
            }
            if (changes['imagePath'] && _imagePath !== undefined) {
                clusterer.setImagePath(_imagePath);
            }
            if (changes['imageSizes'] && _imageSizes) {
                clusterer.setImageSizes(_imageSizes);
            }
            if (changes['maxZoom'] && _maxZoom !== undefined) {
                clusterer.setMaxZoom(_maxZoom);
            }
            if (changes['minimumClusterSize'] && _minimumClusterSize !== undefined) {
                clusterer.setMinimumClusterSize(_minimumClusterSize);
            }
            if (changes['styles'] && _styles) {
                clusterer.setStyles(_styles);
            }
            if (changes['title'] && _title !== undefined) {
                clusterer.setTitle(_title);
            }
            if (changes['zIndex'] && _zIndex !== undefined) {
                clusterer.setZIndex(_zIndex);
            }
            if (changes['zoomOnClick'] && _zoomOnClick !== undefined) {
                clusterer.setZoomOnClick(_zoomOnClick);
            }
        }
    }
    ngOnDestroy() {
        this._destroy.next();
        this._destroy.complete();
        this._eventManager.destroy();
        if (this.markerClusterer) {
            this.markerClusterer.setMap(null);
        }
    }
    fitMapToMarkers(padding) {
        this._assertInitialized();
        this.markerClusterer.fitMapToMarkers(padding);
    }
    getAverageCenter() {
        this._assertInitialized();
        return this.markerClusterer.getAverageCenter();
    }
    getBatchSizeIE() {
        this._assertInitialized();
        return this.markerClusterer.getBatchSizeIE();
    }
    getCalculator() {
        this._assertInitialized();
        return this.markerClusterer.getCalculator();
    }
    getClusterClass() {
        this._assertInitialized();
        return this.markerClusterer.getClusterClass();
    }
    getClusters() {
        this._assertInitialized();
        return this.markerClusterer.getClusters();
    }
    getEnableRetinaIcons() {
        this._assertInitialized();
        return this.markerClusterer.getEnableRetinaIcons();
    }
    getGridSize() {
        this._assertInitialized();
        return this.markerClusterer.getGridSize();
    }
    getIgnoreHidden() {
        this._assertInitialized();
        return this.markerClusterer.getIgnoreHidden();
    }
    getImageExtension() {
        this._assertInitialized();
        return this.markerClusterer.getImageExtension();
    }
    getImagePath() {
        this._assertInitialized();
        return this.markerClusterer.getImagePath();
    }
    getImageSizes() {
        this._assertInitialized();
        return this.markerClusterer.getImageSizes();
    }
    getMaxZoom() {
        this._assertInitialized();
        return this.markerClusterer.getMaxZoom();
    }
    getMinimumClusterSize() {
        this._assertInitialized();
        return this.markerClusterer.getMinimumClusterSize();
    }
    getStyles() {
        this._assertInitialized();
        return this.markerClusterer.getStyles();
    }
    getTitle() {
        this._assertInitialized();
        return this.markerClusterer.getTitle();
    }
    getTotalClusters() {
        this._assertInitialized();
        return this.markerClusterer.getTotalClusters();
    }
    getTotalMarkers() {
        this._assertInitialized();
        return this.markerClusterer.getTotalMarkers();
    }
    getZIndex() {
        this._assertInitialized();
        return this.markerClusterer.getZIndex();
    }
    getZoomOnClick() {
        this._assertInitialized();
        return this.markerClusterer.getZoomOnClick();
    }
    _combineOptions() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
        const options = this._options || DEFAULT_CLUSTERER_OPTIONS;
        return Object.assign(Object.assign({}, options), { ariaLabelFn: (_a = this.ariaLabelFn) !== null && _a !== void 0 ? _a : options.ariaLabelFn, averageCenter: (_b = this._averageCenter) !== null && _b !== void 0 ? _b : options.averageCenter, batchSize: (_c = this.batchSize) !== null && _c !== void 0 ? _c : options.batchSize, batchSizeIE: (_d = this._batchSizeIE) !== null && _d !== void 0 ? _d : options.batchSizeIE, calculator: (_e = this._calculator) !== null && _e !== void 0 ? _e : options.calculator, clusterClass: (_f = this._clusterClass) !== null && _f !== void 0 ? _f : options.clusterClass, enableRetinaIcons: (_g = this._enableRetinaIcons) !== null && _g !== void 0 ? _g : options.enableRetinaIcons, gridSize: (_h = this._gridSize) !== null && _h !== void 0 ? _h : options.gridSize, ignoreHidden: (_j = this._ignoreHidden) !== null && _j !== void 0 ? _j : options.ignoreHidden, imageExtension: (_k = this._imageExtension) !== null && _k !== void 0 ? _k : options.imageExtension, imagePath: (_l = this._imagePath) !== null && _l !== void 0 ? _l : options.imagePath, imageSizes: (_m = this._imageSizes) !== null && _m !== void 0 ? _m : options.imageSizes, maxZoom: (_o = this._maxZoom) !== null && _o !== void 0 ? _o : options.maxZoom, minimumClusterSize: (_p = this._minimumClusterSize) !== null && _p !== void 0 ? _p : options.minimumClusterSize, styles: (_q = this._styles) !== null && _q !== void 0 ? _q : options.styles, title: (_r = this._title) !== null && _r !== void 0 ? _r : options.title, zIndex: (_s = this._zIndex) !== null && _s !== void 0 ? _s : options.zIndex, zoomOnClick: (_t = this._zoomOnClick) !== null && _t !== void 0 ? _t : options.zoomOnClick });
    }
    _watchForMarkerChanges() {
        this._assertInitialized();
        const initialMarkers = [];
        for (const marker of this._getInternalMarkers(this._markers.toArray())) {
            this._currentMarkers.add(marker);
            initialMarkers.push(marker);
        }
        this.markerClusterer.addMarkers(initialMarkers);
        this._markers.changes.pipe(takeUntil(this._destroy)).subscribe((markerComponents) => {
            this._assertInitialized();
            const newMarkers = new Set(this._getInternalMarkers(markerComponents));
            const markersToAdd = [];
            const markersToRemove = [];
            for (const marker of Array.from(newMarkers)) {
                if (!this._currentMarkers.has(marker)) {
                    this._currentMarkers.add(marker);
                    markersToAdd.push(marker);
                }
            }
            for (const marker of Array.from(this._currentMarkers)) {
                if (!newMarkers.has(marker)) {
                    markersToRemove.push(marker);
                }
            }
            this.markerClusterer.addMarkers(markersToAdd, true);
            this.markerClusterer.removeMarkers(markersToRemove, true);
            this.markerClusterer.repaint();
            for (const marker of markersToRemove) {
                this._currentMarkers.delete(marker);
            }
        });
    }
    _getInternalMarkers(markers) {
        return markers.filter(markerComponent => !!markerComponent.marker)
            .map(markerComponent => markerComponent.marker);
    }
    _assertInitialized() {
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
            if (!this._googleMap.googleMap) {
                throw Error('Cannot access Google Map information before the API has been initialized. ' +
                    'Please wait for the API to load before trying to interact with it.');
            }
            if (!this.markerClusterer) {
                throw Error('Cannot interact with a MarkerClusterer before it has been initialized. ' +
                    'Please wait for the MarkerClusterer to load before trying to interact with it.');
            }
        }
    }
}
MapMarkerClusterer.decorators = [
    { type: Component, args: [{
                selector: 'map-marker-clusterer',
                exportAs: 'mapMarkerClusterer',
                changeDetection: ChangeDetectionStrategy.OnPush,
                template: '<ng-content></ng-content>',
                encapsulation: ViewEncapsulation.None
            },] }
];
MapMarkerClusterer.ctorParameters = () => [
    { type: GoogleMap },
    { type: NgZone }
];
MapMarkerClusterer.propDecorators = {
    ariaLabelFn: [{ type: Input }],
    averageCenter: [{ type: Input }],
    batchSize: [{ type: Input }],
    batchSizeIE: [{ type: Input }],
    calculator: [{ type: Input }],
    clusterClass: [{ type: Input }],
    enableRetinaIcons: [{ type: Input }],
    gridSize: [{ type: Input }],
    ignoreHidden: [{ type: Input }],
    imageExtension: [{ type: Input }],
    imagePath: [{ type: Input }],
    imageSizes: [{ type: Input }],
    maxZoom: [{ type: Input }],
    minimumClusterSize: [{ type: Input }],
    styles: [{ type: Input }],
    title: [{ type: Input }],
    zIndex: [{ type: Input }],
    zoomOnClick: [{ type: Input }],
    options: [{ type: Input }],
    clusteringbegin: [{ type: Output }],
    clusteringend: [{ type: Output }],
    clusterClick: [{ type: Output }],
    _markers: [{ type: ContentChildren, args: [MapMarker, { descendants: true },] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLW1hcmtlci1jbHVzdGVyZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvZ29vZ2xlLW1hcHMvbWFwLW1hcmtlci1jbHVzdGVyZXIvbWFwLW1hcmtlci1jbHVzdGVyZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgseUVBQXlFO0FBQ3pFLG9DQUFvQztBQUNwQyxrREFBa0Q7QUFFbEQsT0FBTyxFQUVMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsZUFBZSxFQUNmLEtBQUssRUFDTCxNQUFNLEVBSU4sTUFBTSxFQUNOLFNBQVMsRUFFVCxpQkFBaUIsRUFDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDekMsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRXpDLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUNuRCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDckQsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBRW5ELHVDQUF1QztBQUN2QyxNQUFNLHlCQUF5QixHQUEyQixFQUFFLENBQUM7QUFFN0Q7Ozs7R0FJRztBQVFILE1BQU0sT0FBTyxrQkFBa0I7SUFpSjdCLFlBQTZCLFVBQXFCLEVBQW1CLE9BQWU7UUFBdkQsZUFBVSxHQUFWLFVBQVUsQ0FBVztRQUFtQixZQUFPLEdBQVAsT0FBTyxDQUFRO1FBaEpuRSxvQkFBZSxHQUFHLElBQUksR0FBRyxFQUFzQixDQUFDO1FBQ2hELGtCQUFhLEdBQUcsSUFBSSxlQUFlLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2xELGFBQVEsR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO1FBTWhELGdCQUFXLEdBQWdCLEdBQUcsRUFBRSxDQUFD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QkFBa0I7UUFDeEIsSUFBSSxPQUFPLFNBQVMsS0FBSyxXQUFXLElBQUksU0FBUyxFQUFFO1lBQ2pELElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRTtnQkFDOUIsTUFBTSxLQUFLLENBQ1QsNEVBQTRFO29CQUM1RSxvRUFBb0UsQ0FBQyxDQUFDO2FBQ3pFO1lBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUU7Z0JBQ3pCLE1BQU0sS0FBSyxDQUNULHlFQUF5RTtvQkFDekUsZ0ZBQWdGLENBQUMsQ0FBQzthQUNyRjtTQUNGO0lBQ0gsQ0FBQzs7O1lBN2FGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsc0JBQXNCO2dCQUNoQyxRQUFRLEVBQUUsb0JBQW9CO2dCQUM5QixlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtnQkFDL0MsUUFBUSxFQUFFLDJCQUEyQjtnQkFDckMsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7YUFDdEM7OztZQWxCTyxTQUFTO1lBWmYsTUFBTTs7OzBCQXVDTCxLQUFLOzRCQUdMLEtBQUs7d0JBTUwsS0FBSzswQkFFTCxLQUFLO3lCQU1MLEtBQUs7MkJBTUwsS0FBSztnQ0FNTCxLQUFLO3VCQU1MLEtBQUs7MkJBTUwsS0FBSzs2QkFNTCxLQUFLO3dCQU1MLEtBQUs7eUJBTUwsS0FBSztzQkFNTCxLQUFLO2lDQU1MLEtBQUs7cUJBTUwsS0FBSztvQkFNTCxLQUFLO3FCQU1MLEtBQUs7MEJBTUwsS0FBSztzQkFNTCxLQUFLOzhCQVdMLE1BQU07NEJBT04sTUFBTTsyQkFJTixNQUFNO3VCQUdOLGVBQWUsU0FBQyxTQUFTLEVBQUUsRUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8vIFdvcmthcm91bmQgZm9yOiBodHRwczovL2dpdGh1Yi5jb20vYmF6ZWxidWlsZC9ydWxlc19ub2RlanMvaXNzdWVzLzEyNjVcbi8vLyA8cmVmZXJlbmNlIHR5cGVzPVwiZ29vZ2xlbWFwc1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwibWFya2VyLWNsdXN0ZXJlci10eXBlcy50c1wiIC8+XG5cbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3V0cHV0LFxuICBRdWVyeUxpc3QsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFZpZXdFbmNhcHN1bGF0aW9uXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtPYnNlcnZhYmxlLCBTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7dGFrZVVudGlsfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7R29vZ2xlTWFwfSBmcm9tICcuLi9nb29nbGUtbWFwL2dvb2dsZS1tYXAnO1xuaW1wb3J0IHtNYXBFdmVudE1hbmFnZXJ9IGZyb20gJy4uL21hcC1ldmVudC1tYW5hZ2VyJztcbmltcG9ydCB7TWFwTWFya2VyfSBmcm9tICcuLi9tYXAtbWFya2VyL21hcC1tYXJrZXInO1xuXG4vKiogRGVmYXVsdCBvcHRpb25zIGZvciBhIGNsdXN0ZXJlci4gKi9cbmNvbnN0IERFRkFVTFRfQ0xVU1RFUkVSX09QVElPTlM6IE1hcmtlckNsdXN0ZXJlck9wdGlvbnMgPSB7fTtcblxuLyoqXG4gKiBBbmd1bGFyIGNvbXBvbmVudCBmb3IgaW1wbGVtZW50aW5nIGEgR29vZ2xlIE1hcHMgTWFya2VyIENsdXN0ZXJlci5cbiAqXG4gKiBTZWUgaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvbWFya2VyLWNsdXN0ZXJpbmdcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWFwLW1hcmtlci1jbHVzdGVyZXInLFxuICBleHBvcnRBczogJ21hcE1hcmtlckNsdXN0ZXJlcicsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICB0ZW1wbGF0ZTogJzxuZy1jb250ZW50PjwvbmctY29udGVudD4nLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxufSlcbmV4cG9ydCBjbGFzcyBNYXBNYXJrZXJDbHVzdGVyZXIgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyQ29udGVudEluaXQsIE9uQ2hhbmdlcywgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSByZWFkb25seSBfY3VycmVudE1hcmtlcnMgPSBuZXcgU2V0PGdvb2dsZS5tYXBzLk1hcmtlcj4oKTtcbiAgcHJpdmF0ZSByZWFkb25seSBfZXZlbnRNYW5hZ2VyID0gbmV3IE1hcEV2ZW50TWFuYWdlcih0aGlzLl9uZ1pvbmUpO1xuICBwcml2YXRlIHJlYWRvbmx5IF9kZXN0cm95ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKiogV2hldGhlciB0aGUgY2x1c3RlcmVyIGlzIGFsbG93ZWQgdG8gYmUgaW5pdGlhbGl6ZWQuICovXG4gIHByaXZhdGUgcmVhZG9ubHkgX2NhbkluaXRpYWxpemU6IGJvb2xlYW47XG5cbiAgQElucHV0KClcbiAgYXJpYUxhYmVsRm46IEFyaWFMYWJlbEZuID0gKCkgPT4gJydcblxuICBASW5wdXQoKVxuICBzZXQgYXZlcmFnZUNlbnRlcihhdmVyYWdlQ2VudGVyOiBib29sZWFuKSB7XG4gICAgdGhpcy5fYXZlcmFnZUNlbnRlciA9IGF2ZXJhZ2VDZW50ZXI7XG4gIH1cbiAgcHJpdmF0ZSBfYXZlcmFnZUNlbnRlcjogYm9vbGVhbjtcblxuICBASW5wdXQoKSBiYXRjaFNpemU/OiBudW1iZXI7XG5cbiAgQElucHV0KClcbiAgc2V0IGJhdGNoU2l6ZUlFKGJhdGNoU2l6ZUlFOiBudW1iZXIpIHtcbiAgICB0aGlzLl9iYXRjaFNpemVJRSA9IGJhdGNoU2l6ZUlFO1xuICB9XG4gIHByaXZhdGUgX2JhdGNoU2l6ZUlFOiBudW1iZXI7XG5cbiAgQElucHV0KClcbiAgc2V0IGNhbGN1bGF0b3IoY2FsY3VsYXRvcjogQ2FsY3VsYXRvcikge1xuICAgIHRoaXMuX2NhbGN1bGF0b3IgPSBjYWxjdWxhdG9yO1xuICB9XG4gIHByaXZhdGUgX2NhbGN1bGF0b3I6IENhbGN1bGF0b3I7XG5cbiAgQElucHV0KClcbiAgc2V0IGNsdXN0ZXJDbGFzcyhjbHVzdGVyQ2xhc3M6IHN0cmluZykge1xuICAgIHRoaXMuX2NsdXN0ZXJDbGFzcyA9IGNsdXN0ZXJDbGFzcztcbiAgfVxuICBwcml2YXRlIF9jbHVzdGVyQ2xhc3M6IHN0cmluZztcblxuICBASW5wdXQoKVxuICBzZXQgZW5hYmxlUmV0aW5hSWNvbnMoZW5hYmxlUmV0aW5hSWNvbnM6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9lbmFibGVSZXRpbmFJY29ucyA9IGVuYWJsZVJldGluYUljb25zO1xuICB9XG4gIHByaXZhdGUgX2VuYWJsZVJldGluYUljb25zOiBib29sZWFuO1xuXG4gIEBJbnB1dCgpXG4gIHNldCBncmlkU2l6ZShncmlkU2l6ZTogbnVtYmVyKSB7XG4gICAgdGhpcy5fZ3JpZFNpemUgPSBncmlkU2l6ZTtcbiAgfVxuICBwcml2YXRlIF9ncmlkU2l6ZTogbnVtYmVyO1xuXG4gIEBJbnB1dCgpXG4gIHNldCBpZ25vcmVIaWRkZW4oaWdub3JlSGlkZGVuOiBib29sZWFuKSB7XG4gICAgdGhpcy5faWdub3JlSGlkZGVuID0gaWdub3JlSGlkZGVuO1xuICB9XG4gIHByaXZhdGUgX2lnbm9yZUhpZGRlbjogYm9vbGVhbjtcblxuICBASW5wdXQoKVxuICBzZXQgaW1hZ2VFeHRlbnNpb24oaW1hZ2VFeHRlbnNpb246IHN0cmluZykge1xuICAgIHRoaXMuX2ltYWdlRXh0ZW5zaW9uID0gaW1hZ2VFeHRlbnNpb247XG4gIH1cbiAgcHJpdmF0ZSBfaW1hZ2VFeHRlbnNpb246IHN0cmluZztcblxuICBASW5wdXQoKVxuICBzZXQgaW1hZ2VQYXRoKGltYWdlUGF0aDogc3RyaW5nKSB7XG4gICAgdGhpcy5faW1hZ2VQYXRoID0gaW1hZ2VQYXRoO1xuICB9XG4gIHByaXZhdGUgX2ltYWdlUGF0aDogc3RyaW5nO1xuXG4gIEBJbnB1dCgpXG4gIHNldCBpbWFnZVNpemVzKGltYWdlU2l6ZXM6IG51bWJlcltdKSB7XG4gICAgdGhpcy5faW1hZ2VTaXplcyA9IGltYWdlU2l6ZXM7XG4gIH1cbiAgcHJpdmF0ZSBfaW1hZ2VTaXplczogbnVtYmVyW107XG5cbiAgQElucHV0KClcbiAgc2V0IG1heFpvb20obWF4Wm9vbTogbnVtYmVyKSB7XG4gICAgdGhpcy5fbWF4Wm9vbSA9IG1heFpvb207XG4gIH1cbiAgcHJpdmF0ZSBfbWF4Wm9vbTogbnVtYmVyO1xuXG4gIEBJbnB1dCgpXG4gIHNldCBtaW5pbXVtQ2x1c3RlclNpemUobWluaW11bUNsdXN0ZXJTaXplOiBudW1iZXIpIHtcbiAgICB0aGlzLl9taW5pbXVtQ2x1c3RlclNpemUgPSBtaW5pbXVtQ2x1c3RlclNpemU7XG4gIH1cbiAgcHJpdmF0ZSBfbWluaW11bUNsdXN0ZXJTaXplOiBudW1iZXI7XG5cbiAgQElucHV0KClcbiAgc2V0IHN0eWxlcyhzdHlsZXM6IENsdXN0ZXJJY29uU3R5bGVbXSkge1xuICAgIHRoaXMuX3N0eWxlcyA9IHN0eWxlcztcbiAgfVxuICBwcml2YXRlIF9zdHlsZXM6IENsdXN0ZXJJY29uU3R5bGVbXTtcblxuICBASW5wdXQoKVxuICBzZXQgdGl0bGUodGl0bGU6IHN0cmluZykge1xuICAgIHRoaXMuX3RpdGxlID0gdGl0bGU7XG4gIH1cbiAgcHJpdmF0ZSBfdGl0bGU6IHN0cmluZztcblxuICBASW5wdXQoKVxuICBzZXQgekluZGV4KHpJbmRleDogbnVtYmVyKSB7XG4gICAgdGhpcy5fekluZGV4ID0gekluZGV4O1xuICB9XG4gIHByaXZhdGUgX3pJbmRleDogbnVtYmVyO1xuXG4gIEBJbnB1dCgpXG4gIHNldCB6b29tT25DbGljayh6b29tT25DbGljazogYm9vbGVhbikge1xuICAgIHRoaXMuX3pvb21PbkNsaWNrID0gem9vbU9uQ2xpY2s7XG4gIH1cbiAgcHJpdmF0ZSBfem9vbU9uQ2xpY2s6IGJvb2xlYW47XG5cbiAgQElucHV0KClcbiAgc2V0IG9wdGlvbnMob3B0aW9uczogTWFya2VyQ2x1c3RlcmVyT3B0aW9ucykge1xuICAgIHRoaXMuX29wdGlvbnMgPSBvcHRpb25zO1xuICB9XG4gIHByaXZhdGUgX29wdGlvbnM6IE1hcmtlckNsdXN0ZXJlck9wdGlvbnM7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBnb29nbGVtYXBzLmdpdGh1Yi5pby92My11dGlsaXR5LWxpYnJhcnkvbW9kdWxlcy9cbiAgICogX2dvb2dsZV9tYXJrZXJjbHVzdGVyZXJwbHVzLmh0bWwjY2x1c3RlcmluZ2JlZ2luXG4gICAqL1xuICBAT3V0cHV0KClcbiAgY2x1c3RlcmluZ2JlZ2luOiBPYnNlcnZhYmxlPHZvaWQ+ID0gdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCdjbHVzdGVyaW5nYmVnaW4nKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGdvb2dsZW1hcHMuZ2l0aHViLmlvL3YzLXV0aWxpdHktbGlicmFyeS9tb2R1bGVzL19nb29nbGVfbWFya2VyY2x1c3RlcmVycGx1cy5odG1sI2NsdXN0ZXJpbmdlbmRcbiAgICovXG4gIEBPdXRwdXQoKVxuICBjbHVzdGVyaW5nZW5kOiBPYnNlcnZhYmxlPHZvaWQ+ID0gdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCdjbHVzdGVyaW5nZW5kJyk7XG5cbiAgLyoqIEVtaXRzIHdoZW4gYSBjbHVzdGVyIGhhcyBiZWVuIGNsaWNrZWQuICovXG4gIEBPdXRwdXQoKVxuICBjbHVzdGVyQ2xpY2s6IE9ic2VydmFibGU8Q2x1c3Rlcj4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Q2x1c3Rlcj4oJ2NsaWNrJyk7XG5cbiAgQENvbnRlbnRDaGlsZHJlbihNYXBNYXJrZXIsIHtkZXNjZW5kYW50czogdHJ1ZX0pIF9tYXJrZXJzOiBRdWVyeUxpc3Q8TWFwTWFya2VyPjtcblxuICAvKipcbiAgICogVGhlIHVuZGVybHlpbmcgTWFya2VyQ2x1c3RlcmVyIG9iamVjdC5cbiAgICpcbiAgICogU2VlXG4gICAqIGdvb2dsZW1hcHMuZ2l0aHViLmlvL3YzLXV0aWxpdHktbGlicmFyeS9jbGFzc2VzL1xuICAgKiBfZ29vZ2xlX21hcmtlcmNsdXN0ZXJlcnBsdXMubWFya2VyY2x1c3RlcmVyLmh0bWxcbiAgICovXG4gIG1hcmtlckNsdXN0ZXJlcj86IE1hcmtlckNsdXN0ZXJlcjtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IF9nb29nbGVNYXA6IEdvb2dsZU1hcCwgcHJpdmF0ZSByZWFkb25seSBfbmdab25lOiBOZ1pvbmUpIHtcbiAgICB0aGlzLl9jYW5Jbml0aWFsaXplID0gdGhpcy5fZ29vZ2xlTWFwLl9pc0Jyb3dzZXI7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICBpZiAodGhpcy5fY2FuSW5pdGlhbGl6ZSkge1xuICAgICAgLy8gQ3JlYXRlIHRoZSBvYmplY3Qgb3V0c2lkZSB0aGUgem9uZSBzbyBpdHMgZXZlbnRzIGRvbid0IHRyaWdnZXIgY2hhbmdlIGRldGVjdGlvbi5cbiAgICAgIC8vIFdlJ2xsIGJyaW5nIGl0IGJhY2sgaW4gaW5zaWRlIHRoZSBgTWFwRXZlbnRNYW5hZ2VyYCBvbmx5IGZvciB0aGUgZXZlbnRzIHRoYXQgdGhlXG4gICAgICAvLyB1c2VyIGhhcyBzdWJzY3JpYmVkIHRvLlxuICAgICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgdGhpcy5tYXJrZXJDbHVzdGVyZXIgPSBuZXcgTWFya2VyQ2x1c3RlcmVyKHRoaXMuX2dvb2dsZU1hcC5nb29nbGVNYXAhLCBbXSxcbiAgICAgICAgICAgIHRoaXMuX2NvbWJpbmVPcHRpb25zKCkpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuc2V0VGFyZ2V0KHRoaXMubWFya2VyQ2x1c3RlcmVyKTtcbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgaWYgKHRoaXMuX2NhbkluaXRpYWxpemUpIHtcbiAgICAgIHRoaXMuX3dhdGNoRm9yTWFya2VyQ2hhbmdlcygpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBjb25zdCB7XG4gICAgICBtYXJrZXJDbHVzdGVyZXI6IGNsdXN0ZXJlciwgYXJpYUxhYmVsRm4sIF9hdmVyYWdlQ2VudGVyLCBfYmF0Y2hTaXplSUUsIF9jYWxjdWxhdG9yLCBfc3R5bGVzLFxuICAgICAgX2NsdXN0ZXJDbGFzcywgX2VuYWJsZVJldGluYUljb25zLCBfZ3JpZFNpemUsIF9pZ25vcmVIaWRkZW4sIF9pbWFnZUV4dGVuc2lvbiwgX2ltYWdlUGF0aCxcbiAgICAgIF9pbWFnZVNpemVzLCBfbWF4Wm9vbSwgX21pbmltdW1DbHVzdGVyU2l6ZSwgX3RpdGxlLCBfekluZGV4LCBfem9vbU9uQ2xpY2tcbiAgICB9ID0gdGhpcztcblxuICAgIGlmIChjbHVzdGVyZXIpIHtcbiAgICAgIGlmIChjaGFuZ2VzWydvcHRpb25zJ10pIHtcbiAgICAgICAgY2x1c3RlcmVyLnNldE9wdGlvbnModGhpcy5fY29tYmluZU9wdGlvbnMoKSk7XG4gICAgICB9XG4gICAgICBpZiAoY2hhbmdlc1snYXJpYUxhYmVsRm4nXSkge1xuICAgICAgICBjbHVzdGVyZXIuYXJpYUxhYmVsRm4gPSBhcmlhTGFiZWxGbjtcbiAgICAgIH1cbiAgICAgIGlmIChjaGFuZ2VzWydhdmVyYWdlQ2VudGVyJ10gJiYgX2F2ZXJhZ2VDZW50ZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjbHVzdGVyZXIuc2V0QXZlcmFnZUNlbnRlcihfYXZlcmFnZUNlbnRlcik7XG4gICAgICB9XG4gICAgICBpZiAoY2hhbmdlc1snYmF0Y2hTaXplSUUnXSAmJiBfYmF0Y2hTaXplSUUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjbHVzdGVyZXIuc2V0QmF0Y2hTaXplSUUoX2JhdGNoU2l6ZUlFKTtcbiAgICAgIH1cbiAgICAgIGlmIChjaGFuZ2VzWydjYWxjdWxhdG9yJ10gJiYgISFfY2FsY3VsYXRvcikge1xuICAgICAgICBjbHVzdGVyZXIuc2V0Q2FsY3VsYXRvcihfY2FsY3VsYXRvcik7XG4gICAgICB9XG4gICAgICBpZiAoY2hhbmdlc1snY2x1c3RlckNsYXNzJ10gJiYgX2NsdXN0ZXJDbGFzcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNsdXN0ZXJlci5zZXRDbHVzdGVyQ2xhc3MoX2NsdXN0ZXJDbGFzcyk7XG4gICAgICB9XG4gICAgICBpZiAoY2hhbmdlc1snZW5hYmxlUmV0aW5hSWNvbnMnXSAmJiBfZW5hYmxlUmV0aW5hSWNvbnMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjbHVzdGVyZXIuc2V0RW5hYmxlUmV0aW5hSWNvbnMoX2VuYWJsZVJldGluYUljb25zKTtcbiAgICAgIH1cbiAgICAgIGlmIChjaGFuZ2VzWydncmlkU2l6ZSddICYmIF9ncmlkU2l6ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNsdXN0ZXJlci5zZXRHcmlkU2l6ZShfZ3JpZFNpemUpO1xuICAgICAgfVxuICAgICAgaWYgKGNoYW5nZXNbJ2lnbm9yZUhpZGRlbiddICYmIF9pZ25vcmVIaWRkZW4gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjbHVzdGVyZXIuc2V0SWdub3JlSGlkZGVuKF9pZ25vcmVIaWRkZW4pO1xuICAgICAgfVxuICAgICAgaWYgKGNoYW5nZXNbJ2ltYWdlRXh0ZW5zaW9uJ10gJiYgX2ltYWdlRXh0ZW5zaW9uICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY2x1c3RlcmVyLnNldEltYWdlRXh0ZW5zaW9uKF9pbWFnZUV4dGVuc2lvbik7XG4gICAgICB9XG4gICAgICBpZiAoY2hhbmdlc1snaW1hZ2VQYXRoJ10gJiYgX2ltYWdlUGF0aCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNsdXN0ZXJlci5zZXRJbWFnZVBhdGgoX2ltYWdlUGF0aCk7XG4gICAgICB9XG4gICAgICBpZiAoY2hhbmdlc1snaW1hZ2VTaXplcyddICYmIF9pbWFnZVNpemVzKSB7XG4gICAgICAgIGNsdXN0ZXJlci5zZXRJbWFnZVNpemVzKF9pbWFnZVNpemVzKTtcbiAgICAgIH1cbiAgICAgIGlmIChjaGFuZ2VzWydtYXhab29tJ10gJiYgX21heFpvb20gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjbHVzdGVyZXIuc2V0TWF4Wm9vbShfbWF4Wm9vbSk7XG4gICAgICB9XG4gICAgICBpZiAoY2hhbmdlc1snbWluaW11bUNsdXN0ZXJTaXplJ10gJiYgX21pbmltdW1DbHVzdGVyU2l6ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNsdXN0ZXJlci5zZXRNaW5pbXVtQ2x1c3RlclNpemUoX21pbmltdW1DbHVzdGVyU2l6ZSk7XG4gICAgICB9XG4gICAgICBpZiAoY2hhbmdlc1snc3R5bGVzJ10gJiYgX3N0eWxlcykge1xuICAgICAgICBjbHVzdGVyZXIuc2V0U3R5bGVzKF9zdHlsZXMpO1xuICAgICAgfVxuICAgICAgaWYgKGNoYW5nZXNbJ3RpdGxlJ10gJiYgX3RpdGxlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY2x1c3RlcmVyLnNldFRpdGxlKF90aXRsZSk7XG4gICAgICB9XG4gICAgICBpZiAoY2hhbmdlc1snekluZGV4J10gJiYgX3pJbmRleCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNsdXN0ZXJlci5zZXRaSW5kZXgoX3pJbmRleCk7XG4gICAgICB9XG4gICAgICBpZiAoY2hhbmdlc1snem9vbU9uQ2xpY2snXSAmJiBfem9vbU9uQ2xpY2sgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjbHVzdGVyZXIuc2V0Wm9vbU9uQ2xpY2soX3pvb21PbkNsaWNrKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9kZXN0cm95Lm5leHQoKTtcbiAgICB0aGlzLl9kZXN0cm95LmNvbXBsZXRlKCk7XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmRlc3Ryb3koKTtcbiAgICBpZiAodGhpcy5tYXJrZXJDbHVzdGVyZXIpIHtcbiAgICAgIHRoaXMubWFya2VyQ2x1c3RlcmVyLnNldE1hcChudWxsKTtcbiAgICB9XG4gIH1cblxuICBmaXRNYXBUb01hcmtlcnMocGFkZGluZzogbnVtYmVyfGdvb2dsZS5tYXBzLlBhZGRpbmcpIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHRoaXMubWFya2VyQ2x1c3RlcmVyLmZpdE1hcFRvTWFya2VycyhwYWRkaW5nKTtcbiAgfVxuXG4gIGdldEF2ZXJhZ2VDZW50ZXIoKTogYm9vbGVhbiB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJDbHVzdGVyZXIuZ2V0QXZlcmFnZUNlbnRlcigpO1xuICB9XG5cbiAgZ2V0QmF0Y2hTaXplSUUoKTogbnVtYmVyIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlckNsdXN0ZXJlci5nZXRCYXRjaFNpemVJRSgpO1xuICB9XG5cbiAgZ2V0Q2FsY3VsYXRvcigpOiBDYWxjdWxhdG9yIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlckNsdXN0ZXJlci5nZXRDYWxjdWxhdG9yKCk7XG4gIH1cblxuICBnZXRDbHVzdGVyQ2xhc3MoKTogc3RyaW5nIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlckNsdXN0ZXJlci5nZXRDbHVzdGVyQ2xhc3MoKTtcbiAgfVxuXG4gIGdldENsdXN0ZXJzKCk6IENsdXN0ZXJbXSB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJDbHVzdGVyZXIuZ2V0Q2x1c3RlcnMoKTtcbiAgfVxuXG4gIGdldEVuYWJsZVJldGluYUljb25zKCk6IGJvb2xlYW4ge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyQ2x1c3RlcmVyLmdldEVuYWJsZVJldGluYUljb25zKCk7XG4gIH1cblxuICBnZXRHcmlkU2l6ZSgpOiBudW1iZXIge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyQ2x1c3RlcmVyLmdldEdyaWRTaXplKCk7XG4gIH1cblxuICBnZXRJZ25vcmVIaWRkZW4oKTogYm9vbGVhbiB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJDbHVzdGVyZXIuZ2V0SWdub3JlSGlkZGVuKCk7XG4gIH1cblxuICBnZXRJbWFnZUV4dGVuc2lvbigpOiBzdHJpbmcge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyQ2x1c3RlcmVyLmdldEltYWdlRXh0ZW5zaW9uKCk7XG4gIH1cblxuICBnZXRJbWFnZVBhdGgoKTogc3RyaW5nIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlckNsdXN0ZXJlci5nZXRJbWFnZVBhdGgoKTtcbiAgfVxuXG4gIGdldEltYWdlU2l6ZXMoKTogbnVtYmVyW10ge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyQ2x1c3RlcmVyLmdldEltYWdlU2l6ZXMoKTtcbiAgfVxuXG4gIGdldE1heFpvb20oKTogbnVtYmVyIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlckNsdXN0ZXJlci5nZXRNYXhab29tKCk7XG4gIH1cblxuICBnZXRNaW5pbXVtQ2x1c3RlclNpemUoKTogbnVtYmVyIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlckNsdXN0ZXJlci5nZXRNaW5pbXVtQ2x1c3RlclNpemUoKTtcbiAgfVxuXG4gIGdldFN0eWxlcygpOiBDbHVzdGVySWNvblN0eWxlW10ge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyQ2x1c3RlcmVyLmdldFN0eWxlcygpO1xuICB9XG5cbiAgZ2V0VGl0bGUoKTogc3RyaW5nIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlckNsdXN0ZXJlci5nZXRUaXRsZSgpO1xuICB9XG5cbiAgZ2V0VG90YWxDbHVzdGVycygpOiBudW1iZXIge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyQ2x1c3RlcmVyLmdldFRvdGFsQ2x1c3RlcnMoKTtcbiAgfVxuXG4gIGdldFRvdGFsTWFya2VycygpOiBudW1iZXIge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyQ2x1c3RlcmVyLmdldFRvdGFsTWFya2VycygpO1xuICB9XG5cbiAgZ2V0WkluZGV4KCk6IG51bWJlciB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJDbHVzdGVyZXIuZ2V0WkluZGV4KCk7XG4gIH1cblxuICBnZXRab29tT25DbGljaygpOiBib29sZWFuIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlckNsdXN0ZXJlci5nZXRab29tT25DbGljaygpO1xuICB9XG5cbiAgcHJpdmF0ZSBfY29tYmluZU9wdGlvbnMoKTogTWFya2VyQ2x1c3RlcmVyT3B0aW9ucyB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMuX29wdGlvbnMgfHwgREVGQVVMVF9DTFVTVEVSRVJfT1BUSU9OUztcbiAgICByZXR1cm4ge1xuICAgICAgLi4ub3B0aW9ucyxcbiAgICAgIGFyaWFMYWJlbEZuOiB0aGlzLmFyaWFMYWJlbEZuID8/IG9wdGlvbnMuYXJpYUxhYmVsRm4sXG4gICAgICBhdmVyYWdlQ2VudGVyOiB0aGlzLl9hdmVyYWdlQ2VudGVyID8/IG9wdGlvbnMuYXZlcmFnZUNlbnRlcixcbiAgICAgIGJhdGNoU2l6ZTogdGhpcy5iYXRjaFNpemUgPz8gb3B0aW9ucy5iYXRjaFNpemUsXG4gICAgICBiYXRjaFNpemVJRTogdGhpcy5fYmF0Y2hTaXplSUUgPz8gb3B0aW9ucy5iYXRjaFNpemVJRSxcbiAgICAgIGNhbGN1bGF0b3I6IHRoaXMuX2NhbGN1bGF0b3IgPz8gb3B0aW9ucy5jYWxjdWxhdG9yLFxuICAgICAgY2x1c3RlckNsYXNzOiB0aGlzLl9jbHVzdGVyQ2xhc3MgPz8gb3B0aW9ucy5jbHVzdGVyQ2xhc3MsXG4gICAgICBlbmFibGVSZXRpbmFJY29uczogdGhpcy5fZW5hYmxlUmV0aW5hSWNvbnMgPz8gb3B0aW9ucy5lbmFibGVSZXRpbmFJY29ucyxcbiAgICAgIGdyaWRTaXplOiB0aGlzLl9ncmlkU2l6ZSA/PyBvcHRpb25zLmdyaWRTaXplLFxuICAgICAgaWdub3JlSGlkZGVuOiB0aGlzLl9pZ25vcmVIaWRkZW4gPz8gb3B0aW9ucy5pZ25vcmVIaWRkZW4sXG4gICAgICBpbWFnZUV4dGVuc2lvbjogdGhpcy5faW1hZ2VFeHRlbnNpb24gPz8gb3B0aW9ucy5pbWFnZUV4dGVuc2lvbixcbiAgICAgIGltYWdlUGF0aDogdGhpcy5faW1hZ2VQYXRoID8/IG9wdGlvbnMuaW1hZ2VQYXRoLFxuICAgICAgaW1hZ2VTaXplczogdGhpcy5faW1hZ2VTaXplcyA/PyBvcHRpb25zLmltYWdlU2l6ZXMsXG4gICAgICBtYXhab29tOiB0aGlzLl9tYXhab29tID8/IG9wdGlvbnMubWF4Wm9vbSxcbiAgICAgIG1pbmltdW1DbHVzdGVyU2l6ZTogdGhpcy5fbWluaW11bUNsdXN0ZXJTaXplID8/IG9wdGlvbnMubWluaW11bUNsdXN0ZXJTaXplLFxuICAgICAgc3R5bGVzOiB0aGlzLl9zdHlsZXMgPz8gb3B0aW9ucy5zdHlsZXMsXG4gICAgICB0aXRsZTogdGhpcy5fdGl0bGUgPz8gb3B0aW9ucy50aXRsZSxcbiAgICAgIHpJbmRleDogdGhpcy5fekluZGV4ID8/IG9wdGlvbnMuekluZGV4LFxuICAgICAgem9vbU9uQ2xpY2s6IHRoaXMuX3pvb21PbkNsaWNrID8/IG9wdGlvbnMuem9vbU9uQ2xpY2ssXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgX3dhdGNoRm9yTWFya2VyQ2hhbmdlcygpIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIGNvbnN0IGluaXRpYWxNYXJrZXJzOiBnb29nbGUubWFwcy5NYXJrZXJbXSA9IFtdO1xuICAgIGZvciAoY29uc3QgbWFya2VyIG9mIHRoaXMuX2dldEludGVybmFsTWFya2Vycyh0aGlzLl9tYXJrZXJzLnRvQXJyYXkoKSkpIHtcbiAgICAgIHRoaXMuX2N1cnJlbnRNYXJrZXJzLmFkZChtYXJrZXIpO1xuICAgICAgaW5pdGlhbE1hcmtlcnMucHVzaChtYXJrZXIpO1xuICAgIH1cbiAgICB0aGlzLm1hcmtlckNsdXN0ZXJlci5hZGRNYXJrZXJzKGluaXRpYWxNYXJrZXJzKTtcblxuICAgIHRoaXMuX21hcmtlcnMuY2hhbmdlcy5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95KSkuc3Vic2NyaWJlKFxuICAgICAgKG1hcmtlckNvbXBvbmVudHM6IE1hcE1hcmtlcltdKSA9PiB7XG4gICAgICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgICAgIGNvbnN0IG5ld01hcmtlcnMgPSBuZXcgU2V0PGdvb2dsZS5tYXBzLk1hcmtlcj4odGhpcy5fZ2V0SW50ZXJuYWxNYXJrZXJzKG1hcmtlckNvbXBvbmVudHMpKTtcbiAgICAgICAgY29uc3QgbWFya2Vyc1RvQWRkOiBnb29nbGUubWFwcy5NYXJrZXJbXSA9IFtdO1xuICAgICAgICBjb25zdCBtYXJrZXJzVG9SZW1vdmU6IGdvb2dsZS5tYXBzLk1hcmtlcltdID0gW107XG4gICAgICAgIGZvciAoY29uc3QgbWFya2VyIG9mIEFycmF5LmZyb20obmV3TWFya2VycykpIHtcbiAgICAgICAgICBpZiAoIXRoaXMuX2N1cnJlbnRNYXJrZXJzLmhhcyhtYXJrZXIpKSB7XG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50TWFya2Vycy5hZGQobWFya2VyKTtcbiAgICAgICAgICAgIG1hcmtlcnNUb0FkZC5wdXNoKG1hcmtlcik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgbWFya2VyIG9mIEFycmF5LmZyb20odGhpcy5fY3VycmVudE1hcmtlcnMpKSB7XG4gICAgICAgICAgaWYgKCFuZXdNYXJrZXJzLmhhcyhtYXJrZXIpKSB7XG4gICAgICAgICAgICBtYXJrZXJzVG9SZW1vdmUucHVzaChtYXJrZXIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLm1hcmtlckNsdXN0ZXJlci5hZGRNYXJrZXJzKG1hcmtlcnNUb0FkZCwgdHJ1ZSk7XG4gICAgICAgIHRoaXMubWFya2VyQ2x1c3RlcmVyLnJlbW92ZU1hcmtlcnMobWFya2Vyc1RvUmVtb3ZlLCB0cnVlKTtcbiAgICAgICAgdGhpcy5tYXJrZXJDbHVzdGVyZXIucmVwYWludCgpO1xuICAgICAgICBmb3IgKGNvbnN0IG1hcmtlciBvZiBtYXJrZXJzVG9SZW1vdmUpIHtcbiAgICAgICAgICB0aGlzLl9jdXJyZW50TWFya2Vycy5kZWxldGUobWFya2VyKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0SW50ZXJuYWxNYXJrZXJzKG1hcmtlcnM6IE1hcE1hcmtlcltdKTogZ29vZ2xlLm1hcHMuTWFya2VyW10ge1xuICAgIHJldHVybiBtYXJrZXJzLmZpbHRlcihtYXJrZXJDb21wb25lbnQgPT4gISFtYXJrZXJDb21wb25lbnQubWFya2VyKVxuICAgICAgICAubWFwKG1hcmtlckNvbXBvbmVudCA9PiBtYXJrZXJDb21wb25lbnQubWFya2VyISk7XG4gIH1cblxuICBwcml2YXRlIF9hc3NlcnRJbml0aWFsaXplZCgpOiBhc3NlcnRzIHRoaXMgaXMge21hcmtlckNsdXN0ZXJlcjogTWFya2VyQ2x1c3RlcmVyfSB7XG4gICAgaWYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkge1xuICAgICAgaWYgKCF0aGlzLl9nb29nbGVNYXAuZ29vZ2xlTWFwKSB7XG4gICAgICAgIHRocm93IEVycm9yKFxuICAgICAgICAgICdDYW5ub3QgYWNjZXNzIEdvb2dsZSBNYXAgaW5mb3JtYXRpb24gYmVmb3JlIHRoZSBBUEkgaGFzIGJlZW4gaW5pdGlhbGl6ZWQuICcgK1xuICAgICAgICAgICdQbGVhc2Ugd2FpdCBmb3IgdGhlIEFQSSB0byBsb2FkIGJlZm9yZSB0cnlpbmcgdG8gaW50ZXJhY3Qgd2l0aCBpdC4nKTtcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5tYXJrZXJDbHVzdGVyZXIpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICAgJ0Nhbm5vdCBpbnRlcmFjdCB3aXRoIGEgTWFya2VyQ2x1c3RlcmVyIGJlZm9yZSBpdCBoYXMgYmVlbiBpbml0aWFsaXplZC4gJyArXG4gICAgICAgICAgJ1BsZWFzZSB3YWl0IGZvciB0aGUgTWFya2VyQ2x1c3RlcmVyIHRvIGxvYWQgYmVmb3JlIHRyeWluZyB0byBpbnRlcmFjdCB3aXRoIGl0LicpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19