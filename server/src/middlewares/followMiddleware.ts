import {Request, Response, NextFunction} from "express";
import User, {UserType} from "../db/models/User";

export const ifFollowed = async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.params;
    if (!username || !req.user) {
        res.status(400).send('Username of follower and following is required');
        return;
    }

    const profile: UserType | null = await User.findOne({username});
    const user: UserType | null = await User.findById(req.user.id);
    if (!profile || !user) {
        res.status(404).send('User not found');
        return;
    }

    (req as any).followed = profile.followers.includes(user._id);
    (req as any).userProfile = user;
    (req as any).profile = profile;
    next();
};