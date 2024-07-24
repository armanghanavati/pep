import { Table, Col, Container } from "react-bootstrap";
import Button from "../Buttons/Button";
import React, { useEffect, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import "../../../assets/CSS/table_multi_select.css";
import Modal from "../../common/Modals/Modal";
import { Label } from "reactstrap";
import SwitchCase from "../SwitchCases/SwitchCase";
import Input from "../Inputs/Input";
import { TextBox } from "devextreme-react";

const TableMultiSelect2 = ({
  label,
  xs = 12,
  md = 3,
  xl = 3,
  xxl = 4,
  allListRF,
  className,
  submit,
  itemName,
  selected,
  setSelected,
}) => {
  const [showTable, setShowTable] = useState(false);
  const [filterTable, setFilterTable] = useState(allListRF);
  const [number, setNumber] = useState(null);
  const [titleFilter, setTitleFilter] = useState("");
  //   const [selected, setSelected] = useState([]);

  useEffect(() => {
    setFilterTable(allListRF);
  }, [allListRF]);

  useEffect(() => {
    if (titleFilter?.length !== 0) {
      setFilterTable(
        allListRF.filter((item) => item[itemName].includes(titleFilter))
      );
    } else {
      setFilterTable(allListRF);
    }
  }, [titleFilter]);

  const handleSubmit = () => {
    setShowTable(false);
    submit();
  };

  const handleCancel = () => {
    setShowTable(false);
  };

  const handleSelected = (id) => {
    setSelected((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((itemId) => itemId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectedAll = () => {
    setSelected((prevSelected) =>
      prevSelected?.length === filterTable?.length
        ? []
        : filterTable?.map((item) => item?.id)
    );
  };

  const handleTitleFilter = (e) => {
    setTitleFilter(e.event.target.value);
  };

  return (
    <Col className={className} xxl={xxl} xs={xs} md={md} xl={xl}>
      <Label> {label} </Label>
      <div
        onClick={() => setShowTable(true)}
        className="d-flex justify-content-between py-1 bg-white-multi cursorPointer px-2 border rounded-2"
      >
        <span className="font15 mt-1">
          {selected?.length !== 0 && selected?.length !== undefined
            ? `${selected?.length} ${label} انتخاب شد`
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
          <Button onClick={handleSubmit} label="افزودن" />,
        ]}
      >
        <Container className="">
          <Col xl="12">
            <Table responsive striped bordered hover size="sm">
              <thead className="">
                <tr>
                  <th className="width2 headColorTable vertical-align-center select text-center text-white fw-normal">
                    <SwitchCase
                      type="checkbox"
                      checked={selected?.length === filterTable?.length}
                      onChange={handleSelectedAll}
                    />
                  </th>
                  <th className=" width2 headColorTable vertical-align-center select text-center text-white fw-normal">
                    ردیف
                    {/* <Input className="mt-0 w-100" /> */}
                  </th>
                  <th className="minWidth150  headColorTable vertical-align-center select text-center text-white fw-normal width15">
                    <span className="">عنوان</span>
                    <div>
                      <TextBox
                        className="my-2"
                        onInput={(e) => handleTitleFilter(e)}
                        rtlEnabled
                        value={titleFilter}
                      />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className=" text-center">
                {filterTable?.map((item, index) => {
                  return (
                    <tr key={item.id}>
                      <td className="vertical-align-center fitTable">
                        <div className="my-1">
                          <SwitchCase
                            type="checkbox"
                            checked={selected?.includes(item.id)}
                            onChange={() => handleSelected(item.id)}
                          />
                        </div>
                      </td>
                      <td className=" vertical-align-center fitTable">
                        {index + 1}
                      </td>
                      <td className="vertical-align-center fitTable">
                        <div className="">{item[itemName]}</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Col>
        </Container>
      </Modal>
    </Col>
  );
};

export default TableMultiSelect2;
