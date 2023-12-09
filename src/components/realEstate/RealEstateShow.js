import React, { Suspense } from "react";
import { connect } from "react-redux";
import DataSource from "devextreme/data/data_source";
import {
  Row,
  Col,
  Card,
  Label,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import classnames from "classnames";
import TextBox from "devextreme-react/text-box";
import TextArea from "devextreme-react/text-area";
import SelectBox from "devextreme-react/select-box";
import TagBox from "devextreme-react/tag-box";
import { Button } from "devextreme-react/button";
import { CheckBox } from "devextreme-react/check-box";
import notify from "devextreme/ui/notify";
import { Toast } from "devextreme-react/toast";
import { Tooltip } from "devextreme-react/tooltip";
import DataGrid, {
  Column,
  Editing,
  Paging,
  Lookup,
  Scrolling,
  FilterRow,
  HeaderFilter,
  FilterPanel,
  FilterBuilderPopup,
  Pager,
  Selection,
  Grouping,
  GroupPanel,
  SearchPanel,
  Export,
} from "devextreme-react/data-grid";
import Wait from "../common/Wait";

import {
  Gfn_NumberDetect,
  Gfn_convertENunicode,
} from "../../utiliy/GlobalMethods";

import { addrsRealEstate } from "../../redux/reducers/rsRealEstate/rsRealEstate-actions";

import {
  DataGridPageSizes,
  DataGridDefaultPageSize,
  DataGridDefaultHeight,
  ToastTime,
  ToastWidth,
  ALL_MOD,
  CHECK_BOXES_MOD,
  FILTER_BUILDER_POPUP_POSITION,
} from "../../config/config";
import PlusNewIcon from "../../assets/images/icon/plus.png";
import SaveIcon from "../../assets/images/icon/save.png";
import UpdateIcon from "../../assets/images/icon/update.png";
import DeleteIcon from "../../assets/images/icon/delete.png";
import CancelIcon from "../../assets/images/icon/cancel.png";
import MinusImage from "../../assets/images/icon/minus.png";
import { masterDataRealEstateList } from "../../redux/reducers/rsMasterDataRealEstate/rsMasterDataRealEstate-action";
import { cityList } from "../../redux/reducers/city/city-actions";
import { stateList } from "../../redux/reducers/state/state-actions";

class RealEstateShow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stateUpdateDelete: true,
      stateDisable_btnAdd: false,
      stateDisable_btnUpdate: false,
      stateDisable_show: false,
      stateDisable_btnDelete: false,
      stateWait: false,
      ToastProps: {
        isToastVisible: false,
        Message: "",
        Type: "",
      },
    };
  }

  onHidingToast = () => {
    this.setState({ ToastProps: { isToastVisible: false } });
  };

  render() {
    return (
      <div className="standardMargin" style={{ direction: "rtl" }}>
        <Toast
          visible={this.state.ToastProps.isToastVisible}
          message={this.state.ToastProps.Message}
          type={this.state.ToastProps.Type}
          onHiding={this.onHidingToast}
          displayTime={ToastTime}
          width={ToastWidth}
          rtlEnabled={true}
        />
        {this.state.stateWait && (
          <Row className="text-center">
            <Col style={{ textAlign: "center", marginTop: "10px" }}>
              <Wait />
            </Col>
          </Row>
        )}        
        <Card className="shadow bg-white border pointer">          
            <Row className="standardPadding">
              <DataGrid
                dataSource={this.state.grdTickets}
                // defaultColumns={DataGridTicketcolumns}
                showBorders={true}
                rtlEnabled={true}
                allowColumnResizing={true}
                onRowClick={this.grdTicket_onClick}
                height={DataGridDefaultHeight}
              >
                <Scrolling
                  rowRenderingMode="virtual"
                  showScrollbar="always"
                  columnRenderingMode="virtual"
                />
                <Editing mode="cell" allowUpdating={true} />
                <Paging defaultPageSize={DataGridDefaultPageSize} />
                <Pager
                  visible={true}
                  allowedPageSizes={DataGridPageSizes}
                  showPageSizeSelector={true}
                  showNavigationButtons={true}
                />
                <FilterRow visible={true} />
                <FilterPanel visible={true} />
                <HeaderFilter visible={true} />
              </DataGrid>
            </Row>          
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  User: state.users,
  Company: state.companies,
});

export default connect(mapStateToProps)(RealEstateShow);
