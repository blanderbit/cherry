export interface IPaginationResponse<T = any> {
    data: T[];
    total: number;
}

export interface IPaginationParams<T = number> {
    skip: T;
    take: T;
    totalItems?: T;
}

export class PaginationResponse<T = any> extends Array<T> {
    constructor(public totalItems: number = 0, items: T[] = []) {
        super();

        items.forEach(item => this.push(item));
        Object.setPrototypeOf(this, PaginationResponse.prototype);
    }

    map(callback) {
        const arr = new PaginationResponse(this.totalItems);

        for (let i = 0; i < this.length; i++) arr.push(callback(this[i], i, this));
        return arr;
    }

    filter(callback) {
        const arr = new PaginationResponse(this.totalItems);
        for (let i = 0; i < this.length; i++) {
            if (callback.call(this, this[i], i, this)) arr.push(this[i]);
        }
        return arr;
    }

    reduce(callback: any, initialVal?: any): any {
        let accumulator = initialVal === undefined ? undefined : initialVal;
        for (let i = 0; i < this.length; i++) {
            if (accumulator !== undefined)
                accumulator = callback.call(undefined, accumulator, this[i], i, this);
            else accumulator = this[i];
        }
        return accumulator;
    }
}
