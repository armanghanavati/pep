import React from "react";
import { connect } from "react-redux";
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
import DataSource from "devextreme/data/data_source";
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
  ColumnFixing,
  Grouping,
  GroupPanel,
  SearchPanel,
} from "devextreme-react/data-grid";

import Wait from "../common/Wait";
import OrderSupplierNew from "./OrderSupplierNew";
import OrderSupplierNewGroup from "./OrderSupplierNewGroup";

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

import { itemActions } from "../../redux/reducers/item/item-slice";
import { logsOrderPointSupplierActions } from "../../redux/reducers/logsOrderPointSupplier/logsOrderPointSupplier-slice";
import { locationActions } from "../../redux/reducers/location/location-slice";
import { companyActions } from "../../redux/reducers/company/company-slice";
import { companyListCombo } from "../../redux/reducers/company/company-actions";
import { supplierListByExtIds } from "../../redux/reducers/supplier/supplier-action";
import { calcSumWeightPriceOrderPointSupplier } from "../../redux/reducers/orderPointSupplier/orderPointSupplier-actions";

import {
  itemListCombo,
  itemListComboBySupplierId,
} from "../../redux/reducers/item/item-action";
import {
  supplierOrderInventoryComboList,
  supplierOrderSupplierComboList,
} from "../../redux/reducers/supplier/supplier-action";
import { locationOrderSupplierComboListByCompanyId } from "../../redux/reducers/location/location-actions";
import OrderSupplierLogs from './OrderSupplierLogs';

import {
  orderPointSupplierListByLSI,
  updateGroupsOrderPointSupplier,
} from "../../redux/reducers/orderPointSupplier/orderPointSupplier-actions";

import {
  logsOPSTodayListByUserId,
  logsOPSByOPSid,
} from "../../redux/reducers/logsOrderPointSupplier/logsOrderPointSupplier-actions";

import {
  Gfn_BuildValueComboMulti,
  Gfn_BuildValueComboSelectAll,
  Gfn_ExportToExcel,
  Gfn_ConvertComboForAll,
  Gfn_num3Seperator,
} from "../../utiliy/GlobalMethods";
import { Template } from "devextreme-react";

import {
  DataGridOrderPointSupplierColumns,
  DataGridOrderPointSumOrdersColumns,
} from "./OrderSupplier-config";

import SearchIcon from "../../assets/images/icon/search.png";
import PlusNewIcon from "../../assets/images/icon/plus.png";
import UpdateIcon from "../../assets/images/icon/update.png";
import ExportExcelIcon from "../../assets/images/icon/export_excel.png";
import { Border } from "devextreme-react/bar-gauge";

