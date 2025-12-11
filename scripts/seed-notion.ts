/**
 * Notion Database Seeding Script
 *
 * This script populates the Notion databases with initial trip data
 * Run with: npx tsx scripts/seed-notion.ts
 */

import { Client } from '@notionhq/client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const ITINERARY_DB = process.env.NOTION_ITINERARY_DB!;
const ACTIVITIES_DB = process.env.NOTION_ACTIVITIES_DB!;
const TRAVELINFO_DB = process.env.NOTION_TRAVELINFO_DB!;

// 行程資料
const itineraries = [
  { name: 'Day 1 - 1/28 \u53f0\u5317\u2192\u9999\u6e2f\u2192\u6df1\u5733', date: '2026-01-28', dayNumber: 1, city: '\u6df1\u5733' },
  { name: 'Day 2 - 1/29 \u6df1\u5733\u83ef\u5f37\u5317\u6df1\u5ea6\u904a', date: '2026-01-29', dayNumber: 2, city: '\u6df1\u5733' },
  { name: 'Day 3 - 1/30 \u6df1\u5733\u2192\u9999\u6e2f', date: '2026-01-30', dayNumber: 3, city: '\u9999\u6e2f' },
  { name: 'Day 4 - 1/31 \u9999\u6e2f\u7d93\u5178\u4e00\u65e5\u904a', date: '2026-01-31', dayNumber: 4, city: '\u9999\u6e2f' },
  { name: 'Day 5 - 2/1 \u9999\u6e2f\u2192\u53f0\u5317', date: '2026-02-01', dayNumber: 5, city: '\u9999\u6e2f' },
];

// Day 1 活動
const day1Activities = [
  {
    name: '\u53f0\u5317\u6843\u5712\u6a5f\u5834\u8d77\u98db',
    time: '17:40',
    type: '\u4ea4\u901a',
    location: '\u53f0\u5317\u6843\u5712\u570b\u969b\u6a5f\u5834',
    coordinates: '121.2332,25.0777',
    description: '\u822a\u73ed UO115',
    tips: '\u63d0\u524d2\u5c0f\u6642\u5230\u6a5f\u5834',
    price: '',
    order: 1,
  },
  {
    name: '\u62b5\u9054\u9999\u6e2f\u570b\u969b\u6a5f\u5834',
    time: '19:40',
    type: '\u4ea4\u901a',
    location: '\u9999\u6e2f\u570b\u969b\u6a5f\u5834',
    coordinates: '113.9145,22.3080',
    description: '\u4e0b\u6a5f\u3001\u5165\u5883\u3001\u9818\u884c\u674e',
    tips: '\u9810\u7559 35 \u5206\u9418',
    price: '',
    order: 2,
  },
  {
    name: '\u6a5f\u5834\u5feb\u7dda\u5230\u897f\u4e5d\u9f8d\u7ad9',
    time: '20:15-20:45',
    type: '\u4ea4\u901a',
    location: '\u9999\u6e2f\u6a5f\u5834\u5feb\u7dda',
    coordinates: '113.9145,22.3080',
    description: '\u8eca\u7a0b\u7d0430\u5206\u9418',
    tips: '',
    price: 'HK$115',
    order: 3,
  },
  {
    name: '\u897f\u4e5d\u9f8d\u7ad9\u904e\u95dc\u3001\u5019\u8eca',
    time: '20:45-21:45',
    type: '\u4ea4\u901a',
    location: '\u9999\u6e2f\u897f\u4e5d\u9f8d\u7ad9',
    coordinates: '114.1619,22.3033',
    description: '\u53d6\u7968\u3001\u904e\u95dc\u3001\u5019\u8eca\uff0c\u9810\u75591\u5c0f\u6642',
    tips: '',
    price: '',
    order: 4,
  },
  {
    name: '\u9ad8\u9435\u5f80\u6df1\u5733\u798f\u7530\u7ad9',
    time: '22:14-22:32',
    type: '\u4ea4\u901a',
    location: '\u6df1\u5733\u798f\u7530\u7ad9',
    coordinates: '114.0550,22.5350',
    description: '\u8eca\u7a0b14\u5206\u9418',
    tips: '\u63d0\u524d\u8cfc\u7968',
    price: 'HK$68-80',
    order: 5,
  },
  {
    name: '\u5730\u9435\u52301\u865f\u7dda\u5230\u83ef\u5f37\u5317\u7ad9',
    time: '22:32-22:40',
    type: '\u4ea4\u901a',
    location: '\u6df1\u5733\u5730\u9435',
    coordinates: '114.0847,22.5474',
    description: '2\u7ad9\uff0c\u7d045\u5206\u9418',
    tips: '',
    price: '\uffe52',
    order: 6,
  },
  {
    name: '\u51f1\u5b63\u661f\u7554\u9152\u5e97 Check-in',
    time: '23:00',
    type: '\u4f4f\u5bbf',
    location: '\u83ef\u5f37\u5317\u8857\u9053\u632f\u83ef\u8def21\u865f',
    coordinates: '114.0847,22.5474',
    description: '\u6df1\u57332\u665a\u4f4f\u5bbf',
    tips: '',
    price: '',
    order: 7,
  },
  {
    name: '\u9644\u8fd1\u5403\u5bb5\u591c',
    time: '23:00-00:00',
    type: '\u9910\u98f2',
    location: '\u83ef\u5f37\u5317\u7f8e\u98df\u57ce',
    coordinates: '114.0860,22.5480',
    description: '\u83ef\u5f37\u5317\u7f8e\u98df\u57ce\u6216\u4fbf\u5229\u5e97',
    tips: '\u65e9\u9ede\u4f11\u606f',
    price: '',
    order: 8,
  },
];

