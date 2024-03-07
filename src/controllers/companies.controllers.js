import db from "../../models";

export const getCompanies = async (req, res) => {
    const companies = await db.companies.findAll()
    res.json(companies)
}