import Mathf from "../../src/core/math/Mathf";

export default class AckermannSteering {
    private wheelbase: number; 
    private rearAxleDistance: number; 

    constructor(wheelbase: number, rearAxleDistance: number) {
        this.wheelbase = wheelbase;
        this.rearAxleDistance = rearAxleDistance;
    }
 
    private calculateInnerWheelAngle(turnRadius: number): number {
        return Math.atan2(this.wheelbase, turnRadius - (this.rearAxleDistance / 2));
    }

    private calculateOuterWheelAngle(turnRadius: number): number {
        return Math.atan2(this.wheelbase, turnRadius + (this.rearAxleDistance / 2));
    }
  
    public calculateWheelAngles(turnRadius: number): { innerWheelAngle: number, outerWheelAngle: number } {
        const innerWheelAngle = Mathf.radToDeg(this.calculateInnerWheelAngle(turnRadius));
        const outerWheelAngle = Mathf.radToDeg(this.calculateOuterWheelAngle(turnRadius));

        return {
            innerWheelAngle,
            outerWheelAngle
        };
    }
}
