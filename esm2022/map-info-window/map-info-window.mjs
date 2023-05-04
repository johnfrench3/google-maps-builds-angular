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
import { Directive, ElementRef, Input, NgZone, Output, inject, } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { GoogleMap } from '../google-map/google-map';
import { MapEventManager } from '../map-event-manager';
import * as i0 from "@angular/core";
import * as i1 from "../google-map/google-map";
/**
 * Angular component that renders a Google Maps info window via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/info-window
 */
class MapInfoWindow {
    set options(options) {
        this._options.next(options || {});
    }
    set position(position) {
        this._position.next(position);
    }
    constructor(_googleMap, _elementRef, _ngZone) {
        this._googleMap = _googleMap;
        this._elementRef = _elementRef;
        this._ngZone = _ngZone;
        this._eventManager = new MapEventManager(inject(NgZone));
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
    ngOnInit() {
        if (this._googleMap._isBrowser) {
            const combinedOptionsChanges = this._combineOptions();
            combinedOptionsChanges.pipe(take(1)).subscribe(options => {
                // Create the object outside the zone so its events don't trigger change detection.
                // We'll bring it back in inside the `MapEventManager` only for the events that the
                // user has subscribed to.
                this._ngZone.runOutsideAngular(() => {
                    this.infoWindow = new google.maps.InfoWindow(options);
                });
                this._eventManager.setTarget(this.infoWindow);
            });
            this._watchForOptionsChanges();
            this._watchForPositionChanges();
        }
    }
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
     */
    close() {
        this._assertInitialized();
        this.infoWindow.close();
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.getContent
     */
    getContent() {
        this._assertInitialized();
        return this.infoWindow.getContent() || null;
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/info-window
     * #InfoWindow.getPosition
     */
    getPosition() {
        this._assertInitialized();
        return this.infoWindow.getPosition() || null;
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.getZIndex
     */
    getZIndex() {
        this._assertInitialized();
        return this.infoWindow.getZIndex();
    }
    /**
     * Opens the MapInfoWindow using the provided anchor. If the anchor is not set,
     * then the position property of the options input is used instead.
     */
    open(anchor, shouldFocus) {
        this._assertInitialized();
        const anchorObject = anchor ? anchor.getAnchor() : undefined;
        // Prevent the info window from initializing when trying to reopen on the same anchor.
        // Note that when the window is opened for the first time, the anchor will always be
        // undefined. If that's the case, we have to allow it to open in order to handle the
        // case where the window doesn't have an anchor, but is placed at a particular position.
        if (this.infoWindow.get('anchor') !== anchorObject || !anchorObject) {
            this._elementRef.nativeElement.style.display = '';
            // The config is cast to `any`, because the internal typings are out of date.
            this.infoWindow.open({
                map: this._googleMap.googleMap,
                anchor: anchorObject,
                shouldFocus,
            });
        }
    }
    _combineOptions() {
        return combineLatest([this._options, this._position]).pipe(map(([options, position]) => {
            const combinedOptions = {
                ...options,
                position: position || options.position,
                content: this._elementRef.nativeElement,
            };
            return combinedOptions;
        }));
    }
    _watchForOptionsChanges() {
        this._options.pipe(takeUntil(this._destroy)).subscribe(options => {
            this._assertInitialized();
            this.infoWindow.setOptions(options);
        });
    }
    _watchForPositionChanges() {
        this._position.pipe(takeUntil(this._destroy)).subscribe(position => {
            if (position) {
                this._assertInitialized();
                this.infoWindow.setPosition(position);
            }
        });
    }
    _assertInitialized() {
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MapInfoWindow, deps: [{ token: i1.GoogleMap }, { token: i0.ElementRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: MapInfoWindow, selector: "map-info-window", inputs: { options: "options", position: "position" }, outputs: { closeclick: "closeclick", contentChanged: "contentChanged", domready: "domready", positionChanged: "positionChanged", zindexChanged: "zindexChanged" }, host: { styleAttribute: "display: none" }, exportAs: ["mapInfoWindow"], ngImport: i0 }); }
}
export { MapInfoWindow };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MapInfoWindow, decorators: [{
            type: Directive,
            args: [{
                    selector: 'map-info-window',
                    exportAs: 'mapInfoWindow',
                    host: { 'style': 'display: none' },
                }]
        }], ctorParameters: function () { return [{ type: i1.GoogleMap }, { type: i0.ElementRef }, { type: i0.NgZone }]; }, propDecorators: { options: [{
                type: Input
            }], position: [{
                type: Input
            }], closeclick: [{
                type: Output
            }], contentChanged: [{
                type: Output
            }], domready: [{
                type: Output
            }], positionChanged: [{
                type: Output
            }], zindexChanged: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWluZm8td2luZG93LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2dvb2dsZS1tYXBzL21hcC1pbmZvLXdpbmRvdy9tYXAtaW5mby13aW5kb3cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBU0EscUNBQXFDO0FBVHJDOzs7Ozs7R0FNRztBQUVILHlFQUF5RTtBQUN6RSxxQ0FBcUM7QUFFckMsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsS0FBSyxFQUNMLE1BQU0sRUFHTixNQUFNLEVBQ04sTUFBTSxHQUNQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxlQUFlLEVBQUUsYUFBYSxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDekUsT0FBTyxFQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFcEQsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQ25ELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQzs7O0FBR3JEOzs7O0dBSUc7QUFDSCxNQUthLGFBQWE7SUFleEIsSUFDSSxPQUFPLENBQUMsT0FBc0M7UUFDaEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFFRCxJQUNJLFFBQVEsQ0FBQyxRQUF3RDtRQUNuRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBd0NELFlBQ21CLFVBQXFCLEVBQzlCLFdBQW9DLEVBQ3BDLE9BQWU7UUFGTixlQUFVLEdBQVYsVUFBVSxDQUFXO1FBQzlCLGdCQUFXLEdBQVgsV0FBVyxDQUF5QjtRQUNwQyxZQUFPLEdBQVAsT0FBTyxDQUFRO1FBakVqQixrQkFBYSxHQUFHLElBQUksZUFBZSxDQUFDLE1B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S0FBSztnQkFTYSxVQUFVO3NCQUE1QixNQUFNO2dCQVFZLGNBQWM7c0JBQWhDLE1BQU07Z0JBT1ksUUFBUTtzQkFBMUIsTUFBTTtnQkFRWSxlQUFlO3NCQUFqQyxNQUFNO2dCQVFZLGFBQWE7c0JBQS9CLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLy8gV29ya2Fyb3VuZCBmb3I6IGh0dHBzOi8vZ2l0aHViLmNvbS9iYXplbGJ1aWxkL3J1bGVzX25vZGVqcy9pc3N1ZXMvMTI2NVxuLy8vIDxyZWZlcmVuY2UgdHlwZXM9XCJnb29nbGUubWFwc1wiIC8+XG5cbmltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgaW5qZWN0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7QmVoYXZpb3JTdWJqZWN0LCBjb21iaW5lTGF0ZXN0LCBPYnNlcnZhYmxlLCBTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7bWFwLCB0YWtlLCB0YWtlVW50aWx9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtHb29nbGVNYXB9IGZyb20gJy4uL2dvb2dsZS1tYXAvZ29vZ2xlLW1hcCc7XG5pbXBvcnQge01hcEV2ZW50TWFuYWdlcn0gZnJvbSAnLi4vbWFwLWV2ZW50LW1hbmFnZXInO1xuaW1wb3J0IHtNYXBBbmNob3JQb2ludH0gZnJvbSAnLi4vbWFwLWFuY2hvci1wb2ludCc7XG5cbi8qKlxuICogQW5ndWxhciBjb21wb25lbnQgdGhhdCByZW5kZXJzIGEgR29vZ2xlIE1hcHMgaW5mbyB3aW5kb3cgdmlhIHRoZSBHb29nbGUgTWFwcyBKYXZhU2NyaXB0IEFQSS5cbiAqXG4gKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9pbmZvLXdpbmRvd1xuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXAtaW5mby13aW5kb3cnLFxuICBleHBvcnRBczogJ21hcEluZm9XaW5kb3cnLFxuICBob3N0OiB7J3N0eWxlJzogJ2Rpc3BsYXk6IG5vbmUnfSxcbn0pXG5leHBvcnQgY2xhc3MgTWFwSW5mb1dpbmRvdyBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfZXZlbnRNYW5hZ2VyID0gbmV3IE1hcEV2ZW50TWFuYWdlcihpbmplY3QoTmdab25lKSk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX29wdGlvbnMgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PGdvb2dsZS5tYXBzLkluZm9XaW5kb3dPcHRpb25zPih7fSk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX3Bvc2l0aW9uID0gbmV3IEJlaGF2aW9yU3ViamVjdDxcbiAgICBnb29nbGUubWFwcy5MYXRMbmdMaXRlcmFsIHwgZ29vZ2xlLm1hcHMuTGF0TG5nIHwgdW5kZWZpbmVkXG4gID4odW5kZWZpbmVkKTtcbiAgcHJpdmF0ZSByZWFkb25seSBfZGVzdHJveSA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqXG4gICAqIFVuZGVybHlpbmcgZ29vZ2xlLm1hcHMuSW5mb1dpbmRvd1xuICAgKlxuICAgKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9pbmZvLXdpbmRvdyNJbmZvV2luZG93XG4gICAqL1xuICBpbmZvV2luZG93PzogZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdztcblxuICBASW5wdXQoKVxuICBzZXQgb3B0aW9ucyhvcHRpb25zOiBnb29nbGUubWFwcy5JbmZvV2luZG93T3B0aW9ucykge1xuICAgIHRoaXMuX29wdGlvbnMubmV4dChvcHRpb25zIHx8IHt9KTtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIHNldCBwb3NpdGlvbihwb3NpdGlvbjogZ29vZ2xlLm1hcHMuTGF0TG5nTGl0ZXJhbCB8IGdvb2dsZS5tYXBzLkxhdExuZykge1xuICAgIHRoaXMuX3Bvc2l0aW9uLm5leHQocG9zaXRpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2luZm8td2luZG93I0luZm9XaW5kb3cuY2xvc2VjbGlja1xuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGNsb3NlY2xpY2s6IE9ic2VydmFibGU8dm9pZD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPignY2xvc2VjbGljaycpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9pbmZvLXdpbmRvd1xuICAgKiAjSW5mb1dpbmRvdy5jb250ZW50X2NoYW5nZWRcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBjb250ZW50Q2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCdjb250ZW50X2NoYW5nZWQnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvaW5mby13aW5kb3cjSW5mb1dpbmRvdy5kb21yZWFkeVxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGRvbXJlYWR5OiBPYnNlcnZhYmxlPHZvaWQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2RvbXJlYWR5Jyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL2luZm8td2luZG93XG4gICAqICNJbmZvV2luZG93LnBvc2l0aW9uX2NoYW5nZWRcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBwb3NpdGlvbkNoYW5nZWQ6IE9ic2VydmFibGU8dm9pZD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPigncG9zaXRpb25fY2hhbmdlZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9pbmZvLXdpbmRvd1xuICAgKiAjSW5mb1dpbmRvdy56aW5kZXhfY2hhbmdlZFxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHppbmRleENoYW5nZWQ6IE9ic2VydmFibGU8dm9pZD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPignemluZGV4X2NoYW5nZWQnKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9nb29nbGVNYXA6IEdvb2dsZU1hcCxcbiAgICBwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcbiAgKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICh0aGlzLl9nb29nbGVNYXAuX2lzQnJvd3Nlcikge1xuICAgICAgY29uc3QgY29tYmluZWRPcHRpb25zQ2hhbmdlcyA9IHRoaXMuX2NvbWJpbmVPcHRpb25zKCk7XG5cbiAgICAgIGNvbWJpbmVkT3B0aW9uc0NoYW5nZXMucGlwZSh0YWtlKDEpKS5zdWJzY3JpYmUob3B0aW9ucyA9PiB7XG4gICAgICAgIC8vIENyZWF0ZSB0aGUgb2JqZWN0IG91dHNpZGUgdGhlIHpvbmUgc28gaXRzIGV2ZW50cyBkb24ndCB0cmlnZ2VyIGNoYW5nZSBkZXRlY3Rpb24uXG4gICAgICAgIC8vIFdlJ2xsIGJyaW5nIGl0IGJhY2sgaW4gaW5zaWRlIHRoZSBgTWFwRXZlbnRNYW5hZ2VyYCBvbmx5IGZvciB0aGUgZXZlbnRzIHRoYXQgdGhlXG4gICAgICAgIC8vIHVzZXIgaGFzIHN1YnNjcmliZWQgdG8uXG4gICAgICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgICAgdGhpcy5pbmZvV2luZG93ID0gbmV3IGdvb2dsZS5tYXBzLkluZm9XaW5kb3cob3B0aW9ucyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5zZXRUYXJnZXQodGhpcy5pbmZvV2luZG93KTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLl93YXRjaEZvck9wdGlvbnNDaGFuZ2VzKCk7XG4gICAgICB0aGlzLl93YXRjaEZvclBvc2l0aW9uQ2hhbmdlcygpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5kZXN0cm95KCk7XG4gICAgdGhpcy5fZGVzdHJveS5uZXh0KCk7XG4gICAgdGhpcy5fZGVzdHJveS5jb21wbGV0ZSgpO1xuXG4gICAgLy8gSWYgbm8gaW5mbyB3aW5kb3cgaGFzIGJlZW4gY3JlYXRlZCBvbiB0aGUgc2VydmVyLCB3ZSBkbyBub3QgdHJ5IGNsb3NpbmcgaXQuXG4gICAgLy8gT24gdGhlIHNlcnZlciwgYW4gaW5mbyB3aW5kb3cgY2Fubm90IGJlIGNyZWF0ZWQgYW5kIHRoaXMgd291bGQgY2F1c2UgZXJyb3JzLlxuICAgIGlmICh0aGlzLmluZm9XaW5kb3cpIHtcbiAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvaW5mby13aW5kb3cjSW5mb1dpbmRvdy5jbG9zZVxuICAgKi9cbiAgY2xvc2UoKSB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICB0aGlzLmluZm9XaW5kb3cuY2xvc2UoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9pbmZvLXdpbmRvdyNJbmZvV2luZG93LmdldENvbnRlbnRcbiAgICovXG4gIGdldENvbnRlbnQoKTogc3RyaW5nIHwgTm9kZSB8IG51bGwge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMuaW5mb1dpbmRvdy5nZXRDb250ZW50KCkgfHwgbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9pbmZvLXdpbmRvd1xuICAgKiAjSW5mb1dpbmRvdy5nZXRQb3NpdGlvblxuICAgKi9cbiAgZ2V0UG9zaXRpb24oKTogZ29vZ2xlLm1hcHMuTGF0TG5nIHwgbnVsbCB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5pbmZvV2luZG93LmdldFBvc2l0aW9uKCkgfHwgbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9pbmZvLXdpbmRvdyNJbmZvV2luZG93LmdldFpJbmRleFxuICAgKi9cbiAgZ2V0WkluZGV4KCk6IG51bWJlciB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5pbmZvV2luZG93LmdldFpJbmRleCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIE9wZW5zIHRoZSBNYXBJbmZvV2luZG93IHVzaW5nIHRoZSBwcm92aWRlZCBhbmNob3IuIElmIHRoZSBhbmNob3IgaXMgbm90IHNldCxcbiAgICogdGhlbiB0aGUgcG9zaXRpb24gcHJvcGVydHkgb2YgdGhlIG9wdGlvbnMgaW5wdXQgaXMgdXNlZCBpbnN0ZWFkLlxuICAgKi9cbiAgb3BlbihhbmNob3I/OiBNYXBBbmNob3JQb2ludCwgc2hvdWxkRm9jdXM/OiBib29sZWFuKSB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICBjb25zdCBhbmNob3JPYmplY3QgPSBhbmNob3IgPyBhbmNob3IuZ2V0QW5jaG9yKCkgOiB1bmRlZmluZWQ7XG5cbiAgICAvLyBQcmV2ZW50IHRoZSBpbmZvIHdpbmRvdyBmcm9tIGluaXRpYWxpemluZyB3aGVuIHRyeWluZyB0byByZW9wZW4gb24gdGhlIHNhbWUgYW5jaG9yLlxuICAgIC8vIE5vdGUgdGhhdCB3aGVuIHRoZSB3aW5kb3cgaXMgb3BlbmVkIGZvciB0aGUgZmlyc3QgdGltZSwgdGhlIGFuY2hvciB3aWxsIGFsd2F5cyBiZVxuICAgIC8vIHVuZGVmaW5lZC4gSWYgdGhhdCdzIHRoZSBjYXNlLCB3ZSBoYXZlIHRvIGFsbG93IGl0IHRvIG9wZW4gaW4gb3JkZXIgdG8gaGFuZGxlIHRoZVxuICAgIC8vIGNhc2Ugd2hlcmUgdGhlIHdpbmRvdyBkb2Vzbid0IGhhdmUgYW4gYW5jaG9yLCBidXQgaXMgcGxhY2VkIGF0IGEgcGFydGljdWxhciBwb3NpdGlvbi5cbiAgICBpZiAodGhpcy5pbmZvV2luZG93LmdldCgnYW5jaG9yJykgIT09IGFuY2hvck9iamVjdCB8fCAhYW5jaG9yT2JqZWN0KSB7XG4gICAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICcnO1xuXG4gICAgICAvLyBUaGUgY29uZmlnIGlzIGNhc3QgdG8gYGFueWAsIGJlY2F1c2UgdGhlIGludGVybmFsIHR5cGluZ3MgYXJlIG91dCBvZiBkYXRlLlxuICAgICAgdGhpcy5pbmZvV2luZG93Lm9wZW4oe1xuICAgICAgICBtYXA6IHRoaXMuX2dvb2dsZU1hcC5nb29nbGVNYXAsXG4gICAgICAgIGFuY2hvcjogYW5jaG9yT2JqZWN0LFxuICAgICAgICBzaG91bGRGb2N1cyxcbiAgICAgIH0gYXMgYW55KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9jb21iaW5lT3B0aW9ucygpOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLkluZm9XaW5kb3dPcHRpb25zPiB7XG4gICAgcmV0dXJuIGNvbWJpbmVMYXRlc3QoW3RoaXMuX29wdGlvbnMsIHRoaXMuX3Bvc2l0aW9uXSkucGlwZShcbiAgICAgIG1hcCgoW29wdGlvbnMsIHBvc2l0aW9uXSkgPT4ge1xuICAgICAgICBjb25zdCBjb21iaW5lZE9wdGlvbnM6IGdvb2dsZS5tYXBzLkluZm9XaW5kb3dPcHRpb25zID0ge1xuICAgICAgICAgIC4uLm9wdGlvbnMsXG4gICAgICAgICAgcG9zaXRpb246IHBvc2l0aW9uIHx8IG9wdGlvbnMucG9zaXRpb24sXG4gICAgICAgICAgY29udGVudDogdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LFxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gY29tYmluZWRPcHRpb25zO1xuICAgICAgfSksXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgX3dhdGNoRm9yT3B0aW9uc0NoYW5nZXMoKSB7XG4gICAgdGhpcy5fb3B0aW9ucy5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95KSkuc3Vic2NyaWJlKG9wdGlvbnMgPT4ge1xuICAgICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICAgIHRoaXMuaW5mb1dpbmRvdy5zZXRPcHRpb25zKG9wdGlvbnMpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfd2F0Y2hGb3JQb3NpdGlvbkNoYW5nZXMoKSB7XG4gICAgdGhpcy5fcG9zaXRpb24ucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveSkpLnN1YnNjcmliZShwb3NpdGlvbiA9PiB7XG4gICAgICBpZiAocG9zaXRpb24pIHtcbiAgICAgICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICAgICAgdGhpcy5pbmZvV2luZG93LnNldFBvc2l0aW9uKHBvc2l0aW9uKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2Fzc2VydEluaXRpYWxpemVkKCk6IGFzc2VydHMgdGhpcyBpcyB7aW5mb1dpbmRvdzogZ29vZ2xlLm1hcHMuSW5mb1dpbmRvd30ge1xuICAgIGlmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpIHtcbiAgICAgIGlmICghdGhpcy5fZ29vZ2xlTWFwLmdvb2dsZU1hcCkge1xuICAgICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICAnQ2Fubm90IGFjY2VzcyBHb29nbGUgTWFwIGluZm9ybWF0aW9uIGJlZm9yZSB0aGUgQVBJIGhhcyBiZWVuIGluaXRpYWxpemVkLiAnICtcbiAgICAgICAgICAgICdQbGVhc2Ugd2FpdCBmb3IgdGhlIEFQSSB0byBsb2FkIGJlZm9yZSB0cnlpbmcgdG8gaW50ZXJhY3Qgd2l0aCBpdC4nLFxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLmluZm9XaW5kb3cpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICAgJ0Nhbm5vdCBpbnRlcmFjdCB3aXRoIGEgR29vZ2xlIE1hcCBJbmZvIFdpbmRvdyBiZWZvcmUgaXQgaGFzIGJlZW4gJyArXG4gICAgICAgICAgICAnaW5pdGlhbGl6ZWQuIFBsZWFzZSB3YWl0IGZvciB0aGUgSW5mbyBXaW5kb3cgdG8gbG9hZCBiZWZvcmUgdHJ5aW5nIHRvIGludGVyYWN0IHdpdGggJyArXG4gICAgICAgICAgICAnaXQuJyxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==