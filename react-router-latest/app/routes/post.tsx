import type { Route } from "./+types/post";

export async function loader({ params }: Route.LoaderArgs) {
  const postId = params.postId;
  return { postId };
}

// option 1 to get params data
export default function Post({ loaderData }: Route.ComponentProps) {
  const postId = loaderData.postId;
  return <div>Post Id: {postId}</div>;
}

// option 2 to get params data
// export default function Post() {
//   const { postId } = useLoaderData();
//   return <div>Post Id: {postId}</div>;
// }

export async function action() {}
