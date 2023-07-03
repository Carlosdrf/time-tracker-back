import usersModel from "../models/User";
import * as format from "../services/utc.format";

export const getUsers = async(req, res) => {
    // const token = await genNewToken(req)
    // console.log(req.body)
    const result = await usersModel.getUsersList(req.body.searchField)
    res.json(result)
}