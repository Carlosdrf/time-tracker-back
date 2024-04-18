import db from "../../models";

export const startedEntryExists = async (req, res, next) => {
  const startedEntry = await db.entries.findOne({
    where: { user_id: req.userId, status: 0 },
  });
  if(startedEntry) return res.status(400).json({message: "There's a current entry in progress"})
  next();
};
