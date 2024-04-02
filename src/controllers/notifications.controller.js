import db, { sequelize } from "../../models";
const errorMessage = 'There was an error';

export const get = async (req, res) => {
    let query = {}
    if (req.params.id) query.where = { id: req.params.id }
    if (req.params.user_id) query.include = {
        model: db.users,
        where: { id: req.params.user_id }
    }
    const notifications = await db.notifications.findAll(query);
    if (notifications.length > 0) return res.status(200).json({ notifications })
    res.status(400).json({ errorMessage })
}

export const create = async (req, res) => {
    const { message, user_id } = req.body
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
        if (!user_id) {
            const userIds = await db.users.findAll({ attributes: ['id'], where: sequelize.literal('id <>' + req.userId) })
            userIds.map(async (user) => {
                await db.users_notifications.create({ user_id: user.id, notification_id: notification.id, status: 1 })
            });
        }
        return res.status(200).json(newNotification)
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
    if (deleted) {
        return res.status(200).json({ message: 'Notification Deleted' })
    }
    res.status(400).json({ errorMessage })
}