export type EventType =
| "preUpdate"
| "update"
| "postUpdate"
| "lateUpdate"
| "preRender"
| "render"
| "postRender"
| "drawGizmos"
| string;

export default class LifeCycleEvents {
    public static events: Map<string, Set<Function>> = new Map();

    public static on(event: EventType, listener: Function): void {
        if (!this.events.has(event)) {
            this.events.set(event, new Set());
        }
        this.events.get(event)?.add(listener);
    }

    public static emit(event: EventType, ...args: any[]): void {
        const listeners = this.events.get(event);
        if (listeners) {
            listeners.forEach(listener => listener(...args));
        }
    }

    public static off(event: EventType, listener: Function): void {
        const listeners = this.events.get(event);
        if (listeners) {
            listeners.delete(listener);
        }
    }
}
