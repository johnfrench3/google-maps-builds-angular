/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __values } from "tslib";
import { Observable } from 'rxjs';
/** Manages event on a Google Maps object, ensuring that events are added only when necessary. */
var MapEventManager = /** @class */ (function () {
    function MapEventManager(_ngZone) {
        this._ngZone = _ngZone;
        /** Pending listeners that were added before the target was set. */
        this._pending = [];
        this._listeners = [];
    }
    /** Clears all currently-registered event listeners. */
    MapEventManager.prototype._clearListeners = function () {
        var e_1, _a;
        try {
            for (var _b = __values(this._listeners), _c = _b.next(); !_c.done; _c = _b.next()) {
                var listener = _c.value;
                listener.remove();
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        this._listeners = [];
    };
    /** Gets an observable that adds an event listener to the map when a consumer subscribes to it. */
    MapEventManager.prototype.getLazyEmitter = function (name) {
        var _this = this;
        var observable = new Observable(function (observer) {
            // If the target hasn't been initialized yet, cache the observer so it can be added later.
            if (!_this._target) {
                _this._pending.push({ observable: observable, observer: observer });
                return undefined;
            }
            var listener = _this._target.addListener(name, function (event) {
                _this._ngZone.run(function () { return observer.next(event); });
            });
            _this._listeners.push(listener);
            return function () { return listener.remove(); };
        });
        return observable;
    };
    /** Sets the current target that the manager should bind events to. */
    MapEventManager.prototype.setTarget = function (target) {
        if (target === this._target) {
            return;
        }
        // Clear the listeners from the pre-existing target.
        if (this._target) {
            this._clearListeners();
            this._pending = [];
        }
        this._target = target;
        // Add the listeners that were bound before the map was initialized.
        this._pending.forEach(function (subscriber) { return subscriber.observable.subscribe(subscriber.observer); });
        this._pending = [];
    };
    /** Destroys the manager and clears the event listeners. */
    MapEventManager.prototype.destroy = function () {
        this._clearListeners();
        this._pending = [];
        this._target = undefined;
    };
    return MapEventManager;
}());
export { MapEventManager };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWV2ZW50LW1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvZ29vZ2xlLW1hcHMvbWFwLWV2ZW50LW1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUdILE9BQU8sRUFBQyxVQUFVLEVBQWEsTUFBTSxNQUFNLENBQUM7QUFNNUMsaUdBQWlHO0FBQ2pHO0lBZUUseUJBQW9CLE9BQWU7UUFBZixZQUFPLEdBQVAsT0FBTyxDQUFRO1FBZG5DLG1FQUFtRTtRQUMzRCxhQUFRLEdBQStELEVBQUUsQ0FBQztRQUMxRSxlQUFVLEdBQW9DLEVBQUUsQ0FBQztJQVluQixDQUFDO0lBVHZDLHVEQUF1RDtJQUMvQyx5Q0FBZSxHQUF2Qjs7O1lBQ0UsS0FBcUIsSUFBQSxLQUFBLFNBQUEsSUFBSSxDQUFDLFVBQVUsQ0FBQSxnQkFBQSw0QkFBRTtnQkFBakMsSUFBSSxRQUFRLFdBQUE7Z0JBQ2YsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO2FBQ25COzs7Ozs7Ozs7UUFFRCxJQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztJQUN2QixDQUFDO0lBSUQsa0dBQWtHO0lBQ2xHLHdDQUFjLEdBQWQsVUFBa0IsSUFBWTtRQUE5QixpQkFnQkM7UUFmQyxJQUFNLFVBQVUsR0FBRyxJQUFJLFVBQVUsQ0FBSSxVQUFBLFFBQVE7WUFDM0MsMEZBQTBGO1lBQzFGLElBQUksQ0FBQyxLQUFJLENBQUMsT0FBTyxFQUFFO2dCQUNqQixLQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFDLFVBQVUsWUFBQSxFQUFFLFFBQVEsVUFBQSxFQUFDLENBQUMsQ0FBQztnQkFDM0MsT0FBTyxTQUFTLENBQUM7YUFDbEI7WUFFRCxJQUFNLFFBQVEsR0FBRyxLQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsVUFBQyxLQUFRO2dCQUN2RCxLQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFNLE9BQUEsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBcEIsQ0FBb0IsQ0FBQyxDQUFDO1lBQy9DLENBQUMsQ0FBQyxDQUFDO1lBQ0gsS0FBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDL0IsT0FBTyxjQUFNLE9BQUEsUUFBUSxDQUFDLE1BQU0sRUFBRSxFQUFqQixDQUFpQixDQUFDO1FBQ2pDLENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxVQUFVLENBQUM7SUFDcEIsQ0FBQztJQUVELHNFQUFzRTtJQUN0RSxtQ0FBUyxHQUFULFVBQVUsTUFBNkI7UUFDckMsSUFBSSxNQUFNLEtBQUssSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUMzQixPQUFPO1NBQ1I7UUFFRCxvREFBb0Q7UUFDcEQsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2hCLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUN2QixJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztTQUNwQjtRQUVELElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBRXRCLG9FQUFvRTtRQUNwRSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFBLFVBQVUsSUFBSSxPQUFBLFVBQVUsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsRUFBcEQsQ0FBb0QsQ0FBQyxDQUFDO1FBQzFGLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFFRCwyREFBMkQ7SUFDM0QsaUNBQU8sR0FBUDtRQUNFLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUN2QixJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztRQUNuQixJQUFJLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQztJQUMzQixDQUFDO0lBQ0gsc0JBQUM7QUFBRCxDQUFDLEFBN0RELElBNkRDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Tmdab25lfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7T2JzZXJ2YWJsZSwgU3Vic2NyaWJlcn0gZnJvbSAncnhqcyc7XG5cbnR5cGUgTWFwRXZlbnRNYW5hZ2VyVGFyZ2V0ID0ge1xuICBhZGRMaXN0ZW5lcjogKG5hbWU6IHN0cmluZywgY2FsbGJhY2s6ICguLi5hcmdzOiBhbnlbXSkgPT4gdm9pZCkgPT4gZ29vZ2xlLm1hcHMuTWFwc0V2ZW50TGlzdGVuZXI7XG59IHwgdW5kZWZpbmVkO1xuXG4vKiogTWFuYWdlcyBldmVudCBvbiBhIEdvb2dsZSBNYXBzIG9iamVjdCwgZW5zdXJpbmcgdGhhdCBldmVudHMgYXJlIGFkZGVkIG9ubHkgd2hlbiBuZWNlc3NhcnkuICovXG5leHBvcnQgY2xhc3MgTWFwRXZlbnRNYW5hZ2VyIHtcbiAgLyoqIFBlbmRpbmcgbGlzdGVuZXJzIHRoYXQgd2VyZSBhZGRlZCBiZWZvcmUgdGhlIHRhcmdldCB3YXMgc2V0LiAqL1xuICBwcml2YXRlIF9wZW5kaW5nOiB7b2JzZXJ2YWJsZTogT2JzZXJ2YWJsZTxhbnk+LCBvYnNlcnZlcjogU3Vic2NyaWJlcjxhbnk+fVtdID0gW107XG4gIHByaXZhdGUgX2xpc3RlbmVyczogZ29vZ2xlLm1hcHMuTWFwc0V2ZW50TGlzdGVuZXJbXSA9IFtdO1xuICBwcml2YXRlIF90YXJnZXQ6IE1hcEV2ZW50TWFuYWdlclRhcmdldDtcblxuICAvKiogQ2xlYXJzIGFsbCBjdXJyZW50bHktcmVnaXN0ZXJlZCBldmVudCBsaXN0ZW5lcnMuICovXG4gIHByaXZhdGUgX2NsZWFyTGlzdGVuZXJzKCkge1xuICAgIGZvciAobGV0IGxpc3RlbmVyIG9mIHRoaXMuX2xpc3RlbmVycykge1xuICAgICAgbGlzdGVuZXIucmVtb3ZlKCk7XG4gICAgfVxuXG4gICAgdGhpcy5fbGlzdGVuZXJzID0gW107XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSkge31cblxuICAvKiogR2V0cyBhbiBvYnNlcnZhYmxlIHRoYXQgYWRkcyBhbiBldmVudCBsaXN0ZW5lciB0byB0aGUgbWFwIHdoZW4gYSBjb25zdW1lciBzdWJzY3JpYmVzIHRvIGl0LiAqL1xuICBnZXRMYXp5RW1pdHRlcjxUPihuYW1lOiBzdHJpbmcpOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICBjb25zdCBvYnNlcnZhYmxlID0gbmV3IE9ic2VydmFibGU8VD4ob2JzZXJ2ZXIgPT4ge1xuICAgICAgLy8gSWYgdGhlIHRhcmdldCBoYXNuJ3QgYmVlbiBpbml0aWFsaXplZCB5ZXQsIGNhY2hlIHRoZSBvYnNlcnZlciBzbyBpdCBjYW4gYmUgYWRkZWQgbGF0ZXIuXG4gICAgICBpZiAoIXRoaXMuX3RhcmdldCkge1xuICAgICAgICB0aGlzLl9wZW5kaW5nLnB1c2goe29ic2VydmFibGUsIG9ic2VydmVyfSk7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGxpc3RlbmVyID0gdGhpcy5fdGFyZ2V0LmFkZExpc3RlbmVyKG5hbWUsIChldmVudDogVCkgPT4ge1xuICAgICAgICB0aGlzLl9uZ1pvbmUucnVuKCgpID0+IG9ic2VydmVyLm5leHQoZXZlbnQpKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fbGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpO1xuICAgICAgcmV0dXJuICgpID0+IGxpc3RlbmVyLnJlbW92ZSgpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIG9ic2VydmFibGU7XG4gIH1cblxuICAvKiogU2V0cyB0aGUgY3VycmVudCB0YXJnZXQgdGhhdCB0aGUgbWFuYWdlciBzaG91bGQgYmluZCBldmVudHMgdG8uICovXG4gIHNldFRhcmdldCh0YXJnZXQ6IE1hcEV2ZW50TWFuYWdlclRhcmdldCkge1xuICAgIGlmICh0YXJnZXQgPT09IHRoaXMuX3RhcmdldCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIENsZWFyIHRoZSBsaXN0ZW5lcnMgZnJvbSB0aGUgcHJlLWV4aXN0aW5nIHRhcmdldC5cbiAgICBpZiAodGhpcy5fdGFyZ2V0KSB7XG4gICAgICB0aGlzLl9jbGVhckxpc3RlbmVycygpO1xuICAgICAgdGhpcy5fcGVuZGluZyA9IFtdO1xuICAgIH1cblxuICAgIHRoaXMuX3RhcmdldCA9IHRhcmdldDtcblxuICAgIC8vIEFkZCB0aGUgbGlzdGVuZXJzIHRoYXQgd2VyZSBib3VuZCBiZWZvcmUgdGhlIG1hcCB3YXMgaW5pdGlhbGl6ZWQuXG4gICAgdGhpcy5fcGVuZGluZy5mb3JFYWNoKHN1YnNjcmliZXIgPT4gc3Vic2NyaWJlci5vYnNlcnZhYmxlLnN1YnNjcmliZShzdWJzY3JpYmVyLm9ic2VydmVyKSk7XG4gICAgdGhpcy5fcGVuZGluZyA9IFtdO1xuICB9XG5cbiAgLyoqIERlc3Ryb3lzIHRoZSBtYW5hZ2VyIGFuZCBjbGVhcnMgdGhlIGV2ZW50IGxpc3RlbmVycy4gKi9cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLl9jbGVhckxpc3RlbmVycygpO1xuICAgIHRoaXMuX3BlbmRpbmcgPSBbXTtcbiAgICB0aGlzLl90YXJnZXQgPSB1bmRlZmluZWQ7XG4gIH1cbn1cbiJdfQ==