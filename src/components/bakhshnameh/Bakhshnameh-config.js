export const DataGridBakhshnamehColumns = [
    {
      dataField: "id",
      caption: "شماره سند",
      allowEditing: false,
    },
    {
      dataField: "title",
      caption: "عنوان سند",
      allowEditing: false,
    },
    {
      dataField: "persianDate",
      caption: "تاریخ",
      allowEditing: false,
    },
    {
      dataField: "statusBakhshnameh",
      caption: "وضعیت ثبت",
      allowEditing: false,
    },
    {
      dataField: "statusRead",
      caption: "وضعیت",
      allowEditing: false,
    }
  ];

  export const tabs = [
    { name: 'From This Device', value: ['file'] },
    { name: 'From the Web', value: ['url'] },
    { name: 'Both', value: ['file', 'url'] },
  ];
  