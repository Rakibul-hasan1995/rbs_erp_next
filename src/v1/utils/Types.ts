

interface Contact {
   address: string;
   phone: string;
   contactParsonName: string;
}

export interface User {
   email: string;
   user_name: string;
   roll: 'user' | 'customer' | 'supplier' | 'admin' | 'super-admin';
   password?: string;
   contact_details?: Contact;
}


export interface Order {
   _id: string;
   customer: string;
   order_name: string;
   program_name: string;
   qty: number;
   rate: number;
   currency: string;
   unit: string;
   stitching?: number;
   category?: string;
   tags?: string[];
   description?: string;
   order_date?: string;
   shipment_date?: string;
   status: string;
   image_gallery?: {
      _id: string;
      href: string
   }[];
   cover_photo: string;
   delivery_qty?: number | 0;
   receive_qty?: number | 0;
   production_qty?: number | 0;
   invoice_amount?: number | 0
}

export interface OrderExpand {
   _id: string;
   customer: {
      _id: string;
      user_name: string;
      exchange_rate: number
   };
   order_name: string;
   program_name: string;
   qty: number;
   rate: number;
   currency: string;
   unit: string;
   stitching?: number;
   category?: string;
   tags?: string[];
   description?: string;
   order_date?: string;
   shipment_date?: string;
   status: string;
   image_gallery?: {
      _id: string;
      href: string
   }[];
   cover_photo: {
      href: string;
      _id: string
   };
   delivery_qty?: number | 0;
   receive_qty?: number | 0;
   production_qty?: number | 0;
   invoice_amount?: number | 0
}

export interface ProductionExpanded {
   date: string;
   shift: string;
   total_amount: number;
   _id: string;
   production_data?: {
      order: OrderExpand;
      qty: number;
      machine_no: number;
      operator?: User;
      assistant_operator?: User;
      helper?: User;
      remarks?: string;
      _id: string
   }[];
}
export interface Production {
   date: string;
   shift: string;
   total_amount: number;
   _id: string;
   production_data?: {
      order: Order;
      qty: number;
      machine_no: number;
      operator: string | User;
      assistant_operator: string | User;
      helper: string | User;
      remarks: string;
      _id: string
   }[];
}


export interface InvoiceExpandItem {
   _id: string;
   program_name: string;
   order_name: string;
   qty: number;
   rate: number;
   unit: 'Pcs' | "Dzn";
   currency: "USD" | "BDT";
   cover_photo: {
      _id: string;
      href: string
   };
   challan_no?: string
   totalUsd: number;
   totalBdt: number;
}


export interface InvoiceExpand {
   _id: string;
   customer: {
      _id: string;
      user_name: string,
      exchange_rate: number;
      contact_details: {
         address: string
      }
   }
   date: string;
   invoice_no: string;
   customer_bill_no: number;
   discount: number;
   amount: number;
   status: string;
   customer_prev_deu?: number;
   items: InvoiceExpandItem[];
   totalAmountBDT: number;
   totalAmountUSD: number;
   discountAmount: number;
   totalQty: number;
   remarks?: string;
}
export interface Challan {
   _id: string
   date: string;
   customer: {
      _id: string;
      user_name: string
      contact_details: {
         address: string
      }
   };
   challan_no: string;
   bag_qty: number;
   remarks: string;
   items?: {
      order: {
         _id: string,
         customer: string;
         order_name: string;
         program_name: string;
         unit: string;
         cover_photo: {
            href: string
         };
      };
      qty: number;
      emb_reject_qty: number;
      fabric_reject_qty: number;
      remarks: string
   }[];
   total?: {
      qty: number;
      emb_reject_qty: number;
      fabric_reject_qty: number;
   }
}
export interface PurchaseOrders {
   _id: string;
   order_date: string,
   shipment_date: string,
   supplier: {
      _id: string;
      user_name: string
      contact_details: {
         address: string
      }
   };
   order: string
   qty: number,
   rate: number,
   status: string,
   description: string,
}

export interface PurchaseOrdersExpand {
   _id: string;
   description: string;
   order: {
      cover_photo: {
         href: string;
         _id: string
      };
      order_name: string;
      program_name: string;
      qty: number;
      rate: number;
      unit: string;
      _id: string;
      currency: string
   };
   supplier: {
      _id: string;
      user_name: string
      contact_details: {
         address: string
      };
      exchange_rate: number
   };
   order_date: string;
   shipment_date: string;
   qty: number;
   rate: number;
   status: string,

}

interface Cover_photoExpand {
   _id: string;
   href: string
}


export interface PurchaseOrderInvoiceExpandItem {
   _id: string;
   cover_photo: {
      _id: string;
      href: string
   };
   program_name: string;
   order_name: string;
   unit: 'Pcs' | "Dzn";
   currency: "USD" | "BDT";
   qty: number;
   rate: number;
   challan_no?: string
   totalUsd: number;
   totalBdt: number;
   order_date: string;
}

export interface PurchaseOrderInvoiceExpand {
   _id: string
   amount: number;
   cover_photo: Cover_photoExpand;
   date: string;
   discount: number;
   invoice_no: string;
   items: PurchaseOrderInvoiceExpandItem[];
   supplier: {
      _id: string;
      user_name: string,
      exchange_rate: number;
      contact_details: {
         address: string
      }
   };
   supplier_bill_no: number;
   status: string;
   supplier_prev_deu: number;
   remarks: string;
   totalAmountBDT: number;
   totalAmountUSD: number;
   discountAmount: number;
   totalQty: number;
}