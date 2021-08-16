import { FormControl, List, TextField } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import styles from "./App.module.css";
import { db } from "./firebase";
import AddToPhotosIcon from "@material-ui/icons/AddToPhotos";
import TaskItem from "./TaskItem";
import { makeStyles } from "@material-ui/styles";
import { auth } from "./firebase";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

const useStyles = makeStyles({
  field: {
    marginTop: 30,
    marginBottom: 20,
  },
  list: {
    margin: "auto",
    width: "40%",
  },
});

const App: React.FC = (props: any) => {
  // firebaseから取得したdataを管理するため、useStateを定義
  const [tasks, setTasks] = useState([{ id: "", title: "" }]);
  const [input, setInput] = useState("");
  const classes = useStyles();

  // Login check

  useEffect(() => {
    const unSub = auth.onAuthStateChanged((user) => {
      !user && props.history.push("login"); // userに値が入っていなければ、loginpageに飛ばす
    });
    return () => unSub();
  });

  // Task一覧読み込み

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
    <div className={styles.app__root}>
      <h1>Todo app by React</h1>

      {/* Logout Button */}

      <button
        className={styles.app__logout}
        onClick={async () => {
          try {
            // awaitを使うことでauth.signOutの完了を待ってから、loginに飛ばしている。
            await auth.signOut();
            props.history.push("login");
          } catch (error) {
            alert(error.message);
          }
        }}
      >
        <ExitToAppIcon />
      </button>
      <br />

      {/* Task入力画面 */}

      <FormControl>
        <TextField
          className={classes.field}
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
      <button className={styles.app__icon} disabled={!input} onClick={newTask}>
        <AddToPhotosIcon />
      </button>

      {/* Task一覧画面 */}
      <List className={classes.list}>
        {tasks.map((task) => (
          <TaskItem key={task.id} id={task.id} title={task.title} />
        ))}
      </List>
    </div>
  );
};

export default App;
