const ContactsRepository = require('../repositories/ContactsRepository');

class ContactController {
  async index(request, response) {
    // Listar todos os registros
    const { orderBy } = request.query;
    const contacts = await ContactsRepository.findAll(orderBy);

    response.json(contacts);
  }

  async show(request, response) {
    // Obeter UM registro
    const { id } = request.params;

    const contact = await ContactsRepository.findById(id);

    if (!contact) {
      return response.status(404).json({ error: 'User not found' });
    }

    return response.json(contact);
  }

  async store(request, response) {
    // Criar novo registro
    const {
      name, email, phone, categoryId,
    } = request.body;

    const contactExists = await ContactsRepository.findByEmail(email);

    if (!(name && email)) {
      return response.status(400).json({ error: 'The name and email are required' });
    }

    if (contactExists) {
      return response.status(400).json({ error: 'This E-mail is already in use' });
    }

    const contact = await ContactsRepository.create({
      name, email, phone, categoryId,
    });

    return response.json(contact);
  }

  async update(request, response) {
    // Editar um registro
    const { id } = request.params;

    const {
      name, email, phone, categoryId,
    } = request.body;

    const contactExists = await ContactsRepository.findById(id);
    if (!contactExists) {
      return response.status(404).json({ error: 'User not found' });
    }

    if (!(name && email)) {
      return response.status(400).json({ error: 'The name and email are required' });
    }

    const contactByEmail = await ContactsRepository.findByEmail(email);
    if (contactByEmail && contactByEmail.id !== id) {
      return response.status(400).json({ error: 'This is e-mail already in use' });
    }

    const contact = await ContactsRepository.update(id, {
      name, email, phone, categoryId,
    });

    return response.json(contact);
  }

  async delete(request, response) {
    // Deletar um registro
    const { id } = request.params;

    const contact = await ContactsRepository.findById(id);

    if (!contact) {
      return response.status(404).json({ error: 'User not found' });
    }

    await ContactsRepository.delete(id);
    return response.sendStatus(204);
  }
}

module.exports = new ContactController();
