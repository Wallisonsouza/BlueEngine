export default class Time {
    private accumulator: number = 0;
    private isRunning: boolean = false;
    private isPaused: boolean = false;
    private readonly maxFrameSkip: number = 5;

    public static deltaTime: number = 0;
    public static time: number = 0;
    public static readonly fixedDeltaTime: number = 1 / 50;
    
    public static timeScale: number = 1; 
    public static realtimeSinceStartup: number = 0;

    private frameCount: number = 0;
    private lastFpsTime: number = 0;
    public static fps: number = 0;

    private initialized: boolean = false;

    constructor(
        private readonly awakeCallback: () => void = () => {},
        private readonly startCallback: () => void = () => {},
        private readonly updateCallback: () => void = () => {},
        private readonly fixedUpdateCallback: () => void = () => {},
        private readonly lateUpdateCallback: () => void = () => {},
        private readonly onDrawGizmosCallback: () => void = () => {},
        private readonly onGUICallback: () => void = () => {}
    ) {}

    public start(): void {
        if (this.isRunning || this.initialized) return;

        this.awakeCallback();
        this.startCallback();

        this.initialized = true;
        this.isRunning = true;
        this.isPaused = false;
        Time.time = performance.now();
        this.lastFpsTime = Time.time;

        this.loop();
    }

    public stop(): void {
        this.isRunning = false;
    }

    public pause(): void {
        this.isPaused = true;
    }

    public resume(): void {
        if (!this.isRunning || !this.isPaused) return;
        this.isPaused = false;
        Time.time = performance.now();
        this.loop();
    }

    public step(): void {
        if (!this.isPaused) return;
        this.processFrame();
    }

    private loop(): void {
        if (!this.isRunning) return;

        if (!this.isPaused) {
            this.processFrame();
        }

        requestAnimationFrame(() => this.loop());
    }

    private processFrame(): void {
        const now = performance.now();
        const realDelta = (now - Time.time) / 1000;
        
     
        Time.deltaTime = realDelta * Time.timeScale;
        Time.realtimeSinceStartup += realDelta; 
        Time.time = now;

        this.accumulator += Time.deltaTime;
        let steps = 0;

        if (this.initialized) {
          
            while (this.accumulator >= Time.fixedDeltaTime && steps < this.maxFrameSkip) {
                this.fixedUpdateCallback();
                this.accumulator -= Time.fixedDeltaTime;
                steps++;
            }

            this.updateCallback();
            this.lateUpdateCallback();
            this.onDrawGizmosCallback();
            this.onGUICallback();
        }

        this.frameCount++;
        if (now - this.lastFpsTime >= 1000) {
            Time.fps = this.frameCount;
            this.frameCount = 0;
            this.lastFpsTime = now;
        }
    }
}