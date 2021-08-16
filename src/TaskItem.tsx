import React, { useState } from "react";
import styles from "./TaskItem.module.css";
import { ListItem, TextField, Grid } from "@material-ui/core";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import { db } from "./firebase";

interface PROPS {
  id: string;
  title: string;
}

export const TaskItem: React.FC<PROPS> = (props) => {
  const [title, setTitle] = useState(props.title);

  // TaskEdit
  const editTask = () => {
    // titleだけ書き換えたい場合は、mergeをtrueにする。
    db.collection("tasks").doc(props.id).set({ title: title }, { merge: true });
  };

  // TaskDelete
  const deleteTask = () => {
    db.collection("tasks").doc(props.id).delete();
  };

  return (
    <div>
      <ListItem>
        <h2>{props.title}</h2>
        <Grid container justify="flex-end">
          <TextField
            InputLabelProps={{
              shrink: true,
            }}
            label="Edit task"
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
          />
        </Grid>
        <button className={styles.taskitem__icon} onClick={editTask}>
          <EditOutlinedIcon />
        </button>
        <button className={styles.taskitem__icon} onClick={deleteTask}>
          <DeleteOutlineOutlinedIcon />
        </button>
      </ListItem>
    </div>
  );
};

export default TaskItem;
