import { BufferUsage, BufferTarget } from "../enum/Buffer";
import BufferHelper, { UniformBufferConfig, UniformBufferObject } from "./BufferHelper";

export default class UniformBlock {

    private properties: Map<string, { offset: number, value: Float32Array }> = new Map();
    private offset: number = 0;
    private id: number | null = null;

    private defineProperty(name: string, size: number, initialValue: Float32Array) {
        if (this.properties.has(name)) {
            throw new Error(`A propriedade "${name}" já foi definida.`);
        }

        this.properties.set(name, { offset: this.offset, value: initialValue });
        this.offset += size;
    }

    public defineFloat(name: string, initialValue: number) {
        this.defineProperty(name, 4, new Float32Array([initialValue]));
    }

    public defineVec2(name: string, initialValue: Float32Array) {
        this.defineProperty(name, 8, initialValue);
    }

    public defineVec3(name: string, initialValue: Float32Array) {
        this.defineProperty(name, 12, initialValue);
    }

    public defineVec4(name: string, initialValue: Float32Array) {
        this.defineProperty(name, 16, initialValue);
    }

    public defineMat4(name: string, initialValue: Float32Array) {
        this.defineProperty(name, 64, initialValue);
    }

    public getPropertyOffset(name: string): { offset: number, value: Float32Array } | null {
        return this.properties.get(name) ?? null;
    }

    public createBuffer(identifier: number) {
        if (this.id !== null) {
            throw new Error("O buffer já foi criado.");
        }

        this.id = identifier;

        const config: UniformBufferConfig = {
            size: this.offset,
            usage: BufferUsage.DYNAMIC_DRAW,
            target: BufferTarget.UNIFORM_BUFFER,
        };

        BufferHelper.createUniformBuffer(identifier, config);

        for (const [key, property] of this.properties) {
            if (this.id && property) {
                const object: UniformBufferObject = {
                    id: this.id,
                    target: BufferTarget.UNIFORM_BUFFER,
                    uniformsData: [
                        {
                            data: property.value,
                            offset: property.offset
                        }
                    ]
                };

                BufferHelper.updateUniformBuffer(object);
            }
        }
    }

    private updatePropertyBuffer(name: string, value: Float32Array) {
        const property = this.properties.get(name);
        if (this.id && property) {
            property.value = value;
            const object: UniformBufferObject = {
                id: this.id,
                target: BufferTarget.UNIFORM_BUFFER,
                uniformsData: [
                    {
                        data: property.value,
                        offset: property.offset
                    }
                ]
            };

            BufferHelper.updateUniformBuffer(object);
        }
    }

    public setFloat(name: string, value: number) {
        this.updatePropertyBuffer(name, new Float32Array([value]));
    }

    public setVec3(name: string, value: Float32Array) {
        this.updatePropertyBuffer(name, value);
    }
}
