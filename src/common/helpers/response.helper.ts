import { Response } from "express";

class ResponseHelper {
  success(
    res: Response,
    message: string,
    data: any = null,
    status: number = 200,
  ) {
    return res.status(status).json({
      success: true,
      message,
      data,
    });
  }

  error(res: Response, message: string, status: number = 500) {
    return res.status(status).json({
      success: false,
      message,
    });
  }
}

export default new ResponseHelper();
