import { Words } from "../db/words.entity";
import "./index.css";

const search = document.querySelector(".search-text") as HTMLInputElement;

const copySearch = document.querySelector(".copy-search") as HTMLButtonElement;
const clearSearch = document.querySelector(
  ".clear-search"
) as HTMLButtonElement;
const soundSearch = document.querySelector(
  ".sound-search"
) as HTMLButtonElement;
const settingsBtn = document.querySelector(
  ".settings"
) as HTMLButtonElement;

const container = document.querySelector("div.container") as HTMLDivElement;

const menu = document.querySelector(".menu") as HTMLDivElement;

const messageHTML = (type: "not-found" | "info"): HTMLDivElement => {
  const div = document.createElement("div");
  div.classList.add("message");
  const img = document.createElement("img");
  const text = document.createElement("div");
  img.draggable = false;

  switch (type) {
    case "info":
      img.src = "assets/icons/icon.svg";
      img.height = 400;
      img.width = 400;
      text.textContent = "Look up definitions of any english term.";
      break;
    case "not-found":
      img.src = "assets/icons/search.svg";
      img.height = 300;
      img.width = 300;
      text.textContent = "No definitions found for the term.";
      break;
  }
  div.append(img, text);

  return div;
};

const dictionary = (data: Words): HTMLDetailsElement => {
  const dictSection = document.createElement("div");
  dictSection.classList.add("dictionary");

  const divPro = document.createElement("div");
  divPro.style.display = "flex";
  divPro.style.flexDirection = "column";
  divPro.style.alignItems = "start";
  data.phonetics.forEach((i) => {
    const pronunciation = document.createElement("div");
    pronunciation.classList.add("pronunciation");
    const phonetic = document.createElement("span");
    phonetic.textContent = `${i.text}`;
    pronunciation.appendChild(phonetic);

    const btn = document.createElement("button");

    btn.addEventListener("click", async () => {
      //browser voice
      const utter = new SpeechSynthesisUtterance();
      utter.text = data.word;
      utter.lang = "en-US";
      speechSynthesis.speak(utter);
    });

    btn.title = "listen to pronunciation";

    const img = document.createElement("img");

    img.alt = "sound";
    img.src = "assets/icons/volume.svg";
    img.draggable = false;
    btn.appendChild(img);
    pronunciation.appendChild(btn);
    divPro.appendChild(pronunciation);
  });

  const dictContent = document.createElement("div");
  dictContent.classList.add("dictionary-content");
  for (const meaning of data.meanings) {
    const wordDetails = document.createElement("div");
    wordDetails.classList.add("word-details");
    const partOfSpeech = document.createElement("span");
    partOfSpeech.classList.add("part-of-speech");
    partOfSpeech.textContent = meaning.partOfSpeech;

    const plural = document.createElement("span");
    plural.classList.add("plural");

    plural.textContent = "plural";

    wordDetails.appendChild(partOfSpeech);
    wordDetails.appendChild(plural);

    dictContent.appendChild(wordDetails);

    const ol = document.createElement("ol");

    meaning.definitions.forEach((i) => {
      const li = document.createElement("li");
      const defHeader = document.createElement("div");
      defHeader.classList.add("def-header");
      const cxt = document.createElement("strong");

      cxt.textContent = "Other";
      cxt.classList.add("context");
      defHeader.appendChild(cxt);

      const p = document.createElement("p");

      p.textContent = i.definition;

      li.appendChild(p);
      const ul = document.createElement("ul");
      ul.classList.add("examples");

      const li1 = document.createElement("li");

      if (i.example) {
        li1.innerHTML = `Example: ${i?.example?.replace(
          new RegExp(data.word),
          `<u><strong>${data.word}</strong></u>`
        )}`;
      }

      if (i.synonyms?.length) {
        const p1 = document.createElement("p");
        p1.textContent = "Synonyms: ";

        p1.classList.add("synonyms");

        i.synonyms?.forEach((i) => {
          const a = document.createElement("a");
          a.href = "#";
          a.textContent = i;
          p1.appendChild(a);

          a.addEventListener("click", async () => {
            search.value = i;
            search.dispatchEvent(
              new KeyboardEvent("keypress", { key: "Enter" })
            );
          });
        });

        li1.appendChild(p1);
      }

      if (i.antonyms?.length) {
        const p2 = document.createElement("p");
        p2.textContent = "Antonyms: ";

        i.antonyms?.forEach((i) => {
          const a = document.createElement("a");
          a.href = "#";
          a.textContent = i;
          p2.appendChild(a);
        });

        li1.appendChild(p2);
      }

      ul.appendChild(li1);

      li.appendChild(ul);
      ol.appendChild(li);
    });
    dictContent.appendChild(ol);
  }

  dictSection.append(divPro,dictContent);
  return createDetails(dictSection, "Dictionary", true);
};

const createDetails = (div: HTMLDivElement, text: string, open?: boolean) => {
  const summary = document.createElement("summary");
  const details = document.createElement("details");

  details.open = open;
  summary.innerHTML = `
  ${text}
   <svg
            class="icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 9L12 15L18 9"
              stroke="#333"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
  `;

  details.append(summary, div);

  return details;
};

copySearch.title = "Copy to clipboard";
soundSearch.title = "Listen to pronunciation";
copySearch.addEventListener("click", () => {
  navigator.clipboard.writeText(search.value);
  alert("Copied to clipboard");
});

clearSearch.addEventListener("click", () => {
  search.value = "";
});

settingsBtn.addEventListener("click", () => {
  // window.electronAPI.openSettings();
  menu.hidden = menu.hidden ? false : true;

  menu.style.display = menu.style.display === "none" ? "flex" : "none";
});

document.addEventListener("DOMContentLoaded", () => {
  search.spellcheck = true;
  copySearch.hidden = true;
  soundSearch.hidden = true;
  clearSearch.hidden = true;
  container.innerHTML = "";
  container.append(messageHTML("info"));
});

search.addEventListener("input", () => {
  if (search.value.length > 0) {
    copySearch.hidden = false;
    soundSearch.hidden = false;
    clearSearch.hidden = false;
  } else {
    copySearch.hidden = true;
    soundSearch.hidden = true;
    clearSearch.hidden = true;
    container.innerHTML = "";
    container.append(messageHTML("info"));
  }
});

search.addEventListener("keypress", async (e) => {
  if (e?.key === "Enter") {
    container.innerHTML = "";
    const resp = await window.electronAPI.query(search.value);
    if (resp === null) {
      container.appendChild(messageHTML("not-found"));
      return;
    }
    container.append(dictionary(resp));
  }
});
