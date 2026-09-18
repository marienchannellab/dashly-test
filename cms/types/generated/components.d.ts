import type { Schema, Struct } from '@strapi/strapi';

export interface ProductBadge extends Struct.ComponentSchema {
  collectionName: 'components_product_badges';
  info: {
    displayName: 'Badge';
    icon: 'priceTag';
  };
  attributes: {
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 30;
      }>;
  };
}

export interface ProductPricing extends Struct.ComponentSchema {
  collectionName: 'components_product_pricings';
  info: {
    displayName: 'Pricing';
    icon: 'shoppingCart';
  };
  attributes: {
    basePrice: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    discountPercent: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          max: 100;
          min: 0;
        },
        number
      >;
    mode: Schema.Attribute.Enumeration<['none', 'percentage', 'fixed']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'none'>;
    salePrice: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
  };
}

export interface ProductVariationGroup extends Struct.ComponentSchema {
  collectionName: 'components_product_variation_groups';
  info: {
    displayName: 'Variation Group';
    icon: 'oneToMany';
  };
  attributes: {
    name: Schema.Attribute.String & Schema.Attribute.Required;
    options: Schema.Attribute.Component<'product.variation-option', true>;
    order: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
  };
}

export interface ProductVariationOption extends Struct.ComponentSchema {
  collectionName: 'components_product_variation_options';
  info: {
    displayName: 'Variation Option';
    icon: 'connector';
  };
  attributes: {
    discountPercent: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 100;
          min: 0;
        },
        number
      >;
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    order: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'product.badge': ProductBadge;
      'product.pricing': ProductPricing;
      'product.variation-group': ProductVariationGroup;
      'product.variation-option': ProductVariationOption;
    }
  }
}
