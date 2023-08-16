import Ticket from '../components/ticket/Ticket'
import PaymentRequest from '../components/payment/PaymentRequest'
import Company from '../components/company/Company'
import Position from '../components/position/Position'
import Location from '../components/location/Location'
import Supplier from '../components/supplier/Supplier';
import Person from '../components/person/Person'
import OrdersInventory from '../pages/OrdersInventory';


export const REAL_COMPONENT=[
  {
    strComponent:"Ticket",
    orgComponent:<Ticket />
  },
  {
    strComponent:"PaymentRequest",
    orgComponent:<PaymentRequest />
  },
  {
    strComponent:"Company",
    orgComponent:<Company />
  },
  {
    strComponent:"Position",
    orgComponent:<Position />
  },
  {
    strComponent:"Location",
    orgComponent:<Location />
  },
  {
    strComponent:"Supplier",
    orgComponent:<Supplier />
  },
  {
    strComponent:"OrdersInventory",
    orgComponent:<OrdersInventory />
  },
  {
    strComponent:"Person",
    orgComponent:<Person />
  },
]