import db, { sequelize } from "../../models";
import roles from "../services/Role";

const errorMessage = 'There was an error'

export const get = async (req, res) => {
    let companies = [];
    if (req.role == roles.EMPLOYER_ROLE) {
        const user = await db.users.findByPk(req.userId);
        companies = await user.getCompanies();
    } else {
        companies = await db.companies.findAll();
    }
    if (companies) return res.status(200).json(companies)
    res.status(400).json({ errorMessage })
}

export const getEmployees = async (req, res) => {

    const company = await db.companies.findOne({
        include: [{
            model: db.employees,
            include: {
                // attributes: [],
                model: db.users,
                where: { active: 1 }
            }
        }],
        where: { id: req.params.id },
    })
    if (company) return res.status(200).json(company.employees)
    res.status(400).json({ errorMessage })
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
    res.status(400).json({ errorMessage })
}

export const deleteCompany = async (req, res) => {
    const deleted = await db.companies.destroy({ where: { id: req.params.id } })
    res.json(deleted)
}