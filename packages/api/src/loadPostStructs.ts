import { AnySpaceId, AnyAccountId } from '@subsocial/types/substrate/interfaces/utils';
import { PostData, PostWithSomeDetails, ProfileData, SpaceData, AnyPostId } from '@subsocial/types'
import { PostId, AccountId, SpaceId } from '@subsocial/types/substrate/interfaces'
import { getPostIdFromExtension } from './utils'
import { nonEmptyStr, isDefined, isEmptyStr } from '@subsocial/utils'
import { CommentExt } from '@subsocial/types/src/substrate/classes';

export type FindStructsFns = {
  findPosts: (ids: AnyPostId[]) => Promise<PostData[]>,
  findSpaces: (ids: AnySpaceId[]) => Promise<SpaceData[]>
  findProfiles: (ids: AnyAccountId[]) => Promise<ProfileData[]>
}

export type PostDetailsOpts = {
  withOwner?: boolean
  withSpace?: boolean
}

async function loadRelatedStructs (posts: PostData[], finders: FindStructsFns, opts?: PostDetailsOpts) {
  const { withSpace, withOwner } = opts || {}
  const { findSpaces, findPosts, findProfiles } = finders

  const ownerByIdMap = new Map<string, ProfileData>()
  const spaceByIdMap = new Map<string, SpaceData>()
  const postByIdMap = new Map<string, PostData>()
  posts.forEach(x => postByIdMap.set(x.struct.id.toString(), x))

  const rootPosts: PostData[] = []
  const extPosts: PostData[] = []

  const rootIds: PostId[] = []
  const extIds: PostId[] = []
  const ownerIds: AccountId[] = []
  const spaceIds: SpaceId[] = []

  // Post id can be either extension or root post
  const rememberPostId = (post: PostData, posts: PostData[], postIds: PostId[]) => {
    const extId = getPostIdFromExtension(post)
    const extIdStr = extId?.toString()
    if (extId && nonEmptyStr(extIdStr)) {
      const currentPost = postByIdMap.get(extIdStr)
      if (currentPost) {
        posts.push(currentPost)
      } else {
        postIds.push(extId)
      }
    }
  }

  // Related id can be either space id or owner id
  function rememberRelatedId<T extends SpaceId | AccountId> (relatedId: T, relatedIds: T[]) {
    if (isDefined(relatedId)) {
      relatedIds.push(relatedId)
    }
  }

  posts.forEach((post) => {
    rememberPostId(post, extPosts, extIds)

    if (withOwner) {
      const ownerId = post.struct.created.account
      rememberRelatedId(ownerId, ownerIds)
    }

    if (withSpace) {
      const spaceId = post.struct.space_id.unwrapOr(undefined)
      spaceId && rememberRelatedId(spaceId, spaceIds)
    }
  })

  const loadedExtPosts = await findPosts(extIds)
  extPosts.push(...loadedExtPosts)
  extPosts.forEach(x => postByIdMap.set(x.struct.id.toString(), x))

  extPosts.forEach((post) => {

    if (withOwner) {
      const ownerId = post.struct.created.account
      ownerIds.push(ownerId)
    }

    if (withSpace) {
      const spaceId = post.struct.space_id.unwrapOr(undefined)
      if (isDefined(spaceId)) {
        spaceIds.push(spaceId)
      } else {
        rememberPostId(post, rootPosts, rootIds)
      }
    }
  })

  const loadedRootPosts = await findPosts(rootIds)
  rootPosts.push(...loadedRootPosts)
  rootPosts.forEach(x => postByIdMap.set(x.struct.id.toString(), x))

  rootPosts.forEach((post) => {
    postByIdMap.set(post.struct.id.toString(), post)
    if (withSpace) {
      const spaceId = post.struct.space_id.unwrapOr(undefined)
      spaceId && rememberRelatedId(spaceId, spaceIds)
    }
  })

  // Load related owners
  if (withOwner) {
    const owners = await findProfiles(ownerIds)

    owners.forEach(owner => {
      const ownerId = owner.profile?.created.account.toString()
      ownerId && ownerByIdMap.set(ownerId, owner)
    })
  }

  // Load related spaces
  if (withSpace) {
    const spaces = await findSpaces(spaceIds)

    spaces.forEach(space => {
      const spaceId = space.struct.id.toString()
      spaceId && spaceByIdMap.set(spaceId, space)
    })
  }

  return {
    postByIdMap,
    spaceByIdMap,
    ownerByIdMap
  }
}

/** Load post structs and related structs like owner profile, space, root post if required. */
export async function loadAndSetPostRelatedStructs (posts: PostData[], finders: FindStructsFns, opts?: PostDetailsOpts): Promise<PostWithSomeDetails[]> {
  const { withSpace, withOwner } = opts || {}
  const {
    spaceByIdMap,
    ownerByIdMap,
    postByIdMap
  } = await loadRelatedStructs(posts, finders, opts)

  const setExtOnPost = (postStruct: PostWithSomeDetails) => {
    const { post } = postStruct
    const extId = getPostIdFromExtension(post)
    const extIdStr = extId?.toString()
    if (!extId || isEmptyStr(extIdStr)) return

    const currentPost = postByIdMap.get(extIdStr)

    if (!currentPost) return
    postStruct.ext = { post: currentPost }
  }

  const setExtAndRootOnPost = (postStruct: PostWithSomeDetails) => {
    setExtOnPost(postStruct)
    const { ext } = postStruct
    if (!ext) return

    const { post: { struct: { extension } } } = ext
    if (!extension.isComment && !(extension.value instanceof CommentExt)) return

    setExtOnPost(ext)
  }

  const setOwnerOnPost = (postStruct: PostWithSomeDetails) => {
    if (!withOwner) return

    const { post, ext } = postStruct
    const ownerId = post.struct.created.account.toString()
    const owner = ownerByIdMap.get(ownerId)
    postStruct.owner = owner

    if (!ext) return

    const extOwnerId = ext.post.struct.created.account.toString()
    ext.owner = extOwnerId === ownerId
      ? owner
      : ownerByIdMap.get(extOwnerId)
  }

  const setSpaceOnPost = (post: PostWithSomeDetails, spaceId?: SpaceId, ext?: PostWithSomeDetails) => {
    if (!withSpace || !spaceId) return

    const space = spaceByIdMap.get(spaceId.toString())
    if (!post.space) {
      post.space = space
    }

    if (ext) {
      ext.space = space
    }
  }

  const postStructs: PostWithSomeDetails[] = []

  posts.forEach(post => {
    const postStruct = { post } as PostWithSomeDetails

    // Set a extension and root post if the post has them:
    setExtAndRootOnPost(postStruct)

    setOwnerOnPost(postStruct)

    const { post: { struct: { space_id } }, ext } = postStruct

    // Set a space if the post has space id:
    setSpaceOnPost(postStruct, space_id.unwrapOr(undefined))

    // Set a space (from extension) on post and its extension if extension has space id:
    const spaceId = ext?.post.struct.space_id.unwrapOr(undefined)
    setSpaceOnPost(postStruct, spaceId, ext)
    if (!spaceId) {
      // Set a space (from root post) on post and its extension if extension does NOT have space id:
      const spaceId = ext?.ext?.post.struct.space_id.unwrapOr(undefined)
      setSpaceOnPost(postStruct, spaceId, ext)
    }

    postStructs.push(postStruct)
  })

  return postStructs
}
