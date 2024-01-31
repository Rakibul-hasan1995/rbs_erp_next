import { BiSolidDashboard } from "react-icons/bi";
import { BsFillBarChartFill } from "react-icons/bs";
import { FaArrowRight, FaFileInvoiceDollar, FaLayerGroup, FaUsers } from "react-icons/fa";
import { MdOutlineManageAccounts, MdOutlinePayments } from "react-icons/md";
import { FaTruckArrowRight } from "react-icons/fa6";
import FaTruckArrowLeft from "../customIcons";
import { SiSublimetext } from "react-icons/si";

export interface MenuItem {
   title: string;
   name: string;
   parent?: boolean;
   icon: any | 'dot';
   child?: MenuItem[];
   link?: string
}



const routeStructure: MenuItem[] = [
   {
      title: "Dashboard",
      name: "dashboard",
      parent: false,
      icon: BiSolidDashboard,
      link: "/v1/dashboard"
   },
   {
      title: "Customers",
      name: "customers",
      parent: true,
      icon: FaUsers,
      link: '/v1/customers',
      child: [
         {
            title: 'Add',
            name: 'customers.add-people',
            parent: false,
            icon: 'dot',
            link: '/v1/customers/add',
         },
         {
            title: 'Customers',
            name: 'people.customers',
            parent: false,
            icon: 'dot',
            link: '/v1/customers',
         },
         {
            title: 'Users',
            name: 'people.users',
            parent: false,
            icon: 'dot',
            link: '/rbs-erp/v1/users/list',
         },
         {
            title: 'Employee',
            name: 'people.employee',
            parent: false,
            icon: 'dot',
            link: '/rbs-erp/v1/users/employee/list',
         },
      ]
   },
   {
      title: "Orders",
      name: "orders",
      parent: true,
      icon: FaLayerGroup,
      link: '/v1/orders/report',
      child: [
         {
            title: 'Add',
            name: 'customers.add-people',
            parent: false,
            icon: 'dot',
            link: '/v1/orders/add',
         },
         {
            title: 'List',
            name: '',
            parent: false,
            icon: 'dot',
            link: '/v1/orders',
         },
         {
            title: 'Report',
            name: '',
            parent: false,
            icon: 'dot',
            link: '/v1/orders/report',
         },
      ]
   },
   {
      title: 'Purchase Orders',
      name: 'purchase_orders',
      link: '/v1/purchase-orders',
      parent: true,
      icon: SiSublimetext,
      child: [
         {
            title: 'Orders',
            name: 'p-orders',
            parent: false,
            icon: 'dot',
            link: '/v1/purchase_orders',
         },
         {
            title: 'Invoices',
            name: 'p-invoices',
            parent: false,
            icon: 'dot',
            link: '/v1/purchase_orders/invoices',
         }
      ]
   },
   {
      title: "Productions",
      name: "productions",
      parent: true,
      icon: BsFillBarChartFill,
      link: '/v1/productions',
      child: [
         {
            title: 'Add',
            name: 'production.add',
            parent: false,
            icon: 'dot',
            link: '/v1/productions/add',
         },
         {
            title: 'List',
            name: '',
            parent: false,
            icon: 'dot',
            link: '/v1/productions',
         },
      ]
   },
   {
      title: "Accountant",
      name: "accountant",
      parent: true,
      icon: MdOutlineManageAccounts,
      // link: '/v1/invoices',
      child: [
         {
            title: 'Add',
            name: 'invoice.add',
            parent: false,
            icon: 'dot',
            link: '/v1/chart_of_accounts/add',
         },
         {
            title: 'Chart of Accounts',
            name: '',
            parent: false,
            icon: 'dot',
            link: '/v1/chart_of_accounts/list',
         },
      ]
   },
   {
      title: "Invoices",
      name: "invoices",
      parent: true,
      icon: FaFileInvoiceDollar,
      link: '/v1/invoices',
      child: [
         {
            title: 'Add',
            name: 'invoice.add',
            parent: false,
            icon: 'dot',
            link: '/v1/invoices/add',
         },
         {
            title: 'List',
            name: '',
            parent: false,
            icon: 'dot',
            link: '/v1/invoices',
         },
      ]
   },
   {
      title: "Payments",
      name: "payments",
      parent: false,
      icon: MdOutlinePayments,
      link: '/v1/payments',
   },
   {
      title: "Receive Challan",
      name: "recChallan",
      parent: true,
      icon: FaTruckArrowLeft,
      link: '/v1/receive-challans',
      child: [
         {
            title: 'Add',
            name: 'invoice.add',
            parent: false,
            icon: 'dot',
            link: '/v1/receive-challans/add',
         },
         {
            title: 'List',
            name: '',
            parent: false,
            icon: 'dot',
            link: '/v1/receive-challans',
         },
      ]
   },
   {
      title: "Delivery Challan",
      name: "delChallan",
      parent: true,
      icon: FaTruckArrowRight,
      link: '/v1/delivery-challans',
      child: [
         {
            title: 'Add',
            name: 'delivery.add',
            parent: false,
            icon: 'dot',
            link: '/v1/delivery-challans/add',
         },
         {
            title: 'List',
            name: 'list.delivery',
            parent: false,
            icon: 'dot',
            link: '/v1/delivery-challans',
         },
      ]
   }


];

export { routeStructure };
