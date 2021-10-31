import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyCbELwupfI9xz_TDoskZntuEpyQzjm6IIc",
  authDomain: "superchat-ef1f5.firebaseapp.com",
  projectId: "superchat-ef1f5",
  storageBucket: "superchat-ef1f5.appspot.com",
  messagingSenderId: "22452240752",
  appId: "1:22452240752:web:08fb55a3fa85e06ec98fb5",
  measurementId: "G-XM89FMXBN7"
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  const [user] = useAuthState(auth);
  
  return (
    <div className="App">
      <header>
        <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }


  return (
    <button onClick={signInWithGoogle}>Sign in With Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (


    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}



function ChatRoom() {

  const dummy = useRef()


  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});

  const[formValue, setFormValue] = useState('');
  

  const sendMessage = async(e) => {


    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');

    dummy.current.scrollIntoView({ behavior: 'smooth' });

  }

  return(
    <>
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

        <div ref={dummy}></div>

      </main>

      <form onSubmit={sendMessage}>

        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />

        <button type="submit">🕊️</button>
       

        

      </form>
    </>
  )
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} />
      <p>{text}</p>
    </div>
  )
}


export default App;
