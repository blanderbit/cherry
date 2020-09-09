import { Injectable } from '@angular/core';

const HoursInput = 'h';
const MinutesInput = 'm';

type TimeInputMeasureType = typeof HoursInput | typeof MinutesInput;
type HoursAndMinutes = [string, string?];
type TimeInput = string | number;

@Injectable()
export class ManualTimeInputService {
    maxMinutes: number;

    get maxHours() {
        return this.maxMinutes && Math.floor(this.maxMinutes / 60);
    }

    // input - string in format hh:mm
    toMinutes(input: string): number {
        if (input) {
            const values = input.split(':');
            const [hours, minutes] = values;

            if (hours != null && minutes != null) {
                return Number(hours) * 60 + Number(minutes);
            }
        }

        return 0;
    }

    // get hh:mm string from minutes number
    fromMinutes(minutes: TimeInput, maxMinutes: number): string {
        this.maxMinutes = maxMinutes;
        return this.calculateHoursOrMinutes(`${minutes.toString()}${MinutesInput}`);
    }

    parseTimeInput(input: string): string {
        return this.parseTimeInputDuration(input);
    }

    parseTimeInputDuration(input: string): string {
        if (!!input) {
            input = getNormalizedTimeInput(input);
            const timeInputData = input.split(/[:\/;\-]/);
            const timeDurationDataLength = timeInputData.length;

            switch (timeDurationDataLength) {
                case 1:
                    return this.calculateHoursOrMinutes(timeInputData[0]);
                case 2:
                    return this.calculateHoursAndMinutes(timeInputData as HoursAndMinutes);
            }
        }
    }

    calculateHoursOrMinutes(timeDuration: string): string {
        const type = getLastChar(timeDuration).toLowerCase() as TimeInputMeasureType;
        const time = timeDuration.substring(0, timeDuration.length - 1);

        switch (type) {
            case HoursInput:
                return this.calculateHours(time);
            case MinutesInput:
                return this.calculateMinutes(time);
            default:
                return this.calculateMinutesNumberOnly(timeDuration);
        }
    }

    calculateHours(timeDuration: string): string {
        timeDuration = timeDuration.replace(',', '.');

        const hoursFromData = Number(timeDuration);

        if (!isNaN(hoursFromData)) {
            if (hoursFromData >= this.maxHours) {
                return `${this.maxHours}:00`;
            } else {
                const hoursResult = Math.floor(hoursFromData);
                const minutesResult = Math.round(convertDecimalMinutesToMinutes(hoursFromData));
                return getViewString(hoursResult, minutesResult);
            }
        }
    }

    calculateMinutes(timeDuration: string): string {
        timeDuration = timeDuration.replace(',', '.');
        const minutesFromData = Number(timeDuration);

        if (!isNaN(minutesFromData)) {
            let hoursResult = Math.floor(minutesFromData / 60);
            let minutesResult: number;

            if (hoursResult >= this.maxHours) {
                hoursResult = this.maxHours;
                minutesResult = 0;
            } else {
                minutesResult = Math.floor(minutesFromData - hoursResult * 60);
            }

            return getViewString(hoursResult, minutesResult);
        }
    }

    calculateMinutesNumberOnly(time: string): string {
        time = time.replace(',', '.');
        const minutesFromData = Number(time);

        if (!isNaN(minutesFromData)) {
            if (minutesFromData < 100) {
                if (minutesFromData.toString().includes('.')) {
                    return this.calculateHours(minutesFromData.toString());
                }

                return getViewStringFromMinutes(minutesFromData);
            } else {
                let convertedTime: string;

                if (!Number.isInteger(minutesFromData)) {
                    const roundMinutes = minutesFromData.toFixed(2);
                    const minutes = String(roundMinutes);

                    convertedTime = `${minutes.substring(0, minutes.length - 5)}:${minutes.substring(minutes.length - 5, minutes.length)}`;
                } else {
                    convertedTime = `${time.substring(0, time.length - 2)}:${time.substring(time.length - 2, time.length)}`;
                }

                return this.calculateHoursAndMinutes(convertedTime.split(':') as HoursAndMinutes);
            }
        }
    }

    calculateHoursAndMinutes(timeDurationData: HoursAndMinutes): string {
        let hours = Number(timeDurationData[0].replace(',', '.'));

        if (!isNaN(hours)) {
            let minutes = Number(timeDurationData[1].replace(',', '.'));

            if (!isNaN(minutes)) {
                minutes = Math.floor(convertDecimalMinutesToMinutes(hours)) + Number(minutes);

                if (minutes > 59) {
                    hours = hours + (Math.floor(minutes / 60));
                    minutes = Math.floor(minutes - Math.floor(minutes / 60) * 60);
                }

                if (hours > this.maxHours) {
                    return `${this.maxHours}:00`;
                } else {
                    if (!Number.isInteger(hours)) {
                        hours = Math.floor(hours);
                    }

                    if (!Number.isInteger(minutes)) {
                        minutes = Math.floor(minutes);
                    }

                    return getViewString(hours, minutes);
                }
            }
        }
    }
}

function getNormalizedTimeInput(value: TimeInput): string {
    return String(value).trim().replace(',', '.').replace('.0', 'h');
}

function getLastChar(value: any): string {
    value = String(value);
    return value.charAt(value.length - 1);
}

function getViewStringFromMinutes(minutes: number): string {
    const hoursResult = Math.floor(+minutes / 60);
    const minutesResult = Math.floor(+minutes - hoursResult * 60);

    return getViewString(hoursResult, minutesResult);
}

function convertDecimalMinutesToMinutes(value: TimeInput): number {
    return ((+value * 100 % 100) / 100 * 60) || 0;
}

function getViewString(hours: TimeInput, minutes: TimeInput): string {
    const hoursDisplay = hours < 10 ? `0${hours}` : hours;
    const minutesDisplay = minutes < 10 ? `0${minutes}` : minutes;
    return `${hoursDisplay}:${minutesDisplay}`;
}
