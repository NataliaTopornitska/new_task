'use strict';

const form = document.getElementById("textForm");
const input = document.getElementById("inputText");
const output = document.getElementById("output");

let selected = new Set();
let dragged = null;
let insertMarker = null;

form.addEventListener("submit", e => {
  e.preventDefault();
  renderText(input.value);
});

function renderText(text) {
  output.innerHTML = "";
  selected.clear();
  [...text].forEach((ch, i) => {
    const span = document.createElement("span");
    span.textContent = ch;
    span.className = "letter";
    span.draggable = true;

    span.addEventListener("click", e => {
      if (e.ctrlKey) {
        span.classList.toggle("selected");
        if (selected.has(span)) selected.delete(span);
        else selected.add(span);
      }
    });

    span.addEventListener("dragstart", e => {
      dragged = span;
      span.classList.add("dragging");
    });

    span.addEventListener("dragend", e => {
      span.classList.remove("dragging");
      if (insertMarker) insertMarker.remove();
      dragged = null;
    });

    span.addEventListener("dragover", e => {
      e.preventDefault();
      showInsertMarker(span, e.offsetX < span.offsetWidth / 2);
    });

    span.addEventListener("drop", e => {
      e.preventDefault();
      handleDrop(span);
    });

    output.appendChild(span);
  });
}

function showInsertMarker(target, before) {
  if (insertMarker) insertMarker.remove();
  insertMarker = document.createElement("div");
  insertMarker.className = "insert-marker";
  output.insertBefore(insertMarker, before ? target : target.nextSibling);
}

function handleDrop(target) {
  if (!dragged || dragged === target) return;

  if (selected.size > 1 && selected.has(dragged)) {
    const items = Array.from(selected);
    items.forEach(item => {
      output.insertBefore(item, insertMarker || target);
    });
  } else {
    output.insertBefore(dragged, insertMarker || target);
  }

  insertMarker?.remove();
}
