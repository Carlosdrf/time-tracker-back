import db from "../../models";

export const get = async (req, res) => {
  const positions = await db.positions.findAll();
  res.json(positions);
};

export const create = async (req, res) => {
  const { title, description } = req.body;
  try {
    const result = await db.positions.create(req.body);
    if (result) {
      return res.json(result);
    }
  } catch (error) {
    res.status(400).json({ message: "Possible Duplicate" });
  }
};

export const update = async (req, res) => {
  const { title, description } = req.body;
  const result = await db.positions.update({ title, description }, { where: { id: req.params.id } });
  if (result.length > 0) {
    const updated = await db.positions.findOne({ where: { id: req.params.id } })
    return res.status(200).json(updated)
  }
  res.status(400).json({ message: 'There was a problem' })
};

export const deletePosition = async (req, res) => {
  const result = await db.positions.destroy({ where: { id: req.params.id } })
  res.json({ message: 'Position Deleted' })
}