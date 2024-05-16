import db, { sequelize } from "../../models";
import roles from "../services/Role"
const errorMessage = 'There was an error';

export const get = async (req, res) => {
    let notifications = [];
    if (req.role != roles.ADMIN_ROLE) {
        const user = await db.users.findByPk(req.userId)
        notifications = await user.getNotifications()
    } else {
        notifications = await db.notifications.findAll({
            include: [
                { model: db.users }
            ],
        })
    }

    if (notifications) return res.status(200).json(notifications)
    res.status(400).json({ errorMessage })
}

export const create = async (req, res) => {
    const { selectedUsers } = req.body
    console.log(selectedUsers)
        const notification = await db.notifications.create(req.body)
        if (notification) {
            if (selectedUsers) {
                for (let employee of selectedUsers) {
                    if (employee.checked) await notification.addUser(employee.user_id)
                }
                let result = await db.notifications.findOne({
                    where: { id: notification.id },
                    include: {
                        model: db.users
                    }
                })
                return res.status(200).json(result)
            }
        }
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