export const GRID_DEFAULT_COL_DEF = {
    // width: 130,
    editable: false,
    sortable: true,
    resizable: true,
    filter: 'customFilter',
    comparator: (valueA, valueB) => {
        // disable default grid sorting
        return 0;
    },
};
