import generatePagination from "@/app/api/lib/generatePagination copy";
import { getQueryParams } from "@/app/api/lib/getQueryParams";
import { User } from "@/app/api/mongoose/model/User";

export const findUsers = async (req: Request) => {
  try {
    const page = getQueryParams(req.url as string, 'page', 1);
    const limit = getQueryParams(req.url as string, 'limit', 10)
    const sortType = getQueryParams(req.url as string, 'sort_type', 'asc')
    const sortKey = getQueryParams(req.url as string, 'sort_key', 'user_name')
    const searchTerm = getQueryParams(req.url as string, 'search', undefined)
    const roll = getQueryParams(req.url as string, 'roll', undefined)
    const searchBy = getQueryParams(req.url as string, 'search_by', undefined)

    const skip = (+page - 1) * +limit;

    const regex = new RegExp(`${searchTerm}`, 'i')
    let filter = {}
    if (searchBy && searchTerm) {
      filter = { [`${searchBy}`]: { $regex: regex } }
    }
    if (roll) {

      if (Object.keys(filter).length) {
        filter = {
          $and:
            [
              { roll: roll },
              { ...filter },
            ]
        }
      } else {
        filter = { roll: roll }
      }
    }

    const users = await User.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ [sortKey]: sortType == 'asc' ? 1 : -1 })
      .exec()

    const count = await User.countDocuments(filter)
    const pagination = generatePagination(+page, +limit, count)
    const response = {
      code: 200,
      data: users,
      pagination,
    };
    return response
  } catch (error) {
    return error
  }
};