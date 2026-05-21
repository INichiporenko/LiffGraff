import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const INDEXES_TO_DROP = [
    "post_1_user_1",
    "user_1_post_1",
    "comment_1_user_1",
    "post_1",
    "user_1",
    "postId_1_userId_1",
    "commentId_1_userId_1",
    "postId_1",
    "userId_1",
];

async function migrate() {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("MONGO_URI is not set");

    await mongoose.connect(uri);
    const db = mongoose.connection.db!;
    const likes = db.collection("likes");

    const removed = await likes.deleteMany({
        $or: [
            { postId: null, userId: null },
            { post: null, user: null },
            {
                postId: { $exists: false },
                commentId: { $exists: false },
                post: { $exists: false },
                comment: { $exists: false },
            },
        ],
    });
    console.log(`Removed invalid likes: ${removed.deletedCount}`);

    const legacy = await likes
        .find({
            $or: [
                { user: { $exists: true }, userId: { $exists: false } },
                { post: { $exists: true }, postId: { $exists: false } },
            ],
        })
        .toArray();

    for (const doc of legacy) {
        await likes.updateOne(
            { _id: doc._id },
            {
                $set: {
                    ...(doc.user ? { userId: doc.user } : {}),
                    ...(doc.post ? { postId: doc.post } : {}),
                    ...(doc.comment ? { commentId: doc.comment } : {}),
                },
                $unset: { user: "", post: "", comment: "" },
            }
        );
    }
    console.log(`Migrated legacy field names: ${legacy.length}`);

    // Unset null optional fields so partial indexes work correctly.
    await likes.updateMany(
        { postId: null },
        { $unset: { postId: "" } }
    );
    await likes.updateMany(
        { commentId: null },
        { $unset: { commentId: "" } }
    );

    for (const name of INDEXES_TO_DROP) {
        try {
            await likes.dropIndex(name);
            console.log(`Dropped index: ${name}`);
        } catch {
            // missing index
        }
    }

    await likes.createIndex(
        { postId: 1, userId: 1 },
        {
            unique: true,
            name: "postId_1_userId_1_partial",
            partialFilterExpression: { postId: { $exists: true, $type: "objectId" } },
        }
    );
    await likes.createIndex(
        { commentId: 1, userId: 1 },
        {
            unique: true,
            name: "commentId_1_userId_1_partial",
            partialFilterExpression: { commentId: { $exists: true, $type: "objectId" } },
        }
    );

    const after = await likes.indexes();
    console.log("Indexes:", after.map((i) => i.name).join(", "));

    await mongoose.disconnect();
}

migrate().catch((err) => {
    console.error(err);
    process.exit(1);
});
