import * as fs from 'fs';
import { NextApiRequest, NextApiResponse } from "next";

import { withIronSessionApiRoute } from "iron-session/next";

require('dotenv').config();

const dogProbability = 0.5;

export const newCaptchaImage = () => {
  return (new Array(9)).fill(null).map((value, index) => {
    const shouldBeDog = Math.random() < dogProbability;
    const number = Math.floor(Math.random() * (shouldBeDog ? 10 : 13)) + 1;;
    const filename = (shouldBeDog ? 'dog' : 'muffin') + `${number}.png`;
    return `./public/dogs-and-muffins/${filename}`
  });
}

export default withIronSessionApiRoute(
  async function handler(
    req: NextApiRequest | any,
    res: NextApiResponse<Buffer>
  ) {
    const index = req.query.index;
    if (!req.session.captchaImages) {
      req.session.captchaImages = newCaptchaImage();
      await req.session.save();
    }
    res.setHeader('Content-Type', 'image/png');
    const imageBuffer = fs.readFileSync(req.session.captchaImages[index]);
    res.send(imageBuffer);
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
