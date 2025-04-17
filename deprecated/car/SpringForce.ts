export default class SpringForce {
    private springConstant: number; 

    constructor(springConstant: number) {
        if (springConstant <= 0) {
            throw new Error("A constante da mola deve ser maior que zero.");
        }
        this.springConstant = springConstant;
    }

    public calculateForce(displacement: number): number {
        return -this.springConstant * displacement;
    }
  
    public getSpringConstant(): number {
        return this.springConstant;
    }

    public setSpringConstant(springConstant: number): void {
        if (springConstant <= 0) {
            throw new Error("A constante da mola deve ser maior que zero.");
        }
        this.springConstant = springConstant;
    }
}
