import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'textSplitFormatPipe'
})
export class TextSplitFormatPipe implements PipeTransform {
    transform(value: number | string, length: number = 30, range: number = 7): string {
        let text = value.toString();
        if (text.length > length) {
            text = `${text.substr(0, range)}...${text.substr(-range, range)}`;
        }
        return text;
    }
}
