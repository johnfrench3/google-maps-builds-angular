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
import { Input, Output, NgZone, Directive, inject, } from '@angular/core';
import { Observable } from 'rxjs';
import { GoogleMap } from '../google-map/google-map';
import { MapEventManager } from '../map-event-manager';
import * as i0 from "@angular/core";
import * as i1 from "../google-map/google-map";
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
    /**
     * Title of the marker.
     * See: developers.google.com/maps/documentation/javascript/reference/marker#MarkerOptions.title
     */
    set title(title) {
        this._title = title;
    }
    /**
     * Position of the marker. See:
     * developers.google.com/maps/documentation/javascript/reference/marker#MarkerOptions.position
     */
    set position(position) {
        this._position = position;
    }
    /**
     * Label for the marker.
     * See: developers.google.com/maps/documentation/javascript/reference/marker#MarkerOptions.label
     */
    set label(label) {
        this._label = label;
    }
    /**
     * Whether the marker is clickable. See:
     * developers.google.com/maps/documentation/javascript/reference/marker#MarkerOptions.clickable
     */
    set clickable(clickable) {
        this._clickable = clickable;
    }
    /**
     * Options used to configure the marker.
     * See: developers.google.com/maps/documentation/javascript/reference/marker#MarkerOptions
     */
    set options(options) {
        this._options = options;
    }
    /**
     * Icon to be used for the marker.
     * See: https://developers.google.com/maps/documentation/javascript/reference/marker#Icon
     */
    set icon(icon) {
        this._icon = icon;
    }
    /**
     * Whether the marker is visible.
     * See: developers.google.com/maps/documentation/javascript/reference/marker#MarkerOptions.visible
     */
    set visible(value) {
        this._visible = value;
    }
    constructor(_googleMap, _ngZone) {
        this._googleMap = _googleMap;
        this._ngZone = _ngZone;
        this._eventManager = new MapEventManager(inject(NgZone));
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
    ngOnInit() {
        if (this._googleMap._isBrowser) {
            // Create the object outside the zone so its events don't trigger change detection.
            // We'll bring it back in inside the `MapEventManager` only for the events that the
            // user has subscribed to.
            this._ngZone.runOutsideAngular(() => {
                this.marker = new google.maps.Marker(this._combineOptions());
            });
            this._assertInitialized();
            this.marker.setMap(this._googleMap.googleMap);
            this._eventManager.setTarget(this.marker);
        }
    }
    ngOnChanges(changes) {
        const { marker, _title, _position, _label, _clickable, _icon, _visible } = this;
        if (marker) {
            if (changes['options']) {
                marker.setOptions(this._combineOptions());
            }
            if (changes['title'] && _title !== undefined) {
                marker.setTitle(_title);
            }
            if (changes['position'] && _position) {
                marker.setPosition(_position);
            }
            if (changes['label'] && _label !== undefined) {
                marker.setLabel(_label);
            }
            if (changes['clickable'] && _clickable !== undefined) {
                marker.setClickable(_clickable);
            }
            if (changes['icon'] && _icon) {
                marker.setIcon(_icon);
            }
            if (changes['visible'] && _visible !== undefined) {
                marker.setVisible(_visible);
            }
        }
    }
    ngOnDestroy() {
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
    /** Creates a combined options object using the passed-in options and the individual inputs. */
    _combineOptions() {
        const options = this._options || DEFAULT_MARKER_OPTIONS;
        return {
            ...options,
            title: this._title || options.title,
            position: this._position || options.position,
            label: this._label || options.label,
            clickable: this._clickable ?? options.clickable,
            map: this._googleMap.googleMap,
            icon: this._icon || options.icon,
            visible: this._visible ?? options.visible,
        };
    }
    _assertInitialized() {
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.0", ngImport: i0, type: MapMarker, deps: [{ token: i1.GoogleMap }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.1.0", type: MapMarker, selector: "map-marker", inputs: { title: "title", position: "position", label: "label", clickable: "clickable", options: "options", icon: "icon", visible: "visible" }, outputs: { animationChanged: "animationChanged", mapClick: "mapClick", clickableChanged: "clickableChanged", cursorChanged: "cursorChanged", mapDblclick: "mapDblclick", mapDrag: "mapDrag", mapDragend: "mapDragend", draggableChanged: "draggableChanged", mapDragstart: "mapDragstart", flatChanged: "flatChanged", iconChanged: "iconChanged", mapMousedown: "mapMousedown", mapMouseout: "mapMouseout", mapMouseover: "mapMouseover", mapMouseup: "mapMouseup", positionChanged: "positionChanged", mapRightclick: "mapRightclick", shapeChanged: "shapeChanged", titleChanged: "titleChanged", visibleChanged: "visibleChanged", zindexChanged: "zindexChanged" }, exportAs: ["mapMarker"], usesOnChanges: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.0", ngImport: i0, type: MapMarker, decorators: [{
            type: Directive,
            args: [{
                    selector: 'map-marker',
                    exportAs: 'mapMarker',
                }]
        }], ctorParameters: function () { return [{ type: i1.GoogleMap }, { type: i0.NgZone }]; }, propDecorators: { title: [{
                type: Input
            }], position: [{
                type: Input
            }], label: [{
                type: Input
            }], clickable: [{
                type: Input
            }], options: [{
                type: Input
            }], icon: [{
                type: Input
            }], visible: [{
                type: Input
            }], animationChanged: [{
                type: Output
            }], mapClick: [{
                type: Output
            }], clickableChanged: [{
                type: Output
            }], cursorChanged: [{
                type: Output
            }], mapDblclick: [{
                type: Output
            }], mapDrag: [{
                type: Output
            }], mapDragend: [{
                type: Output
            }], draggableChanged: [{
                type: Output
            }], mapDragstart: [{
                type: Output
            }], flatChanged: [{
                type: Output
            }], iconChanged: [{
                type: Output
            }], mapMousedown: [{
                type: Output
            }], mapMouseout: [{
                type: Output
            }], mapMouseover: [{
                type: Output
            }], mapMouseup: [{
                type: Output
            }], positionChanged: [{
                type: Output
            }], mapRightclick: [{
                type: Output
            }], shapeChanged: [{
                type: Output
            }], titleChanged: [{
                type: Output
            }], visibleChanged: [{
                type: Output
            }], zindexChanged: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLW1hcmtlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9nb29nbGUtbWFwcy9tYXAtbWFya2VyL21hcC1tYXJrZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBU0EscUNBQXFDO0FBVHJDOzs7Ozs7R0FNRztBQUVILHlFQUF5RTtBQUN6RSxxQ0FBcUM7QUFFckMsT0FBTyxFQUNMLEtBQUssRUFHTCxNQUFNLEVBQ04sTUFBTSxFQUNOLFNBQVMsRUFHVCxNQUFNLEdBQ1AsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUVoQyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDbkQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHNCQUFzQixDQUFDOzs7QUFHckQ7OztHQUdHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sc0JBQXNCLEdBQUc7SUFDcEMsUUFBUSxFQUFFLEVBQUMsR0FBRyxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxVQUFVLEVBQUM7Q0FDN0MsQ0FBQztBQUVGOzs7O0dBSUc7QUFLSCxNQUFNLE9BQU8sU0FBUztJQUdwQjs7O09BR0c7SUFDSCxJQUNJLEtBQUssQ0FBQyxLQUFhO1FBQ3JCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO0lBQ3RCLENBQUM7SUFHRDs7O09BR0c7SUFDSCxJQUNJLFFBQVEsQ0FBQyxRQUF3RDtRQUNuRSxJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztJQUM1QixDQUFDO0lBR0Q7OztPQUdHO0lBQ0gsSUFDSSxLQUFLLENBQUMsS0FBdUM7UUFDL0MsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7SUFDdEIsQ0FBQztJQUdEOzs7T0FHRztJQUNILElBQ0ksU0FBUyxDQUFDLFNBQWtCO1FBQzlCLElBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO0lBQzlC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T1ksWUFBWTtzQkFBOUIsTUFBTTtnQkFPWSxVQUFVO3NCQUE1QixNQUFNO2dCQU9ZLGVBQWU7c0JBQWpDLE1BQU07Z0JBT1ksYUFBYTtzQkFBL0IsTUFBTTtnQkFPWSxZQUFZO3NCQUE5QixNQUFNO2dCQU9ZLFlBQVk7c0JBQTlCLE1BQU07Z0JBT1ksY0FBYztzQkFBaEMsTUFBTTtnQkFPWSxhQUFhO3NCQUEvQixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8vIFdvcmthcm91bmQgZm9yOiBodHRwczovL2dpdGh1Yi5jb20vYmF6ZWxidWlsZC9ydWxlc19ub2RlanMvaXNzdWVzLzEyNjVcbi8vLyA8cmVmZXJlbmNlIHR5cGVzPVwiZ29vZ2xlLm1hcHNcIiAvPlxuXG5pbXBvcnQge1xuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgTmdab25lLFxuICBEaXJlY3RpdmUsXG4gIE9uQ2hhbmdlcyxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgaW5qZWN0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7R29vZ2xlTWFwfSBmcm9tICcuLi9nb29nbGUtbWFwL2dvb2dsZS1tYXAnO1xuaW1wb3J0IHtNYXBFdmVudE1hbmFnZXJ9IGZyb20gJy4uL21hcC1ldmVudC1tYW5hZ2VyJztcbmltcG9ydCB7TWFwQW5jaG9yUG9pbnR9IGZyb20gJy4uL21hcC1hbmNob3ItcG9pbnQnO1xuXG4vKipcbiAqIERlZmF1bHQgb3B0aW9ucyBmb3IgdGhlIEdvb2dsZSBNYXBzIG1hcmtlciBjb21wb25lbnQuIERpc3BsYXlzIGEgbWFya2VyXG4gKiBhdCB0aGUgR29vZ2xlcGxleC5cbiAqL1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfTUFSS0VSX09QVElPTlMgPSB7XG4gIHBvc2l0aW9uOiB7bGF0OiAzNy40MjE5OTUsIGxuZzogLTEyMi4wODQwOTJ9LFxufTtcblxuLyoqXG4gKiBBbmd1bGFyIGNvbXBvbmVudCB0aGF0IHJlbmRlcnMgYSBHb29nbGUgTWFwcyBtYXJrZXIgdmlhIHRoZSBHb29nbGUgTWFwcyBKYXZhU2NyaXB0IEFQSS5cbiAqXG4gKiBTZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXJcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWFwLW1hcmtlcicsXG4gIGV4cG9ydEFzOiAnbWFwTWFya2VyJyxcbn0pXG5leHBvcnQgY2xhc3MgTWFwTWFya2VyIGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSwgTWFwQW5jaG9yUG9pbnQge1xuICBwcml2YXRlIF9ldmVudE1hbmFnZXIgPSBuZXcgTWFwRXZlbnRNYW5hZ2VyKGluamVjdChOZ1pvbmUpKTtcblxuICAvKipcbiAgICogVGl0bGUgb2YgdGhlIG1hcmtlci5cbiAgICogU2VlOiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXJPcHRpb25zLnRpdGxlXG4gICAqL1xuICBASW5wdXQoKVxuICBzZXQgdGl0bGUodGl0bGU6IHN0cmluZykge1xuICAgIHRoaXMuX3RpdGxlID0gdGl0bGU7XG4gIH1cbiAgcHJpdmF0ZSBfdGl0bGU6IHN0cmluZztcblxuICAvKipcbiAgICogUG9zaXRpb24gb2YgdGhlIG1hcmtlci4gU2VlOlxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXJPcHRpb25zLnBvc2l0aW9uXG4gICAqL1xuICBASW5wdXQoKVxuICBzZXQgcG9zaXRpb24ocG9zaXRpb246IGdvb2dsZS5tYXBzLkxhdExuZ0xpdGVyYWwgfCBnb29nbGUubWFwcy5MYXRMbmcpIHtcbiAgICB0aGlzLl9wb3NpdGlvbiA9IHBvc2l0aW9uO1xuICB9XG4gIHByaXZhdGUgX3Bvc2l0aW9uOiBnb29nbGUubWFwcy5MYXRMbmdMaXRlcmFsIHwgZ29vZ2xlLm1hcHMuTGF0TG5nO1xuXG4gIC8qKlxuICAgKiBMYWJlbCBmb3IgdGhlIG1hcmtlci5cbiAgICogU2VlOiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXJPcHRpb25zLmxhYmVsXG4gICAqL1xuICBASW5wdXQoKVxuICBzZXQgbGFiZWwobGFiZWw6IHN0cmluZyB8IGdvb2dsZS5tYXBzLk1hcmtlckxhYmVsKSB7XG4gICAgdGhpcy5fbGFiZWwgPSBsYWJlbDtcbiAgfVxuICBwcml2YXRlIF9sYWJlbDogc3RyaW5nIHwgZ29vZ2xlLm1hcHMuTWFya2VyTGFiZWw7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIG1hcmtlciBpcyBjbGlja2FibGUuIFNlZTpcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyT3B0aW9ucy5jbGlja2FibGVcbiAgICovXG4gIEBJbnB1dCgpXG4gIHNldCBjbGlja2FibGUoY2xpY2thYmxlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fY2xpY2thYmxlID0gY2xpY2thYmxlO1xuICB9XG4gIHByaXZhdGUgX2NsaWNrYWJsZTogYm9vbGVhbjtcblxuICAvKipcbiAgICogT3B0aW9ucyB1c2VkIHRvIGNvbmZpZ3VyZSB0aGUgbWFya2VyLlxuICAgKiBTZWU6IGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlck9wdGlvbnNcbiAgICovXG4gIEBJbnB1dCgpXG4gIHNldCBvcHRpb25zKG9wdGlvbnM6IGdvb2dsZS5tYXBzLk1hcmtlck9wdGlvbnMpIHtcbiAgICB0aGlzLl9vcHRpb25zID0gb3B0aW9ucztcbiAgfVxuICBwcml2YXRlIF9vcHRpb25zOiBnb29nbGUubWFwcy5NYXJrZXJPcHRpb25zO1xuXG4gIC8qKlxuICAgKiBJY29uIHRvIGJlIHVzZWQgZm9yIHRoZSBtYXJrZXIuXG4gICAqIFNlZTogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNJY29uXG4gICAqL1xuICBASW5wdXQoKVxuICBzZXQgaWNvbihpY29uOiBzdHJpbmcgfCBnb29nbGUubWFwcy5JY29uIHwgZ29vZ2xlLm1hcHMuU3ltYm9sKSB7XG4gICAgdGhpcy5faWNvbiA9IGljb247XG4gIH1cbiAgcHJpdmF0ZSBfaWNvbjogc3RyaW5nIHwgZ29vZ2xlLm1hcHMuSWNvbiB8IGdvb2dsZS5tYXBzLlN5bWJvbDtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgbWFya2VyIGlzIHZpc2libGUuXG4gICAqIFNlZTogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyT3B0aW9ucy52aXNpYmxlXG4gICAqL1xuICBASW5wdXQoKVxuICBzZXQgdmlzaWJsZSh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX3Zpc2libGUgPSB2YWx1ZTtcbiAgfVxuICBwcml2YXRlIF92aXNpYmxlOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmFuaW1hdGlvbl9jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgYW5pbWF0aW9uQ2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCdhbmltYXRpb25fY2hhbmdlZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmNsaWNrXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgbWFwQ2xpY2s6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PignY2xpY2snKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5jbGlja2FibGVfY2hhbmdlZFxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGNsaWNrYWJsZUNoYW5nZWQ6IE9ic2VydmFibGU8dm9pZD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPignY2xpY2thYmxlX2NoYW5nZWQnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5jdXJzb3JfY2hhbmdlZFxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGN1cnNvckNoYW5nZWQ6IE9ic2VydmFibGU8dm9pZD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPignY3Vyc29yX2NoYW5nZWQnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5kYmxjbGlja1xuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG1hcERibGNsaWNrOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4oJ2RibGNsaWNrJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuZHJhZ1xuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG1hcERyYWc6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PignZHJhZycpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmRyYWdlbmRcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBtYXBEcmFnZW5kOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4oJ2RyYWdlbmQnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5kcmFnZ2FibGVfY2hhbmdlZFxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGRyYWdnYWJsZUNoYW5nZWQ6IE9ic2VydmFibGU8dm9pZD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPignZHJhZ2dhYmxlX2NoYW5nZWQnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5kcmFnc3RhcnRcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBtYXBEcmFnc3RhcnQ6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PignZHJhZ3N0YXJ0Jyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuZmxhdF9jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgZmxhdENoYW5nZWQ6IE9ic2VydmFibGU8dm9pZD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPignZmxhdF9jaGFuZ2VkJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuaWNvbl9jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgaWNvbkNoYW5nZWQ6IE9ic2VydmFibGU8dm9pZD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPignaWNvbl9jaGFuZ2VkJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIubW91c2Vkb3duXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgbWFwTW91c2Vkb3duOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4oJ21vdXNlZG93bicpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLm1vdXNlb3V0XG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgbWFwTW91c2VvdXQ6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PignbW91c2VvdXQnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5tb3VzZW92ZXJcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBtYXBNb3VzZW92ZXI6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PignbW91c2VvdmVyJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIubW91c2V1cFxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG1hcE1vdXNldXA6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5NYXBNb3VzZUV2ZW50PignbW91c2V1cCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLnBvc2l0aW9uX2NoYW5nZWRcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBwb3NpdGlvbkNoYW5nZWQ6IE9ic2VydmFibGU8dm9pZD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPigncG9zaXRpb25fY2hhbmdlZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLnJpZ2h0Y2xpY2tcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBtYXBSaWdodGNsaWNrOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1hcE1vdXNlRXZlbnQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTWFwTW91c2VFdmVudD4oJ3JpZ2h0Y2xpY2snKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5zaGFwZV9jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgc2hhcGVDaGFuZ2VkOiBPYnNlcnZhYmxlPHZvaWQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ3NoYXBlX2NoYW5nZWQnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci50aXRsZV9jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgdGl0bGVDaGFuZ2VkOiBPYnNlcnZhYmxlPHZvaWQ+ID1cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ3RpdGxlX2NoYW5nZWQnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci52aXNpYmxlX2NoYW5nZWRcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSB2aXNpYmxlQ2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCd2aXNpYmxlX2NoYW5nZWQnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci56aW5kZXhfY2hhbmdlZFxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHppbmRleENoYW5nZWQ6IE9ic2VydmFibGU8dm9pZD4gPVxuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPignemluZGV4X2NoYW5nZWQnKTtcblxuICAvKipcbiAgICogVGhlIHVuZGVybHlpbmcgZ29vZ2xlLm1hcHMuTWFya2VyIG9iamVjdC5cbiAgICpcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlclxuICAgKi9cbiAgbWFya2VyPzogZ29vZ2xlLm1hcHMuTWFya2VyO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgX2dvb2dsZU1hcDogR29vZ2xlTWFwLCBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSkge31cblxuICBuZ09uSW5pdCgpIHtcbiAgICBpZiAodGhpcy5fZ29vZ2xlTWFwLl9pc0Jyb3dzZXIpIHtcbiAgICAgIC8vIENyZWF0ZSB0aGUgb2JqZWN0IG91dHNpZGUgdGhlIHpvbmUgc28gaXRzIGV2ZW50cyBkb24ndCB0cmlnZ2VyIGNoYW5nZSBkZXRlY3Rpb24uXG4gICAgICAvLyBXZSdsbCBicmluZyBpdCBiYWNrIGluIGluc2lkZSB0aGUgYE1hcEV2ZW50TWFuYWdlcmAgb25seSBmb3IgdGhlIGV2ZW50cyB0aGF0IHRoZVxuICAgICAgLy8gdXNlciBoYXMgc3Vic2NyaWJlZCB0by5cbiAgICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgIHRoaXMubWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih0aGlzLl9jb21iaW5lT3B0aW9ucygpKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICAgIHRoaXMubWFya2VyLnNldE1hcCh0aGlzLl9nb29nbGVNYXAuZ29vZ2xlTWFwISk7XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuc2V0VGFyZ2V0KHRoaXMubWFya2VyKTtcbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgY29uc3Qge21hcmtlciwgX3RpdGxlLCBfcG9zaXRpb24sIF9sYWJlbCwgX2NsaWNrYWJsZSwgX2ljb24sIF92aXNpYmxlfSA9IHRoaXM7XG5cbiAgICBpZiAobWFya2VyKSB7XG4gICAgICBpZiAoY2hhbmdlc1snb3B0aW9ucyddKSB7XG4gICAgICAgIG1hcmtlci5zZXRPcHRpb25zKHRoaXMuX2NvbWJpbmVPcHRpb25zKCkpO1xuICAgICAgfVxuXG4gICAgICBpZiAoY2hhbmdlc1sndGl0bGUnXSAmJiBfdGl0bGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBtYXJrZXIuc2V0VGl0bGUoX3RpdGxlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNoYW5nZXNbJ3Bvc2l0aW9uJ10gJiYgX3Bvc2l0aW9uKSB7XG4gICAgICAgIG1hcmtlci5zZXRQb3NpdGlvbihfcG9zaXRpb24pO1xuICAgICAgfVxuXG4gICAgICBpZiAoY2hhbmdlc1snbGFiZWwnXSAmJiBfbGFiZWwgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBtYXJrZXIuc2V0TGFiZWwoX2xhYmVsKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNoYW5nZXNbJ2NsaWNrYWJsZSddICYmIF9jbGlja2FibGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBtYXJrZXIuc2V0Q2xpY2thYmxlKF9jbGlja2FibGUpO1xuICAgICAgfVxuXG4gICAgICBpZiAoY2hhbmdlc1snaWNvbiddICYmIF9pY29uKSB7XG4gICAgICAgIG1hcmtlci5zZXRJY29uKF9pY29uKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNoYW5nZXNbJ3Zpc2libGUnXSAmJiBfdmlzaWJsZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIG1hcmtlci5zZXRWaXNpYmxlKF92aXNpYmxlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZGVzdHJveSgpO1xuICAgIGlmICh0aGlzLm1hcmtlcikge1xuICAgICAgdGhpcy5tYXJrZXIuc2V0TWFwKG51bGwpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmdldEFuaW1hdGlvblxuICAgKi9cbiAgZ2V0QW5pbWF0aW9uKCk6IGdvb2dsZS5tYXBzLkFuaW1hdGlvbiB8IG51bGwge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyLmdldEFuaW1hdGlvbigpIHx8IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5nZXRDbGlja2FibGVcbiAgICovXG4gIGdldENsaWNrYWJsZSgpOiBib29sZWFuIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlci5nZXRDbGlja2FibGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmdldEN1cnNvclxuICAgKi9cbiAgZ2V0Q3Vyc29yKCk6IHN0cmluZyB8IG51bGwge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyLmdldEN1cnNvcigpIHx8IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5nZXREcmFnZ2FibGVcbiAgICovXG4gIGdldERyYWdnYWJsZSgpOiBib29sZWFuIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiAhIXRoaXMubWFya2VyLmdldERyYWdnYWJsZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuZ2V0SWNvblxuICAgKi9cbiAgZ2V0SWNvbigpOiBzdHJpbmcgfCBnb29nbGUubWFwcy5JY29uIHwgZ29vZ2xlLm1hcHMuU3ltYm9sIHwgbnVsbCB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXIuZ2V0SWNvbigpIHx8IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5nZXRMYWJlbFxuICAgKi9cbiAgZ2V0TGFiZWwoKTogZ29vZ2xlLm1hcHMuTWFya2VyTGFiZWwgfCBzdHJpbmcgfCBudWxsIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlci5nZXRMYWJlbCgpIHx8IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5nZXRPcGFjaXR5XG4gICAqL1xuICBnZXRPcGFjaXR5KCk6IG51bWJlciB8IG51bGwge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyLmdldE9wYWNpdHkoKSB8fCBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuZ2V0UG9zaXRpb25cbiAgICovXG4gIGdldFBvc2l0aW9uKCk6IGdvb2dsZS5tYXBzLkxhdExuZyB8IG51bGwge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyLmdldFBvc2l0aW9uKCkgfHwgbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmdldFNoYXBlXG4gICAqL1xuICBnZXRTaGFwZSgpOiBnb29nbGUubWFwcy5NYXJrZXJTaGFwZSB8IG51bGwge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyLmdldFNoYXBlKCkgfHwgbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmdldFRpdGxlXG4gICAqL1xuICBnZXRUaXRsZSgpOiBzdHJpbmcgfCBudWxsIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlci5nZXRUaXRsZSgpIHx8IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5nZXRWaXNpYmxlXG4gICAqL1xuICBnZXRWaXNpYmxlKCk6IGJvb2xlYW4ge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyLmdldFZpc2libGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmdldFpJbmRleFxuICAgKi9cbiAgZ2V0WkluZGV4KCk6IG51bWJlciB8IG51bGwge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyLmdldFpJbmRleCgpIHx8IG51bGw7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgYW5jaG9yIHBvaW50IHRoYXQgY2FuIGJlIHVzZWQgdG8gYXR0YWNoIG90aGVyIEdvb2dsZSBNYXBzIG9iamVjdHMuICovXG4gIGdldEFuY2hvcigpOiBnb29nbGUubWFwcy5NVkNPYmplY3Qge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyO1xuICB9XG5cbiAgLyoqIENyZWF0ZXMgYSBjb21iaW5lZCBvcHRpb25zIG9iamVjdCB1c2luZyB0aGUgcGFzc2VkLWluIG9wdGlvbnMgYW5kIHRoZSBpbmRpdmlkdWFsIGlucHV0cy4gKi9cbiAgcHJpdmF0ZSBfY29tYmluZU9wdGlvbnMoKTogZ29vZ2xlLm1hcHMuTWFya2VyT3B0aW9ucyB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMuX29wdGlvbnMgfHwgREVGQVVMVF9NQVJLRVJfT1BUSU9OUztcbiAgICByZXR1cm4ge1xuICAgICAgLi4ub3B0aW9ucyxcbiAgICAgIHRpdGxlOiB0aGlzLl90aXRsZSB8fCBvcHRpb25zLnRpdGxlLFxuICAgICAgcG9zaXRpb246IHRoaXMuX3Bvc2l0aW9uIHx8IG9wdGlvbnMucG9zaXRpb24sXG4gICAgICBsYWJlbDogdGhpcy5fbGFiZWwgfHwgb3B0aW9ucy5sYWJlbCxcbiAgICAgIGNsaWNrYWJsZTogdGhpcy5fY2xpY2thYmxlID8/IG9wdGlvbnMuY2xpY2thYmxlLFxuICAgICAgbWFwOiB0aGlzLl9nb29nbGVNYXAuZ29vZ2xlTWFwLFxuICAgICAgaWNvbjogdGhpcy5faWNvbiB8fCBvcHRpb25zLmljb24sXG4gICAgICB2aXNpYmxlOiB0aGlzLl92aXNpYmxlID8/IG9wdGlvbnMudmlzaWJsZSxcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBfYXNzZXJ0SW5pdGlhbGl6ZWQoKTogYXNzZXJ0cyB0aGlzIGlzIHttYXJrZXI6IGdvb2dsZS5tYXBzLk1hcmtlcn0ge1xuICAgIGlmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpIHtcbiAgICAgIGlmICghdGhpcy5fZ29vZ2xlTWFwLmdvb2dsZU1hcCkge1xuICAgICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICAnQ2Fubm90IGFjY2VzcyBHb29nbGUgTWFwIGluZm9ybWF0aW9uIGJlZm9yZSB0aGUgQVBJIGhhcyBiZWVuIGluaXRpYWxpemVkLiAnICtcbiAgICAgICAgICAgICdQbGVhc2Ugd2FpdCBmb3IgdGhlIEFQSSB0byBsb2FkIGJlZm9yZSB0cnlpbmcgdG8gaW50ZXJhY3Qgd2l0aCBpdC4nLFxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLm1hcmtlcikge1xuICAgICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICAnQ2Fubm90IGludGVyYWN0IHdpdGggYSBHb29nbGUgTWFwIE1hcmtlciBiZWZvcmUgaXQgaGFzIGJlZW4gJyArXG4gICAgICAgICAgICAnaW5pdGlhbGl6ZWQuIFBsZWFzZSB3YWl0IGZvciB0aGUgTWFya2VyIHRvIGxvYWQgYmVmb3JlIHRyeWluZyB0byBpbnRlcmFjdCB3aXRoIGl0LicsXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0=