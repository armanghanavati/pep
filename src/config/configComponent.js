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
import LocationPositionOrderNumber from "../components/locationPositionOrderNumber/LocationPositionOrderNumber"
import RegisterOrderTimes from "../pages/RegisterOrderTimes";
import ItemLocations from '../pages/ItemLocations';
import OrdersInventoryReports from '../pages/OrdersInventoryReports';
import OrdersInventoryOutRouteReports from '../pages/OrdersInventoryOutRouteReports';
import OutRoutsOrdersInventoryConfirms from '../pages/OutRoutsOrdersInventoryConfirms';
import RegisterSupplierOrderTimes from '../pages/RegisterSupplierOrderTimes';
import UserCompanies from '../pages/UserCompanies';
import UserLocations from '../pages/UserLocations'
import PersonShifts from '../pages/PersonShifts'
import ItemSuppliers from '../pages/ItemSuppliers'
import OrderInventoryConfirms from '../pages/OrderInventoryConfirms'
import OrderSupplierConfirms from '../pages/OrderSupplierConfirms';
import OrderPoints from '../pages/OrderPoints'
import OrderPointSupplierReports from '../pages/OrderPointSupplierReports';
import TicketSubjectUsers from '../pages/TicketSubjectUsers';
import TicketSubjects from '../pages/TicketSubjects'
import OrdersByUpload from '../pages/OrdersByUpload'
import SupplierLocationContacts from '../pages/SupplierLocationContacts'

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
  {
    strComponent: "OrdersInventoryReports",
    orgComponent: <OrdersInventoryReports />,
  },
  {
    strComponent: "OrdersInventoryOutRouteReports",
    orgComponent: <OrdersInventoryOutRouteReports />,
  },
  {
    strComponent: "OutRoutsOrdersInventoryConfirms",
    orgComponent: <OutRoutsOrdersInventoryConfirms />,
  },
  {
    strComponent: "RegisterSupplierOrderTimes",
    orgComponent: <RegisterSupplierOrderTimes />,
  },
  {
    strComponent: "UserCompanies",
    orgComponent: <UserCompanies />,
  },
  {
    strComponent: "UserLocations",
    orgComponent: <UserLocations />,
  },
  {
    strComponent: "PersonShifts",
    orgComponent: <PersonShifts />,
  },
  {
    strComponent: "ItemSuppliers",
    orgComponent: <ItemSuppliers />,
  },
  {
    strComponent: "OrderInventoryConfirms",
    orgComponent: <OrderInventoryConfirms />,
  },
  {
    strComponent: "OrderPointSupplierReports",
    orgComponent: <OrderPointSupplierReports />,
  }, 
  {
    strComponent: "OrderPoints",
    orgComponent: <OrderPoints />,
  },
  {
    strComponent: "OrderSupplierConfirms",
    orgComponent: <OrderSupplierConfirms/>,
  },
  {
    strComponent: "TicketSubjectUsers",
    orgComponent: <TicketSubjectUsers/>,
  },
  {
    strComponent: "TicketSubjects",
    orgComponent: <TicketSubjects/>,
  },
  {
    strComponent: "OrdersByUpload",
    orgComponent: <OrdersByUpload/>,
  },
  {
    strComponent: "SupplierLocationContacts",
    orgComponent: <SupplierLocationContacts/>,
  }  
];

