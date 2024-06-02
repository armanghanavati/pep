export const DataGridSnpOrderColumns = [
    {
        dataField: "id",
        caption: "شماره درخواست",
        allowEditing: false
    },
    {
        dataField: "location",
        caption: "فروشگاه",
        allowEditing: false,
    },
    {
        dataField: "code",
        caption: "کد درخواست",
        allowEditing: false
    },
    {
        dataField: "statusDesc",
        caption: "وضعیت",
        allowEditing: false
    },
    {
        dataField: "price",
        caption: "قیمت",
        allowEditing: false,        
        format: {  
            type: "fixedPoint",  
            precision: 0  
         }         
    },
    {
        dataField: "date",
        caption: "تاریخ",
        allowEditing: false
    },
    {
        dataField: "time",
        caption: "ساعت",
        allowEditing: false
    },
    {
        dataField: "fullName",
        caption: "مشتری",
        allowEditing: false,
    },
    {
        dataField: "phone",
        caption: "شماره همراه",
        allowEditing: false,
    },
    {
        dataField: "deliverAddress",
        caption: "آدرس تحویل",
        allowEditing: false,
    },    
];




export const DataGridSnpOrderDetailsColumns = [
    {
        dataField: "snpOrderId",
        caption: "شماره درخواست",
        allowEditing: false
    },
    {
        dataField: "itemName",
        caption: "نام کالا",
        allowEditing: false,
    },
    {
        dataField: "extItemId",
        caption: "کد کالا",
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
        allowEditing: false
    },
    {
        dataField: "discount",
        caption: "جمع تخفیف",
        allowEditing: false,        
        format: {  
            type: "fixedPoint",  
            precision: 0,
         }         
    },
    {
        dataField: "price",
        caption: "قیمت",
        allowEditing: false,
        format: {  
            type: "fixedPoint",  
            precision: 0  
         } 
    },
    {
        dataField: "vat",
        caption: "مالیات",
        allowEditing: false
    },
       
];