// Day 2 活動
const day2Activities = [
  {
    name: '\u9152\u5e97\u65e9\u9910\u6216\u9644\u8fd1\u8336\u9910\u5ef3',
    time: '09:00-09:30',
    type: '\u9910\u98f2',
    location: '\u83ef\u5f37\u5317',
    coordinates: '114.0847,22.5474',
    description: '',
    tips: '',
    price: '',
    order: 1,
  },
  {
    name: 'SEG\u96fb\u5b50\u5e02\u5834\uff08\u8cfd\u683c\u5ee3\u5834\uff09',
    time: '09:30-12:30',
    type: '\u666f\u9ede',
    location: '\u6df1\u5733\u8cfd\u683c\u5ee3\u5834',
    coordinates: '114.0847,22.5474',
    description: '9\u5c64\u6a13\uff0c\u6700\u5927\u6700\u6709\u540d\u7684\u96fb\u5b50\u5e02\u5834\uff0c\u624b\u6a5f\u914d\u4ef6\u3001\u96fb\u8166\u96f6\u4ef6\u3001\u6578\u78bc\u7522\u54c1',
    tips: '\u8a18\u5f97\u6bba\u50f9\uff01\u958b\u50f9\u901a\u5e38\u53ef\u4ee5\u62536-7\u6298\uff0c\u591a\u6bd4\u50f9\u4e0d\u8981\u7b2c\u4e00\u5bb6\u5c31\u8cb7',
    price: '',
    order: 2,
    mustBuy: ['\u624b\u6a5f\u914d\u4ef6', '\u96fb\u8166\u96f6\u4ef6', '\u6578\u78bc\u7522\u54c1'],
  },
  {
    name: '\u5348\u9910',
    time: '12:30-14:00',
    type: '\u9910\u98f2',
    location: '\u83ef\u5f37\u5317',
    coordinates: '114.0847,22.5474',
    description: '\u63a8\u85a6\uff1a\u9ede\u90fd\u5fb7\u3001\u6d77\u5e95\u6488\u3001\u6f6e\u6c55\u725b\u8089\u706b\u934b\u3001\u6930\u5b50\u96de\u706b\u934b',
    tips: '',
    price: '\uffe5150-200',
    order: 3,
    mustEat: ['\u9ede\u90fd\u5fb7', '\u6d77\u5e95\u6488', '\u6f6e\u6c55\u725b\u8089\u706b\u934b'],
  },
  {
    name: '\u83ef\u50d1\u57ce\u5275\u610f\u5712 OCT-LOFT',
    time: '14:00-17:00',
    type: '\u666f\u9ede',
    location: '\u6df1\u5733\u83ef\u50d1\u57ce\u5275\u610f\u5712',
    coordinates: '113.9847,22.5411',
    description: '\u6587\u9752\u62cd\u7167\u8056\u5730\uff0c\u985e\u4f3c\u53f0\u5317\u83ef\u5c71\u6587\u5275\u5712\u5340',
    tips: '\u5730\u9435\u7d0415\u5206\u9418\u53ef\u5230',
    price: '\u514d\u8cbb',
    order: 4,
  },
  {
    name: '\u665a\u9910',
    time: '18:00-20:00',
    type: '\u9910\u98f2',
    location: '\u83ef\u5f37\u5317',
    coordinates: '114.0847,22.5474',
    description: '\u63a8\u85a6\uff1a\u8001\u8857\u7f8e\u98df\u8857\u3001\u7fe0\u83ef\u9910\u5ef3\u3001\u63a2\u9b5a\u70e4\u9b5a',
    tips: '\u8a66\u8a66\u559c\u8336/\u5948\u96ea\u7684\u8336\uff08\u6df1\u5733\u767c\u8de1\u7684\u624b\u6416\u98f2\uff09',
    price: '\uffe5100-150',
    order: 5,
    mustEat: ['\u559c\u8336', '\u5948\u96ea\u7684\u8336'],
  },
  {
    name: '\u6df1\u5733\u7063\u516c\u5712\u770b\u591c\u666f',
    time: '20:00-21:00',
    type: '\u666f\u9ede',
    location: '\u6df1\u5733\u7063\u516c\u5712',
    coordinates: '113.9543,22.5194',
    description: '\u6d77\u6ff1\u9577\u5eca\uff0c\u53ef\u9060\u7730\u9999\u6e2f',
    tips: '\u6216\u56de\u9152\u5e97\u9644\u8fd1\u901b\u8857',
    price: '\u514d\u8cbb',
    order: 6,
  },
];

