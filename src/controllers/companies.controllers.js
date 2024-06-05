import { FilterGroup } from "@hubspot/api-client/lib/codegen/crm/contacts";
import db, { sequelize } from "../../models";
import roles from "../services/Role";
import { AssociationTypes, Client } from "@hubspot/api-client";
const hubspotClient = new Client({ accessToken: process.env.HUBSPOT_TOKEN });

const errorMessage = "There was an error";

export const get = async (req, res) => {
  let companies = [];
  if (req.role == roles.EMPLOYER_ROLE) {
    const user = await db.users.findByPk(req.userId);
    companies = await user.getCompanies();
  } else {
    companies = await db.companies.findAll();
  }
  if (companies) return res.status(200).json(companies);
  res.status(400).json({ errorMessage });
};

export const getEmployees = async (req, res) => {
  const company = await db.companies.findOne({
    include: [
      {
        model: db.employees,
        include: {
          // attributes: [],
          model: db.users,
          where: { active: 1 },
        },
      },
    ],
    where: { id: req.params.id },
  });
  if (company) return res.status(200).json(company.employees);
  res.status(400).json({ errorMessage });
};

export const create = async (req, res) => {
  try {
    const company = await db.companies.create(req.body);
    console.log(company);
    res.status(200).json(company);
  } catch (error) {
    res.status(400).json({ message: "Possible Duplicate" });
  }
};
export const update = async (req, res) => {
  const result = await db.companies.update(req.body, {
    where: { id: req.params.id },
  });
  if (result.length > 0) {
    const updated = await db.companies.findOne({
      where: { id: req.params.id },
    });
    return res.status(200).json(updated);
  }
  res.status(400).json({ errorMessage });
};

export const createPossibleClient = async (req, res) => {
  const {
    name,
    lastname,
    company,
    email,
    phone,
    positions,
    tasks_description,
  } = req.body;
  const contact = {
    properties: {
      email,
      phone,
      firstname: name,
      worker_in_need: positions,
      lastname,
      hubspot_owner_id: "40000426",
    },
  };
  const companyObject = {
    properties: {
      name: company,
    },
  };
  try {
    const contactExists = await validateContact(email);

    if (contactExists.total == 0) {
      const createdContact = await hubspotClient.crm.contacts.basicApi.create(
        contact
      );
      const createdCompany = await hubspotClient.crm.companies.basicApi.create(
        companyObject
      );

      await hubspotClient.crm.associations.v4.basicApi.create(
        "companies",
        createdCompany.id,
        "contacts",
        createdContact.id,
        [
          {
            associationCategory: "HUBSPOT_DEFINED",
            associationTypeId: AssociationTypes.companyToContact,
          },
        ]
      );

      res.json({ message: "Success" });
    } else {
      res.status(400).json({ errorMessage });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
};
export const getContacts = async (req, res) => {
  const response = await hubspotClient.crm.owners.ownersApi.getPage();
  const listaUsuarios = response;

  res.json(listaUsuarios);
};
export const validateContact = async (email) => {
  const publicObjectSearchRequest = {
    filterGroups: [
      {
        filters: [
          {
            propertyName: "email",
            operator: "EQ",
            value: `${email}`,
          },
        ],
      },
    ],
    properties: ["createdate", "firstname", "lastname", "email"],
    limit: 100,
    after: 0,
  };
  return await hubspotClient.crm.contacts.searchApi.doSearch(
    publicObjectSearchRequest
  );
};

export const deleteCompany = async (req, res) => {
  try {
    const deleted = await db.companies.destroy({
      where: { id: req.params.id },
    });
    res.json(deleted);
  } catch (error) {
    res
      .status(400)
      .json({ message: "You're trying to delete an assigned company" });
  }
};
