import db from "../../models";
import roles from "../services/Role"

const errorMessage = "There was an error, try again later";

export const get = async (req, res) => {
    console.log(req.params.type)
    let projects = [];
    if (req.role == roles.EMPLOYER_ROLE) {
        console.log(req.body.type)
        let where = req.body.type == 'user' ? { id: req.body.userId } : ''

        const employer = await db.users.findByPk(req.userId)
        const [company] = await employer.getCompanies()
        projects = await company.getProjects({
            include: [
                {
                    model: db.users,
                    as: 'users',
                    through: { attributes: [] },
                    where
                },
            ],
        });
    }
    if (req.role == roles.USER_ROLE) {
        const user = await db.users.findByPk(req.userId);
        projects = await user.getProjects();
    }
    if (req.role == roles.ADMIN_ROLE) {
        let include = [{ model: db.companies, model: db.users }]
        if (req.params.type == 'user') include = { model: db.users, where: { id: req.body.userId } }
        if (req.params.type == 'company') include = { model: db.companies, where: { id: req.body.userId } }
        projects = await db.projects.findAll({ include });
    }

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
    if (req.role == roles.EMPLOYER_ROLE) {
        const user = await db.users.findByPk(req.userId)
        const [company] = await user.getCompanies()
        const projects = await db.projects.findOne({
            where: {
                id: req.params.id,
                company_id: company.id
            }
        })
        if (!projects) return res.status(400).json({
            message: "Can't delete this projects, you're not the owner"
        });
    }
    const deleted = await db.projects.destroy({ where: { id: req.params.id } })

    if (deleted) return res.status(200).json({ message: 'Project deleted' })
    res.status(400).json({ errorMessage })
}