// Day 3 活動
const day3Activities = [
  {
    name: '\u83ef\u5f37\u5317\u6700\u5f8c\u63a1\u8cfc',
    time: '09:00-11:00',
    type: '\u8cfc\u7269',
    location: '\u83ef\u5f37\u5317\u96fb\u5b50\u5e02\u5834',
    coordinates: '114.0847,22.5474',
    description: '\u88dc\u8cb7\u907a\u6f0f\u7684\u6771\u897f\uff0c\u6700\u5f8c\u6bd4\u50f9',
    tips: '',
    price: '',
    order: 1,
  },
  {
    name: '\u9000\u623f\u3001\u6574\u7406\u884c\u674e',
    time: '11:00-12:00',
    type: '\u4f4f\u5bbf',
    location: '\u51f1\u5b63\u661f\u7554\u9152\u5e97',
    coordinates: '114.0847,22.5474',
    description: '',
    tips: '',
    price: '',
    order: 2,
  },
  {
    name: '\u5348\u9910',
    time: '12:00-13:00',
    type: '\u9910\u98f2',
    location: '\u9152\u5e97\u9644\u8fd1',
    coordinates: '114.0847,22.5474',
    description: '',
    tips: '',
    price: '',
    order: 3,
  },
  {
    name: '\u6df1\u5733\u2192\u9999\u6e2f\uff08\u904e\u95dc\uff09',
    time: '13:00-15:00',
    type: '\u4ea4\u901a',
    location: '\u7f85\u6e56/\u798f\u7530\u53e3\u5cb8',
    coordinates: '114.1113,22.5332',
    description: '\u83ef\u5f37\u5317\u7ad9\u5730\u9435\u21921\u865f\u7dda\u5230\u7f85\u6e56\u7ad9\u21922\u904e\u95dc\u2192\u6e2f\u9435\u6771\u9435\u7dda\u5230\u65fa\u89d2\u6771\u7ad9\u2192\u8f49\u89c0\u5858\u7dda1\u7ad9\u5230\u65fa\u89d2\u7ad9',
    tips: '\u904e\u95dc\u9810\u75591-1.5\u5c0f\u6642',
    price: '\uffe530 + HK$70',
    order: 4,
  },
  {
    name: '\u91d1\u5821\u8cd3\u9928 Check-in',
    time: '15:00-15:30',
    type: '\u4f4f\u5bbf',
    location: '\u65fa\u89d2\u5f4c\u6566\u9053607\u865f\u65b0\u8208\u5927\u53c821\u6a132108\u5ba4',
    coordinates: '114.1694,22.3193',
    description: '\u9999\u6e2f2\u665a\u4f4f\u5bbf',
    tips: '\u653e\u884c\u674e\u3001\u4f11\u606f',
    price: '',
    order: 5,
  },
  {
    name: '\u65fa\u89d2\u5468\u908a\u901b\u8857',
    time: '15:30-18:00',
    type: '\u8cfc\u7269',
    location: '\u65fa\u89d2',
    coordinates: '114.1694,22.3193',
    description: '\u5973\u4eba\u8857\u3001\u6ce2\u978b\u8857\u3001\u6717\u8c6a\u574a\u3001\u65fa\u89d2\u4e2d\u5fc3\u3001\u65b0\u4e16\u7d00\u5ee3\u5834\u3001\u897f\u6d0b\u83dc\u8857',
    tips: '',
    price: '',
    order: 6,
    mustBuy: ['\u7403\u978b', '\u904b\u52d5\u7528\u54c1'],
  },
  {
    name: '\u665a\u9910',
    time: '18:00-19:30',
    type: '\u9910\u98f2',
    location: '\u65fa\u89d2',
    coordinates: '114.1694,22.3193',
    description: '\u63a8\u85a6\uff1a\u4e5d\u8a18\u725b\u8169\u3001\u862d\u82b3\u5712\u3001\u5bcc\u8a18\u7ca5\u54c1\u3001\u6fb3\u6d32\u725b\u5976\u516c\u53f8',
    tips: '\u4e5d\u8a18\u725b\u8169\u8981\u6392\u968a',
    price: 'HK$100-150',
    order: 7,
    mustEat: ['\u4e5d\u8a18\u725b\u8169', '\u862d\u82b3\u5712\u7d72\u896a\u5976\u8336'],
  },
  {
    name: '\u5c16\u6c99\u5480\u7dad\u6e2f\u591c\u666f',
    time: '19:30-21:30',
    type: '\u666f\u9ede',
    location: '\u5c16\u6c99\u5480\u661f\u5149\u5927\u9053',
    coordinates: '114.1722,22.2934',
    description: '\u661f\u5149\u5927\u9053\u3001\u7dad\u591a\u5229\u4e9e\u6e2f\u300120:00\u5e7b\u5f69\u8a60\u9999\u6c5f\u71c8\u5149\u79c0\u3001\u5929\u661f\u5c0f\u8f2a',
    tips: '\u5929\u661f\u5c0f\u8f2aHK$3.4\uff0c\u8d85\u4fbf\u5b9c',
    price: 'HK$3.4',
    order: 8,
  },
  {
    name: '\u65fa\u89d2\u5bb5\u591c',
    time: '22:00',
    type: '\u9910\u98f2',
    location: '\u65fa\u89d2',
    coordinates: '114.1694,22.3193',
    description: '\u6587\u8f1d\u58a8\u9b5a\u4e38\u3001\u5abd\u54aa\u96de\u86cb\u4ed4\u3001\u5bcc\u8a18\u7ca5\u54c1',
    tips: '24\u5c0f\u6642\u71df\u696d\u9910\u5ef3\u5f88\u591a',
    price: '',
    order: 9,
    mustEat: ['\u96de\u86cb\u4ed4', '\u58a8\u9b5a\u4e38'],
  },
];

