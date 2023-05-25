import { Component, useState, useEffect } from 'react';
import { nanoid } from 'nanoid';

import css from './App.module.css';

import ContactForm from './ContactForm/contactForm';
import ContactList from './ContactList/contactList';
import Filter from './Filter/filter';

const LOCAL_CONTACTS_LIST = 'contactsList';

const App = () => {
  const [contacts, setContacts] = useState([]);
  const [filter, setFilter] = useState('');
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');

  const formSubmit = event => {
    event.preventDefault();

    const { name, number } = event.target;

    console.log('name ' + name.value);
    console.log('number ' + number.value);

    if (
      contacts
        .map(contact => contact.name.toLowerCase())
        .includes(name.value.toLowerCase())
    ) {
      return alert(`Name ${name.value} is already here`);
    }

    setName(name.value);
    setNumber(number.value);

    event.currentTarget.reset();
  };

  useEffect(() => {
    if (name === '') {
      return;
    }
    setContacts(state => {
      return [
        ...state,
        {
          id: nanoid(),
          name: name,
          number: number,
        },
      ];
    });
  }, [name, number]);

  const handleInputChange = event => {
    setFilter(event.target.value);
  };

  const removeContacts = event => {
    const { id } = event.currentTarget.parentElement;

    setContacts(state => {
      return state.filter(contact => contact.id !== id);
    });
  };

  useEffect(() => {
    let localData = [];
    try {
      localData = JSON.parse(localStorage.getItem(LOCAL_CONTACTS_LIST));
    } catch (error) {
      console.log(error);
    }
    if (localData) {
      if (localData !== []) {
        setContacts([...localData.contacts]);
      }
    }
  }, []);

  useEffect(() => {
    if (contacts.length !== 0) {
      localStorage.setItem(LOCAL_CONTACTS_LIST, JSON.stringify({ contacts }));
    }
  }, [contacts]);

  return (
    <div className={css.phonebook}>
      <h1 className={css.phonebook__title}>Phonebook</h1>
      <ContactForm state={{ contacts, filter }} formSubmit={formSubmit} />

      <h2 className={css.phonebook__contactsTitle}>Contacts</h2>
      <Filter
        contacts={contacts}
        filter={filter}
        handleInputChange={handleInputChange}
      />
      <ContactList
        contacts={contacts}
        filter={filter}
        removeContacts={removeContacts}
      />
    </div>
  );
};

export default App;
