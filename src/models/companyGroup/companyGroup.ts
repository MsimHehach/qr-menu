import { BaseModel } from 'src/corexModels/apiModels/baseModel';

export type TermsOfServiceInfo = {
  sales_points: {
    uuid: string;
    name: string;
    code: string | null;
    external_id: string;
    address: string;
    custom_address: string;

    settings: {
      delivery_enabled: boolean;
      pickup_enabled: boolean;
      table_orders_enabled: boolean;
      booking_enabled: boolean;
      cart_enabled: boolean;
      promo_codes: string | null;
    };
    payment_settings: {
      cash_enabled: boolean;
      card_enabled: boolean;
      online_payment_enabled: boolean;
      bonus_using_enabled: boolean;
      payment_types_mapping: {
        bonus: string;
        cash: string;
        card: string;
        online: string;
      };
      update_on_parent_change: boolean;
    };
    coords: {
      latitude: number;
      longitude: number;
    };
    company: string;
    company_group: string;
    contacts: {
      uuid: string;
      active: boolean;
      emails: string[];
      contact_phone: number | null;
    };
    active: boolean;
    visible: boolean;
  }[];
  legal_entities: {
    uuid: string;
    code: number | string | null;
    registration_code: string | number | null;
    state_registration_number: string | number | null;
    legal_address: string | null;
    contact_phone: string | null;
    name: string;
    company_group: string;
    active: boolean;
    sales_points: {
      uuid: string;
      name: string;
      code: string | null;
      settings: {
        delivery_enabled: boolean;
        pickup_enabled: boolean;
        table_orders_enabled: boolean;
        booking_enabled: boolean;
        cart_enabled: boolean;
        promo_codes: string | null;
      };
      payment_settings: {
        cash_enabled: boolean;
        card_enabled: boolean;
        online_payment_enabled: boolean;
        bonus_using_enabled: boolean;
        payment_types_mapping: {
          bonus: string;
          cash: string;
          card: string;
          online: string;
        };
        update_on_parent_change: boolean;
      };
      external_id: string;
      address: string;
      custom_address: string;
      coords: {
        latitude: number;
        longitude: number;
      };
      company: {
        uuid: string;
        name: string;
        code: string | number | null;
        external_id: string | number | null;
        company_group: string;
        visible: boolean;
        description: string | null;
      };
      company_group: string;
      contacts: {
        uuid: string;
        active: boolean;
        emails: string[];
        contact_phone: number | null;
      };
      active: boolean;
      visible: boolean;
    }[];
  }[];
  bank: {
    uuid: string | null;
    bank: string | null;
    default: boolean;
    production: boolean;
    legal_entity: string | null;
    payment_services: {
      apple_pay_enabled: boolean;
      apple_pay: string;
      google_pay_enabled: boolean;
      google_pay: string;
      sbp_enabled: boolean;
      save_cards_enabled: boolean;
    };
  };
};

export type CompanyGroupRaw = {
  id: number | undefined;
};

export class CompanyGroup implements BaseModel {
  id: number | undefined;

  constructor(raw: CompanyGroupRaw) {
    this.id = raw.id;
  }

  toJson(): Record<string, any> {
    return {
      id: this.id,
    };
  }
}
