export const IMG_CDN_URL =
  "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_1400,h_1400,c_fill/";

export const BASE_API_URL =
  "https://instafood-server.vercel.app/api/restaurants?";

export const MENU_ITEM_TYPE_KEY =
  "type.googleapis.com/swiggy.presentation.food.v2.ItemCategory";
export const RESTAURANT_TYPE_KEY =
  "type.googleapis.com/swiggy.presentation.food.v2.Restaurant";
export const RESTAURANT_URL =
  "https://instafood-server.vercel.app/api/menu?page-type=REGULAR_MENU&complete-menu=true&";
export let URL = "";
export function setURL(s: string) {
  URL = RESTAURANT_URL + s;
}