// Day 4 活動
const day4Activities = [
  {
    name: '\u65e9\u9910',
    time: '09:00-10:00',
    type: '\u9910\u98f2',
    location: '\u65fa\u89d2',
    coordinates: '114.1694,22.3193',
    description: '\u63a8\u85a6\uff1a\u6fb3\u6d32\u725b\u5976\u516c\u53f8\u3001\u7fe0\u83ef\u9910\u5ef3',
    tips: '\u6fb3\u6d32\u725b\u5976\u516c\u53f8\u8981\u6392\u968a\u4f46\u5f88\u503c\u5f97',
    price: 'HK$50-80',
    order: 1,
    mustEat: ['\u7092\u86cb\u591a\u58eb'],
  },
  {
    name: '\u4e2d\u74b0\u5340\u57df\u6f2b\u6b65',
    time: '10:00-12:30',
    type: '\u666f\u9ede',
    location: '\u4e2d\u74b0',
    coordinates: '114.1588,22.2812',
    description: '\u4e2d\u74b0\u8857\u5e02\u3001\u77f3\u677f\u8857\u3001\u862d\u6842\u574a\u3001\u4e2d\u74b0\u6469\u5929\u8f2a\u3001\u9999\u6e2f\u6469\u5929\u8f2a\u78bc\u982d\u770b\u6d77',
    tips: '\u77f3\u677f\u8857\u662f\u62cd\u7167\u6253\u5361\u8056\u5730',
    price: '',
    order: 2,
  },
  {
    name: '\u5348\u9910',
    time: '12:30-14:00',
    type: '\u9910\u98f2',
    location: '\u4e2d\u74b0',
    coordinates: '114.1588,22.2812',
    description: '\u63a8\u85a6\uff1a\u93de\u8a18\u9152\u5bb6\u3001\u84ee\u9999\u6a13\u3001\u862d\u82b3\u5712\u3001IFC\u5546\u5834\u5404\u5f0f\u9910\u5ef3',
    tips: '\u93de\u8a18\u9152\u5bb6\u662f\u7c73\u5176\u6797\u71d2\u9d5d',
    price: 'HK$100-200',
    order: 3,
    mustEat: ['\u93de\u8a18\u71d2\u9d5d'],
  },
  {
    name: '\u9285\u9591\u7063\u8cfc\u7269',
    time: '14:00-18:00',
    type: '\u8cfc\u7269',
    location: '\u9285\u9591\u7063',
    coordinates: '114.1849,22.2783',
    description: '\u6642\u4ee3\u5ee3\u5834\u3001SOGO\u767e\u8ca8\u3001\u5e0c\u6148\u5ee3\u5834\u3001\u5229\u821e\u53f0\u5ee3\u5834',
    tips: '',
    price: '',
    order: 4,
  },
  {
    name: '\u665a\u9910',
    time: '18:00-19:30',
    type: '\u9910\u98f2',
    location: '\u9285\u9591\u7063',
    coordinates: '114.1849,22.2783',
    description: '\u63a8\u85a6\uff1a\u4f55\u6d2a\u8a18\u3001\u4e00\u862d\u62c9\u9eb5\u3001\u6dfb\u597d\u904b',
    tips: '\u6dfb\u597d\u904b\u662f\u7c73\u5176\u6797\u9ede\u5fc3',
    price: 'HK$100-150',
    order: 5,
    mustEat: ['\u6dfb\u597d\u904b\u9ede\u5fc3'],
  },
  {
    name: '\u592a\u5e73\u5c71\u9802\u770b\u591c\u666f',
    time: '19:30-21:30',
    type: '\u666f\u9ede',
    location: '\u592a\u5e73\u5c71\u9802',
    coordinates: '114.1456,22.2759',
    description: '\u5f9e\u9285\u9591\u7063\u5730\u9435\u5230\u4e2d\u74b0\u7ad9\u2192\u8f49\u5c71\u9802\u7e9c\u8eca\u4e0a\u592a\u5e73\u5c71\u2192\u51cc\u9704\u95a3\u770b\u591c\u666f\u2192\u5c71\u9802\u5ee3\u5834',
    tips: '\u5c71\u9802\u7e9c\u8eca\u4f86\u56deHK$88',
    price: 'HK$88',
    order: 6,
  },
  {
    name: '\u56de\u65fa\u89d2\u5bb5\u591c\u3001\u901b\u8857',
    time: '22:00',
    type: '\u9910\u98f2',
    location: '\u65fa\u89d2',
    coordinates: '114.1694,22.3193',
    description: '',
    tips: '',
    price: '',
    order: 7,
  },
];

