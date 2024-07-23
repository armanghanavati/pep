import { Table, Col, Container } from "react-bootstrap";
import Button from "../Buttons/Button";
import React, { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import "../../../assets/CSS/table_multi_select.css";
import Modal from "../../common/Modals/Modal";
import { Label } from "reactstrap";
import SwitchCase from "../SwitchCases/SwitchCase";

const TableMultiSelect2 = ({
  label,
  xs = 12,
  md = 3,
  xl = 3,
  xxl = 4,
  allListRF = [],
  className,
  submit,
  selectStore,
  setSelectStore,
}) => {
  const [showTable, setShowTable] = useState(false);
  //   const [selectStore, setSelectStore] = useState([]);

  const handleSubmit = () => {
    setShowTable(false);
    submit();
  };

  const handleCancel = () => {
    setShowTable(false);
  };

  const handleSelected = (id) => {
    setSelectStore((prevSelectStore) =>
      prevSelectStore.includes(id)
        ? prevSelectStore.filter((itemId) => itemId !== id)
        : [...prevSelectStore, id]
    );
  };

  const handleSelectedAll = () => {
    setSelectStore((prevSelectStore) =>
      prevSelectStore.length === allListRF.length
        ? []
        : allListRF.map((item) => item.id)
    );
  };

  console.log(selectStore);

  return (
    <Col className={className} xxl={xxl} xs={xs} md={md} xl={xl}>
      <Label> {label} </Label>
      <div
        onClick={() => setShowTable(true)}
        className="d-flex justify-content-between py-1 bg-white-multi cursorPointer px-2 border rounded-2"
      >
        <span className="font15 mt-1"></span>
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
          <Button onClick={handleSubmit} label="افزودن" />,
        ]}
      >
        <Container className="">
          <Col xl="12">
            <Table
              responsive
              striped
              bordered
              hover
              size="sm"
              className="mt-4 bg-danger"
            >
              <thead className="">
                <tr>
                  <th className="width10 headColorTable select text-center text-white fw-normal">
                    کد
                  </th>
                  <th className="minWidth150 headColorTable select text-center text-white fw-normal width15">
                    عنوان
                  </th>
                  <th className="width10 headColorTable select my-2 text-center text-white fw-normal">
                    <div className="my-1">
                      <SwitchCase
                        type="checkbox"
                        checked={selectStore.length === allListRF.length}
                        onChange={handleSelectedAll}
                      />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody
                style={{ verticalAlign: "center" }}
                className="text-center"
              >
                {allListRF?.length !== 0 ? (
                  allListRF.map((item, index) => {
                    return (
                      <tr key={item.id}>
                        <td className="fitTable">{index + 1}</td>
                        <td className="fitTable">
                          <div className="">{item?.locationName}</div>
                        </td>
                        <td className="fitTable">
                          <div className="my-1">
                            <SwitchCase
                              type="checkbox"
                              checked={selectStore.includes(item.id)}
                              onChange={() => handleSelected(item.id)}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td className="fitTable" colSpan={9}>
                      <div className="">
                        <span className="text-secondary p-2">
                          کالایی برای نمایش وجود ندارد
                          <i className="font20 textPrimary me-2 bi bi-exclamation-triangle-fill" />
                        </span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Col>
        </Container>
      </Modal>
    </Col>
  );
};

export default TableMultiSelect2;
