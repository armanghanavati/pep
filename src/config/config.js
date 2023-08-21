//------------Config For DEV DataGrid---------------
import themes from 'devextreme/ui/themes';
export const DataGridPageSizes = [10, 20,30, 50, 100];
export const DataGridDefaultPageSize=10;
export const DataGridDefaultHeight=600;
export const ALL_MOD= 'allPages';
export const CHECK_BOXES_MOD= themes.current().startsWith('material') ? 'always' : 'onClick'
export const FILTER_BUILDER_POPUP_POSITION = {
    of: window,
    at: 'top',
    my: 'top',
    offset: { y: 10 },
};


//----config for Toast-----------
export const ToastTime=4000;
export const ToastWidth=600;