// Day 5 活動
const day5Activities = [
  {
    name: '\u7761\u5230\u81ea\u7136\u9192\u3001\u9000\u623f',
    time: '09:00-10:00',
    type: '\u4f4f\u5bbf',
    location: '\u91d1\u5821\u8cd3\u9928',
    coordinates: '114.1694,22.3193',
    description: '\u53ef\u5bc4\u653e\u884c\u674e\u5728\u6ac3\u53f0',
    tips: '',
    price: '',
    order: 1,
  },
  {
    name: '\u6700\u5f8c\u63a1\u8cfc\u4f34\u624b\u79ae',
    time: '10:00-12:00',
    type: '\u8cfc\u7269',
    location: '\u65fa\u89d2\u5f4c\u6566\u9053',
    coordinates: '114.1694,22.3193',
    description: '\u73cd\u59ae\u66f2\u5947\u3001\u5947\u83ef\u9905\u5bb6\u3001\u9245\u8a18\u624b\u4fe1\u3001\u4f4d\u5143\u5802\u3001\u5c48\u81e3\u6c0f/\u842c\u5be7',
    tips: '\u73cd\u59ae\u66f2\u5947\u8981\u6392\u968a\uff0c\u5efa\u8b70\u65e9\u9ede\u53bb',
    price: '',
    order: 2,
    mustBuy: ['\u73cd\u59ae\u66f2\u5947', '\u5947\u83ef\u9905\u5bb6', '\u9245\u8a18\u624b\u4fe1'],
  },
  {
    name: '\u5348\u9910',
    time: '12:00-13:00',
    type: '\u9910\u98f2',
    location: '\u65fa\u89d2\u6216\u6a5f\u5834',
    coordinates: '114.1694,22.3193',
    description: '\u65fa\u89d2\u96a8\u4fbf\u5403\u6216\u76f4\u63a5\u53bb\u6a5f\u5834\u5403',
    tips: '',
    price: '',
    order: 3,
  },
  {
    name: '\u56de\u91d1\u5821\u8cd3\u9928\u62ff\u884c\u674e',
    time: '13:00-13:10',
    type: '\u4f4f\u5bbf',
    location: '\u91d1\u5821\u8cd3\u9928',
    coordinates: '114.1694,22.3193',
    description: '',
    tips: '',
    price: '',
    order: 4,
  },
  {
    name: 'A21\u5df4\u58eb\u5f80\u6a5f\u5834',
    time: '13:10-14:30',
    type: '\u4ea4\u901a',
    location: '\u5f4c\u6566\u9053\u5df4\u58eb\u7ad9',
    coordinates: '114.1694,22.3193',
    description: '\u8eca\u7a0b50-60\u5206\u9418\uff0c\u73ed\u6b6110-20\u5206\u9418\u4e00\u73ed',
    tips: '',
    price: 'HK$33',
    order: 5,
  },
  {
    name: '\u62b5\u9054\u9999\u6e2f\u570b\u969b\u6a5f\u5834',
    time: '14:30',
    type: '\u4ea4\u901a',
    location: '\u9999\u6e2f\u570b\u969b\u6a5f\u5834',
    coordinates: '113.9145,22.3080',
    description: '',
    tips: '',
    price: '',
    order: 6,
  },
  {
    name: '\u8fa6\u7406\u767b\u6a5f\u3001\u901b\u514d\u7a05\u5e97',
    time: '14:30-17:00',
    type: '\u8cfc\u7269',
    location: '\u9999\u6e2f\u570b\u969b\u6a5f\u5834',
    coordinates: '113.9145,22.3080',
    description: '\u63d0\u524d3\u5c0f\u6642\u8fa6\u7406\u767b\u6a5f\u624b\u7e8c\uff0c\u901b\u514d\u7a05\u5e97\u3001\u6a5f\u5834\u7f8e\u98df\u5ee3\u5834',
    tips: '',
    price: '',
    order: 7,
  },
  {
    name: '\u8d77\u98db\u56de\u53f0\u5317',
    time: '20:10',
    type: '\u4ea4\u901a',
    location: '\u9999\u6e2f\u570b\u969b\u6a5f\u5834',
    coordinates: '113.9145,22.3080',
    description: '\u822a\u73ed HB706',
    tips: '',
    price: '',
    order: 8,
  },
  {
    name: '\u62b5\u9054\u53f0\u5317\u6843\u5712\u6a5f\u5834',
    time: '22:15',
    type: '\u4ea4\u901a',
    location: '\u53f0\u5317\u6843\u5712\u570b\u969b\u6a5f\u5834',
    coordinates: '121.2332,25.0777',
    description: '\u5e73\u5b89\u6b78\u4f86\uff01',
    tips: '',
    price: '',
    order: 9,
  },
];

