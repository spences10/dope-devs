import { useState } from 'react'
import sanityClient from '../../sanity-client'

export default function DevPage({ name, description, likes, _id }) {
  const [likeState, setLikes] = useState(likes)

  const addLike = async () => {
    const { likes: newLikes } = await fetch('/api/handle-likes', {
      method: 'POST',
      body: JSON.stringify({ _id }),
    }).then(response => response.json())

    setLikes(newLikes)
  }

  return (
    <>
      <h1>{name}</h1>
      <h3>{description}</h3>
      <button onClick={addLike}>{likeState} likes</button>
    </>
  )
}

export async function getStaticProps({ params }) {
  const slug = params.slug
  const [devs] = await sanityClient.fetch(
    `*[_type == 'dev' && slug.current == '${slug}']{ 
      _id,
      name,
      description,
      likes
    }`
  )
  return { props: { ...devs } }
}

export async function getStaticPaths() {
  const devs = await sanityClient.fetch(
    `*[_type == 'dev']{ 
      'slug': slug.current 
    }`
  )

  return {
    paths: devs.map(({ slug }) => `/dev/${slug}`),
    fallback: false,
  }
}
