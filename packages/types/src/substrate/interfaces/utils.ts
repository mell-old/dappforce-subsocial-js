import BN from 'bn.js';
import { SpaceId, PostId, Space, Post, AccountId, ReactionId, SocialAccount } from '.';

export type SubstrateId = SpaceId | PostId | BN;
export type CommonStruct = Space | Post | SocialAccount;
export type AnyAccountId = AccountId | string;
export type AnySpaceId = SpaceId | BN;
export type AnyPostId = PostId | BN;
export type AnyReactionId = ReactionId | BN;
