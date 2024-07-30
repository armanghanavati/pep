import React, { useCallback, useEffect, useRef, useState } from "react";
import BlurOnIcon from "@mui/icons-material/BlurOn";
import MenuIcon from "@mui/icons-material/Menu";
import themes from "devextreme/ui/themes";
import "../../../assets/CSS/table_multi_select.css";
import { Col, Label } from "reactstrap";
import DataGrid, {
  Column,
  Paging,
  Scrolling,
  FilterRow,
  Pager,
  Selection,
  Editing,
  HeaderFilter,
} from "devextreme-react/data-grid";
import Modal from "../../common/Modals/Modal";
import Button from "../Buttons/Button";
import { useSelector } from "react-redux";

const TableMultiSelect = ({
  xs = 12,
  md = 3,
  xl = 3,
  xxl = 4,
  label,
  onRowClick,
  headerFilter,
  filterRow,
  columns = [],
  allListRF = [],
  defaultPageSize = 10,
  className,
  deleteRow,
  // selectedRowKeys,
  // onSelectionChanged,
  selection,
  handleAcceptAll,
  onRowUpdating,
  // setSelectedRowKeys = () => {},
  submit,
  selected,
  handleCancelRow,
}) => {
  const [showTable, setShowTable] = useState(false);
  const { promotion } = useSelector((state) => state);

  const fixPlaceHolder = allListRF?.filter((item) => item?.isChecked);

  const handleSubmit = () => {
    setShowTable(false);
    // setSelectedRowKeys([]);
    submit();
  };

  const handleCancel = () => {
    // setSelectedRowKeys([]);
    setShowTable(false);
  };

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // تابع برای مدیریت تغییرات انتخاب
  const onSelectionChanged = (e) => {
    if (e.currentSelectedRowKeys.length) {
      console.log("1");
      // افزودن کلیدهای انتخاب‌شده جدید به حالت فعلی
      setSelectedRowKeys((prevSelectedRowKeys) => [
        ...prevSelectedRowKeys,
        ...e.currentSelectedRowKeys,
      ]);
    } else {
      console.log("2");
      // حذف کلیدهای لغو انتخاب‌شده از حالت فعلی
      setSelectedRowKeys((prevSelectedRowKeys) =>
        prevSelectedRowKeys.filter(
          (key) => !e.currentDeselectedRowKeys.includes(key)
        )
      );
    }
  };

  console.log(selectedRowKeys);

  return (
    <Col className={className} xxl={xxl} xs={xs} md={md} xl={xl}>
      <Label> {label} </Label>
      <div
        onClick={() => setShowTable(true)}
        className="d-flex justify-content-between py-1 bg-white-multi  cursorPointer px-2 border rounded-2"
      >
        <span className="font15 mt-1">
          {selected !== 0 && selected !== undefined
            ? `${selected} ${label} انتخاب شد`
            : ""}
        </span>
        <span>
          <MenuIcon className="text-secondary" />
        </span>
      </div>
      <Modal
        label={label}
        classHeader="bg-white"
        isOpen={showTable}
        footerButtons={[
          <Button
            text="Outlined"
            stylingMode="outlined"
            type="danger"
            onClick={handleCancel}
            label="لغو"
          />,
          <Button type="default" onClick={handleSubmit} label="افزودن" />,
        ]}
      >
        <Col className="mt-4">
          <DataGrid
            // valueExpr="id"
            keyExpr="id"
            onSelectionChanged={onSelectionChanged}
            columnResizingMode="widget"
            selectedRowKeys={selectedRowKeys}
            columnAutoWidth={true}
            allowColumnReordering={true}
            onRowClick={onRowClick}
            dataSource={allListRF}
            // defaultColumns={columns}
            showBorders
            rtlEnabled
            allowColumnResizing
            className="fontStyle"
            height={500}
            onRowUpdating={onRowUpdating}
          >
            <Paging defaultPageSize={10000000} />
            <Scrolling
              rowRenderingMode="virtual"
              showScrollbar="always"
              columnRenderingMode="virtual"
            />
            {selection && (
              <Selection
                showCheckBoxesMode="always"
                selectAllMode="allPages"
                mode="multiple"
              />
            )}
            <Editing mode="cell" allowUpdating allowDeleting={deleteRow} />
            <HeaderFilter visible={headerFilter} />
            <FilterRow visible={filterRow} />
            {columns.map((col, index) => (
              <Column key={index} {...col} />
            ))}
          </DataGrid>
        </Col>
      </Modal>
    </Col>
  );
};

export default TableMultiSelect;
