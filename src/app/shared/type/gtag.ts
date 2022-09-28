/**
 * @seehttps://developers.google.com/analytics/devguides/collection/gtagjs/events?hl=ja
 */
export type TGtagDefault = 'general' | 'not_set';

export type TGtagEventValue = number;

export type TGtagEventCategory =
  | TGtagDefault
  | 'method_success'
  | 'method_failed'
  | 'method'
  | 'search_term'
  | 'content_type';

export type TGtagEventAction =
  | TGtagDefault
  | 'sign_up'
  | 'login'
  | 'logout'
  | 'search'
  | 'game_play'
  | 'view_game_detail'
  | 'deposit'
  | 'withdrawal'
  | 'add_payment_info'
  | 'add_to_cart'
  | 'add_to_wishlist'
  | 'begin_checkout'
  | 'checkout_progress'
  | 'generate_lead'
  | 'purchase'
  | 'refund'
  | 'remove_from_cart'
  | 'select_content'
  | 'set_checkout_option'
  | 'share'
  | 'view_item'
  | 'view_item_list'
  | 'view_promotion'
  | 'view_search_results';

export type TGtagEventLabel =
  | TGtagDefault
  | string
  | 'ecommerce'
  | 'engagement';
