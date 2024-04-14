export const notEmpty = <TValue>(value: TValue | null | undefined): value is TValue =>
    value !== null && value !== undefined && (typeof value !== "string" || value.trim() !== "");


export const mapNumber = (value: number, x1: number, y1: number, x2: number, y2: number) => {
    return (value - x1) * (y2 - x2) / (y1 - x1) + x2;
}
