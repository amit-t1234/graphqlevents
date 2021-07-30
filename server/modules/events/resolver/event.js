const { User, Event, User_Event } = require('../../../models');
const { Op } = require("sequelize");
const sequelize = require("../../../models").sequelize;

module.exports = {
    async createEvent (_, args, {req}) {
        if (!req.isAuth) {
            throw new Error('Unauthorized');
        }
        
        // ! Creating Transaction
        const t = await sequelize.transaction();

        try {
            const { name, description } = args.event;
            const userId = req.user.id;

            const event = await Event.create({ name, description, userId}, { transaction: t });

            const linkUserEvent = await event.addUsers(userId, { transaction: t });

            // ! Transaction Commit
            await t.commit();
            return event
        } catch (error) {
            console.log(error);

            // ! Transaction Rollback
            await t.rollback();
            throw new Error('Unauthorized');
        }
    },

    async getEvents (_, args, {req}) {
        if (!req.isAuth) {
            throw new Error('Unauthorized');
        }

        try {
            const { offset, limit, name, description, created_from, created_to } = args;
            const user = req.user;

            // !Define Dynamic Where Clause
            let where = {};
            
            if (created_from && created_to && created_from.length && created_to.length) {
                where.createdAt = {
                    [Op.and]: {
                        [Op.gte]: new Date(created_from),
                        [Op.lte]: new Date(created_to),
                    }
                }
            }

            if (name && name.length) {
                where.name = {
                    [Op.eq]: name,
                }
            }

            if (description && description.length) {
                where.description = {
                    [Op.eq]: description,
                }
            }

            // ! Get Events Of User
            // TODO: Can be made simpler I think
            const events = await User_Event.findAll({
                where: {
                    userId: user.id,
                },
                include: [{
                    model: Event,
                    include: [ {
                        model: User,
                    }],
                    where,
                    order: ['createdAt'],
                }],
                limit,
                offset,
            });

            console.log(events);

            return events

        } catch (error) {
            console.log(error);
            throw new Error('Unauthorized');
        }
    },

    async inviteEvent (_, args, {req}) {
        try {
            const { event_id, invites} = args;

            // Get User Ids
            const users = await User.findAll({
                where: {
                    username: {
                        [Op.in]: invites
                    }
                },
                attributes: ['id'],
                raw: true,
            })

            // Get the Event
            const event = await Event.findByPk(event_id);

            // * Add Users to the Event
            const addToEvent = await event.addUsers(users.map(user => user.id));

            return event

        } catch (error) {
            console.log(error);
            throw new Error('Unauthorized');
        }
    }
};