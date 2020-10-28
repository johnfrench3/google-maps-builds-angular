/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <reference types="googlemaps" />
import { NgZone } from '@angular/core';
import { Observable } from 'rxjs';
declare type MapEventManagerTarget = {
    addListener: (name: string, callback: (...args: any[]) => void) => google.maps.MapsEventListener;
} | undefined;
/** Manages event on a Google Maps object, ensuring that events are added only when necessary. */
export declare class MapEventManager {
    private _ngZone;
    /** Pending listeners that were added before the target was set. */
    private _pending;
    private _listeners;
    private _targetStream;
    /** Clears all currently-registered event listeners. */
    private _clearListeners;
    constructor(_ngZone: NgZone);
    /** Gets an observable that adds an event listener to the map when a consumer subscribes to it. */
    getLazyEmitter<T>(name: string): Observable<T>;
    /** Sets the current target that the manager should bind events to. */
    setTarget(target: MapEventManagerTarget): void;
    /** Destroys the manager and clears the event listeners. */
    destroy(): void;
}
export {};
