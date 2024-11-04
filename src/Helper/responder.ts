import { Request, Response } from './path'

class ResponderClass {
    constructor() { }

    sentSuccessMessage = async (message: string, res: Response) => {
        let result = {
            success: true,
            message: message,
        }
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify(result));
    }

    sentSuccessData = async (data: any, message: string, res: Response) => {
        let result = {
            success: true,
            message: message,
            data: data
        }
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify(result));
    }

    sentFailureMessage = async (message: string, res: Response) => {
        let result = {
            success: false,
            message: message,
        }
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify(result));
    }
}

export const Responder = new ResponderClass()