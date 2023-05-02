import * as fs from 'fs';
import { NextApiRequest, NextApiResponse } from "next";

import { withIronSessionApiRoute } from "iron-session/next";
import { newCaptchaImage } from './captcha-image';

require('dotenv').config();

export default withIronSessionApiRoute(
  async function handler(
    req: NextApiRequest | any,
    res: NextApiResponse<any>
  ) {
    const { message = '', selectedIndexes = [] } = req.body;
    const captchaImages = req.session.captchaImages;
    const dogsIndexes = captchaImages.map((path: string, index: number) => {
      return path.includes(`/dogs-and-muffins/dog`) ? index : -1
    }).filter((index: number) => index !== -1);
    const captchaIsValid = JSON.stringify(dogsIndexes) === JSON.stringify(selectedIndexes.sort());

    req.session.captchaImages = newCaptchaImage();
    await req.session.save();

    const send = captchaIsValid;

    res.json({
      captchaIsValid,
      send
    })
  },
  {
    cookieName: "session",
    password: process.env.SESSION_SECRET_KEY || 'hoangnn',
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    // cookieOptions: {
    //   secure: process.env.NODE_ENV === "production",
    // },
  },
);
