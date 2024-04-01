import db from "../../models";

export const get = async (req, res) => {
    const companies = await db.companies.findAll()
    res.json(companies)
}

export const create = async (req, res) => {
    try {
        const company = await db.companies.create(req.body)
        console.log(company)
        res.status(200).json(company)
    } catch (error) {
        res.status(400).json({ message: "Possible Duplicate" })
    }

}
export const update = async (req, res) => {
    const result = await db.companies.update(req.body, { where: { id: req.params.id } })
    if (result.length > 0) {
        const updated = await db.companies.findOne({ where: { id: req.params.id } })
        return res.status(200).json(updated)
    }
    res.status(400).json({ message: "there was an error" })
}

export const deleteCompany = async (req, res) => {
    const deleted = await db.companies.destroy({ where: { id: req.params.id } })
    res.json(deleted)
}