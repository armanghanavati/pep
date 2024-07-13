import { configureStore } from "@reduxjs/toolkit";
import ticketSlice from "./ticket/ticket-slice";
import userSlice from "./user/user-slice";
import ticketSubjectSlice from "./ticketSubject/ticketSubject-slice";
import ticketPrioritySlice from "./ticketPriority/ticketPriority-slice";
import paymentSlice from "./payment/payment-slice";
import companySlice from "./company/company-slice";
import locationSlice from "./location/location-slice";
import supplierSlice from "./supplier/supplier-slice";
import itemSlice from "./item/item-slice";
import itemGroupSlice from "./itemGroup/itemGroup-slice";
import orderPointInventorySlice from "./OrderPointInventory/orderPointInventory-slice";
import logsOrderPointInventorySlice from "./logsOrderPointInventory/logsOrderPointInventory-slice";
import orderPointSupplierSlice from "./orderPointSupplier/orderPointSupplier-slice";
import logsOrderPointSupplierSlice from "./logsOrderPointSupplier/logsOrderPointSupplier-slice";
import inventorySlice from "./inventory/inventory-slice";
import hubConnectionSlice from "./hubConnection/hubConnection-slice";
import mainSlice from "./main/main-slice";

const store = configureStore({
  reducer: {
    main: mainSlice.reducer,
    ticket: ticketSlice.reducer,
    users: userSlice.reducer,
    ticketSubjects: ticketSubjectSlice.reducer,
    ticketPriority: ticketPrioritySlice.reducer,
    payment: paymentSlice.reducer,
    companies: companySlice.reducer,
    locations: locationSlice.reducer,
    suppliers: supplierSlice.reducer,
    items: itemSlice.reducer,
    itemGroups: itemGroupSlice.reducer,
    orderPointInventories: orderPointInventorySlice.reducer,
    logsOrderPointInventories: logsOrderPointInventorySlice.reducer,
    orderPointSuppliers: orderPointSupplierSlice.reducer,
    logsOrderPointSuppliers: logsOrderPointSupplierSlice.reducer,
    inventories: inventorySlice.reducer,
    hubConnections: hubConnectionSlice.reducer,
  },
});
export default store;
