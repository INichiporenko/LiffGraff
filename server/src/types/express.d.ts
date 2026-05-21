import express from 'express';

export interface TokenPayload {
    username: string;
    id: string;
}


declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload
        }
    }
}

