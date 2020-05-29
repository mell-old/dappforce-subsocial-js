// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

import { Enum, Option, Struct, Vec } from '@polkadot/types/codec';
import { Text, bool, i32, u16, u32, u64 } from '@polkadot/types/primitive';
import { AccountId, BlockNumber, Moment } from '@subsocial/types/substrate/interfaces/runtime';

/** @name CommentExt */
export interface CommentExt extends Struct {
  readonly parent_id: Option<PostId>;
  readonly root_post_id: PostId;
}

/** @name IpfsHash */
export interface IpfsHash extends Text {}

/** @name OptionVecAccountId */
export interface OptionVecAccountId extends Option<Vec<AccountId>> {}

/** @name Post */
export interface Post extends Struct {
  readonly id: PostId;
  readonly created: WhoAndWhen;
  readonly updated: Option<WhoAndWhen>;
  readonly hidden: bool;
  readonly space_id: Option<SpaceId>;
  readonly extension: PostExtension;
  readonly ipfs_hash: IpfsHash;
  readonly edit_history: Vec<PostHistoryRecord>;
  readonly direct_replies_count: u16;
  readonly total_replies_count: u32;
  readonly shares_count: u16;
  readonly upvotes_count: u16;
  readonly downvotes_count: u16;
  readonly score: i32;
}

/** @name PostExtension */
export interface PostExtension extends Enum {
  readonly isRegularPost: boolean;
  readonly isComment: boolean;
  readonly asComment: CommentExt;
  readonly isSharedPost: boolean;
  readonly asSharedPost: PostId;
}

/** @name PostHistoryRecord */
export interface PostHistoryRecord extends Struct {
  readonly edited: WhoAndWhen;
  readonly old_data: PostUpdate;
}

/** @name PostId */
export interface PostId extends u64 {}

/** @name PostUpdate */
export interface PostUpdate extends Struct {
  readonly space_id: Option<SpaceId>;
  readonly ipfs_hash: Option<IpfsHash>;
  readonly hidden: Option<bool>;
}

/** @name Profile */
export interface Profile extends Struct {
  readonly created: WhoAndWhen;
  readonly updated: Option<WhoAndWhen>;
  readonly username: Text;
  readonly ipfs_hash: IpfsHash;
  readonly edit_history: Vec<ProfileHistoryRecord>;
}

/** @name ProfileHistoryRecord */
export interface ProfileHistoryRecord extends Struct {
  readonly edited: WhoAndWhen;
  readonly old_data: ProfileUpdate;
}

/** @name ProfileUpdate */
export interface ProfileUpdate extends Struct {
  readonly username: Option<Text>;
  readonly ipfs_hash: Option<IpfsHash>;
}

/** @name Reaction */
export interface Reaction extends Struct {
  readonly id: ReactionId;
  readonly created: WhoAndWhen;
  readonly updated: Option<WhoAndWhen>;
  readonly kind: ReactionKind;
}

/** @name ReactionId */
export interface ReactionId extends u64 {}

/** @name ReactionKind */
export interface ReactionKind extends Enum {
  readonly isUpvote: boolean;
  readonly isDownvote: boolean;
}

/** @name ScoringAction */
export interface ScoringAction extends Enum {
  readonly isUpvotePost: boolean;
  readonly isDownvotePost: boolean;
  readonly isSharePost: boolean;
  readonly isCreateComment: boolean;
  readonly isUpvoteComment: boolean;
  readonly isDownvoteComment: boolean;
  readonly isShareComment: boolean;
  readonly isFollowSpace: boolean;
  readonly isFollowAccount: boolean;
}

/** @name SocialAccount */
export interface SocialAccount extends Struct {
  readonly followers_count: u32;
  readonly following_accounts_count: u16;
  readonly following_spaces_count: u16;
  readonly reputation: u32;
  readonly profile: Option<Profile>;
}

/** @name Space */
export interface Space extends Struct {
  readonly id: SpaceId;
  readonly created: WhoAndWhen;
  readonly updated: Option<WhoAndWhen>;
  readonly hidden: bool;
  readonly owner: AccountId;
  readonly handle: Option<Text>;
  readonly ipfs_hash: IpfsHash;
  readonly posts_count: u16;
  readonly followers_count: u32;
  readonly edit_history: Vec<SpaceHistoryRecord>;
  readonly score: i32;
}

/** @name SpaceHistoryRecord */
export interface SpaceHistoryRecord extends Struct {
  readonly edited: WhoAndWhen;
  readonly old_data: SpaceUpdate;
}

/** @name SpaceId */
export interface SpaceId extends u64 {}

/** @name SpaceUpdate */
export interface SpaceUpdate extends Struct {
  readonly handle: Option<Option<Text>>;
  readonly ipfs_hash: Option<IpfsHash>;
  readonly hidden: Option<bool>;
}

/** @name WhoAndWhen */
export interface WhoAndWhen extends Struct {
  readonly account: AccountId;
  readonly block: BlockNumber;
  readonly time: Moment;
}

export type PHANTOM_SUBSOCIAL = 'subsocial';
