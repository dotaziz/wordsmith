import { Words } from '../../main/entities/words.entity'
const search = document.querySelector('.search-input') as HTMLInputElement
const dropdown = document.querySelector('.dropdown') as HTMLDivElement

const container = document.querySelector('div.container') as HTMLDivElement
const menu = document.querySelector('.menu') as HTMLDivElement
const sideMenu = document.querySelector('.side-menu') as HTMLDivElement
const historyBtn = document.querySelector('.history') as HTMLButtonElement

const dictionary = (data: Words): HTMLDivElement => {
  const dictSection = document.createElement('div')
  dictSection.classList.add('dictionary')

  const divPro = document.createElement('div')
  divPro.style.display = 'flex'
  divPro.style.flexDirection = 'column'
  divPro.style.alignItems = 'start'
  data.phonetics?.forEach((i) => {
    const pronunciation = document.createElement('div')
    pronunciation.classList.add('pronunciation')
    const phonetic = document.createElement('span')
    phonetic.textContent = `${i.text}`
    pronunciation.appendChild(phonetic)

    const btn = document.createElement('button')

    btn.addEventListener('click', async () => {
      //browser voice
      const utter = new SpeechSynthesisUtterance()
      utter.text = data.word
      utter.lang = 'en-US'
      speechSynthesis.speak(utter)
    })

    btn.title = 'listen to pronunciation'

    const img = document.createElement('img')

    img.alt = 'sound'
    img.src = 'assets/icons/volume.svg'
    img.draggable = false
    btn.appendChild(img)
    pronunciation.appendChild(btn)
    divPro.appendChild(pronunciation)
  })

  const dictContent = document.createElement('div')
  dictContent.classList.add('dictionary-content')
  for (const meaning of data.meanings) {
    const wordDetails = document.createElement('div')
    wordDetails.classList.add('word-details')
    const partOfSpeech = document.createElement('span')
    partOfSpeech.classList.add('part-of-speech')
    partOfSpeech.textContent = meaning.partOfSpeech

    const plural = document.createElement('span')
    plural.classList.add('plural')

    plural.textContent = 'plural'

    wordDetails.appendChild(partOfSpeech)
    wordDetails.appendChild(plural)

    dictContent.appendChild(wordDetails)

    const ol = document.createElement('ol')

    meaning.definitions.forEach((i) => {
      const li = document.createElement('li')
      const defHeader = document.createElement('div')
      defHeader.classList.add('def-header')
      const cxt = document.createElement('strong')

      cxt.textContent = 'Other'
      cxt.classList.add('context')
      defHeader.appendChild(cxt)

      const p = document.createElement('p')

      p.textContent = i.definition

      li.appendChild(p)
      const ul = document.createElement('ul')
      ul.classList.add('examples')

      const li1 = document.createElement('li')

      if (i.example) {
        li1.innerHTML = `Example: ${i?.example?.replace(
          new RegExp(data.word),
          `<u><strong>${data.word}</strong></u>`
        )}`
      }

      if (i.synonyms?.length) {
        const p1 = document.createElement('p')
        p1.textContent = 'Synonyms: '

        p1.classList.add('synonyms')

        i.synonyms?.forEach((i) => {
          const a = document.createElement('a')
          a.href = '#'
          a.textContent = i
          p1.appendChild(a)

          a.addEventListener('click', async () => {
            search.value = i
            search.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter' }))
          })
        })

        li1.appendChild(p1)
      }

      if (i.antonyms?.length) {
        const p2 = document.createElement('p')
        p2.textContent = 'Antonyms: '

        i.antonyms?.forEach((i) => {
          const a = document.createElement('a')
          a.href = '#'
          a.textContent = i
          p2.appendChild(a)
        })

        li1.appendChild(p2)
      }

      ul.appendChild(li1)

      li.appendChild(ul)
      ol.appendChild(li)
    })
    dictContent.appendChild(ol)
  }

  dictSection.append(divPro, dictContent)
  return createDetails(dictSection, 'Dictionary')
}
const createDetails = (div: HTMLDivElement, text: string): HTMLDivElement => {
  const summary = document.createElement('summary')
  const details = document.createElement('div')

  // details.open = open ? true : false
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
  `

  details.append(div)

  return details
}

dropdown.addEventListener('click', async () => {
  // window.electronAPI.openSettings();
  menu.classList.toggle('active')
})

historyBtn.addEventListener('click', async () => {
  sideMenu.classList.toggle('active')

  const history = await window.electronAPI.getHistory()
  const list = document.createElement('ul')
  list.classList.add('menu-list')

  for (const itm of history) {
    const li = document.createElement('li')
    li.classList.add('menu-item')
    const a = document.createElement('a')
    a.href = `#${itm.id}`
    a.textContent = itm.word
    li.appendChild(a)
    list.appendChild(li)
  }

  sideMenu.appendChild(list)
})

historyBtn.addEventListener('blur', () => {
  sideMenu.classList.remove('active')
})

dropdown.addEventListener('blur', () => {
  menu.classList.remove('active')
})

search.addEventListener('input', () => {
  if (search.value.length == 0) {
    container.innerHTML = ''
    ;(document.querySelector('.message') as HTMLDivElement).style.display = 'block'
    ;(document.querySelector('#info') as HTMLImageElement).hidden = false
    ;(document.querySelector('#not-found') as HTMLImageElement).hidden = true
    ;(document.querySelector('.message>div') as HTMLImageElement).textContent =
      'Look up definitions of any english term.'
  }
})

search.addEventListener('keypress', async (e) => {
  if (e?.key === 'Enter') {
    container.innerHTML = ''
    const resp = await window.electronAPI.query(search.value)
    if (resp === null) {
      ;(document.querySelector('.message') as HTMLDivElement).style.display = 'block'
      ;(document.querySelector('#info') as HTMLImageElement).hidden = true
      ;(document.querySelector('#not-found') as HTMLImageElement).hidden = false
      ;(document.querySelector('.message>div') as HTMLImageElement).textContent =
        'No definitions found for the term.'
      return
    }
    ;(document.querySelector('.message') as HTMLDivElement).style.display = 'none'
    container.append(dictionary(resp))
  }
})
