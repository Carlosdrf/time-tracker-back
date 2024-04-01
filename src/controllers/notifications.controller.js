import db from "../../models";
const errorMessage = 'There was an error';

export const get = async (req, res) => {
    let where = {}
    if (req.params.id) where = { id: req.params.id }
    const notifications = await db.notifications.findAll({ where });
    if (notifications.length > 0) return res.status(200).json(notifications)
    res.status(400).json({ errorMessage })
}

export const create = async (req, res) => {
    const { message } = req.body
    let newNotification;
    if (!message) return res.status(400).json({ errorMessage })
    try {
        newNotification = await db.notifications.create(req.body)
    } catch (error) {
        return res.status(400).json({ errorMessage: 'Possible duplicate' })
    }
    if (newNotification) {
        const notification = await db.notifications.findOne({
            where: {
                id: newNotification.id
            }
        })
        return res.status(200).json(notification)
    }
    res.status(400).json({ errorMessage })
}

export const update = async (req, res) => {
    const { message } = req.body
    if (!message) return res.status(400).json({ errorMessage })
    await db.notifications.update(req.body, {
        where: { id: req.params.id }
    })
    const updated = await db.notifications.findOne({
        where: { id: req.params.id }
    })
    if (updated) return res.status(200).json(updated)

    res.status(400).json({ errorMessage })
}

export const deleteNotification = async (req, res) => {
    const deleted = await db.notifications.destroy({
        where: { id: req.params.id }
    })
    console.log(deleted)
    if (deleted) {
        return res.status(200).json({ message: 'Notification Deleted' })
    }
    res.status(400).json({ errorMessage })
}