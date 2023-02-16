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
import { ChangeDetectionStrategy, Component, ContentChildren, Input, NgZone, Output, QueryList, ViewEncapsulation, } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GoogleMap } from '../google-map/google-map';
import { MapEventManager } from '../map-event-manager';
import { MapMarker } from '../map-marker/map-marker';
import * as i0 from "@angular/core";
import * as i1 from "../google-map/google-map";
/** Default options for a clusterer. */
const DEFAULT_CLUSTERER_OPTIONS = {};
/**
 * Angular component for implementing a Google Maps Marker Clusterer.
 *
 * See https://developers.google.com/maps/documentation/javascript/marker-clustering
 */
export class MapMarkerClusterer {
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
    ngOnInit() {
        if (this._canInitialize) {
            if (typeof MarkerClusterer !== 'function' &&
                (typeof ngDevMode === 'undefined' || ngDevMode)) {
                throw Error('MarkerClusterer class not found, cannot construct a marker cluster. ' +
                    'Please install the MarkerClustererPlus library: ' +
                    'https://github.com/googlemaps/js-markerclustererplus');
            }
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
        const { markerClusterer: clusterer, ariaLabelFn, _averageCenter, _batchSizeIE, _calculator, _styles, _clusterClass, _enableRetinaIcons, _gridSize, _ignoreHidden, _imageExtension, _imagePath, _imageSizes, _maxZoom, _minimumClusterSize, _title, _zIndex, _zoomOnClick, } = this;
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
        const options = this._options || DEFAULT_CLUSTERER_OPTIONS;
        return {
            ...options,
            ariaLabelFn: this.ariaLabelFn ?? options.ariaLabelFn,
            averageCenter: this._averageCenter ?? options.averageCenter,
            batchSize: this.batchSize ?? options.batchSize,
            batchSizeIE: this._batchSizeIE ?? options.batchSizeIE,
            calculator: this._calculator ?? options.calculator,
            clusterClass: this._clusterClass ?? options.clusterClass,
            enableRetinaIcons: this._enableRetinaIcons ?? options.enableRetinaIcons,
            gridSize: this._gridSize ?? options.gridSize,
            ignoreHidden: this._ignoreHidden ?? options.ignoreHidden,
            imageExtension: this._imageExtension ?? options.imageExtension,
            imagePath: this._imagePath ?? options.imagePath,
            imageSizes: this._imageSizes ?? options.imageSizes,
            maxZoom: this._maxZoom ?? options.maxZoom,
            minimumClusterSize: this._minimumClusterSize ?? options.minimumClusterSize,
            styles: this._styles ?? options.styles,
            title: this._title ?? options.title,
            zIndex: this._zIndex ?? options.zIndex,
            zoomOnClick: this._zoomOnClick ?? options.zoomOnClick,
        };
    }
    _watchForMarkerChanges() {
        this._assertInitialized();
        const initialMarkers = [];
        for (const marker of this._getInternalMarkers(this._markers.toArray())) {
            this._currentMarkers.add(marker);
            initialMarkers.push(marker);
        }
        this.markerClusterer.addMarkers(initialMarkers);
        this._markers.changes
            .pipe(takeUntil(this._destroy))
            .subscribe((markerComponents) => {
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
        return markers
            .filter(markerComponent => !!markerComponent.marker)
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
MapMarkerClusterer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.0-rc.0", ngImport: i0, type: MapMarkerClusterer, deps: [{ token: i1.GoogleMap }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component });
MapMarkerClusterer.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.0-rc.0", type: MapMarkerClusterer, selector: "map-marker-clusterer", inputs: { ariaLabelFn: "ariaLabelFn", averageCenter: "averageCenter", batchSize: "batchSize", batchSizeIE: "batchSizeIE", calculator: "calculator", clusterClass: "clusterClass", enableRetinaIcons: "enableRetinaIcons", gridSize: "gridSize", ignoreHidden: "ignoreHidden", imageExtension: "imageExtension", imagePath: "imagePath", imageSizes: "imageSizes", maxZoom: "maxZoom", minimumClusterSize: "minimumClusterSize", styles: "styles", title: "title", zIndex: "zIndex", zoomOnClick: "zoomOnClick", options: "options" }, outputs: { clusteringbegin: "clusteringbegin", clusteringend: "clusteringend", clusterClick: "clusterClick" }, queries: [{ propertyName: "_markers", predicate: MapMarker, descendants: true }], exportAs: ["mapMarkerClusterer"], usesOnChanges: true, ngImport: i0, template: '<ng-content></ng-content>', isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.0-rc.0", ngImport: i0, type: MapMarkerClusterer, decorators: [{
            type: Component,
            args: [{
                    selector: 'map-marker-clusterer',
                    exportAs: 'mapMarkerClusterer',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    template: '<ng-content></ng-content>',
                    encapsulation: ViewEncapsulation.None,
                }]
        }], ctorParameters: function () { return [{ type: i1.GoogleMap }, { type: i0.NgZone }]; }, propDecorators: { ariaLabelFn: [{
                type: Input
            }], averageCenter: [{
                type: Input
            }], batchSize: [{
                type: Input
            }], batchSizeIE: [{
                type: Input
            }], calculator: [{
                type: Input
            }], clusterClass: [{
                type: Input
            }], enableRetinaIcons: [{
                type: Input
            }], gridSize: [{
                type: Input
            }], ignoreHidden: [{
                type: Input
            }], imageExtension: [{
                type: Input
            }], imagePath: [{
                type: Input
            }], imageSizes: [{
                type: Input
            }], maxZoom: [{
                type: Input
            }], minimumClusterSize: [{
                type: Input
            }], styles: [{
                type: Input
            }], title: [{
                type: Input
            }], zIndex: [{
                type: Input
            }], zoomOnClick: [{
                type: Input
            }], options: [{
                type: Input
            }], clusteringbegin: [{
                type: Output
            }], clusteringend: [{
                type: Output
            }], clusterClick: [{
                type: Output
            }], _markers: [{
                type: ContentChildren,
                args: [MapMarker, { descendants: true }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLW1hcmtlci1jbHVzdGVyZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvZ29vZ2xlLW1hcHMvbWFwLW1hcmtlci1jbHVzdGVyZXIvbWFwLW1hcmtlci1jbHVzdGVyZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBU0EscUNBQXFDO0FBVHJDOzs7Ozs7R0FNRztBQUVILHlFQUF5RTtBQUN6RSxxQ0FBcUM7QUFFckMsT0FBTyxFQUVMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsZUFBZSxFQUNmLEtBQUssRUFDTCxNQUFNLEVBSU4sTUFBTSxFQUNOLFNBQVMsRUFFVCxpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDekMsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRXpDLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUNuRCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDckQsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLDBCQUEwQixDQUFDOzs7QUFVbkQsdUNBQXVDO0FBQ3ZDLE1BQU0seUJBQXlCLEdBQTJCLEVBQUUsQ0FBQztBQVE3RDs7OztHQUlHO0FBUUgsTUFBTSxPQUFPLGtCQUFrQjtJQVc3QixJQUNJLGFBQWEsQ0FBQyxhQUFzQjtRQUN0QyxJQUFJLENBQUMsY0FBYyxHQUFHLGFBQWEsQ0FBQztJQUN0QyxDQUFDO0lBS0QsSUFDSSxXQUFXLENBQUMsV0FBbUI7UUFDakMsSUFBSSxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUM7SUFDbEMsQ0FBQztJQUdELElBQ0ksVUFBVSxDQUFDLFVBQXNCO1FBQ25DLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO0lBQ2hDLENBQUM7SUFHRCxJQUNJLFlBQVksQ0FBQyxZQUFv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QUFLO2dCQU9GLEtBQUs7c0JBRFIsS0FBSztnQkFPRixNQUFNO3NCQURULEtBQUs7Z0JBT0YsV0FBVztzQkFEZCxLQUFLO2dCQU9GLE9BQU87c0JBRFYsS0FBSztnQkFXYSxlQUFlO3NCQUFqQyxNQUFNO2dCQU9ZLGFBQWE7c0JBQS9CLE1BQU07Z0JBS0UsWUFBWTtzQkFEcEIsTUFBTTtnQkFHMEMsUUFBUTtzQkFBeEQsZUFBZTt1QkFBQyxTQUFTLEVBQUUsRUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8vIFdvcmthcm91bmQgZm9yOiBodHRwczovL2dpdGh1Yi5jb20vYmF6ZWxidWlsZC9ydWxlc19ub2RlanMvaXNzdWVzLzEyNjVcbi8vLyA8cmVmZXJlbmNlIHR5cGVzPVwiZ29vZ2xlLm1hcHNcIiAvPlxuXG5pbXBvcnQge1xuICBBZnRlckNvbnRlbnRJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgUXVlcnlMaXN0LFxuICBTaW1wbGVDaGFuZ2VzLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge09ic2VydmFibGUsIFN1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHt0YWtlVW50aWx9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtHb29nbGVNYXB9IGZyb20gJy4uL2dvb2dsZS1tYXAvZ29vZ2xlLW1hcCc7XG5pbXBvcnQge01hcEV2ZW50TWFuYWdlcn0gZnJvbSAnLi4vbWFwLWV2ZW50LW1hbmFnZXInO1xuaW1wb3J0IHtNYXBNYXJrZXJ9IGZyb20gJy4uL21hcC1tYXJrZXIvbWFwLW1hcmtlcic7XG5pbXBvcnQge1xuICBBcmlhTGFiZWxGbixcbiAgQ2FsY3VsYXRvcixcbiAgQ2x1c3RlcixcbiAgQ2x1c3Rlckljb25TdHlsZSxcbiAgTWFya2VyQ2x1c3RlcmVyIGFzIE1hcmtlckNsdXN0ZXJlckluc3RhbmNlLFxuICBNYXJrZXJDbHVzdGVyZXJPcHRpb25zLFxufSBmcm9tICcuL21hcmtlci1jbHVzdGVyZXItdHlwZXMnO1xuXG4vKiogRGVmYXVsdCBvcHRpb25zIGZvciBhIGNsdXN0ZXJlci4gKi9cbmNvbnN0IERFRkFVTFRfQ0xVU1RFUkVSX09QVElPTlM6IE1hcmtlckNsdXN0ZXJlck9wdGlvbnMgPSB7fTtcblxuLyoqXG4gKiBUaGUgY2x1c3RlcmVyIGhhcyB0byBiZSBkZWZpbmVkIGFuZCByZWZlcnJlZCB0byBhcyBhIGdsb2JhbCB2YXJpYWJsZSxcbiAqIG90aGVyd2lzZSBpdCdsbCBjYXVzZSBpc3N1ZXMgd2hlbiBtaW5pZmllZCB0aHJvdWdoIENsb3N1cmUuXG4gKi9cbmRlY2xhcmUgY29uc3QgTWFya2VyQ2x1c3RlcmVyOiB0eXBlb2YgTWFya2VyQ2x1c3RlcmVySW5zdGFuY2U7XG5cbi8qKlxuICogQW5ndWxhciBjb21wb25lbnQgZm9yIGltcGxlbWVudGluZyBhIEdvb2dsZSBNYXBzIE1hcmtlciBDbHVzdGVyZXIuXG4gKlxuICogU2VlIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L21hcmtlci1jbHVzdGVyaW5nXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hcC1tYXJrZXItY2x1c3RlcmVyJyxcbiAgZXhwb3J0QXM6ICdtYXBNYXJrZXJDbHVzdGVyZXInLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgdGVtcGxhdGU6ICc8bmctY29udGVudD48L25nLWNvbnRlbnQ+JyxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbn0pXG5leHBvcnQgY2xhc3MgTWFwTWFya2VyQ2x1c3RlcmVyIGltcGxlbWVudHMgT25Jbml0LCBBZnRlckNvbnRlbnRJbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2N1cnJlbnRNYXJrZXJzID0gbmV3IFNldDxnb29nbGUubWFwcy5NYXJrZXI+KCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2V2ZW50TWFuYWdlciA9IG5ldyBNYXBFdmVudE1hbmFnZXIodGhpcy5fbmdab25lKTtcbiAgcHJpdmF0ZSByZWFkb25seSBfZGVzdHJveSA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNsdXN0ZXJlciBpcyBhbGxvd2VkIHRvIGJlIGluaXRpYWxpemVkLiAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9jYW5Jbml0aWFsaXplOiBib29sZWFuO1xuXG4gIEBJbnB1dCgpXG4gIGFyaWFMYWJlbEZuOiBBcmlhTGFiZWxGbiA9ICgpID0+ICcnO1xuXG4gIEBJbnB1dCgpXG4gIHNldCBhdmVyYWdlQ2VudGVyKGF2ZXJhZ2VDZW50ZXI6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9hdmVyYWdlQ2VudGVyID0gYXZlcmFnZUNlbnRlcjtcbiAgfVxuICBwcml2YXRlIF9hdmVyYWdlQ2VudGVyOiBib29sZWFuO1xuXG4gIEBJbnB1dCgpIGJhdGNoU2l6ZT86IG51bWJlcjtcblxuICBASW5wdXQoKVxuICBzZXQgYmF0Y2hTaXplSUUoYmF0Y2hTaXplSUU6IG51bWJlcikge1xuICAgIHRoaXMuX2JhdGNoU2l6ZUlFID0gYmF0Y2hTaXplSUU7XG4gIH1cbiAgcHJpdmF0ZSBfYmF0Y2hTaXplSUU6IG51bWJlcjtcblxuICBASW5wdXQoKVxuICBzZXQgY2FsY3VsYXRvcihjYWxjdWxhdG9yOiBDYWxjdWxhdG9yKSB7XG4gICAgdGhpcy5fY2FsY3VsYXRvciA9IGNhbGN1bGF0b3I7XG4gIH1cbiAgcHJpdmF0ZSBfY2FsY3VsYXRvcjogQ2FsY3VsYXRvcjtcblxuICBASW5wdXQoKVxuICBzZXQgY2x1c3RlckNsYXNzKGNsdXN0ZXJDbGFzczogc3RyaW5nKSB7XG4gICAgdGhpcy5fY2x1c3RlckNsYXNzID0gY2x1c3RlckNsYXNzO1xuICB9XG4gIHByaXZhdGUgX2NsdXN0ZXJDbGFzczogc3RyaW5nO1xuXG4gIEBJbnB1dCgpXG4gIHNldCBlbmFibGVSZXRpbmFJY29ucyhlbmFibGVSZXRpbmFJY29uczogYm9vbGVhbikge1xuICAgIHRoaXMuX2VuYWJsZVJldGluYUljb25zID0gZW5hYmxlUmV0aW5hSWNvbnM7XG4gIH1cbiAgcHJpdmF0ZSBfZW5hYmxlUmV0aW5hSWNvbnM6IGJvb2xlYW47XG5cbiAgQElucHV0KClcbiAgc2V0IGdyaWRTaXplKGdyaWRTaXplOiBudW1iZXIpIHtcbiAgICB0aGlzLl9ncmlkU2l6ZSA9IGdyaWRTaXplO1xuICB9XG4gIHByaXZhdGUgX2dyaWRTaXplOiBudW1iZXI7XG5cbiAgQElucHV0KClcbiAgc2V0IGlnbm9yZUhpZGRlbihpZ25vcmVIaWRkZW46IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9pZ25vcmVIaWRkZW4gPSBpZ25vcmVIaWRkZW47XG4gIH1cbiAgcHJpdmF0ZSBfaWdub3JlSGlkZGVuOiBib29sZWFuO1xuXG4gIEBJbnB1dCgpXG4gIHNldCBpbWFnZUV4dGVuc2lvbihpbWFnZUV4dGVuc2lvbjogc3RyaW5nKSB7XG4gICAgdGhpcy5faW1hZ2VFeHRlbnNpb24gPSBpbWFnZUV4dGVuc2lvbjtcbiAgfVxuICBwcml2YXRlIF9pbWFnZUV4dGVuc2lvbjogc3RyaW5nO1xuXG4gIEBJbnB1dCgpXG4gIHNldCBpbWFnZVBhdGgoaW1hZ2VQYXRoOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9pbWFnZVBhdGggPSBpbWFnZVBhdGg7XG4gIH1cbiAgcHJpdmF0ZSBfaW1hZ2VQYXRoOiBzdHJpbmc7XG5cbiAgQElucHV0KClcbiAgc2V0IGltYWdlU2l6ZXMoaW1hZ2VTaXplczogbnVtYmVyW10pIHtcbiAgICB0aGlzLl9pbWFnZVNpemVzID0gaW1hZ2VTaXplcztcbiAgfVxuICBwcml2YXRlIF9pbWFnZVNpemVzOiBudW1iZXJbXTtcblxuICBASW5wdXQoKVxuICBzZXQgbWF4Wm9vbShtYXhab29tOiBudW1iZXIpIHtcbiAgICB0aGlzLl9tYXhab29tID0gbWF4Wm9vbTtcbiAgfVxuICBwcml2YXRlIF9tYXhab29tOiBudW1iZXI7XG5cbiAgQElucHV0KClcbiAgc2V0IG1pbmltdW1DbHVzdGVyU2l6ZShtaW5pbXVtQ2x1c3RlclNpemU6IG51bWJlcikge1xuICAgIHRoaXMuX21pbmltdW1DbHVzdGVyU2l6ZSA9IG1pbmltdW1DbHVzdGVyU2l6ZTtcbiAgfVxuICBwcml2YXRlIF9taW5pbXVtQ2x1c3RlclNpemU6IG51bWJlcjtcblxuICBASW5wdXQoKVxuICBzZXQgc3R5bGVzKHN0eWxlczogQ2x1c3Rlckljb25TdHlsZVtdKSB7XG4gICAgdGhpcy5fc3R5bGVzID0gc3R5bGVzO1xuICB9XG4gIHByaXZhdGUgX3N0eWxlczogQ2x1c3Rlckljb25TdHlsZVtdO1xuXG4gIEBJbnB1dCgpXG4gIHNldCB0aXRsZSh0aXRsZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fdGl0bGUgPSB0aXRsZTtcbiAgfVxuICBwcml2YXRlIF90aXRsZTogc3RyaW5nO1xuXG4gIEBJbnB1dCgpXG4gIHNldCB6SW5kZXgoekluZGV4OiBudW1iZXIpIHtcbiAgICB0aGlzLl96SW5kZXggPSB6SW5kZXg7XG4gIH1cbiAgcHJpdmF0ZSBfekluZGV4OiBudW1iZXI7XG5cbiAgQElucHV0KClcbiAgc2V0IHpvb21PbkNsaWNrKHpvb21PbkNsaWNrOiBib29sZWFuKSB7XG4gICAgdGhpcy5fem9vbU9uQ2xpY2sgPSB6b29tT25DbGljaztcbiAgfVxuICBwcml2YXRlIF96b29tT25DbGljazogYm9vbGVhbjtcblxuICBASW5wdXQoKVxuICBzZXQgb3B0aW9ucyhvcHRpb25zOiBNYXJrZXJDbHVzdGVyZXJPcHRpb25zKSB7XG4gICAgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnM7XG4gIH1cbiAgcHJpdmF0ZSBfb3B0aW9uczogTWFya2VyQ2x1c3RlcmVyT3B0aW9ucztcblxuICAvKipcbiAgICogU2VlXG4gICAqIGdvb2dsZW1hcHMuZ2l0aHViLmlvL3YzLXV0aWxpdHktbGlicmFyeS9tb2R1bGVzL1xuICAgKiBfZ29vZ2xlX21hcmtlcmNsdXN0ZXJlcnBsdXMuaHRtbCNjbHVzdGVyaW5nYmVnaW5cbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBjbHVzdGVyaW5nYmVnaW46IE9ic2VydmFibGU8dm9pZD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPignY2x1c3RlcmluZ2JlZ2luJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBnb29nbGVtYXBzLmdpdGh1Yi5pby92My11dGlsaXR5LWxpYnJhcnkvbW9kdWxlcy9fZ29vZ2xlX21hcmtlcmNsdXN0ZXJlcnBsdXMuaHRtbCNjbHVzdGVyaW5nZW5kXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgY2x1c3RlcmluZ2VuZDogT2JzZXJ2YWJsZTx2b2lkPiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCdjbHVzdGVyaW5nZW5kJyk7XG5cbiAgLyoqIEVtaXRzIHdoZW4gYSBjbHVzdGVyIGhhcyBiZWVuIGNsaWNrZWQuICovXG4gIEBPdXRwdXQoKVxuICByZWFkb25seSBjbHVzdGVyQ2xpY2s6IE9ic2VydmFibGU8Q2x1c3Rlcj4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Q2x1c3Rlcj4oJ2NsaWNrJyk7XG5cbiAgQENvbnRlbnRDaGlsZHJlbihNYXBNYXJrZXIsIHtkZXNjZW5kYW50czogdHJ1ZX0pIF9tYXJrZXJzOiBRdWVyeUxpc3Q8TWFwTWFya2VyPjtcblxuICAvKipcbiAgICogVGhlIHVuZGVybHlpbmcgTWFya2VyQ2x1c3RlcmVyIG9iamVjdC5cbiAgICpcbiAgICogU2VlXG4gICAqIGdvb2dsZW1hcHMuZ2l0aHViLmlvL3YzLXV0aWxpdHktbGlicmFyeS9jbGFzc2VzL1xuICAgKiBfZ29vZ2xlX21hcmtlcmNsdXN0ZXJlcnBsdXMubWFya2VyY2x1c3RlcmVyLmh0bWxcbiAgICovXG4gIG1hcmtlckNsdXN0ZXJlcj86IE1hcmtlckNsdXN0ZXJlckluc3RhbmNlO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgX2dvb2dsZU1hcDogR29vZ2xlTWFwLCBwcml2YXRlIHJlYWRvbmx5IF9uZ1pvbmU6IE5nWm9uZSkge1xuICAgIHRoaXMuX2NhbkluaXRpYWxpemUgPSB0aGlzLl9nb29nbGVNYXAuX2lzQnJvd3NlcjtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICh0aGlzLl9jYW5Jbml0aWFsaXplKSB7XG4gICAgICBpZiAoXG4gICAgICAgIHR5cGVvZiBNYXJrZXJDbHVzdGVyZXIgIT09ICdmdW5jdGlvbicgJiZcbiAgICAgICAgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSlcbiAgICAgICkge1xuICAgICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICAnTWFya2VyQ2x1c3RlcmVyIGNsYXNzIG5vdCBmb3VuZCwgY2Fubm90IGNvbnN0cnVjdCBhIG1hcmtlciBjbHVzdGVyLiAnICtcbiAgICAgICAgICAgICdQbGVhc2UgaW5zdGFsbCB0aGUgTWFya2VyQ2x1c3RlcmVyUGx1cyBsaWJyYXJ5OiAnICtcbiAgICAgICAgICAgICdodHRwczovL2dpdGh1Yi5jb20vZ29vZ2xlbWFwcy9qcy1tYXJrZXJjbHVzdGVyZXJwbHVzJyxcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgLy8gQ3JlYXRlIHRoZSBvYmplY3Qgb3V0c2lkZSB0aGUgem9uZSBzbyBpdHMgZXZlbnRzIGRvbid0IHRyaWdnZXIgY2hhbmdlIGRldGVjdGlvbi5cbiAgICAgIC8vIFdlJ2xsIGJyaW5nIGl0IGJhY2sgaW4gaW5zaWRlIHRoZSBgTWFwRXZlbnRNYW5hZ2VyYCBvbmx5IGZvciB0aGUgZXZlbnRzIHRoYXQgdGhlXG4gICAgICAvLyB1c2VyIGhhcyBzdWJzY3JpYmVkIHRvLlxuICAgICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgdGhpcy5tYXJrZXJDbHVzdGVyZXIgPSBuZXcgTWFya2VyQ2x1c3RlcmVyKFxuICAgICAgICAgIHRoaXMuX2dvb2dsZU1hcC5nb29nbGVNYXAhLFxuICAgICAgICAgIFtdLFxuICAgICAgICAgIHRoaXMuX2NvbWJpbmVPcHRpb25zKCksXG4gICAgICAgICk7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5zZXRUYXJnZXQodGhpcy5tYXJrZXJDbHVzdGVyZXIpO1xuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICBpZiAodGhpcy5fY2FuSW5pdGlhbGl6ZSkge1xuICAgICAgdGhpcy5fd2F0Y2hGb3JNYXJrZXJDaGFuZ2VzKCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGNvbnN0IHtcbiAgICAgIG1hcmtlckNsdXN0ZXJlcjogY2x1c3RlcmVyLFxuICAgICAgYXJpYUxhYmVsRm4sXG4gICAgICBfYXZlcmFnZUNlbnRlcixcbiAgICAgIF9iYXRjaFNpemVJRSxcbiAgICAgIF9jYWxjdWxhdG9yLFxuICAgICAgX3N0eWxlcyxcbiAgICAgIF9jbHVzdGVyQ2xhc3MsXG4gICAgICBfZW5hYmxlUmV0aW5hSWNvbnMsXG4gICAgICBfZ3JpZFNpemUsXG4gICAgICBfaWdub3JlSGlkZGVuLFxuICAgICAgX2ltYWdlRXh0ZW5zaW9uLFxuICAgICAgX2ltYWdlUGF0aCxcbiAgICAgIF9pbWFnZVNpemVzLFxuICAgICAgX21heFpvb20sXG4gICAgICBfbWluaW11bUNsdXN0ZXJTaXplLFxuICAgICAgX3RpdGxlLFxuICAgICAgX3pJbmRleCxcbiAgICAgIF96b29tT25DbGljayxcbiAgICB9ID0gdGhpcztcblxuICAgIGlmIChjbHVzdGVyZXIpIHtcbiAgICAgIGlmIChjaGFuZ2VzWydvcHRpb25zJ10pIHtcbiAgICAgICAgY2x1c3RlcmVyLnNldE9wdGlvbnModGhpcy5fY29tYmluZU9wdGlvbnMoKSk7XG4gICAgICB9XG4gICAgICBpZiAoY2hhbmdlc1snYXJpYUxhYmVsRm4nXSkge1xuICAgICAgICBjbHVzdGVyZXIuYXJpYUxhYmVsRm4gPSBhcmlhTGFiZWxGbjtcbiAgICAgIH1cbiAgICAgIGlmIChjaGFuZ2VzWydhdmVyYWdlQ2VudGVyJ10gJiYgX2F2ZXJhZ2VDZW50ZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjbHVzdGVyZXIuc2V0QXZlcmFnZUNlbnRlcihfYXZlcmFnZUNlbnRlcik7XG4gICAgICB9XG4gICAgICBpZiAoY2hhbmdlc1snYmF0Y2hTaXplSUUnXSAmJiBfYmF0Y2hTaXplSUUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjbHVzdGVyZXIuc2V0QmF0Y2hTaXplSUUoX2JhdGNoU2l6ZUlFKTtcbiAgICAgIH1cbiAgICAgIGlmIChjaGFuZ2VzWydjYWxjdWxhdG9yJ10gJiYgISFfY2FsY3VsYXRvcikge1xuICAgICAgICBjbHVzdGVyZXIuc2V0Q2FsY3VsYXRvcihfY2FsY3VsYXRvcik7XG4gICAgICB9XG4gICAgICBpZiAoY2hhbmdlc1snY2x1c3RlckNsYXNzJ10gJiYgX2NsdXN0ZXJDbGFzcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNsdXN0ZXJlci5zZXRDbHVzdGVyQ2xhc3MoX2NsdXN0ZXJDbGFzcyk7XG4gICAgICB9XG4gICAgICBpZiAoY2hhbmdlc1snZW5hYmxlUmV0aW5hSWNvbnMnXSAmJiBfZW5hYmxlUmV0aW5hSWNvbnMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjbHVzdGVyZXIuc2V0RW5hYmxlUmV0aW5hSWNvbnMoX2VuYWJsZVJldGluYUljb25zKTtcbiAgICAgIH1cbiAgICAgIGlmIChjaGFuZ2VzWydncmlkU2l6ZSddICYmIF9ncmlkU2l6ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNsdXN0ZXJlci5zZXRHcmlkU2l6ZShfZ3JpZFNpemUpO1xuICAgICAgfVxuICAgICAgaWYgKGNoYW5nZXNbJ2lnbm9yZUhpZGRlbiddICYmIF9pZ25vcmVIaWRkZW4gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjbHVzdGVyZXIuc2V0SWdub3JlSGlkZGVuKF9pZ25vcmVIaWRkZW4pO1xuICAgICAgfVxuICAgICAgaWYgKGNoYW5nZXNbJ2ltYWdlRXh0ZW5zaW9uJ10gJiYgX2ltYWdlRXh0ZW5zaW9uICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY2x1c3RlcmVyLnNldEltYWdlRXh0ZW5zaW9uKF9pbWFnZUV4dGVuc2lvbik7XG4gICAgICB9XG4gICAgICBpZiAoY2hhbmdlc1snaW1hZ2VQYXRoJ10gJiYgX2ltYWdlUGF0aCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNsdXN0ZXJlci5zZXRJbWFnZVBhdGgoX2ltYWdlUGF0aCk7XG4gICAgICB9XG4gICAgICBpZiAoY2hhbmdlc1snaW1hZ2VTaXplcyddICYmIF9pbWFnZVNpemVzKSB7XG4gICAgICAgIGNsdXN0ZXJlci5zZXRJbWFnZVNpemVzKF9pbWFnZVNpemVzKTtcbiAgICAgIH1cbiAgICAgIGlmIChjaGFuZ2VzWydtYXhab29tJ10gJiYgX21heFpvb20gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjbHVzdGVyZXIuc2V0TWF4Wm9vbShfbWF4Wm9vbSk7XG4gICAgICB9XG4gICAgICBpZiAoY2hhbmdlc1snbWluaW11bUNsdXN0ZXJTaXplJ10gJiYgX21pbmltdW1DbHVzdGVyU2l6ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNsdXN0ZXJlci5zZXRNaW5pbXVtQ2x1c3RlclNpemUoX21pbmltdW1DbHVzdGVyU2l6ZSk7XG4gICAgICB9XG4gICAgICBpZiAoY2hhbmdlc1snc3R5bGVzJ10gJiYgX3N0eWxlcykge1xuICAgICAgICBjbHVzdGVyZXIuc2V0U3R5bGVzKF9zdHlsZXMpO1xuICAgICAgfVxuICAgICAgaWYgKGNoYW5nZXNbJ3RpdGxlJ10gJiYgX3RpdGxlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY2x1c3RlcmVyLnNldFRpdGxlKF90aXRsZSk7XG4gICAgICB9XG4gICAgICBpZiAoY2hhbmdlc1snekluZGV4J10gJiYgX3pJbmRleCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNsdXN0ZXJlci5zZXRaSW5kZXgoX3pJbmRleCk7XG4gICAgICB9XG4gICAgICBpZiAoY2hhbmdlc1snem9vbU9uQ2xpY2snXSAmJiBfem9vbU9uQ2xpY2sgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjbHVzdGVyZXIuc2V0Wm9vbU9uQ2xpY2soX3pvb21PbkNsaWNrKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9kZXN0cm95Lm5leHQoKTtcbiAgICB0aGlzLl9kZXN0cm95LmNvbXBsZXRlKCk7XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmRlc3Ryb3koKTtcbiAgICBpZiAodGhpcy5tYXJrZXJDbHVzdGVyZXIpIHtcbiAgICAgIHRoaXMubWFya2VyQ2x1c3RlcmVyLnNldE1hcChudWxsKTtcbiAgICB9XG4gIH1cblxuICBmaXRNYXBUb01hcmtlcnMocGFkZGluZzogbnVtYmVyIHwgZ29vZ2xlLm1hcHMuUGFkZGluZykge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgdGhpcy5tYXJrZXJDbHVzdGVyZXIuZml0TWFwVG9NYXJrZXJzKHBhZGRpbmcpO1xuICB9XG5cbiAgZ2V0QXZlcmFnZUNlbnRlcigpOiBib29sZWFuIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlckNsdXN0ZXJlci5nZXRBdmVyYWdlQ2VudGVyKCk7XG4gIH1cblxuICBnZXRCYXRjaFNpemVJRSgpOiBudW1iZXIge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyQ2x1c3RlcmVyLmdldEJhdGNoU2l6ZUlFKCk7XG4gIH1cblxuICBnZXRDYWxjdWxhdG9yKCk6IENhbGN1bGF0b3Ige1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyQ2x1c3RlcmVyLmdldENhbGN1bGF0b3IoKTtcbiAgfVxuXG4gIGdldENsdXN0ZXJDbGFzcygpOiBzdHJpbmcge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyQ2x1c3RlcmVyLmdldENsdXN0ZXJDbGFzcygpO1xuICB9XG5cbiAgZ2V0Q2x1c3RlcnMoKTogQ2x1c3RlcltdIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlckNsdXN0ZXJlci5nZXRDbHVzdGVycygpO1xuICB9XG5cbiAgZ2V0RW5hYmxlUmV0aW5hSWNvbnMoKTogYm9vbGVhbiB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJDbHVzdGVyZXIuZ2V0RW5hYmxlUmV0aW5hSWNvbnMoKTtcbiAgfVxuXG4gIGdldEdyaWRTaXplKCk6IG51bWJlciB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJDbHVzdGVyZXIuZ2V0R3JpZFNpemUoKTtcbiAgfVxuXG4gIGdldElnbm9yZUhpZGRlbigpOiBib29sZWFuIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlckNsdXN0ZXJlci5nZXRJZ25vcmVIaWRkZW4oKTtcbiAgfVxuXG4gIGdldEltYWdlRXh0ZW5zaW9uKCk6IHN0cmluZyB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJDbHVzdGVyZXIuZ2V0SW1hZ2VFeHRlbnNpb24oKTtcbiAgfVxuXG4gIGdldEltYWdlUGF0aCgpOiBzdHJpbmcge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyQ2x1c3RlcmVyLmdldEltYWdlUGF0aCgpO1xuICB9XG5cbiAgZ2V0SW1hZ2VTaXplcygpOiBudW1iZXJbXSB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJDbHVzdGVyZXIuZ2V0SW1hZ2VTaXplcygpO1xuICB9XG5cbiAgZ2V0TWF4Wm9vbSgpOiBudW1iZXIge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyQ2x1c3RlcmVyLmdldE1heFpvb20oKTtcbiAgfVxuXG4gIGdldE1pbmltdW1DbHVzdGVyU2l6ZSgpOiBudW1iZXIge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyQ2x1c3RlcmVyLmdldE1pbmltdW1DbHVzdGVyU2l6ZSgpO1xuICB9XG5cbiAgZ2V0U3R5bGVzKCk6IENsdXN0ZXJJY29uU3R5bGVbXSB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJDbHVzdGVyZXIuZ2V0U3R5bGVzKCk7XG4gIH1cblxuICBnZXRUaXRsZSgpOiBzdHJpbmcge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyQ2x1c3RlcmVyLmdldFRpdGxlKCk7XG4gIH1cblxuICBnZXRUb3RhbENsdXN0ZXJzKCk6IG51bWJlciB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJDbHVzdGVyZXIuZ2V0VG90YWxDbHVzdGVycygpO1xuICB9XG5cbiAgZ2V0VG90YWxNYXJrZXJzKCk6IG51bWJlciB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJDbHVzdGVyZXIuZ2V0VG90YWxNYXJrZXJzKCk7XG4gIH1cblxuICBnZXRaSW5kZXgoKTogbnVtYmVyIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlckNsdXN0ZXJlci5nZXRaSW5kZXgoKTtcbiAgfVxuXG4gIGdldFpvb21PbkNsaWNrKCk6IGJvb2xlYW4ge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyQ2x1c3RlcmVyLmdldFpvb21PbkNsaWNrKCk7XG4gIH1cblxuICBwcml2YXRlIF9jb21iaW5lT3B0aW9ucygpOiBNYXJrZXJDbHVzdGVyZXJPcHRpb25zIHtcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5fb3B0aW9ucyB8fCBERUZBVUxUX0NMVVNURVJFUl9PUFRJT05TO1xuICAgIHJldHVybiB7XG4gICAgICAuLi5vcHRpb25zLFxuICAgICAgYXJpYUxhYmVsRm46IHRoaXMuYXJpYUxhYmVsRm4gPz8gb3B0aW9ucy5hcmlhTGFiZWxGbixcbiAgICAgIGF2ZXJhZ2VDZW50ZXI6IHRoaXMuX2F2ZXJhZ2VDZW50ZXIgPz8gb3B0aW9ucy5hdmVyYWdlQ2VudGVyLFxuICAgICAgYmF0Y2hTaXplOiB0aGlzLmJhdGNoU2l6ZSA/PyBvcHRpb25zLmJhdGNoU2l6ZSxcbiAgICAgIGJhdGNoU2l6ZUlFOiB0aGlzLl9iYXRjaFNpemVJRSA/PyBvcHRpb25zLmJhdGNoU2l6ZUlFLFxuICAgICAgY2FsY3VsYXRvcjogdGhpcy5fY2FsY3VsYXRvciA/PyBvcHRpb25zLmNhbGN1bGF0b3IsXG4gICAgICBjbHVzdGVyQ2xhc3M6IHRoaXMuX2NsdXN0ZXJDbGFzcyA/PyBvcHRpb25zLmNsdXN0ZXJDbGFzcyxcbiAgICAgIGVuYWJsZVJldGluYUljb25zOiB0aGlzLl9lbmFibGVSZXRpbmFJY29ucyA/PyBvcHRpb25zLmVuYWJsZVJldGluYUljb25zLFxuICAgICAgZ3JpZFNpemU6IHRoaXMuX2dyaWRTaXplID8/IG9wdGlvbnMuZ3JpZFNpemUsXG4gICAgICBpZ25vcmVIaWRkZW46IHRoaXMuX2lnbm9yZUhpZGRlbiA/PyBvcHRpb25zLmlnbm9yZUhpZGRlbixcbiAgICAgIGltYWdlRXh0ZW5zaW9uOiB0aGlzLl9pbWFnZUV4dGVuc2lvbiA/PyBvcHRpb25zLmltYWdlRXh0ZW5zaW9uLFxuICAgICAgaW1hZ2VQYXRoOiB0aGlzLl9pbWFnZVBhdGggPz8gb3B0aW9ucy5pbWFnZVBhdGgsXG4gICAgICBpbWFnZVNpemVzOiB0aGlzLl9pbWFnZVNpemVzID8/IG9wdGlvbnMuaW1hZ2VTaXplcyxcbiAgICAgIG1heFpvb206IHRoaXMuX21heFpvb20gPz8gb3B0aW9ucy5tYXhab29tLFxuICAgICAgbWluaW11bUNsdXN0ZXJTaXplOiB0aGlzLl9taW5pbXVtQ2x1c3RlclNpemUgPz8gb3B0aW9ucy5taW5pbXVtQ2x1c3RlclNpemUsXG4gICAgICBzdHlsZXM6IHRoaXMuX3N0eWxlcyA/PyBvcHRpb25zLnN0eWxlcyxcbiAgICAgIHRpdGxlOiB0aGlzLl90aXRsZSA/PyBvcHRpb25zLnRpdGxlLFxuICAgICAgekluZGV4OiB0aGlzLl96SW5kZXggPz8gb3B0aW9ucy56SW5kZXgsXG4gICAgICB6b29tT25DbGljazogdGhpcy5fem9vbU9uQ2xpY2sgPz8gb3B0aW9ucy56b29tT25DbGljayxcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBfd2F0Y2hGb3JNYXJrZXJDaGFuZ2VzKCkge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgY29uc3QgaW5pdGlhbE1hcmtlcnM6IGdvb2dsZS5tYXBzLk1hcmtlcltdID0gW107XG4gICAgZm9yIChjb25zdCBtYXJrZXIgb2YgdGhpcy5fZ2V0SW50ZXJuYWxNYXJrZXJzKHRoaXMuX21hcmtlcnMudG9BcnJheSgpKSkge1xuICAgICAgdGhpcy5fY3VycmVudE1hcmtlcnMuYWRkKG1hcmtlcik7XG4gICAgICBpbml0aWFsTWFya2Vycy5wdXNoKG1hcmtlcik7XG4gICAgfVxuICAgIHRoaXMubWFya2VyQ2x1c3RlcmVyLmFkZE1hcmtlcnMoaW5pdGlhbE1hcmtlcnMpO1xuXG4gICAgdGhpcy5fbWFya2Vycy5jaGFuZ2VzXG4gICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveSkpXG4gICAgICAuc3Vic2NyaWJlKChtYXJrZXJDb21wb25lbnRzOiBNYXBNYXJrZXJbXSkgPT4ge1xuICAgICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgICBjb25zdCBuZXdNYXJrZXJzID0gbmV3IFNldDxnb29nbGUubWFwcy5NYXJrZXI+KHRoaXMuX2dldEludGVybmFsTWFya2VycyhtYXJrZXJDb21wb25lbnRzKSk7XG4gICAgICAgIGNvbnN0IG1hcmtlcnNUb0FkZDogZ29vZ2xlLm1hcHMuTWFya2VyW10gPSBbXTtcbiAgICAgICAgY29uc3QgbWFya2Vyc1RvUmVtb3ZlOiBnb29nbGUubWFwcy5NYXJrZXJbXSA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IG1hcmtlciBvZiBBcnJheS5mcm9tKG5ld01hcmtlcnMpKSB7XG4gICAgICAgICAgaWYgKCF0aGlzLl9jdXJyZW50TWFya2Vycy5oYXMobWFya2VyKSkge1xuICAgICAgICAgICAgdGhpcy5fY3VycmVudE1hcmtlcnMuYWRkKG1hcmtlcik7XG4gICAgICAgICAgICBtYXJrZXJzVG9BZGQucHVzaChtYXJrZXIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IG1hcmtlciBvZiBBcnJheS5mcm9tKHRoaXMuX2N1cnJlbnRNYXJrZXJzKSkge1xuICAgICAgICAgIGlmICghbmV3TWFya2Vycy5oYXMobWFya2VyKSkge1xuICAgICAgICAgICAgbWFya2Vyc1RvUmVtb3ZlLnB1c2gobWFya2VyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5tYXJrZXJDbHVzdGVyZXIuYWRkTWFya2VycyhtYXJrZXJzVG9BZGQsIHRydWUpO1xuICAgICAgICB0aGlzLm1hcmtlckNsdXN0ZXJlci5yZW1vdmVNYXJrZXJzKG1hcmtlcnNUb1JlbW92ZSwgdHJ1ZSk7XG4gICAgICAgIHRoaXMubWFya2VyQ2x1c3RlcmVyLnJlcGFpbnQoKTtcbiAgICAgICAgZm9yIChjb25zdCBtYXJrZXIgb2YgbWFya2Vyc1RvUmVtb3ZlKSB7XG4gICAgICAgICAgdGhpcy5fY3VycmVudE1hcmtlcnMuZGVsZXRlKG1hcmtlcik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0SW50ZXJuYWxNYXJrZXJzKG1hcmtlcnM6IE1hcE1hcmtlcltdKTogZ29vZ2xlLm1hcHMuTWFya2VyW10ge1xuICAgIHJldHVybiBtYXJrZXJzXG4gICAgICAuZmlsdGVyKG1hcmtlckNvbXBvbmVudCA9PiAhIW1hcmtlckNvbXBvbmVudC5tYXJrZXIpXG4gICAgICAubWFwKG1hcmtlckNvbXBvbmVudCA9PiBtYXJrZXJDb21wb25lbnQubWFya2VyISk7XG4gIH1cblxuICBwcml2YXRlIF9hc3NlcnRJbml0aWFsaXplZCgpOiBhc3NlcnRzIHRoaXMgaXMge21hcmtlckNsdXN0ZXJlcjogTWFya2VyQ2x1c3RlcmVySW5zdGFuY2V9IHtcbiAgICBpZiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSB7XG4gICAgICBpZiAoIXRoaXMuX2dvb2dsZU1hcC5nb29nbGVNYXApIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICAgJ0Nhbm5vdCBhY2Nlc3MgR29vZ2xlIE1hcCBpbmZvcm1hdGlvbiBiZWZvcmUgdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZC4gJyArXG4gICAgICAgICAgICAnUGxlYXNlIHdhaXQgZm9yIHRoZSBBUEkgdG8gbG9hZCBiZWZvcmUgdHJ5aW5nIHRvIGludGVyYWN0IHdpdGggaXQuJyxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5tYXJrZXJDbHVzdGVyZXIpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICAgJ0Nhbm5vdCBpbnRlcmFjdCB3aXRoIGEgTWFya2VyQ2x1c3RlcmVyIGJlZm9yZSBpdCBoYXMgYmVlbiBpbml0aWFsaXplZC4gJyArXG4gICAgICAgICAgICAnUGxlYXNlIHdhaXQgZm9yIHRoZSBNYXJrZXJDbHVzdGVyZXIgdG8gbG9hZCBiZWZvcmUgdHJ5aW5nIHRvIGludGVyYWN0IHdpdGggaXQuJyxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==