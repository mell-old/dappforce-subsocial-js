import { regularPostId, commentIdOnRegularPost, commentIdOnSharedPost, sharedCommentId, sharedPostId, mockRegularPostDataStruct, mockSharedPostDataStruct, mockCommentOnRegularPostDataStruct, mockSharedCommentDataStruct, mockCommentOnSharedPostDataStruct } from './mocks/PostMocks'
import { findSpaces, findPosts, findProfiles  } from './mocks/MocksDB'
import { loadAndSetPostRelatedStructs } from '../src/loadPostStructs'

const methods = {
  findSpaces,
  findPosts,
  findProfiles
}

const opts = { withOwner: true, withSpace: true }

test('Load regular and shared post', async () => {
  const ids = [ regularPostId, sharedPostId ]
  const res = [ mockRegularPostDataStruct, mockSharedPostDataStruct ]
  const posts = await findPosts(ids);
  const results = await loadAndSetPostRelatedStructs(posts, methods, opts)
  console.log('Regular and shared post: ', results)
  expect(results).toEqual(res)
})

test('Load comment on regular and shared post, also shared comment post', async () => {
  const ids = [ commentIdOnRegularPost, commentIdOnSharedPost, sharedCommentId ]
  const res = [ mockCommentOnRegularPostDataStruct, mockCommentOnSharedPostDataStruct,  mockSharedCommentDataStruct ]
  const posts = await findPosts(ids);
  const results = await loadAndSetPostRelatedStructs(posts, methods, opts)
  console.log('Comment and shared comment post: ', results)
  expect(results).toEqual(res)
})