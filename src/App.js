import './App.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { useLocalStorageState } from './lib/utils';
import { useState } from 'react';
import { FcPlus, FcCheckmark } from 'react-icons/fc';
import { MdDragHandle } from 'react-icons/md';
import { v4 as uuid_v4 } from 'uuid';

const MainPageStyles = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10rem;

  h1 {
    font-size: 6rem;
    margin: 0;
  }
  h3 {
  }
  .form-section {
    margin: 4rem 0;
    padding: 2rem;
    border-radius: 50px;
    background: linear-gradient(145deg, #c8f0c7, #a8caa7);
    box-shadow: 10px 10px 20px #9dbc9c, -10px -10px 20px #d9ffd8;
    h2 {
      margin: 0;
      text-align: center;
    }
    form {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-around;
      label {
        padding: 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      input {
        margin-top: 1rem;
        background: linear-gradient(145deg, #e6e6e6, #ffffff);
        border: none;
        padding: 1rem 2rem;
        border-radius: 10px;
      }
      select {
        margin-top: 1rem;
        background: linear-gradient(145deg, #e6e6e6, #ffffff);
        border: none;
        padding: 1rem 2rem;
        border-radius: 10px;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        padding-right: 24px;
        background: url('data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>')
          100% 50% no-repeat #fff;
      }
      button {
        background: none;
        cursor: pointer;
        border: none;
        padding: 1rem;
      }
    }
  }
  .list {
    width: 800px;
    padding: 2rem;
    text-align: center;
    border-radius: 50px;
    background: linear-gradient(145deg, #c8f0c7, #a8caa7);
    box-shadow: 10px 10px 20px #9dbc9c, -10px -10px 20px #d9ffd8;
  }
  header {
    width: 100% - 2rem;
    margin: 1rem;
    padding: 1rem;
    height: 50px;
    display: grid;
    grid-template-columns: 0.5fr 2fr 1fr 3fr 0.5fr;
    align-items: center;
    h2 {
      margin: 0;
    }
  }
  ul {
    width: 100%;
    list-style: none;
    padding: 0;
    text-align: center;
    li {
      border: 1px solid black;
      border-radius: 10px;
      margin: 1rem;
      padding: 1rem;
      height: 40px;
      display: grid;
      grid-template-columns: 0.5fr 2fr 1fr 3fr 0.5fr;
      align-items: center;
      background: linear-gradient(145deg, #ffffff, #e6e6e6);
      p {
        font-size: 0.8rem;
        margin: 0;
        text-align: center;
      }
      button {
        background: none;
        cursor: pointer;
        border: none;
      }
    }
    .dragging {
      background: rgba(242, 171, 127, 0.6);
    }
    .dragged-over {
      background: green;
    }
  }
`;

function App() {
  const [newItem, setNewItem] = useState({
    title: '',
    priority: 'High 🔥',
    notes: '',
  });
  const [listItems, setListItems] = useLocalStorageState(
    'listItems',
    initialItems
  );

  function clearForm() {
    const blankState = Object.fromEntries(
      Object.entries(newItem).map(([key]) => [key, ''])
    );
    setNewItem(blankState);
  }

  function handleOnDragEnd(result) {
    if (!result.destination) return;
    const items = Array.from(listItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setListItems(items);
  }

  function handleFormChange(e) {
    setNewItem({
      ...newItem,
      [e.target.name]: e.target.value,
    });
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    const newId = uuid_v4();
    setListItems([...listItems, { ...newItem, id: newId }]);
    clearForm();
  }

  function handleRemoveItem(itemId) {
    setListItems(listItems.filter((i) => i.id !== itemId));
  }

  return (
    <MainPageStyles>
      <h1> To💩</h1>
      <h3>
        Drag & Drop to reorder! Add and remove items! Persistent state on
        browser refresh/close!
      </h3>
      <section className="form-section">
        <h2>Add New Item</h2>
        <form onSubmit={(e) => handleFormSubmit(e)}>
          <label htmlFor="title">
            Title
            <input
              type="text"
              name="title"
              id="title"
              onChange={handleFormChange}
              value={newItem.title}
              placeholder="What to do..?"
            />
          </label>
          <label htmlFor="priority">
            Priority
            <select name="priority" id="priority" onChange={handleFormChange}>
              <option value="High 🔥">High 🔥</option>
              <option value="Medium 🤏">Medium 🤏</option>
              <option value="Low 💤">Low 💤</option>
            </select>
          </label>
          <label htmlFor="notes">
            Notes
            <input
              type="text"
              name="notes"
              id="notes"
              value={newItem.notes}
              placeholder="Tell me more..."
              onChange={handleFormChange}
            />
          </label>
          <button type="submit">
            <FcPlus size={40} />
          </button>
        </form>
      </section>
      <div className="list">
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <header>
            <span></span>
            <h2>Title</h2>
            <h2>Priority</h2>
            <h2>Notes</h2>
            <span></span>
          </header>
          {listItems.length === 0 ? (
            <h2>🥳 🥳 🥳</h2>
          ) : (
            <Droppable droppableId="todoList">
              {(provided) => (
                <ul {...provided.droppableProps} ref={provided.innerRef}>
                  {listItems.map(({ id, title, priority, notes }, index) => {
                    return (
                      <Draggable key={id} draggableId={id} index={index}>
                        {(provided, snapshot) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={snapshot.isDragging ? 'dragging' : ''}
                          >
                            <span>
                              <MdDragHandle size={20} />
                            </span>
                            <p>{title}</p>
                            <p>{priority}</p>
                            <p>{notes}</p>
                            <button
                              type="button"
                              onClick={(e, index) => {
                                handleRemoveItem(id);
                              }}
                            >
                              <FcCheckmark size={20} />
                            </button>
                          </li>
                        )}
                      </Draggable>
                    );
                  })}
                  <div style={{ visibility: 'hidden' }}>
                    {provided.placeholder}
                  </div>
                </ul>
              )}
            </Droppable>
          )}
        </DragDropContext>
      </div>
    </MainPageStyles>
  );
}

const initialItems = [
  {
    id: '54f834b7-c212-4ed4-b2df-9b55be6929b5',
    title: 'Vacuum the floor',
    priority: 'Medium 🤏',
    notes: 'They are dirty!',
  },
  {
    id: '2d423715-d434-410c-a5fb-a3f637cdf8e4',
    title: 'Walk the dogs',
    priority: 'High 🔥',
    notes: "I don't want them to pee the floor after I've vacuumed",
  },
  {
    id: '225902b4-16a9-4a01-ac98-ab05e08f24df',
    title: 'Make a to do list app',
    priority: 'low 💤',
    notes: 'To be honest, I have better things to do.',
  },
];

export default App;
