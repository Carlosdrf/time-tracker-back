import db from "../../models";

const errorMessage = "There was an error, try again later"

export const get = async (req, res) => {
    const projects = await db.projects.findAll()
    if (projects) return res.status(200).json(projects)
    res.status(400).json({ errorMessage })
}

export const create = async (req, res) => {
    const { name, description, user_id } = req.body
    try {
        const project = await db.projects.create(req.body)
        if (project) return res.status(200).json(project)
    } catch (error) {
        res.status(400).json({ errorMessage })

    }
}

export const update = async (req, res) => {
    const { name, description, user_id } = req.body
    const [updated] = await db.projects.update(req.body, { where: { id: req.params.id } })
    let project;
    if (updated) {
        project = await db.projects.findOne({ where: { id: req.params.id } })
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