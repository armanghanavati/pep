
import Ticket from '../components/ticket/Ticket'
import PaymentRequest from '../components/payment/PaymentRequest'
import Company from '../components/company/Company'
import Position from '../components/position/Position'
import Locations from '../pages/Locations'
import Supplier from '../components/supplier/Supplier';
import Person from '../components/person/Person'
import OrdersSupplier from '../pages/OrdersSupplier'
import User from "../components/user/User";
import Role from "../components/role/Role";
import PepObject from "../components/pepObject/PepObject";
import PepRoleObjectPermission from "../components/pepRoleObjectPermission/PepRoleObjectPermission";
import OrderStoreDate from "../components/orderStoreDate/OrderStoreDate";
import OrdersInventory from "../pages/OrdersInventory";
import OrderStoreSupplierDate from "../components/orderStoreSupplierDate/OrderStoreSupplierDate";
import LocationPositionOrderNumber from "../components/locationPositionOrderNumber/LocationPositionOrderNumber";
import RegisterOrderTimes from "../pages/RegisterOrderTimes";
import ItemLocations from '../pages/ItemLocations'


export const REAL_COMPONENT = [
  {
    strComponent: "Ticket",
    orgComponent: <Ticket />,
  },
  {
    strComponent: "PaymentRequest",
    orgComponent: <PaymentRequest />,
  },
  {
    strComponent: "Company",
    orgComponent: <Company />,
  },
  {
    strComponent: "Position",
    orgComponent: <Position />,
  },
  {
    strComponent: "Locations",
    orgComponent: <Locations />,
  },
  {
    strComponent: "Supplier",
    orgComponent: <Supplier />,
  },
  {
    strComponent: "OrdersInventory",
    orgComponent: <OrdersInventory />,
  },
  {
    strComponent: "Person",
    orgComponent: <Person />,
  },
  {

    strComponent:"OrdersSupplier",
    orgComponent:<OrdersSupplier />
  },
  {
    strComponent: "User",
    orgComponent: <User />,
  },
  {
    strComponent: "Ticket",
    orgComponent: <Ticket />,
  },
  {
    strComponent: "Role",
    orgComponent: <Role />,
  },
  {
    strComponent: "PaymentRequset",
    orgComponent: <PaymentRequest />,
  },
  {
    strComponent: "OrderStoreDate",
    orgComponent: <OrderStoreDate />,
  },
  {
    strComponent: "PepObject",
    orgComponent: <PepObject />,
  },
  {
    strComponent: "PepRoleObjectPermission",
    orgComponent: <PepRoleObjectPermission />,
  },
  {
    strComponent: "LocationPositionOrderNumber",
    orgComponent: <LocationPositionOrderNumber />,
  },
  {
    strComponent: "OrderStoreSupplierDate",
    orgComponent: <OrderStoreSupplierDate />,
  },
  {
    strComponent: "ItemLocations",
    orgComponent: <ItemLocations />,
  },
  {
    strComponent: "RegisterOrderTimes",
    orgComponent: <RegisterOrderTimes />,
  },
];

