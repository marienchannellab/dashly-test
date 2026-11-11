import hyaluronicAcidSerumImage from '../assets/products/hyaluronic-acid-serum.webp'
import dailyMoisturiserImage from '../assets/products/daily-moisturiser.webp'
import dailyFaceCleanserImage from '../assets/products/daily-face-cleanser.webp'
import cleanseTreatHydrateImage from '../assets/products/cleanse-treat-hydrate.webp'
import dailySunProtectionImage from '../assets/products/daily-sun-protection.webp'
import setIncludesImage from '../assets/products/set-includes.webp'
import chooseFinishImage from '../assets/products/choose-finish.webp'
import type { Category, Product, ProductImage } from '../types/product'

function image(id: number, name: string, url: string, alternativeText: string): ProductImage {
  return {
    id,
    name,
    url,
    width: 1200,
    height: 1200,
    alternativeText,
  }
}

export const categories: Category[] = [
  { id: 1, documentId: 'cleansers', name: 'Cleansers', order: 1 },
  { id: 2, documentId: 'face-wash', name: 'Face Wash', order: 2 },
  { id: 3, documentId: 'makeup-removers', name: 'Makeup Removers', order: 3 },
]

const cleansers = categories[0]

export const products: Product[] = [
  {
    id: 1,
    documentId: 'hyaluronic-acid-serum',
    name: 'Hyaluronic Acid Serum',
    size: '30 ml',
    description: 'Hydrating serum that helps support smooth, healthy-looking skin.',
    order: 1,
    image: image(1, 'hyaluronic-acid-serum.webp', hyaluronicAcidSerumImage, 'Hyaluronic Acid Serum'),
    pricing: { mode: 'percentage', basePrice: 28, discountPercent: 15, salePrice: null },
    badges: [{ id: 1, label: 'Sale' }],
    variationGroups: [
      {
        id: 1,
        name: 'Formula',
        order: 1,
        layout: 'vertical',
        options: [
          { id: 1, value: 'Hyaluronic Acid 2%', order: 1, discountPercent: null, image: null },
          { id: 2, value: 'Hyaluronic + B5', order: 2, discountPercent: null, image: null },
        ],
      },
    ],
    categories: [cleansers],
  },
  {
    id: 2,
    documentId: 'daily-moisturiser',
    name: 'Daily Moisturiser',
    size: '50 ml',
    description: 'Everyday hydration that helps leave skin soft, balanced and comfortable.',
    order: 2,
    image: image(2, 'daily-moisturiser.webp', dailyMoisturiserImage, 'Daily Moisturiser'),
    pricing: { mode: 'percentage', basePrice: 32, discountPercent: 15, salePrice: null },
    badges: [
      { id: 2, label: 'New' },
      { id: 3, label: 'Bestseller' },
    ],
    variationGroups: [
      {
        id: 2,
        name: 'Skin type',
        order: 1,
        layout: 'horizontal',
        options: [
          { id: 3, value: 'Dry', order: 1, discountPercent: null, image: null },
          { id: 4, value: 'Normal', order: 2, discountPercent: null, image: null },
          { id: 5, value: 'Sensitive', order: 3, discountPercent: null, image: null },
        ],
      },
      {
        id: 3,
        name: 'Size',
        order: 2,
        layout: 'horizontal',
        options: [
          { id: 6, value: '30 ml', order: 1, discountPercent: null, image: null },
          { id: 7, value: '50 ml', order: 2, discountPercent: 10, image: null },
          { id: 8, value: '100 ml', order: 3, discountPercent: 20, image: null },
        ],
      },
    ],
    categories: [cleansers],
  },
  {
    id: 3,
    documentId: 'daily-face-cleanser',
    name: 'Daily Face Cleanser',
    size: '150 ml',
    description: 'A gentle daily cleanser that removes impurities without leaving skin feeling tight.',
    order: 3,
    image: image(3, 'daily-face-cleanser.webp', dailyFaceCleanserImage, 'Daily Face Cleanser'),
    pricing: { mode: 'percentage', basePrice: 20, discountPercent: 15, salePrice: null },
    badges: [{ id: 4, label: 'Bestseller' }],
    variationGroups: [
      {
        id: 4,
        name: 'Formula',
        order: 1,
        layout: 'vertical',
        options: [
          { id: 9, value: 'Gentle Hydrating', order: 1, discountPercent: null, image: null },
          { id: 10, value: 'Deep Cleansing', order: 2, discountPercent: null, image: null },
        ],
      },
    ],
    categories: [cleansers],
  },
  {
    id: 4,
    documentId: 'cleanse-treat-hydrate',
    name: 'Cleanse + Treat + Hydrate',
    size: '3 products',
    description: 'A simple three-step routine with cleansing, treatment and hydration essentials.',
    order: 4,
    image: image(4, 'cleanse-treat-hydrate.webp', cleanseTreatHydrateImage, 'Cleanse, treat and hydrate skincare set'),
    pricing: { mode: 'fixed', basePrice: 65, discountPercent: 15, salePrice: 52 },
    badges: [
      { id: 5, label: 'New' },
      { id: 6, label: 'Sale' },
    ],
    variationGroups: [
      {
        id: 5,
        name: 'Set includes',
        order: 1,
        layout: 'vertical',
        options: [
          {
            id: 11,
            value: 'Cleanser + Serum + Cream',
            order: 1,
            discountPercent: null,
            image: image(6, 'set-includes.webp', setIncludesImage, 'Products included in the set'),
          },
          {
            id: 12,
            value: 'Cleanser + Serum + SPF',
            order: 2,
            discountPercent: null,
            image: image(6, 'set-includes.webp', setIncludesImage, 'Products included in the set'),
          },
        ],
      },
    ],
    categories: [cleansers],
  },
  {
    id: 5,
    documentId: 'daily-sun-protection',
    name: 'Daily Sun Protection',
    size: '50 ml',
    description: 'Daily SPF that helps protect skin from UV damage while maintaining comfortable hydration.',
    order: 5,
    image: image(5, 'daily-sun-protection.webp', dailySunProtectionImage, 'Daily Sun Protection'),
    pricing: { mode: 'fixed', basePrice: 26, discountPercent: 15, salePrice: 22 },
    badges: [{ id: 7, label: 'Bestseller' }],
    variationGroups: [
      {
        id: 6,
        name: 'Choose finish',
        order: 1,
        layout: 'vertical',
        options: [
          {
            id: 13,
            value: 'Invisible Finish',
            order: 1,
            discountPercent: null,
            image: image(7, 'choose-finish.webp', chooseFinishImage, 'Invisible sunscreen finish'),
          },
          {
            id: 14,
            value: 'Tinted Finish',
            order: 2,
            discountPercent: null,
            image: image(7, 'choose-finish.webp', chooseFinishImage, 'Tinted sunscreen finish'),
          },
        ],
      },
    ],
    categories: [cleansers],
  },
]

export interface AnnouncementMessage {
  id: number
  documentId: string
  message: string
  order: number
}

export const announcementMessages: AnnouncementMessage[] = [
  { id: 1, documentId: 'free-delivery', message: 'Free delivery on orders over £50', order: 1 },
  { id: 2, documentId: 'first-order', message: '15% off your first order', order: 2 },
]
