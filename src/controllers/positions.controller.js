import db from "../../models";

export const get = async (req, res) => {
  const positions = await db.positions.findAll();
  res.json(positions);
};

export const create = async (req, res) => {
  const { title, description } = req.body;
  const result = await db.positions.create(req.body);
  if (result) {
    return res.json(result);
  }
  res.status(400).json({ message: "error" });
};

export const update = async (req, res) => {
  const { title, description } = req.body;
  const updated = await db.positions.update({ title, description }, { where: { id: req.id } });
  res.json(updated);
};
