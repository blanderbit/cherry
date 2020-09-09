import { ListHandler } from './list/list.handler';
import { GridItemsComponent } from 'grid';

export class HolidayListHandler extends ListHandler {
    handleCreateItem(items, listComponent: GridItemsComponent<any>): boolean {
        const {holidayPolicyId, year}: any = listComponent && listComponent.params;
        const checkItem = (item) => holidayPolicyId == item.holidayPolicyId && isTheSameYear(year, item.date);

        if (checkItem(Array.isArray(items) ? items[0] : items))
            return true;
    }
}

function isTheSameYear(year, date) {
    return new Date(date).getFullYear() == year;
}
