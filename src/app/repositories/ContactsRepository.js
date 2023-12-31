const { v4 } = require('uuid');

const db = require('../../database');

let contacts = [
  {
    id: v4(),
    name: 'Diego',
    email: 'diego@mail.com',
    phone: '1212121212',
    categoryId: v4(),
  },
  {
    id: v4(),
    name: 'Maria',
    email: 'maria@mail.com',
    phone: '1212121212',
    categoryId: v4(),
  },
];

class ContactsRepository {
  async findAll(orderBy = 'ASC') {
    const direction = orderBy.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    const rows = await db.query(`SELECT * FROM contacts ORDER BY name ${direction}`);
    return rows;
  }

  async findById(id) {
    const [row] = await db.query('SELECT * FROM contacts WHERE id = $1', [id]);
    return row;
  }

  async findByEmail(email) {
    const [row] = await db.query('SELECT * FROM contacts WHERE email = $1', [email]);
    return row;
  }

  async create({
    name, email, phone, categoryId,
  }) {
    const [row] = await db.query(`
    INSERT INTO contacts(name, email, phone, categoryId) 
    VALUES($1, $2, $3, $4)
    RETURNING *
    `, [name, email, phone, categoryId]);

    return row;
  }

  async update(id, {
    name, email, phone, categoryId,
  }) {
    const [row] = await db.query(`
      UPDATE contacts
      SET name = $1, email = $2, phone = $3, categoryId = $4
      WHERE id = $5
      RETURNING *
    `, [name, email, phone, categoryId, id]);
    return row;
  }

  delete(id) {
    return new Promise((resolve) => {
      contacts = contacts.filter((contact) => contact.id !== id);
      resolve();
    });
  }
}

module.exports = new ContactsRepository();
