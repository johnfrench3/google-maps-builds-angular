/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="googlemaps" />
import { Input, Output, NgZone, Directive } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { GoogleMap } from '../google-map/google-map';
import { MapEventManager } from '../map-event-manager';
/**
 * Default options for the Google Maps marker component. Displays a marker
 * at the Googleplex.
 */
export const DEFAULT_MARKER_OPTIONS = {
    position: { lat: 37.421995, lng: -122.084092 },
};
/**
 * Angular component that renders a Google Maps marker via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/marker
 */
export class MapMarker {
    constructor(_googleMap, _ngZone) {
        this._googleMap = _googleMap;
        this._ngZone = _ngZone;
        this._eventManager = new MapEventManager(this._ngZone);
        this._options = new BehaviorSubject(DEFAULT_MARKER_OPTIONS);
        this._title = new BehaviorSubject(undefined);
        this._position = new BehaviorSubject(undefined);
        this._label = new BehaviorSubject(undefined);
        this._clickable = new BehaviorSubject(undefined);
        this._destroy = new Subject();
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.animation_changed
         */
        this.animationChanged = this._eventManager.getLazyEmitter('animation_changed');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.click
         */
        this.mapClick = this._eventManager.getLazyEmitter('click');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.clickable_changed
         */
        this.clickableChanged = this._eventManager.getLazyEmitter('clickable_changed');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.cursor_changed
         */
        this.cursorChanged = this._eventManager.getLazyEmitter('cursor_changed');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.dblclick
         */
        this.mapDblclick = this._eventManager.getLazyEmitter('dblclick');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.drag
         */
        this.mapDrag = this._eventManager.getLazyEmitter('drag');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.dragend
         */
        this.mapDragend = this._eventManager.getLazyEmitter('dragend');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.draggable_changed
         */
        this.draggableChanged = this._eventManager.getLazyEmitter('draggable_changed');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.dragstart
         */
        this.mapDragstart = this._eventManager.getLazyEmitter('dragstart');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.flat_changed
         */
        this.flatChanged = this._eventManager.getLazyEmitter('flat_changed');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.icon_changed
         */
        this.iconChanged = this._eventManager.getLazyEmitter('icon_changed');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.mousedown
         */
        this.mapMousedown = this._eventManager.getLazyEmitter('mousedown');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.mouseout
         */
        this.mapMouseout = this._eventManager.getLazyEmitter('mouseout');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.mouseover
         */
        this.mapMouseover = this._eventManager.getLazyEmitter('mouseover');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.mouseup
         */
        this.mapMouseup = this._eventManager.getLazyEmitter('mouseup');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.position_changed
         */
        this.positionChanged = this._eventManager.getLazyEmitter('position_changed');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.rightclick
         */
        this.mapRightclick = this._eventManager.getLazyEmitter('rightclick');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.shape_changed
         */
        this.shapeChanged = this._eventManager.getLazyEmitter('shape_changed');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.title_changed
         */
        this.titleChanged = this._eventManager.getLazyEmitter('title_changed');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.visible_changed
         */
        this.visibleChanged = this._eventManager.getLazyEmitter('visible_changed');
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.zindex_changed
         */
        this.zindexChanged = this._eventManager.getLazyEmitter('zindex_changed');
    }
    set options(options) {
        this._options.next(options || DEFAULT_MARKER_OPTIONS);
    }
    set title(title) {
        this._title.next(title);
    }
    set position(position) {
        this._position.next(position);
    }
    set label(label) {
        this._label.next(label);
    }
    set clickable(clickable) {
        this._clickable.next(clickable);
    }
    ngOnInit() {
        if (this._googleMap._isBrowser) {
            this._combineOptions().pipe(take(1)).subscribe(options => {
                // Create the object outside the zone so its events don't trigger change detection.
                // We'll bring it back in inside the `MapEventManager` only for the events that the
                // user has subscribed to.
                this._ngZone.runOutsideAngular(() => this.marker = new google.maps.Marker(options));
                this._assertInitialized();
                this.marker.setMap(this._googleMap.googleMap);
                this._eventManager.setTarget(this.marker);
            });
            this._watchForOptionsChanges();
            this._watchForTitleChanges();
            this._watchForPositionChanges();
            this._watchForLabelChanges();
            this._watchForClickableChanges();
        }
    }
    ngOnDestroy() {
        this._destroy.next();
        this._destroy.complete();
        this._eventManager.destroy();
        if (this.marker) {
            this.marker.setMap(null);
        }
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getAnimation
     */
    getAnimation() {
        this._assertInitialized();
        return this.marker.getAnimation() || null;
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getClickable
     */
    getClickable() {
        this._assertInitialized();
        return this.marker.getClickable();
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getCursor
     */
    getCursor() {
        this._assertInitialized();
        return this.marker.getCursor() || null;
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getDraggable
     */
    getDraggable() {
        this._assertInitialized();
        return !!this.marker.getDraggable();
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getIcon
     */
    getIcon() {
        this._assertInitialized();
        return this.marker.getIcon() || null;
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getLabel
     */
    getLabel() {
        this._assertInitialized();
        return this.marker.getLabel() || null;
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getOpacity
     */
    getOpacity() {
        this._assertInitialized();
        return this.marker.getOpacity() || null;
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getPosition
     */
    getPosition() {
        this._assertInitialized();
        return this.marker.getPosition() || null;
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getShape
     */
    getShape() {
        this._assertInitialized();
        return this.marker.getShape() || null;
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getTitle
     */
    getTitle() {
        this._assertInitialized();
        return this.marker.getTitle() || null;
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getVisible
     */
    getVisible() {
        this._assertInitialized();
        return this.marker.getVisible();
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getZIndex
     */
    getZIndex() {
        this._assertInitialized();
        return this.marker.getZIndex() || null;
    }
    /** Gets the anchor point that can be used to attach other Google Maps objects. */
    getAnchor() {
        this._assertInitialized();
        return this.marker;
    }
    _combineOptions() {
        return combineLatest([this._options, this._title, this._position, this._label, this._clickable])
            .pipe(map(([options, title, position, label, clickable]) => {
            const combinedOptions = Object.assign(Object.assign({}, options), { title: title || options.title, position: position || options.position, label: label || options.label, clickable: clickable !== undefined ? clickable : options.clickable, map: this._googleMap.googleMap });
            return combinedOptions;
        }));
    }
    _watchForOptionsChanges() {
        this._options.pipe(takeUntil(this._destroy)).subscribe(options => {
            if (this.marker) {
                this._assertInitialized();
                this.marker.setOptions(options);
            }
        });
    }
    _watchForTitleChanges() {
        this._title.pipe(takeUntil(this._destroy)).subscribe(title => {
            if (this.marker && title !== undefined) {
                this._assertInitialized();
                this.marker.setTitle(title);
            }
        });
    }
    _watchForPositionChanges() {
        this._position.pipe(takeUntil(this._destroy)).subscribe(position => {
            if (this.marker && position) {
                this._assertInitialized();
                this.marker.setPosition(position);
            }
        });
    }
    _watchForLabelChanges() {
        this._label.pipe(takeUntil(this._destroy)).subscribe(label => {
            if (this.marker && label !== undefined) {
                this._assertInitialized();
                this.marker.setLabel(label);
            }
        });
    }
    _watchForClickableChanges() {
        this._clickable.pipe(takeUntil(this._destroy)).subscribe(clickable => {
            if (this.marker && clickable !== undefined) {
                this._assertInitialized();
                this.marker.setClickable(clickable);
            }
        });
    }
    _assertInitialized() {
        if (!this._googleMap.googleMap) {
            throw Error('Cannot access Google Map information before the API has been initialized. ' +
                'Please wait for the API to load before trying to interact with it.');
        }
        if (!this.marker) {
            throw Error('Cannot interact with a Google Map Marker before it has been ' +
                'initialized. Please wait for the Marker to load before trying to interact with it.');
        }
    }
}
MapMarker.decorators = [
    { type: Directive, args: [{
                selector: 'map-marker',
                exportAs: 'mapMarker',
            },] }
];
MapMarker.ctorParameters = () => [
    { type: GoogleMap },
    { type: NgZone }
];
MapMarker.propDecorators = {
    options: [{ type: Input }],
    title: [{ type: Input }],
    position: [{ type: Input }],
    label: [{ type: Input }],
    clickable: [{ type: Input }],
    animationChanged: [{ type: Output }],
    mapClick: [{ type: Output }],
    clickableChanged: [{ type: Output }],
    cursorChanged: [{ type: Output }],
    mapDblclick: [{ type: Output }],
    mapDrag: [{ type: Output }],
    mapDragend: [{ type: Output }],
    draggableChanged: [{ type: Output }],
    mapDragstart: [{ type: Output }],
    flatChanged: [{ type: Output }],
    iconChanged: [{ type: Output }],
    mapMousedown: [{ type: Output }],
    mapMouseout: [{ type: Output }],
    mapMouseover: [{ type: Output }],
    mapMouseup: [{ type: Output }],
    positionChanged: [{ type: Output }],
    mapRightclick: [{ type: Output }],
    shapeChanged: [{ type: Output }],
    titleChanged: [{ type: Output }],
    visibleChanged: [{ type: Output }],
    zindexChanged: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLW1hcmtlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9nb29nbGUtbWFwcy9tYXAtbWFya2VyL21hcC1tYXJrZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgseUVBQXlFO0FBQ3pFLG9DQUFvQztBQUVwQyxPQUFPLEVBQUMsS0FBSyxFQUFxQixNQUFNLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNsRixPQUFPLEVBQUMsZUFBZSxFQUFFLGFBQWEsRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQ3pFLE9BQU8sRUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRXBELE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUNuRCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFHckQ7OztHQUdHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sc0JBQXNCLEdBQUc7SUFDcEMsUUFBUSxFQUFFLEVBQUMsR0FBRyxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxVQUFVLEVBQUM7Q0FDN0MsQ0FBQztBQUVGOzs7O0dBSUc7QUFLSCxNQUFNLE9BQU8sU0FBUztJQXVNcEIsWUFDbUIsVUFBcUIsRUFDOUIsT0FBZTtRQUROLGVBQVUsR0FBVixVQUFVLENBQVc7UUFDOUIsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQXhNakIsa0JBQWEsR0FBRyxJQUFJLGVBQWUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDekMsYUFBUSxHQUNyQixJQUFJLGVBQWUsQ0FBNEIsc0JBQXNCLENBQUMsQ0FBQztRQUMxRCxXQUFNLEdBQUcsSUFBSSxlQUFlLENBQW1CLFNBQVMsQ0FBQyxDQUFDO1FBQzFELGNBQVMsR0FDdEIsSUFBSSxlQUFlLENB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NkJBT04sTUFBTTs0QkFPTixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8vIFdvcmthcm91bmQgZm9yOiBodHRwczovL2dpdGh1Yi5jb20vYmF6ZWxidWlsZC9ydWxlc19ub2RlanMvaXNzdWVzLzEyNjVcbi8vLyA8cmVmZXJlbmNlIHR5cGVzPVwiZ29vZ2xlbWFwc1wiIC8+XG5cbmltcG9ydCB7SW5wdXQsIE9uRGVzdHJveSwgT25Jbml0LCBPdXRwdXQsIE5nWm9uZSwgRGlyZWN0aXZlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7QmVoYXZpb3JTdWJqZWN0LCBjb21iaW5lTGF0ZXN0LCBPYnNlcnZhYmxlLCBTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7bWFwLCB0YWtlLCB0YWtlVW50aWx9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtHb29nbGVNYXB9IGZyb20gJy4uL2dvb2dsZS1tYXAvZ29vZ2xlLW1hcCc7XG5pbXBvcnQge01hcEV2ZW50TWFuYWdlcn0gZnJvbSAnLi4vbWFwLWV2ZW50LW1hbmFnZXInO1xuaW1wb3J0IHtNYXBBbmNob3JQb2ludH0gZnJvbSAnLi4vbWFwLWFuY2hvci1wb2ludCc7XG5cbi8qKlxuICogRGVmYXVsdCBvcHRpb25zIGZvciB0aGUgR29vZ2xlIE1hcHMgbWFya2VyIGNvbXBvbmVudC4gRGlzcGxheXMgYSBtYXJrZXJcbiAqIGF0IHRoZSBHb29nbGVwbGV4LlxuICovXG5leHBvcnQgY29uc3QgREVGQVVMVF9NQVJLRVJfT1BUSU9OUyA9IHtcbiAgcG9zaXRpb246IHtsYXQ6IDM3LjQyMTk5NSwgbG5nOiAtMTIyLjA4NDA5Mn0sXG59O1xuXG4vKipcbiAqIEFuZ3VsYXIgY29tcG9uZW50IHRoYXQgcmVuZGVycyBhIEdvb2dsZSBNYXBzIG1hcmtlciB2aWEgdGhlIEdvb2dsZSBNYXBzIEphdmFTY3JpcHQgQVBJLlxuICpcbiAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlclxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXAtbWFya2VyJyxcbiAgZXhwb3J0QXM6ICdtYXBNYXJrZXInLFxufSlcbmV4cG9ydCBjbGFzcyBNYXBNYXJrZXIgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgTWFwQW5jaG9yUG9pbnQge1xuICBwcml2YXRlIF9ldmVudE1hbmFnZXIgPSBuZXcgTWFwRXZlbnRNYW5hZ2VyKHRoaXMuX25nWm9uZSk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX29wdGlvbnMgPVxuICAgICAgbmV3IEJlaGF2aW9yU3ViamVjdDxnb29nbGUubWFwcy5NYXJrZXJPcHRpb25zPihERUZBVUxUX01BUktFUl9PUFRJT05TKTtcbiAgcHJpdmF0ZSByZWFkb25seSBfdGl0bGUgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PHN0cmluZ3x1bmRlZmluZWQ+KHVuZGVmaW5lZCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX3Bvc2l0aW9uID1cbiAgICAgIG5ldyBCZWhhdmlvclN1YmplY3Q8Z29vZ2xlLm1hcHMuTGF0TG5nTGl0ZXJhbHxnb29nbGUubWFwcy5MYXRMbmd8dW5kZWZpbmVkPih1bmRlZmluZWQpO1xuICBwcml2YXRlIHJlYWRvbmx5IF9sYWJlbCA9XG4gICAgICBuZXcgQmVoYXZpb3JTdWJqZWN0PHN0cmluZ3xnb29nbGUubWFwcy5NYXJrZXJMYWJlbHx1bmRlZmluZWQ+KHVuZGVmaW5lZCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2NsaWNrYWJsZSA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbnx1bmRlZmluZWQ+KHVuZGVmaW5lZCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2Rlc3Ryb3kgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIEBJbnB1dCgpXG4gIHNldCBvcHRpb25zKG9wdGlvbnM6IGdvb2dsZS5tYXBzLk1hcmtlck9wdGlvbnMpIHtcbiAgICB0aGlzLl9vcHRpb25zLm5leHQob3B0aW9ucyB8fCBERUZBVUxUX01BUktFUl9PUFRJT05TKTtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIHNldCB0aXRsZSh0aXRsZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fdGl0bGUubmV4dCh0aXRsZSk7XG4gIH1cblxuICBASW5wdXQoKVxuICBzZXQgcG9zaXRpb24ocG9zaXRpb246IGdvb2dsZS5tYXBzLkxhdExuZ0xpdGVyYWx8Z29vZ2xlLm1hcHMuTGF0TG5nKSB7XG4gICAgdGhpcy5fcG9zaXRpb24ubmV4dChwb3NpdGlvbik7XG4gIH1cblxuICBASW5wdXQoKVxuICBzZXQgbGFiZWwobGFiZWw6IHN0cmluZ3xnb29nbGUubWFwcy5NYXJrZXJMYWJlbCkge1xuICAgIHRoaXMuX2xhYmVsLm5leHQobGFiZWwpO1xuICB9XG5cbiAgQElucHV0KClcbiAgc2V0IGNsaWNrYWJsZShjbGlja2FibGU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9jbGlja2FibGUubmV4dChjbGlja2FibGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuYW5pbWF0aW9uX2NoYW5nZWRcbiAgICovXG4gIEBPdXRwdXQoKVxuICBhbmltYXRpb25DaGFuZ2VkOiBPYnNlcnZhYmxlPHZvaWQ+ID0gdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCdhbmltYXRpb25fY2hhbmdlZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmNsaWNrXG4gICAqL1xuICBAT3V0cHV0KClcbiAgbWFwQ2xpY2s6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+KCdjbGljaycpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmNsaWNrYWJsZV9jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KClcbiAgY2xpY2thYmxlQ2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9IHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPignY2xpY2thYmxlX2NoYW5nZWQnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5jdXJzb3JfY2hhbmdlZFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIGN1cnNvckNoYW5nZWQ6IE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2N1cnNvcl9jaGFuZ2VkJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuZGJsY2xpY2tcbiAgICovXG4gIEBPdXRwdXQoKVxuICBtYXBEYmxjbGljazogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4oJ2RibGNsaWNrJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuZHJhZ1xuICAgKi9cbiAgQE91dHB1dCgpXG4gIG1hcERyYWc6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+KCdkcmFnJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuZHJhZ2VuZFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIG1hcERyYWdlbmQ6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+KCdkcmFnZW5kJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuZHJhZ2dhYmxlX2NoYW5nZWRcbiAgICovXG4gIEBPdXRwdXQoKVxuICBkcmFnZ2FibGVDaGFuZ2VkOiBPYnNlcnZhYmxlPHZvaWQ+ID0gdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCdkcmFnZ2FibGVfY2hhbmdlZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmRyYWdzdGFydFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIG1hcERyYWdzdGFydDogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4oJ2RyYWdzdGFydCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmZsYXRfY2hhbmdlZFxuICAgKi9cbiAgQE91dHB1dCgpIGZsYXRDaGFuZ2VkOiBPYnNlcnZhYmxlPHZvaWQ+ID0gdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCdmbGF0X2NoYW5nZWQnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5pY29uX2NoYW5nZWRcbiAgICovXG4gIEBPdXRwdXQoKSBpY29uQ2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9IHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPignaWNvbl9jaGFuZ2VkJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIubW91c2Vkb3duXG4gICAqL1xuICBAT3V0cHV0KClcbiAgbWFwTW91c2Vkb3duOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PignbW91c2Vkb3duJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIubW91c2VvdXRcbiAgICovXG4gIEBPdXRwdXQoKVxuICBtYXBNb3VzZW91dDogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4oJ21vdXNlb3V0Jyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIubW91c2VvdmVyXG4gICAqL1xuICBAT3V0cHV0KClcbiAgbWFwTW91c2VvdmVyOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PignbW91c2VvdmVyJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIubW91c2V1cFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIG1hcE1vdXNldXA6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+KCdtb3VzZXVwJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIucG9zaXRpb25fY2hhbmdlZFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIHBvc2l0aW9uQ2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9IHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPigncG9zaXRpb25fY2hhbmdlZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLnJpZ2h0Y2xpY2tcbiAgICovXG4gIEBPdXRwdXQoKVxuICBtYXBSaWdodGNsaWNrOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PigncmlnaHRjbGljaycpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLnNoYXBlX2NoYW5nZWRcbiAgICovXG4gIEBPdXRwdXQoKSBzaGFwZUNoYW5nZWQ6XG4gIE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ3NoYXBlX2NoYW5nZWQnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci50aXRsZV9jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KClcbiAgdGl0bGVDaGFuZ2VkOiBPYnNlcnZhYmxlPHZvaWQ+ID0gdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCd0aXRsZV9jaGFuZ2VkJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIudmlzaWJsZV9jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KClcbiAgdmlzaWJsZUNoYW5nZWQ6IE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ3Zpc2libGVfY2hhbmdlZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLnppbmRleF9jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KClcbiAgemluZGV4Q2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9IHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPignemluZGV4X2NoYW5nZWQnKTtcblxuICAvKipcbiAgICogVGhlIHVuZGVybHlpbmcgZ29vZ2xlLm1hcHMuTWFya2VyIG9iamVjdC5cbiAgICpcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlclxuICAgKi9cbiAgbWFya2VyPzogZ29vZ2xlLm1hcHMuTWFya2VyO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2dvb2dsZU1hcDogR29vZ2xlTWFwLFxuICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICh0aGlzLl9nb29nbGVNYXAuX2lzQnJvd3Nlcikge1xuICAgICAgdGhpcy5fY29tYmluZU9wdGlvbnMoKS5waXBlKHRha2UoMSkpLnN1YnNjcmliZShvcHRpb25zID0+IHtcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBvYmplY3Qgb3V0c2lkZSB0aGUgem9uZSBzbyBpdHMgZXZlbnRzIGRvbid0IHRyaWdnZXIgY2hhbmdlIGRldGVjdGlvbi5cbiAgICAgICAgLy8gV2UnbGwgYnJpbmcgaXQgYmFjayBpbiBpbnNpZGUgdGhlIGBNYXBFdmVudE1hbmFnZXJgIG9ubHkgZm9yIHRoZSBldmVudHMgdGhhdCB0aGVcbiAgICAgICAgLy8gdXNlciBoYXMgc3Vic2NyaWJlZCB0by5cbiAgICAgICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHRoaXMubWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcihvcHRpb25zKSk7XG4gICAgICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgICAgIHRoaXMubWFya2VyLnNldE1hcCh0aGlzLl9nb29nbGVNYXAuZ29vZ2xlTWFwISk7XG4gICAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5zZXRUYXJnZXQodGhpcy5tYXJrZXIpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuX3dhdGNoRm9yT3B0aW9uc0NoYW5nZXMoKTtcbiAgICAgIHRoaXMuX3dhdGNoRm9yVGl0bGVDaGFuZ2VzKCk7XG4gICAgICB0aGlzLl93YXRjaEZvclBvc2l0aW9uQ2hhbmdlcygpO1xuICAgICAgdGhpcy5fd2F0Y2hGb3JMYWJlbENoYW5nZXMoKTtcbiAgICAgIHRoaXMuX3dhdGNoRm9yQ2xpY2thYmxlQ2hhbmdlcygpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2Rlc3Ryb3kubmV4dCgpO1xuICAgIHRoaXMuX2Rlc3Ryb3kuY29tcGxldGUoKTtcbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZGVzdHJveSgpO1xuICAgIGlmICh0aGlzLm1hcmtlcikge1xuICAgICAgdGhpcy5tYXJrZXIuc2V0TWFwKG51bGwpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmdldEFuaW1hdGlvblxuICAgKi9cbiAgZ2V0QW5pbWF0aW9uKCk6IGdvb2dsZS5tYXBzLkFuaW1hdGlvbnxudWxsIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlci5nZXRBbmltYXRpb24oKSB8fCBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuZ2V0Q2xpY2thYmxlXG4gICAqL1xuICBnZXRDbGlja2FibGUoKTogYm9vbGVhbiB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXIuZ2V0Q2xpY2thYmxlKCk7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5nZXRDdXJzb3JcbiAgICovXG4gIGdldEN1cnNvcigpOiBzdHJpbmd8bnVsbCB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXIuZ2V0Q3Vyc29yKCkgfHwgbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmdldERyYWdnYWJsZVxuICAgKi9cbiAgZ2V0RHJhZ2dhYmxlKCk6IGJvb2xlYW4ge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuICEhdGhpcy5tYXJrZXIuZ2V0RHJhZ2dhYmxlKCk7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5nZXRJY29uXG4gICAqL1xuICBnZXRJY29uKCk6IHN0cmluZ3xnb29nbGUubWFwcy5JY29ufGdvb2dsZS5tYXBzLlN5bWJvbHxudWxsIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlci5nZXRJY29uKCkgfHwgbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmdldExhYmVsXG4gICAqL1xuICBnZXRMYWJlbCgpOiBnb29nbGUubWFwcy5NYXJrZXJMYWJlbHxudWxsIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlci5nZXRMYWJlbCgpIHx8IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5nZXRPcGFjaXR5XG4gICAqL1xuICBnZXRPcGFjaXR5KCk6IG51bWJlcnxudWxsIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlci5nZXRPcGFjaXR5KCkgfHwgbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmdldFBvc2l0aW9uXG4gICAqL1xuICBnZXRQb3NpdGlvbigpOiBnb29nbGUubWFwcy5MYXRMbmd8bnVsbCB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXIuZ2V0UG9zaXRpb24oKSB8fCBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuZ2V0U2hhcGVcbiAgICovXG4gIGdldFNoYXBlKCk6IGdvb2dsZS5tYXBzLk1hcmtlclNoYXBlfG51bGwge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyLmdldFNoYXBlKCkgfHwgbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmdldFRpdGxlXG4gICAqL1xuICBnZXRUaXRsZSgpOiBzdHJpbmd8bnVsbCB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXIuZ2V0VGl0bGUoKSB8fCBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuZ2V0VmlzaWJsZVxuICAgKi9cbiAgZ2V0VmlzaWJsZSgpOiBib29sZWFuIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlci5nZXRWaXNpYmxlKCk7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5nZXRaSW5kZXhcbiAgICovXG4gIGdldFpJbmRleCgpOiBudW1iZXJ8bnVsbCB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXIuZ2V0WkluZGV4KCkgfHwgbnVsbDtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBhbmNob3IgcG9pbnQgdGhhdCBjYW4gYmUgdXNlZCB0byBhdHRhY2ggb3RoZXIgR29vZ2xlIE1hcHMgb2JqZWN0cy4gKi9cbiAgZ2V0QW5jaG9yKCk6IGdvb2dsZS5tYXBzLk1WQ09iamVjdCB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXI7XG4gIH1cblxuICBwcml2YXRlIF9jb21iaW5lT3B0aW9ucygpOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1hcmtlck9wdGlvbnM+IHtcbiAgICByZXR1cm4gY29tYmluZUxhdGVzdChbdGhpcy5fb3B0aW9ucywgdGhpcy5fdGl0bGUsIHRoaXMuX3Bvc2l0aW9uLCB0aGlzLl9sYWJlbCwgdGhpcy5fY2xpY2thYmxlXSlcbiAgICAgICAgLnBpcGUobWFwKChbb3B0aW9ucywgdGl0bGUsIHBvc2l0aW9uLCBsYWJlbCwgY2xpY2thYmxlXSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGNvbWJpbmVkT3B0aW9uczogZ29vZ2xlLm1hcHMuTWFya2VyT3B0aW9ucyA9IHtcbiAgICAgICAgICAgIC4uLm9wdGlvbnMsXG4gICAgICAgICAgICB0aXRsZTogdGl0bGUgfHwgb3B0aW9ucy50aXRsZSxcbiAgICAgICAgICAgIHBvc2l0aW9uOiBwb3NpdGlvbiB8fCBvcHRpb25zLnBvc2l0aW9uLFxuICAgICAgICAgICAgbGFiZWw6IGxhYmVsIHx8IG9wdGlvbnMubGFiZWwsXG4gICAgICAgICAgICBjbGlja2FibGU6IGNsaWNrYWJsZSAhPT0gdW5kZWZpbmVkID8gY2xpY2thYmxlIDogb3B0aW9ucy5jbGlja2FibGUsXG4gICAgICAgICAgICBtYXA6IHRoaXMuX2dvb2dsZU1hcC5nb29nbGVNYXAsXG4gICAgICAgICAgfTtcbiAgICAgICAgICByZXR1cm4gY29tYmluZWRPcHRpb25zO1xuICAgICAgICB9KSk7XG4gIH1cblxuICBwcml2YXRlIF93YXRjaEZvck9wdGlvbnNDaGFuZ2VzKCkge1xuICAgIHRoaXMuX29wdGlvbnMucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveSkpLnN1YnNjcmliZShvcHRpb25zID0+IHtcbiAgICAgIGlmICh0aGlzLm1hcmtlcikge1xuICAgICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgICB0aGlzLm1hcmtlci5zZXRPcHRpb25zKG9wdGlvbnMpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfd2F0Y2hGb3JUaXRsZUNoYW5nZXMoKSB7XG4gICAgdGhpcy5fdGl0bGUucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveSkpLnN1YnNjcmliZSh0aXRsZSA9PiB7XG4gICAgICBpZiAodGhpcy5tYXJrZXIgJiYgdGl0bGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgICB0aGlzLm1hcmtlci5zZXRUaXRsZSh0aXRsZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF93YXRjaEZvclBvc2l0aW9uQ2hhbmdlcygpIHtcbiAgICB0aGlzLl9wb3NpdGlvbi5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95KSkuc3Vic2NyaWJlKHBvc2l0aW9uID0+IHtcbiAgICAgIGlmICh0aGlzLm1hcmtlciAmJiBwb3NpdGlvbikge1xuICAgICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgICB0aGlzLm1hcmtlci5zZXRQb3NpdGlvbihwb3NpdGlvbik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF93YXRjaEZvckxhYmVsQ2hhbmdlcygpIHtcbiAgICB0aGlzLl9sYWJlbC5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95KSkuc3Vic2NyaWJlKGxhYmVsID0+IHtcbiAgICAgIGlmICh0aGlzLm1hcmtlciAmJiBsYWJlbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgICAgIHRoaXMubWFya2VyLnNldExhYmVsKGxhYmVsKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3dhdGNoRm9yQ2xpY2thYmxlQ2hhbmdlcygpIHtcbiAgICB0aGlzLl9jbGlja2FibGUucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveSkpLnN1YnNjcmliZShjbGlja2FibGUgPT4ge1xuICAgICAgaWYgKHRoaXMubWFya2VyICYmIGNsaWNrYWJsZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgICAgIHRoaXMubWFya2VyLnNldENsaWNrYWJsZShjbGlja2FibGUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfYXNzZXJ0SW5pdGlhbGl6ZWQoKTogYXNzZXJ0cyB0aGlzIGlzIHttYXJrZXI6IGdvb2dsZS5tYXBzLk1hcmtlcn0ge1xuICAgIGlmICghdGhpcy5fZ29vZ2xlTWFwLmdvb2dsZU1hcCkge1xuICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICAgJ0Nhbm5vdCBhY2Nlc3MgR29vZ2xlIE1hcCBpbmZvcm1hdGlvbiBiZWZvcmUgdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZC4gJyArXG4gICAgICAgICAgJ1BsZWFzZSB3YWl0IGZvciB0aGUgQVBJIHRvIGxvYWQgYmVmb3JlIHRyeWluZyB0byBpbnRlcmFjdCB3aXRoIGl0LicpO1xuICAgIH1cbiAgICBpZiAoIXRoaXMubWFya2VyKSB7XG4gICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICAnQ2Fubm90IGludGVyYWN0IHdpdGggYSBHb29nbGUgTWFwIE1hcmtlciBiZWZvcmUgaXQgaGFzIGJlZW4gJyArXG4gICAgICAgICAgJ2luaXRpYWxpemVkLiBQbGVhc2Ugd2FpdCBmb3IgdGhlIE1hcmtlciB0byBsb2FkIGJlZm9yZSB0cnlpbmcgdG8gaW50ZXJhY3Qgd2l0aCBpdC4nKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==