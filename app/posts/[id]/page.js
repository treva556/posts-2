
//app/posts/[id]/page.js
export default function Post({ params }) {
    return <h1>Post ID: {params.id}</h1>;
  }

  