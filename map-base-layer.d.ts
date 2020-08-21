/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgZone, OnDestroy, OnInit } from '@angular/core';
import { GoogleMap } from './google-map/google-map';
export declare class MapBaseLayer implements OnInit, OnDestroy {
    protected readonly _map: GoogleMap;
    protected readonly _ngZone: NgZone;
    constructor(_map: GoogleMap, _ngZone: NgZone);
    ngOnInit(): void;
    ngOnDestroy(): void;
    private _assertInitialized;
    protected _initializeObject(): void;
    protected _setMap(): void;
    protected _unsetMap(): void;
}
