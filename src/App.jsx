import { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import ToDo from "./ToDo";
import { db } from "./firebase";

import {
  doc,
  collection,
  onSnapshot,
  query,
  updateDoc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";

const style = {
  bg: `h-screen w-screen p-4 bg-gradient-to-r from-[#5d8b25] to-[#1CB5E8 ]`,
  container: `bg-[#f6ffe6] max-w-[500px] w-full m-auto rounded-md shadow-xl p-4`,
  heading: `text-3xl font-bold text-center text-gray-800 p-2`,
  form: `flex justify-between`,
  input: `border p-2 w-full text-xl`,
  button: `border p-4 ml-2 bg-[#3c6410] text-slate-100`,
  count: `text-center p-2`,
};

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [jokes, setJokes] = useState([]);

  const fetchJokes = async () => {
    const res = await fetch("https://api.chucknorris.io/jokes/random");
    const data = await res.json();
    setJokes(data);
  };

  useEffect(() => {
    fetchJokes();
  }, []);

  const createTodo = async (e) => {
    e.preventDefault(e);
    if (input === "") {
      alert("Please enter a valid todo");
    }
    await addDoc(collection(db, "todos"), {
      text: input,
      completed: false,
    });
    setInput("");
  };

  useEffect(() => {
    const q = query(collection(db, "todos"));
    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      let todosArr = [];
      QuerySnapshot.forEach((doc) => {
        todosArr.push({ ...doc.data(), id: doc.id });
      });
      setTodos(todosArr);
    });
    return () => unsubscribe();
  }, []);

  const toggleComplete = async (todo) => {
    await updateDoc(doc(db, "todos", todo.id), {
      completed: !todo.completed,
    });
  };

  const deleteToDo = async (id) => {
    await deleteDoc(doc(db, "todos", id));
  };
  return (
    <>
      <div className={style.bg}>
        <div className={style.container}>
          <h3 className={style.heading}>TodoApp</h3>
          <form onSubmit={createTodo} className={style.form}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={style.input}
              type="text"
              placeholder="Add ToDo"
            />
            <button className={style.button}>
              <AiOutlinePlus size={30} />
            </button>
          </form>
          <ul>
            {todos.map((todo, index) => (
              <ToDo
                key={index}
                todo={todo}
                toggleComplete={toggleComplete}
                deleteToDo={deleteToDo}
              />
            ))}
          </ul>

          {todos.length < 1 ? null : (
            <p
              className={style.count}
            >{`You have ${todos.length} todos ヾ(・ᆺ・✿)ﾉﾞ`}</p>
          )}

          <div class="max-w-sm rounded overflow-hidden shadow-lg w-full m-auto mt-4">
            <p align="center">
              <iframe
                src="https://giphy.com/embed/sG9m1ps4IuM1O"
                width="350"
                height="250"
                class="giphy-embed"
                allowFullScreen
              ></iframe>
            </p>
            <div class="px-6 py-4">
              <div class="text-1xl font-bold text-center text-gray-800 p-2">
                <h1>Get new jokes while grinding hard</h1>
              </div>
              <p class="text-gray-700 text-base">{jokes.value}</p>
            </div>
            <div class="px-6 pt-4 pb-2">
              <button
                className="bg-[#5d8b25] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full m-auto"
                onClick={() => fetchJokes()}
              >
                Get new joke
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
