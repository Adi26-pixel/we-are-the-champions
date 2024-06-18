import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  databaseURL:
    "https://we-are-the-champions-c4de0-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const endorsementListInDB = ref(database, "endorsements");

const messageEl = document.getElementById("message-el");
const fromEl = document.getElementById("from-el");
const toEl = document.getElementById("to-el");

const publishBtn = document.getElementById("publish-btn");

const endorsementSection = document.getElementById("endorsement-section");

publishBtn.addEventListener("click", function () {
  let message = messageEl.value;
  let sender = fromEl.value;
  let receiver = toEl.value;

  push(endorsementListInDB, message, sender, receiver);

  clearInput();
});

onValue(endorsementListInDB, function (snapshot) {
  if (snapshot.exists()) {
    let commentArray = Object.entries(snapshot.val());

    clearInput();
    endorsementSection.innerHTML = "";

    for (let i = 0; i < commentArray.length; i++) {
      let commentItem = commentArray[i];

      appendCommentList(commentItem);
    }
  } else {
    endorsementSection.innerHTML = " ";
  }
});

function clearInput() {
  messageEl.value = "";
  fromEl.value = "";
  toEl.value = "";
}

function appendCommentList(item) {
  let itemID = item[0];
  let message = item[1][0];
  let sender = item[1][1];
  let receiver = item[1][2];

  let newEl = document.createElement("p");
  newEl.id = "comment";
  newEl.innerHTML = `
  <p id="sender-el">To ${sender}</p>
  <p>${message}</p>
  <p id="recipient-el">${receiver}</p>
  `;

  newEl.addEventListener("click", function () {
    let exactLocationOfItemInDB = ref(database, `endorsements/${itemID}`);

    remove(exactLocationOfItemInDB);
  });

  endorsementSection.append(newEl);
}
