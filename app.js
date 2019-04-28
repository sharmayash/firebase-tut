const cafeList = document.querySelector("#cafe-list");
const form = document.querySelector("#add-cafe-form");

function renderCafe(doc) {
  let li = document.createElement("li");
  let name = document.createElement("span");
  let city = document.createElement("span");
  let cross = document.createElement("div");

  li.setAttribute("data-id", doc.id);
  name.textContent = doc.data().name;
  city.textContent = doc.data().city;
  cross.textContent = "x";

  li.appendChild(name);
  li.appendChild(city);
  li.appendChild(cross);

  cafeList.appendChild(li);

  // delete data
  cross.addEventListener("click", e => {
    let id = e.target.parentElement.getAttribute("data-id");
    db.collection("cafe")
      .doc(id)
      .delete();
  });
}

// get data - not realtime

// db.collection("cafe")
//   .where('city', '==', 'jaipur')
//   .orderBy('name')
//   .get()
//   .then(res => {
//     res.docs.forEach(doc => {
//       renderCafe(doc);
//     });
//   });

// save data
form.addEventListener("submit", e => {
  e.preventDefault();
  db.collection("cafe").add({
    name: form.name.value,
    city: form.city.value
  });
  form.name.value = "";
  form.city.value = "";
});

// real time listening

db.collection("cafe")
  .orderBy("name")
  .onSnapshot(data => {
    let changes = data.docChanges();
    changes.map(change => {
      if (change.type == "added") {
        renderCafe(change.doc);
      } else if (change.type == "removed") {
        let li = cafeList.querySelector(`[data-id=${change.doc.id}]`);
        cafeList.removeChild(li);
      }
    });
  });
