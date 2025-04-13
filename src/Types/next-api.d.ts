import { NextRequest } from "next/server";

declare module "next/server" {
  interface NextApiContext<T = any> {
    params: T;
  }
}