async function createItinerary(data: typeof itineraries[0]) {
  const response = await notion.pages.create({
    parent: { database_id: ITINERARY_DB },
    properties: {
      Name: { title: [{ text: { content: data.name } }] },
      Date: { date: { start: data.date } },
      DayNumber: { number: data.dayNumber },
      City: { select: { name: data.city } },
    },
  });
  console.log(`Created itinerary: ${data.name}`);
  return response.id;
}

async function createActivity(dayId: string, data: typeof day1Activities[0] & { mustEat?: string[]; mustBuy?: string[] }) {
  await notion.pages.create({
    parent: { database_id: ACTIVITIES_DB },
    properties: {
      Name: { title: [{ text: { content: data.name } }] },
      Day: { relation: [{ id: dayId }] },
      Time: { rich_text: [{ text: { content: data.time } }] },
      Type: { select: { name: data.type } },
      Location: { rich_text: [{ text: { content: data.location } }] },
      Coordinates: { rich_text: [{ text: { content: data.coordinates } }] },
      Description: { rich_text: [{ text: { content: data.description } }] },
      Tips: { rich_text: [{ text: { content: data.tips } }] },
      Price: { rich_text: [{ text: { content: data.price } }] },
      Order: { number: data.order },
      ...(data.mustEat ? { MustEat: { multi_select: data.mustEat.map(name => ({ name })) } } : {}),
      ...(data.mustBuy ? { MustBuy: { multi_select: data.mustBuy.map(name => ({ name })) } } : {}),
    },
  });
  console.log(`  Created activity: ${data.name}`);
}

async function main() {
  console.log('Starting Notion database seeding...\n');

  // Create itineraries and activities
  const dayIds: string[] = [];

  for (const itinerary of itineraries) {
    const id = await createItinerary(itinerary);
    dayIds.push(id);
  }

  console.log('\nCreating activities...\n');

  // Day 1
  console.log('Day 1 activities:');
  for (const activity of day1Activities) {
    await createActivity(dayIds[0], activity);
  }

  // Day 2
  console.log('Day 2 activities:');
  for (const activity of day2Activities) {
    await createActivity(dayIds[1], activity);
  }

  // Day 3
  console.log('Day 3 activities:');
  for (const activity of day3Activities) {
    await createActivity(dayIds[2], activity);
  }

  // Day 4
  console.log('Day 4 activities:');
  for (const activity of day4Activities) {
    await createActivity(dayIds[3], activity);
  }

  // Day 5
  console.log('Day 5 activities:');
  for (const activity of day5Activities) {
    await createActivity(dayIds[4], activity);
  }

  console.log('\n\u2705 Notion database seeding completed!');
}

main().catch(console.error);