class OrderSupplier extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stateWait: false,
      cmbLocationGroupValue: null,
      cmbLocation: null,
      cmbLocationValue: null,
      cmbSupplier: null,
      cmbSupplierValue: null,
      cmbItems: null,
      cmbItemsValue: null,
      SupplierListMaxMinParam: null,
      OrderSupplierGridData: null,
      SupplierListSumMaxMinGridData: [],
      OrderPointSupplierEdited: [],
      stateShowRoute: false,
      stateUpdateDelete: true,
      stateEnable_btnAdd: false,
      stateEnable_btnAddGroup: false,
      stateEnable_btnUpdate: false,
      stateEnable_show: false,
      stateModal_OrderSupplierNew: false,
      stateModal_OrderSupplierNewGroup: false,
      stateModal_DetailOfPriceWeighNumber:false,
      DetailOfPriceWeighNumber:null,
      stateModal_LogsOfOPS: false,
      ToastProps: {
        isToastVisible: false,
        Message: "",
        Type: "",
      },
    };
  }

  async componentDidMount() {
    await this.fn_GetPermissions();
    await this.fn_CheckRequireState();
  }

  fn_GetPermissions = () => {
    const perm = this.props.User.permissions;
    if (perm != null)
      for (let i = 0; i < perm.length; i++) {
        switch (perm[i].objectName) {
          case "orders_supplier.update":
            this.setState({ stateEnable_btnUpdate: true });
            break;
          case "orders_supplier.insert":
            this.setState({ stateEnable_btnAdd: true });
            break;
          case "orders_supplier.insert_group":
            this.setState({ stateEnable_btnAddGroup: true });
            break;
          case "orders_supplier.show":
            this.setState({ stateEnable_show: true });
            break;
        }
      }
  };

  OpenCloseWait() {
    this.setState({ stateWait: !this.state.stateWait });
  }

  fn_CheckRequireState = async () => {
    if (this.props.Company.currentCompanyId == null) {
      const companyCombo = await companyListCombo(this.props.User.token);
      if (companyCombo !== null) {
        const currentCompanyId = companyCombo[0].id;
        this.props.dispatch(
          companyActions.setCurrentCompanyId({
            currentCompanyId,
          })
        );
      }
      this.props.dispatch(
        companyActions.setCompanyCombo({
          companyCombo,
        })
      );
    }

    const locationPermission = await locationOrderSupplierComboListByCompanyId(
      this.props.Company.currentCompanyId,
      this.props.User.token
    );

    this.props.dispatch(
      locationActions.setLocationPermission({
        locationPermission,
      })
    );

    this.setState({
      cmbSupplier: await supplierOrderSupplierComboList(
        this.props.Company.currentCompanyId,
        this.props.User.token
      ),
    });
  };

  cmbRetailStoreGroup_onChange = async (e) => {
    const IDS = e.toString().split(",");
    const TEMP_LocationGroup = this.props.Location.locationPermission;
    if (IDS.includes("0"))
      this.setState({
        cmbLocation: TEMP_LocationGroup,
        cmbLocationGroupValue: 0,
      });
    else {
      let tempLocation = [];
      for (let i = 0; i < IDS.length; i++)
        for (let j = 0; j < TEMP_LocationGroup.length; j++)
          if (IDS[i] == TEMP_LocationGroup[j].id)
            tempLocation.push(TEMP_LocationGroup[j]);
      this.setState({
        cmbLocation: tempLocation,
        cmbLocationGroupValue: await Gfn_BuildValueComboMulti(e),
      });
    }
  };

  cmbRetailStore_onChange = async (e) => {
    let data = await Gfn_ConvertComboForAll(e, this.state.cmbLocation);
    // alert(JSON.stringify(data))
    this.setState({ cmbLocationValue: await Gfn_BuildValueComboMulti(data) });
  };

  cmbSupplier_onChange = async (e) => {
    let data = await Gfn_ConvertComboForAll(e, this.state.cmbSupplier);
    const TEMP_cmbSupplier = await Gfn_BuildValueComboMulti(data);

    this.setState({
      cmbSupplierValue: TEMP_cmbSupplier,
      // cmbItems: TEMP_cmbSupplier == null? null: await itemListComboBySupplierId(TEMP_cmbSupplier,this.props.User.token),
    });
    const ITEMS =
      TEMP_cmbSupplier == null
        ? null
        : await itemListComboBySupplierId(
            TEMP_cmbSupplier,
            this.props.User.token
          );
    const LAZY = new DataSource({
      store: ITEMS,
      paginate: true,
      pageSize: 10,
    });
    this.setState({
      cmbItems: LAZY,
      cmbItemsOrg: ITEMS,
    });
  };

  btnExportExcel_onClick = () => {
    Gfn_ExportToExcel(this.state.OrderSupplierGridData, "OrderSupplier");
  };

  cmbItem_onChange = async (e) => {
    // this.setState({ cmbItemsValue: await Gfn_BuildValueComboMulti(e) });
    let data = await Gfn_ConvertComboForAll(e, this.state.cmbItemsOrg);
    this.setState({ cmbItemsValue: await Gfn_BuildValueComboMulti(data) });
  };

  btnSearch_onClick = async () => {
    this.OpenCloseWait();

    const OBJ = {
      locationIds: this.state.cmbLocationValue,
      supplierIds: this.state.cmbSupplierValue,
      itemIds: this.state.cmbItemsValue,
    };
    // console.log(JSON.stringify(OBJ))
    let ORDER_SUPPLIER = await orderPointSupplierListByLSI(
      OBJ,
      this.props.User.token
    );

    ORDER_SUPPLIER = ORDER_SUPPLIER == null ? [] : ORDER_SUPPLIER;
    let tempSupplierId = [];
    for (let i = 0; i < ORDER_SUPPLIER.length; i++) {
      let flag = true;
      for (let j = 0; j < tempSupplierId.length; j++)
        if (ORDER_SUPPLIER[i].supplierId == tempSupplierId[j].Id) flag = false;
      if (flag) {
        const SUP_OBJ = {
          extSupplierId: ORDER_SUPPLIER[i].supplierId,
        };
        tempSupplierId.push(SUP_OBJ);
      }
    }

    this.setState({
      OrderSupplierGridData: ORDER_SUPPLIER,
      SupplierListSumMaxMinGridData:[],
      SupplierListMaxMinParam: await supplierListByExtIds(
        tempSupplierId,
        this.props.User.token
      ),
    });

    this.fn_SetLogsOrderPointSupplier();

    this.OpenCloseWait();
  };

  fn_SetLogsOrderPointSupplier = async () => {
    const AllLogsOrderPointSupplier = await logsOPSTodayListByUserId(
      this.props.User.userId,
      this.props.User.token
    );
    this.props.dispatch(
      logsOrderPointSupplierActions.setLogsOrderPointSupplier({
        AllLogsOrderPointSupplier,
      })
    );
  };

  grdOrderPointSupplier_onRowPrepared = (e) => {
    if (e.rowType === "data" && e.data.orderUser !== null)
      e.rowElement.style.backgroundColor = "#60c77f";
  };
  
  grdOrderPointSupplier_onRowUpdating = async (params) => {
    let FirstVal = 1;
    console.log("Old Data=" + JSON.stringify(params.oldData));
    console.log("New Data=" + JSON.stringify(params.newData));
    let tempOrderPointSupplierEdited = this.state.OrderPointSupplierEdited;

    let Logs = this.props.LogsOrderPointSupplier.AllLogsOrderPointSupplier;

    let flagEditRowCount = false;
    if (Logs == null) Logs = [];
    for (let i = 0; i < Logs.length; i++)
      if (Logs[i].orderPointSupplierId == params.oldData.id) {
        flagEditRowCount = true;
        // alert('edit row cont permited')
      }

    let flagPush = true;
    for (let i = 0; i < tempOrderPointSupplierEdited.length; i++)
      if (
        tempOrderPointSupplierEdited[i].OrderPointSupplierId ===
        params.oldData.id
      ) {
        tempOrderPointSupplierEdited[i].OrderValue =
          params.newData.orderUser === undefined
            ? params.oldData.orderUser
            : params.newData.orderUser;
        tempOrderPointSupplierEdited[i].Description =
          params.newData.description === undefined
            ? params.oldData.description
            : params.newData.description;
        flagPush = false;
        break;
      }
    // alert('edited='+tempOrderPointSupplierEdited.length+
    //         '\nMaxEdit='+AuthOBJ.orderSupplierEditRowCount+
    //         '\nRelaLogs='+(this.state.RealLogs).length)

    let FlagError = true;
    let errMsg = "";
    // ------------------------------------------------
    // let tempLocations = this.state.Locations;
    // let tempRemainMaxOrder = 0;
    // for (let i = 0; i < tempLocations.length; i++)
    //   if (tempLocations[i].kyLocationId == params.oldData.retailStoreId)
    //     tempRemainMaxOrder = tempLocations[i].editOrder;

    // if (tempOrderPointSupplierEdited.length >= tempRemainMaxOrder) {
    //   FlagError = false;
    //   errMsg += "کاربر گرامی ظرفیت سفارش گذاری فروشگاه تکمیل شده است";
    // }
    // ------------------------------------------------
    if (
      params.newData.orderUser > 0 &&
      params.oldData.itemsPerPack > 0 &&
      // params.newData.orderUser % params.oldData.itemsPerPack !== 0 &&
      params.newData.orderUser %
        (params.oldData.itemsPerPack2 == 0
          ? params.oldData.itemsPerPack
          : params.oldData.itemsPerPack2) !==
        0
    ) {
      FlagError = false;
      flagEditRowCount = false;
      errMsg += "\nکاربر گرامی عدد سفارش باید مضربی از تعداد در بسته باشد.";
    }
    if (params.newData.orderUser < 0) {
      FlagError = false;
      flagEditRowCount = false;
      errMsg += "\n کاربر گرامی عدد سفارش باید بزرگتر یا مساوی با 0 باشد.";
    }
    if (flagPush)
      if (FlagError || flagEditRowCount) {
        // let obj = {
        //   UserId: this.props.User.userId,
        //   OrderPointSupplierId: params.oldData.id,
        //   FirstValue:
        //     params.oldData.orderUser == null
        //       ? params.oldData.orderSystem
        //       : params.oldData.orderUser,
        //   OrderValue: params.newData.orderUser,
        //   Description:
        //     params.oldData.description === null
        //       ? ""
        //       : params.oldData.description,
        //   SupplierId: params.oldData.supplierId,
        //   ProductId: params.oldData.productId,
        //   RetailStoreId: params.oldData.retailStoreId,
        // };
        let obj = {
          CompanyId: this.props.Company.currentCompanyId,
          UserId: this.props.User.userId,
          OrderPointSupplierId: params.oldData.id,
          FirstValue:
            params.oldData.orderUser == null
              ? params.oldData.orderSystem
              : params.oldData.orderUser,
          OrderValue: params.newData.orderUser,
          Description:
            params.oldData.description === null
              ? ""
              : params.oldData.description,
          OrderSystem: params.oldData.orderSystem,
          ProductId: params.oldData.productId,
          RetailStoreId: params.oldData.retailStoreId,
        };
        tempOrderPointSupplierEdited.push(obj);
      } else {
        params.cancel = true;
        alert(errMsg);
      }

    if(FlagError){
      let SupplierSummMaxMin = await this.fn_CalculateSumWeightPrice(
        params.oldData.supplierId,
        params.oldData.supplierName,
        params.oldData.retailStoreId,
        params.oldData.retailStoreName,
        params.oldData.productId,
        params.newData.orderUser
      );
      this.setState({
        SupplierListSumMaxMinGridData: SupplierSummMaxMin,
      });
    }

    console.log(
      "Edited Params=" + JSON.stringify(tempOrderPointSupplierEdited)
    );
    this.setState({
      OrderPointSupplierEdited: tempOrderPointSupplierEdited,
    });
  };

  fn_CalculateSumWeightPrice = async (
      extSupplierId,
      supplierName,
      retailStoreId,
      retailStoreName,
      productId,
      orderUser
    ) => {
      // alert(orderUser)
      const ORDERS=this.state.OrderSupplierGridData;
      let tempSpecificOrders=[]
      let SumWeight=0;
      let SumPrice=0;
      let SumNumber=0;
      for(let i=0;i<ORDERS.length;i++){
        if(ORDERS[i].supplierId==extSupplierId 
            && ORDERS[i].retailStoreId==retailStoreId 
            // && ORDERS[i].productId!=productId
            && (ORDERS[i].orderUser==null ? ORDERS[i].orderSystem : ORDERS[i].orderUser)>0){
              SumWeight=SumWeight+ parseFloat(ORDERS[i].productWeight)*parseInt(ORDERS[i].orderUser==null ? ORDERS[i].orderSystem : ORDERS[i].orderUser);
              SumPrice=SumPrice  + parseFloat(ORDERS[i].lastPriceProduct)*parseInt(ORDERS[i].orderUser==null ? ORDERS[i].orderSystem : ORDERS[i].orderUser);
              SumNumber=SumNumber+ parseInt(ORDERS[i].orderUser==null ? ORDERS[i].orderSystem : ORDERS[i].orderUser)              
        }                  
        if(ORDERS[i].supplierId==extSupplierId 
            && ORDERS[i].retailStoreId==retailStoreId 
            && ORDERS[i].productId==productId){
              SumWeight=SumWeight - parseFloat(ORDERS[i].productWeight)*parseInt(ORDERS[i].orderUser==null ? ORDERS[i].orderSystem : ORDERS[i].orderUser) + parseFloat(ORDERS[i].productWeight)*parseInt(orderUser);
              SumPrice =SumPrice  - parseFloat(ORDERS[i].lastPriceProduct)*parseInt(ORDERS[i].orderUser==null ? ORDERS[i].orderSystem : ORDERS[i].orderUser) + parseFloat(ORDERS[i].lastPriceProduct)*parseInt(orderUser);
              SumNumber=SumNumber - parseInt(ORDERS[i].orderUser==null ? ORDERS[i].orderSystem : ORDERS[i].orderUser) + parseInt(orderUser);              
          }
      }
      // alert(
      //   'weight='+SumWeight+
      //   '\nprice='+SumPrice+
      //   '\nNumber='+SumNumber
      //   )    
      const SUPP_LIST = this.state.SupplierListMaxMinParam;

      let tempSup = this.state.SupplierListSumMaxMinGridData;

      for (let i = 0; i < SUPP_LIST.length; i++)
        if (SUPP_LIST[i].extSupplierId == extSupplierId) {
          // alert('SUPPLIER FINDED='+JSON.stringify(SUPP_LIST[i])+'\n'+JSON.stringify(SUM_MAXMIN));
          if (
            SumPrice  < SUPP_LIST[i].minOrderRiali  ||
            SumPrice  > SUPP_LIST[i].maxOrderRiali  ||
            SumWeight < SUPP_LIST[i].minOrderWeight ||
            SumWeight > SUPP_LIST[i].maxOrderWeight ||
            SumNumber < SUPP_LIST[i].minOrderNumber ||
            SumNumber > SUPP_LIST[i].maxOrderNumber
          ) {
            let flagNew = true;
            let indexSup=0
            for (let j = 0; j < tempSup.length; j++)
              if (tempSup[j].extSupplierId == extSupplierId) {
                flagNew = false;
                indexSup=j;
                break;
              }              
            if (flagNew) {
              const SUPOBJ = {
                id: extSupplierId,
                extSupplierId: extSupplierId,
                retailStoreId: retailStoreId,
                retailStoreName: retailStoreName,
                supplierName: supplierName,
                minWeight: SUPP_LIST[i].minOrderWeight,
                maxWeight: SUPP_LIST[i].maxOrderWeight,
                sumItemsWeight: SumWeight,
                minPrice: SUPP_LIST[i].minOrderRiali,              
                maxPrice: SUPP_LIST[i].maxOrderRiali,              
                sumItemsPrice: SumPrice,
                minNumber: SUPP_LIST[i].minOrderNumber,
                maxNumber: SUPP_LIST[i].maxOrderNumber,
                sumItemsNumber: SumNumber,
              };
              tempSup.push(SUPOBJ);
            } 
            else {
              tempSup[indexSup].sumItemsWeight = SumWeight;
              tempSup[indexSup].sumItemsPrice = SumPrice;
              tempSup[indexSup].sumItemsNumber = SumNumber;
            }
          } 
          else {
            for (let j = 0; j < tempSup.length; j++)
              if (tempSup[j].extSupplierId == extSupplierId) 
                tempSup.splice(j, 1);
          }

          return tempSup;
        }
      return [];      
    }

  // fn_CalculateSumWeightPrice = async (
  //   extSupplierId,
  //   supplierName,
  //   retailStoreId
  // ) => {
  //   const OBJ = {
  //     ExtSupplierId: extSupplierId,
  //     RetailStoreId: retailStoreId,
  //   };
  //   const SUM_MAXMIN = await calcSumWeightPriceOrderPointSupplier(
  //     OBJ,
  //     this.props.User.token
  //   );
  //   const SUPP_LIST = this.state.SupplierListMaxMinParam;

  //   let tempSup = this.state.SupplierListSumMaxMinGridData;

  //   for (let i = 0; i < SUPP_LIST.length; i++)
  //     if (SUPP_LIST[i].extSupplierId == extSupplierId) {
  //       // alert('SUPPLIER FINDED='+JSON.stringify(SUPP_LIST[i])+'\n'+JSON.stringify(SUM_MAXMIN));
  //       if (
  //         SUM_MAXMIN.sumPrice < SUPP_LIST[i].minOrderRiali ||
  //         SUM_MAXMIN.sumPrice > SUPP_LIST[i].maxOrderRiali ||
  //         SUM_MAXMIN.sumWeight < SUPP_LIST[i].minOrderWeight ||
  //         SUM_MAXMIN.sumWeight > SUPP_LIST[i].maxOrderWeight ||
  //         SUM_MAXMIN.sumNumber < SUPP_LIST[i].minOrderNumber ||
  //         SUM_MAXMIN.sumNumber > SUPP_LIST[i].maxOrderNumber
  //       ) {
  //         let flagNew = true;
  //         let indexSup=0
  //         for (let j = 0; j < tempSup.length; j++)
  //           if (tempSup[j].extSupplierId == extSupplierId) {
  //             flagNew = false;
  //             indexSup=j;
  //             break;
  //           }              
  //         if (flagNew) {
  //           const SUPOBJ = {
  //             id: extSupplierId,
  //             extSupplierId: extSupplierId,
  //             supplierName: supplierName,
  //             minWeight: SUPP_LIST[i].minOrderWeight,
  //             maxWeight: SUPP_LIST[i].maxOrderWeight,
  //             sumItemsWeight: SUM_MAXMIN.sumWeight,
  //             minPrice: SUPP_LIST[i].minOrderRiali,              
  //             maxPrice: SUPP_LIST[i].maxOrderRiali,              
  //             sumItemsPrice: SUM_MAXMIN.sumPrice,
  //             minNumber: SUPP_LIST[i].minOrderNumber,
  //             maxNumber: SUPP_LIST[i].maxOrderNumber,
  //             sumItemsNumber: SUM_MAXMIN.sumNumber,
  //           };
  //           tempSup.push(SUPOBJ);
  //         } 
  //         else {
  //           tempSup[indexSup].sumItemsWeight = SUM_MAXMIN.sumWeight;
  //           tempSup[indexSup].sumItemsPrice = SUM_MAXMIN.sumPrice;
  //           tempSup[indexSup].sumItemsNumber = SUM_MAXMIN.sumNumber;
  //         }
  //       } 
  //       else {
  //         for (let j = 0; j < tempSup.length; j++)
  //           if (tempSup[j].extSupplierId == extSupplierId) 
  //             tempSup.splice(j, 1);
  //       }

  //       return tempSup;
  //     }
  //   return null;
  // };

  grdOrderPointSupplier_onCellDblClick = async (e) => {
    const LogsOfOPS = await logsOPSByOPSid(e.data.id, this.props.User.token);
    this.props.dispatch(
      logsOrderPointSupplierActions.setLogsOrderPointSupplierByOPSid({
        LogsOfOPS,
      })
    );
    this.setState({ stateModal_LogsOfOPS: true })
  };

  ModalOrderSupplierLogs_onClickAway = () => {
    this.setState({ stateModal_LogsOfOPS: false });
  };

  btnUpdateOrders_onClick = async () => {
    this.OpenCloseWait();
    // alert(JSON.stringify(this.state.OrderPointSupplierEdited))
    await this.fn_RemoveSuppierForConfirm(this.state.OrderPointSupplierEdited,this.state.SupplierListSumMaxMinGridData)
    // alert(JSON.stringify(this.state.OrderPointSupplierEdited))
    await updateGroupsOrderPointSupplier(
      this.state.OrderPointSupplierEdited,
      this.props.User.token
    );
    this.setState({      
      ToastProps: {
        isToastVisible: true,
        Message: (this.state.OrderPointSupplierEdited.length==0) ? "سفارشی برای ویرایش وجود ندارد" : ",ویرایش با موفقیت انجام گردید.",
        Type: ( this.state.OrderPointSupplierEdited.length==0) ? "info" :"success",
      },
      OrderPointSupplierEdited: ( this.state.OrderPointSupplierEdited.length==0) ? [] : this.state.OrderPointSupplierEdited,
    });
    this.OpenCloseWait();
  };

  fn_RemoveSuppierForConfirm=async(orders,removeList)=>{    
    for(let i=0;i<removeList.length;i++){    
      let j=0;
      while(orders.length>j){
        if(orders[j].RetailStoreId==removeList[i].retailStoreId && orders[j].SupplierId==removeList[i].extSupplierId)
          orders.splice(j, 1);
        else
          j++;
      }
    }
    this.setState({OrderPointSupplierEdited:orders})
  }

  btnNew_onClick = () => {
    this.setState({
      stateModal_OrderSupplierNew: true,
      isOutRoute: false,
    });
  };

  btnNewOutRoute_onClick = () => {
    this.setState({
      stateModal_OrderSupplierNew: true,
      isOutRoute: true,
    });
  };

  ModalOrderInventoryNew_onClickAway = () => {
    this.setState({ stateModal_OrderSupplierNew: false });
  };

  btnNewGroup_onClick = () => {
    this.setState({ stateModal_OrderSupplierNewGroup: true });
  };
  ModalOrderInventoryNewGroup_onClickAway = () => {
    this.setState({ stateModal_OrderSupplierNewGroup: false });
  };

  ModalDetailOfPriceWeighNumber_onClickAway=()=>{
    this.setState({stateModal_DetailOfPriceWeighNumber:false,})
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
            <Row>
              <Label>سفارش از تامین کننده</Label>
            </Row>
            <Row>
              <Col>
                <Label className="standardLabelFont">گروه فروشگاه</Label>
                <TagBox
                  dataSource={this.props.Location.locationPermission}
                  searchEnabled={true}
                  displayExpr="label"
                  placeholder="گروه فروشگاه"
                  valueExpr="id"
                  rtlEnabled={true}
                  onValueChange={this.cmbRetailStoreGroup_onChange}
                  className="fontStyle"                  
                />
              </Col>
              <Col>
                <Label className="standardLabelFont">فروشگاه</Label>
                <TagBox
                  dataSource={this.state.cmbLocation}
                  searchEnabled={true}
                  displayExpr="label"
                  placeholder="فروشگاه"
                  valueExpr="id"
                  rtlEnabled={true}
                  onValueChange={this.cmbRetailStore_onChange}
                  className="fontStyle"
                />
              </Col>
              <Col>
                <Label className="standardLabelFont">تامین کننده</Label>
                <TagBox
                  dataSource={this.state.cmbSupplier}
                  searchEnabled={true}
                  displayExpr="label"
                  placeholder="تامین کننده"
                  valueExpr="id"
                  rtlEnabled={true}
                  onValueChange={this.cmbSupplier_onChange}
                  className="fontStyle"
                />
              </Col>
              <Col>
                <Label className="standardLabelFont">کالا</Label>
                <TagBox
                  dataSource={this.state.cmbItems}
                  searchEnabled={true}
                  displayExpr="label"
                  placeholder="کالا"
                  valueExpr="id"
                  rtlEnabled={true}
                  onValueChange={this.cmbItem_onChange}
                  className="fontStyle"
                />
              </Col>
            </Row>
            {this.state.stateEnable_show && (
              <Row className="standardSpaceTop">
                <Col xs="auto">
                  <Button
                    icon={SearchIcon}
                    text="جستجو"
                    type="default"
                    stylingMode="contained"
                    rtlEnabled={true}
                    onClick={this.btnSearch_onClick}
                    className="fontStyle"
                  />
                </Col>
              </Row>
            )}
          </Row>
        </Card>
        <p></p>

        <Row>
          <Col xs="9">
            <Card className="shadow bg-white border pointer">
              <Row className="standardPadding">
                <Row>
                  <Label className="title">لیست سفارشات از تامین کننده</Label>
                </Row>
                {this.state.stateEnable_btnAdd && (
                  <Row>
                    <Col xs="auto" className="standardMarginRight">
                      <Button
                        icon={PlusNewIcon}
                        text="سفارش جدید"
                        type="default"
                        stylingMode="contained"
                        rtlEnabled={true}
                        onClick={this.btnNew_onClick}
                        className="fontStyle"
                      />
                    </Col>
                    {this.state.stateEnable_btnAddGroup && (
                      <Col xs="auto" className="standardMarginRight">
                        <Button
                          icon={PlusNewIcon}
                          text="سفارش جدید گروهی"
                          type="default"
                          stylingMode="contained"
                          rtlEnabled={true}
                          onClick={this.btnNewGroup_onClick}
                          className="fontStyle"
                        />
                      </Col>
                    )}
                    <Col xs="auto" className="standardMarginRight">
                      <Button
                        icon={PlusNewIcon}
                        text="سفارش خارج از برنامه"
                        type="default"
                        stylingMode="contained"
                        rtlEnabled={true}
                        onClick={this.btnNewOutRoute_onClick}
                        className="fontStyle"
                      />
                    </Col>
                  </Row>
                )}
                <Row style={{ direction: "ltr" }}>
                  <Col xs="auto">
                    <Button
                      icon={ExportExcelIcon}
                      type="default"
                      stylingMode="contained"
                      rtlEnabled={true}
                      onClick={this.btnExportExcel_onClick}
                      className="fontStyle"
                    />
                  </Col>
                </Row>
                <Row className="standardSpaceTop">
                  <Col className="standardMarginRight">
                    <DataGrid
                      id="grdOrderPointInventory"
                      dataSource={this.state.OrderSupplierGridData}
                      defaultColumns={DataGridOrderPointSupplierColumns}
                      keyExpr="id"
                      columnAutoWidth={true}
                      allowColumnReordering={true}
                      showBorders={true}
                      rtlEnabled={true}
                      allowColumnResizing={true}
                      columnResizingMode="widget"
                      height={DataGridDefaultHeight}
                      onRowUpdating={this.grdOrderPointSupplier_onRowUpdating}                      
                      onCellDblClick={this.grdOrderPointSupplier_onCellDblClick}
                      onRowPrepared={this.grdOrderPointSupplier_onRowPrepared}
                      className="fontStyle"
                    >
                      <Scrolling
                        rowRenderingMode="virtual"
                        showScrollbar="always"
                        columnRenderingMode="virtual"
                      />

                      <Paging defaultPageSize={DataGridDefaultPageSize} />
                      <Pager
                        visible={true}
                        allowedPageSizes={DataGridPageSizes}
                        showPageSizeSelector={true}
                        showNavigationButtons={true}
                      />
                      {this.state.stateShowRoute && (
                        <Selection
                          mode="multiple"
                          selectAllMode={ALL_MOD}
                          showCheckBoxesMode={CHECK_BOXES_MOD}
                        />
                      )}
                      <Editing mode="cell" allowUpdating={true} />
                      <FilterRow visible={true} />
                      {/* <FilterPanel visible={true} />                   */}
                      <HeaderFilter visible={true} />
                    </DataGrid>
                  </Col>
                </Row>
                {this.state.stateEnable_btnUpdate && (
                  <Row>
                    <Col xs="auto" className="standardMarginRight">
                      <Button
                        icon={UpdateIcon}
                        text="ذخیره تغییرات"
                        type="success"
                        stylingMode="contained"
                        rtlEnabled={true}
                        onClick={this.btnUpdateOrders_onClick}
                        className="fontStyle"
                      />
                    </Col>
                  </Row>
                )}
              </Row>
            </Card>            
          </Col>
          <Col xs="3">
            <Card className="shadow bg-white border pointer">
              <Row className="standardPadding">
                {/* <Label className="title">
                  لیست تامین کنندگان، نیاز به حد نصاب سفارش
                </Label> */}

                <div>
                  <table className='tablePublic'>
                    <tr>
                      {/* <th>کد تامین کننده</th> */}
                      <th>نام فروشگاه</th>
                      <th>نام تامین کننده</th>
                      {/* <th>حداقل وزن</th>
                        <th>حداکثر وزن</th>
                        <th>جمع کل وزن کالا</th>
                        <th>حداقل ریال</th>
                        <th>حداکثر ریال</th>
                        <th>جمع کل ریال کالاها</th> */}
                    </tr>
                    {this.state.SupplierListSumMaxMinGridData.map((item) => (
                      <tr onClick={()=>this.setState({stateModal_DetailOfPriceWeighNumber:true,DetailOfPriceWeighNumber:item})}>
                        {/* <td>{item.extSupplierId}</td> */}
                        <td>{item.retailStoreName}</td>
                        <td>{item.supplierName}</td>
                        {/* <td>{item.minWeight}</td>
                          <td>{item.maxWeight}</td>
                          <td>{item.sumItemsWeight}</td>
                          <td>{item.minPrice}</td>
                          <td>{item.maxPrice}</td>
                          <td>{item.sumItemsPrice}</td> */}
                      </tr>
                    ))}
                  </table>
                </div>
              </Row>
              {/* <Row className="standardPadding">
                <DataGrid
                  id="grdOrderPointSumSupplier"
                  dataSource={this.state.SupplierListSumMaxMinGridData}
                  defaultColumns={DataGridOrderPointSumOrdersColumns}
                  keyExpr="id"
                  columnAutoWidth={true}
                  allowColumnReordering={true}
                  showBorders={true}
                  rtlEnabled={true}
                  allowColumnResizing={true}
                  columnResizingMode="widget"                  
                >
                  <Scrolling
                    rowRenderingMode="virtual"
                    showScrollbar="always"
                    columnRenderingMode="virtual"
                  />

                  <Paging defaultPageSize={DataGridDefaultPageSize} />
                  <Pager
                    visible={true}
                    allowedPageSizes={DataGridPageSizes}
                    showPageSizeSelector={true}
                    showNavigationButtons={true}
                  />                                 
                  <FilterRow visible={true} />
                  <HeaderFilter visible={true} />
                </DataGrid>
              </Row> */}
            </Card>
          </Col>
        </Row>
        {this.state.stateModal_LogsOfOPS && (
          <Row className="text-center">
            <Col>
              <Modal
                style={{ direction: "rtl" }}
                isOpen={this.state.stateModal_LogsOfOPS}
                toggle={this.ModalOrderSupplierLogs_onClickAway}
                centered={true}
                size="lg"
                className="fontStyle"
              >
                <ModalHeader toggle={this.ModalOrderSupplierLogs_onClickAway}>
                  لیست تغییرات سفارش
                </ModalHeader>
                <ModalBody>
                  <Row
                    className="standardPadding"
                    style={{
                      overflowY: "scroll",
                      maxHeight: "450px",
                    }}
                  >
                    <OrderSupplierLogs />
                  </Row>
                </ModalBody>
              </Modal>
            </Col>
          </Row>
        )}


        {this.state.stateModal_OrderSupplierNew && (
          <Row className="text-center">
            <Col>
              <Modal
                style={{ direction: "rtl" }}
                isOpen={this.state.stateModal_OrderSupplierNew}
                toggle={this.ModalOrderInventoryNew_onClickAway}
                centered={true}
                size="lg"
                className="fontStyle"
              >
                <ModalHeader toggle={this.ModalOrderInventoryNew_onClickAway}>
                  ثبت سفارش
                </ModalHeader>
                <ModalBody>
                  <Row
                    className="standardPadding"
                    style={{
                      // overflowY: "scroll",
                      maxHeight: "450px",
                    }}
                  >
                    <OrderSupplierNew isOutRoute={this.state.isOutRoute} />
                  </Row>
                </ModalBody>
              </Modal>
            </Col>
          </Row>
        )}

        {this.state.stateModal_OrderSupplierNewGroup && (
          <Row className="text-center">
            <Col>
              <Modal
                isOpen={this.state.stateModal_OrderSupplierNewGroup}
                toggle={this.ModalOrderInventoryNewGroup_onClickAway}
                centered={true}
                dir="rtl"
                size="xl"
                className="fontStyle"
              >
                <ModalHeader
                  toggle={this.ModalOrderInventoryNewGroup_onClickAway}
                >
                  ثبت سفارش گروهی
                </ModalHeader>
                <ModalBody>
                  <Row
                    className="standardPadding"
                    style={{
                      // overflowY: "scroll",
                      maxHeight: "750px",
                    }}
                  >
                    <OrderSupplierNewGroup />
                  </Row>
                </ModalBody>
              </Modal>
            </Col>
          </Row>
        )}

        {this.state.stateModal_DetailOfPriceWeighNumber && (
          <Row className="text-center">
            <Col>
              <Modal
                isOpen={this.state.stateModal_DetailOfPriceWeighNumber}
                toggle={this.ModalDetailOfPriceWeighNumber_onClickAway}
                centered={true}
                dir="rtl"
                size="xl"
                className="fontStyle"
              >
                <ModalHeader
                  toggle={this.ModalDetailOfPriceWeighNumber_onClickAway}
                >
                  جزئیات محدودیت تامین کننده
                </ModalHeader>
                <ModalBody>
                  <Row
                    className="standardPadding"
                    style={{
                      // overflowY: "scroll",
                      maxHeight: "750px",
                    }}
                  >
                    <Row>
                      <Col>
                        نام فروشگاه: {this.state.DetailOfPriceWeighNumber.retailStoreName}
                      </Col>
                      <Col>
                        نام تامین کننده: {this.state.DetailOfPriceWeighNumber.supplierName}
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        حداقل سفارش وزنی: {Gfn_num3Seperator(this.state.DetailOfPriceWeighNumber.minWeight,3)}
                      </Col>
                      <Col>
                        حداکثر سفارش وزنی: {Gfn_num3Seperator(this.state.DetailOfPriceWeighNumber.maxWeight,3)}
                      </Col>                      
                      <Col>
                        جمع سفارش وزنی: {Gfn_num3Seperator(this.state.DetailOfPriceWeighNumber.sumItemsWeight,3)}
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        حداقل سفارش ریالی: {Gfn_num3Seperator(this.state.DetailOfPriceWeighNumber.minPrice,3)}
                      </Col>
                      <Col>
                        حداکثر سفارش ریالی{Gfn_num3Seperator(this.state.DetailOfPriceWeighNumber.maxPrice,3)}
                      </Col>
                      <Col>
                        جمع سفارش ریالی: {Gfn_num3Seperator(this.state.DetailOfPriceWeighNumber.sumItemsPrice,3)}
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        حداقل سفارش تعدادی: {Gfn_num3Seperator(this.state.DetailOfPriceWeighNumber.minNumber,3)}
                      </Col>
                      <Col>
                        حداکثر سفارش تعدادی: {Gfn_num3Seperator(this.state.DetailOfPriceWeighNumber.maxNumber,3)}
                      </Col>
                      <Col>
                        جمع سفارش تعدادی: {Gfn_num3Seperator(this.state.DetailOfPriceWeighNumber.sumItemsNumber,3)}
                      </Col>
                    </Row>
                  </Row>
                </ModalBody>
              </Modal>
            </Col>
          </Row>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  User: state.users,
  Location: state.locations,
  Supplier: state.suppliers,
  Item: state.items,
  Company: state.companies,
  OrderPointSupplier: state.orderPointSuppliers,
  LogsOrderPointSupplier: state.logsOrderPointSuppliers,
});

export default connect(mapStateToProps)(OrderSupplier);
