import db from "../../models";
import roles from "../services/Role"

const errorMessage = "There was an error, try again later"

export const get = async (req, res) => {

    if (req.role == roles.EMPLOYER_ROLE) {
        const employer = await db.users.findByPk(req.userId)
        const [company] = await employer.getCompanies()
        const projects = await company.getProjects()
        return res.status(200).json(projects)
    }
    if (req.role != roles.ADMIN_ROLE) {
        const user = await db.users.findByPk(req.userId)
        const projects = await user.getProjects()
        return res.status(200).json(projects)
    }

    let projects = await db.projects.findAll({
        include: [
            { model: db.users },
            { model: db.companies }
        ],
    })

    if (projects) return res.status(200).json(projects)
    res.status(400).json({ errorMessage })
}

export const create = async (req, res) => {
    const { name, description, user_id, employees } = req.body
    console.log(employees)
    try {
        const project = await db.projects.create(req.body)
        if (project) {
            if (employees) {
                for (let employee of employees) {
                    if (employee.checked) await project.addUser(employee.user_id)
                }
                let result = await db.projects.findOne({
                    where: { id: project.id },
                    include: {
                        model: db.users
                    }
                })
                return res.status(200).json(result)
            }
        }
    } catch (error) {
        res.status(400).json({ errorMessage })
    }
}

export const update = async (req, res) => {
    const { name, description, user_id, employees } = req.body
    console.log(req.body)

    const [updated] = await db.projects.update(req.body, { where: { id: req.params.id } })

    let project;
    if (updated) {
        project = await db.projects.findOne({
            where: { id: req.params.id }
        })
        if (employees) {
            for (let employee of employees) {
                if (employee.checked) await project.addUser(employee.user_id)
                else await project.removeUser(employee.user_id)
            }
        }
        project = await db.projects.findOne({
            where: { id: req.params.id },
            include: {
                model: db.users
            }
        })
        return res.status(200).json(project)
    }
    res.status(400).json({ errorMessage })
}

export const deleteProject = async (req, res) => {
    const deleted = await db.projects.destroy({ where: { id: req.params.id } })
    console.log('deleted: ', deleted)
    if (deleted) return res.status(200).json({ message: 'project deleted' })
    res.status(400).json({ errorMessage })
}