const KEY = "navratri-collection";
const form = document.getElementById("form");
const nameInput = document.getElementById("name");
const amountInput = document.getElementById("amount");
const list = document.getElementById("list");
const empty = document.getElementById("empty");
const totalEl = document.getElementById("total");
const countEl = document.getElementById("count");
const msg = document.getElementById("msg");
const modal = document.getElementById("modal");

let items = [];
try { items = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { items = []; }

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) {}
}

function render() {
  list.innerHTML = "";
  let total = 0;
  items.forEach((it, i) => {
    total += it.amount;
    const li = document.createElement("li");
    const n = document.createElement("span");
    n.className = "name";
    n.textContent = it.name;
    const a = document.createElement("span");
    a.className = "amt";
    a.textContent = "₹" + it.amount.toLocaleString("en-IN");
    const d = document.createElement("button");
    d.className = "del";
    d.type = "button";
    d.title = "Remove";
    d.textContent = "×";
    d.onclick = () => {
      if (confirm("Remove " + it.name + "?")) { items.splice(i, 1); save(); render(); }
    };
    li.append(n, a, d);
    list.appendChild(li);
  });
  totalEl.textContent = "₹" + total.toLocaleString("en-IN");
  countEl.textContent = items.length;
  empty.style.display = items.length ? "none" : "block";
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const amount = Number(amountInput.value);
  if (!name || !(amount > 0)) return;
  items.unshift({ name, amount });
  save();
  render();
  form.reset();
  nameInput.focus();
  msg.textContent = "Added " + name + " – ₹" + amount.toLocaleString("en-IN");
  setTimeout(() => { msg.textContent = ""; }, 3000);
});

function openModal() { modal.hidden = false; }
function closeModal() { modal.hidden = true; }

document.getElementById("openBtn").onclick = openModal;
document.getElementById("closeBtn").onclick = closeModal;
modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

document.getElementById("clear").onclick = () => {
  if (items.length && confirm("Delete all entries?")) { items = []; save(); render(); }
};

render();
