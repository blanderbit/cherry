const keyImage = require['context']('./', true, /\.(png|jpg|jpeg|svg)$/);

export class FileImage {
    src: string = '';
    item: number = 0;
    key: string = '';
    extention: string = '';
    constructor(init?: Partial<FileImage>) {
        Object.assign(<FileImage>this, init);
    }
}

export const filesImages: FileImage[] = keyImage.keys().map((key: string, item: number): FileImage => {
    const src = keyImage(key);
    const extention = src && src.split('.')[0];
    return new FileImage({ src, item, key, extention });
});

