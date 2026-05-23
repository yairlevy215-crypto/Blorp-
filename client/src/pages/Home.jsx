import { useCallback } from 'react'
import PostComposer from '../components/Posts/PostComposer'
import Feed from '../components/Posts/Feed'

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto">
      <PostComposer />
      <Feed />
    </div>
  )
}
