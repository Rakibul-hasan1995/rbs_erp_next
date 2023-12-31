import { NextResponse } from "next/server";
import { getQueryParams } from "../../lib/getQueryParams";

import { findHistory } from "./controller/findHistory";

export const GET = async (req: Request) => {
   try {
      const parentId = getQueryParams(req.url as string, 'parent_id', '');
      if (!parentId) {
         return NextResponse.error()
      }
      const response = await findHistory(parentId)
      return NextResponse.json(response, { status: response.code })
   } catch (error) {
      return NextResponse.json(error, { status: 500 })
   }
}

