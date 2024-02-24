export const DataGridSnpOrderReportColumns = [
    {
        dataField: "id",
        caption: "شماره درخواست",
        allowEditing: false
    },
    {
        dataField: "code",
        caption: "کد درخواست",
        allowEditing: false
    },
    {
        dataField: "status",
        caption: "وضعیت",
        allowEditing: false
    },
    {
        dataField: "barCode",
        caption: "بارکد",
        allowEditing: false,
    },
    {
        dataField: "quantity",
        caption: "تعداد",
        allowEditing: false,
    },
    {
        dataField: "price",
        caption: "قیمت",
        allowEditing: false,
        allowEditing: false,        
        format: {  
            type: "fixedPoint",  
            precision: 0  
         }  
    },
    {
        dataField: "packingPrice",
        caption: "هزینه آماده سازی",
        allowEditing: false,
        format: {  
            type: "fixedPoint",  
            precision: 0  
         } 
    },
    {
        dataField: "discount",
        caption: "تخفیف",
        allowEditing: false,
        format: {  
            type: "fixedPoint",  
            precision: 0  
         } 
    },
    {
        dataField: "itemName",
        caption: "کالا",
        allowEditing: false,
    },
    {
        dataField: "locationName",
        caption: "فروشگاه",
        allowEditing: false,
    },
    {
        dataField: "fullName",
        caption: "مشتری",
        allowEditing: false
    },
    {
        dataField: "orderDate",
        caption: "تاریخ",
        allowEditing: false
    },
    {
        dataField: "time",
        caption: "ساعت",
        allowEditing: false
    },
];