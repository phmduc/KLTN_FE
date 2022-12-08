import React from "react";
import ReactDOM from "react-dom";
import { MessengerChat } from "react-messenger-chat-plugin";
function Chat() {
  return (
    <div>
      <MessengerChat
        pageId="100063624914687"
        onMessengerShow={() => {
          console.log("onMessengerShow");
        }}
        onMessengerHide={() => {
          console.log("onMessengerHide");
        }}
        onMessengerDialogShow={() => {
          console.log("onMessengerDialogShow");
        }}
        onMessengerDialogHide={() => {
          console.log("onMessengerDialogHide");
        }}
        onMessengerMounted={() => {
          console.log("onMessengerMounted");
        }}
        onMessengerLoad={() => {
          console.log("onMessengerLoad");
        }}
      />
      ,
    </div>
  );
}

export default Chat;
