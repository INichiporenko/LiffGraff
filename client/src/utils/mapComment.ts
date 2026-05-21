import { Comment } from "../store/types/instanceTypes.ts";

type CommentAuthorPayload =
    | string
    | {
          _id?: string;
          username?: string;
          profile_image?: string;
      };

type CommentPayload = {
    _id: string;
    content: string;
    createdAt?: string | Date;
    like_count?: number;
    likes?: Comment["likes"];
    post?: string;
    author?: CommentAuthorPayload;
};

export const mapCommentFromApi = (raw: CommentPayload): Comment => {
    const authorPayload = raw.author;

    const author =
        typeof authorPayload === "object" && authorPayload !== null
            ? {
                  _id: String(authorPayload._id ?? ""),
                  username: String(authorPayload.username ?? ""),
                  profile_image: String(authorPayload.profile_image ?? ""),
              }
            : {
                  _id: String(authorPayload ?? ""),
                  username: "",
                  profile_image: "",
              };

    return {
        _id: String(raw._id),
        content: String(raw.content ?? ""),
        createdAt: raw.createdAt ? new Date(raw.createdAt) : new Date(),
        like_count: raw.like_count ?? 0,
        likes: raw.likes ?? [],
        postId: String(raw.post ?? ""),
        author,
    };
};
