import { Space, Post, SocialAccount, Profile } from '../substrate/interfaces';
import { CommonContent, SpaceContent, PostContent, CommentContent, ProfileContent } from '../offchain'
import { CommonStruct } from '../substrate';

export type CommonData<S extends CommonStruct, C extends CommonContent> = {
  struct: S
  content?: C
}

export type SpaceData = CommonData<Space, SpaceContent>
export type PostData = CommonData<Post, PostContent>
export type CommentData = CommonData<Post, CommentContent>
export type ProfileData = CommonData<SocialAccount, ProfileContent> & {
  profile?: Profile
}

export type AnySubsocialData = SpaceData | PostData | CommentData | ProfileData;

export type PostWithSomeDetails = {
  post: PostData
  ext?: Exclude<PostWithSomeDetails, 'ext'>
  owner?: ProfileData
  space?: SpaceData
}

export type PostWithOwner = Exclude<PostWithSomeDetails, 'owner'> & {
  owner: ProfileData
}

export type PostWithSpace = Exclude<PostWithSomeDetails, 'space'> & {
  space: SpaceData
}

export type PostWithAllDetails = PostWithOwner & PostWithSpace
