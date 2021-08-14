import { FormControl, TextField } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import "./App.css";
import { db } from "./firebase";
import AddToPhotosIcon from "@material-ui/icons/AddToPhotos";

// function App() {
//   return <div className="App"></div>;
// }

const App: React.FC = () => {
  // firebaseから取得したdataを管理するため、useStateを定義
  const [tasks, setTasks] = useState([{ id: "", title: "" }]);
  const [input, setInput] = useState("");

  // pageを開いたとき、一度だけrenderingするためにuseEffectを使う
  useEffect(() => {
    // onSnapshotがCloud Firestoreの変化を監視し、変化があれば更新する。
    const unSub = db.collection("tasks").onSnapshot((snapshot) => {
      setTasks(
        snapshot.docs.map((doc) => ({ id: doc.id, title: doc.data().title }))
      );
    });
    return () => unSub(); // cleanup pageをリロードしたりして監視する必要がなくなったときに解放する必要があるため。
  }, []);

  // Taskの追加ロジック
  const newTask = (e: React.MouseEvent<HTMLButtonElement>) => {
    db.collection("tasks").add({ title: input });
    setInput(""); // dbに登録後、setInputを空にする。
  };

  return (
    <div className="App">
      <h1>Todo app by React</h1>

      {/* Task入力画面 */}

      <FormControl>
        <TextField
          InputLabelProps={{
            shrink: true,
          }}
          label="New task ?"
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setInput(e.target.value)
          }
        />
      </FormControl>

      {/* Taskの登録From 文字が入力されていない(input変数に何も入っていないとき)ときは、iconを押せないようにする。 
          iconをclickすると、newTaskメソッドが動作する。
      */}
      <button disabled={!input} onClick={newTask}>
        <AddToPhotosIcon />
      </button>

      {/* Task一覧画面 */}

      {tasks.map((task) => (
        <h3 key={task.id}>{task.title}</h3>
      ))}
    </div>
  );
};

export default App;
