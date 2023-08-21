import { configureStore } from "@reduxjs/toolkit";
import ticketSlice from './ticket/ticket-slice'
import userSlice from "./user/user-slice";
import ticketSubjectSlice from "./ticketSubject/ticketSubject-slice";
import ticketPrioritySlice from "./ticketPriority/ticketPriority-slice";
import paymentSlice from "./payment/payment-slice";
import companySlice from "./company/company-slice";
import locationSlice from "./location/location-slice";
import supplierSlice from "./supplier/supplier-slice";
import itemSlice from "./item/item-slice";
import orderPointInventorySlice from "./OrderPointInventory/orderPointInventory-slice";
import logsOrderPointInventorySlice from "./logsOrderPointInventory/logsOrderPointInventory-slice";

const store = configureStore({
  reducer: {
    ticket: ticketSlice.reducer,  
    users:userSlice.reducer,
    ticketSubjects:ticketSubjectSlice.reducer,
    ticketPriority: ticketPrioritySlice.reducer,
    payment:paymentSlice.reducer,
    companies:companySlice.reducer,
    locations:locationSlice.reducer,
    suppliers:supplierSlice.reducer,    
    items:itemSlice.reducer,
    orderPointInventories:orderPointInventorySlice.reducer,
    logsOrderPointInventories:logsOrderPointInventorySlice.reducer,
  },
});
export default store;
