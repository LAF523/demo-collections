// 判断移动端设备的屏幕宽度阈值
export const MOBILE_WIDTH = 375;
// 移动端navigation 补充字段
export const ALL_CATEGORY_ITEM = {
  id: 'all',
  name: '全部'
};
export const THEME_DARK = 'dark';
export const THEME_LIGHT = 'light';
export const THEME_SYSTEMS = 'systems';
// nar初始化数据,放防止第一次加载时闪动
export const INT_CATEGORYS = [
  ALL_CATEGORY_ITEM,
  {
    id: 'web_app_icon',
    name: 'UI/UX',
    col: 1,
    urlname: 'web_app_icon'
  },
  {
    id: 'design',
    name: '平面',
    col: 1,
    urlname: 'design'
  },
  {
    id: 'illustration',
    name: '插画/漫画',
    col: 1,
    urlname: 'illustration'
  },
  {
    id: 'photography',
    name: '摄影',
    col: 2,
    urlname: 'photography'
  },
  {
    id: 'games',
    name: '游戏',
    urlname: 'games'
  },
  {
    id: 'anime',
    name: '动漫',
    urlname: 'anime'
  },
  {
    id: 'industrial_design',
    name: '工业设计',
    col: 2,
    urlname: 'industrial_design'
  },
  {
    id: 'architecture',
    name: '建筑设计',
    urlname: 'architecture'
  },
  {
    id: 'art',
    name: '人文艺术',
    urlname: 'art'
  },
  {
    id: 'home',
    name: '家居/家装',
    col: 1,
    urlname: 'home'
  },
  {
    id: 'apparel',
    name: '女装/搭配',
    col: 1,
    urlname: 'apparel'
  },
  {
    id: 'men',
    name: '男士/风尚',
    col: 2,
    urlname: 'men'
  },
  {
    id: 'modeling_hair',
    name: '造型/美妆',
    urlname: 'modeling_hair'
  },
  {
    id: 'diy_crafts',
    name: '手工/布艺',
    urlname: 'diy_crafts'
  },
  {
    id: 'food_drink',
    name: '美食',
    urlname: 'food_drink'
  },
  {
    id: 'travel_places',
    name: '旅行',
    urlname: 'travel_places'
  }
];

export const FEEDBACK_URL = 'https://txc.qq.com/products/660090';
