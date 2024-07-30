import { Table, Col, Container } from "react-bootstrap";
import Button from "../Buttons/Button";
import React, { useCallback, useEffect, useState } from "react";
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
  name,
  error,
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

  const handleLoadMoreItems = useCallback(() => {
    // setCurrentPage((prev) => prev + 1);
  }, []);

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
          <Button type="default" onClick={handleSubmit} label="افزودن" />,
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
      <span className="flex-order-column">
        {error &&
          error.map((err, index) => (
            <span
              key={`${name}-errors-${index}`}
              className="text-danger font12"
            >
              {err}
            </span>
          ))}
      </span>
    </Col>
  );
};

export default TableMultiSelect2;

// const TableMultiSelect2 = ({
//   label,
//   xs = 12,
//   md = 3,
//   xl = 3,
//   xxl = 4,
//   allListRF = [],
//   className,
//   submit,
// }) => {
//   const [showTable, setShowTable] = useState(false);
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [filteredItems, setFilteredItems] = useState([]);
//   const [titleFilter, setTitleFilter] = useState('');
//   const [codeFilter, setCodeFilter] = useState('');
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);

//   useEffect(() => {
//     setFilteredItems(
//       allListRF.filter(item =>
//         item.locationName.includes(titleFilter) && item.id.toString().includes(codeFilter)
//       )
//     );
//   }, [titleFilter, codeFilter, allListRF]);

//   const handleSubmit = () => {
//     setShowTable(false);
//     submit(selectedItems);
//   };

//   const handleCancel = () => {
//     setShowTable(false);
//   };

//   const handleSelected = (id) => {
//     setSelectedItems((prevSelectedItems) =>
//       prevSelectedItems.includes(id)
//         ? prevSelectedItems.filter((itemId) => itemId !== id)
//         : [...prevSelectedItems, id]
//     );
//   };

//   const handleSelectedAll = () => {
//     const visibleItems = filteredItems.slice(0, currentPage * itemsPerPage);
//     setSelectedItems((prevSelectedItems) =>
//       prevSelectedItems.length === visibleItems.length
//         ? []
//         : visibleItems.map((item) => item.id)
//     );
//   };

//   const loadMoreItems = useCallback(() => {
//     setCurrentPage((prevPage) => prevPage + 1);
//   }, []);

//   const handleScroll = useCallback(
//     (e) => {
//       if (
//         e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight
//       ) {
//         loadMoreItems();
//       }
//     },
//     [loadMoreItems]
//   );

//   useEffect(() => {
//     if (showTable) {
//       const tableBody = document.querySelector('.modal-body');
//       tableBody.addEventListener('scroll', handleScroll);
//       return () => tableBody.removeEventListener('scroll', handleScroll);
//     }
//   }, [showTable, handleScroll]);

//   return (
//     <Col className={className} xxl={xxl} xs={xs} md={md} xl={xl}>
//       <Label> {label} </Label>
//       <div
//         onClick={() => setShowTable(true)}
//         className="d-flex justify-content-between py-1 bg-white-multi cursorPointer px-2 border rounded-2"
//       >
//         <span className="font15 mt-1"></span>
//         <span>
//           <MenuIcon className="text-secondary" />
//         </span>
//       </div>
//       <Modal
//         label={label}
//         classHeader="bg-white"
//         isOpen={showTable}
//         footerButtons={[
//           <Button
//             text="Outlined"
//             stylingMode="outlined"
//             type="danger"
//             onClick={handleCancel}
//             label="لغو"
//           />,
//           <Button onClick={handleSubmit} label="افزودن" />,
//         ]}
//       >
//         <Container className="">
//           <Col xl="12">
//             <div className="d-flex justify-content-between my-2">
//               <Input
//                 type="text"
//                 placeholder="فیلتر بر اساس عنوان"
//                 value={titleFilter}
//                 onChange={(e) => setTitleFilter(e.target.value)}
//               />
//               <Input
//                 type="text"
//                 placeholder="فیلتر بر اساس کد"
//                 value={codeFilter}
//                 onChange={(e) => setCodeFilter(e.target.value)}
//               />
//             </div>
//             <Table
//               responsive
//               striped
//               bordered
//               hover
//               size="sm"
//               className="mt-4 bg-danger"
//             >
//               <thead className="">
//                 <tr>
//                   <th className="minWidth50 headColorTable minWidth100 select text-center text-white fw-normal">
//                     کد
//                   </th>
//                   <th className="minWidth150 headColorTable minWidth100 select text-center text-white fw-normal width15">
//                     عنوان
//                   </th>
//                   <th className="minWidth150 headColorTable minWidth100 select my-2 text-center text-white fw-normal">
//                     <div className="my-1">
//                       <input
//                         type="checkbox"
//                         checked={selectedItems.length === filteredItems.slice(0, currentPage * itemsPerPage).length}
//                         onChange={handleSelectedAll}
//                       />
//                     </div>
//                   </th>
//                 </tr>
//               </thead>
//               <tbody
//                 style={{ verticalAlign: "center" }}
//                 className="text-center"
//               >
//                 {filteredItems?.slice(0, currentPage * itemsPerPage).map((item, index) => (
//                   <tr key={item.id}>
//                     <td className="fitTable">{index + 1}</td>
//                     <td className="fitTable">
//                       <div className="">{item?.locationName}</div>
//                     </td>
//                     <td className="fitTable">
//                       <div className="my-1">
//                         <input
//                           type="checkbox"
//                           checked={selectedItems.includes(item.id)}
//                           onChange={() => handleSelected(item.id)}
//                         />
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//                 {filteredItems?.length === 0 && (
//                   <tr>
//                     <td className="fitTable" colSpan={9}>
//                       <div className="">
//                         <span className="text-secondary p-2">
//                           کالایی برای نمایش وجود ندارد
//                           <i className="font20 textPrimary me-2 bi bi-exclamation-triangle-fill" />
//                         </span>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </Table>
//           </Col>
//         </Container>
//       </Modal>
//     </Col>
//   );
// };

// export default TableMultiSelect2;
