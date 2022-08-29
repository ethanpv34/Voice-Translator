import React, { useState, useEffect } from 'react'
import { languages } from './constants/Languages'
import { translate } from './api/Translate'
import './App.css'
import LanguagesMenu from './LanguagesMenu'

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const mic = new SpeechRecognition()

mic.continuous = true
mic.interimResults = true
mic.lang = 'en-US'

function App() {
  const [isListening, setIsListening] = useState(false)
  const [note, setNote] = useState("")
  const [translatedNote, setTranslatedNote] = useState('')
  const [currentTranslationLanguage, setCurrentTranslationLanguage] = useState(null)
  const [showMenu, setShowMenu] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    handleListen()
  }, [isListening])

  const handleListen = () => {
    if (isListening) {
      mic.start()
      mic.onend = () => {
        console.log('continue..')
        mic.start()
      }
    } else {
      mic.stop()
      mic.onend = () => {
        console.log('Stopped Mic on Click')
      }
    }
    mic.onstart = () => {
      console.log('Mics on')
    }

    mic.onresult = event => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('')
      console.log(transcript)
      setNote(transcript)
      mic.onerror = event => {
        console.log(event.error)
      }
    }
  }

  const handleSaveNote = async () => {
    setTranslatedNote('');
    setIsLoading(true);
    const userSelectedLanguage = getKeyByValue(languages, currentTranslationLanguage);
    const stringNote = note.toString();
    const translatedNoteFromApi = await translate(stringNote, userSelectedLanguage)
    setTranslatedNote(translatedNoteFromApi);
    setIsLoading(false);
    renderTTS(translatedNoteFromApi);
  };

  const renderTTS = (text) => {
    let synthesis = window.speechSynthesis;

    let voice = synthesis.getVoices().filter((voice) => {
      return voice.name === 'Google UK English Female';
    })[0];

    let utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.rate = 1;

    synthesis.speak(utterance);
  };

  const handleSelectLanguage = (lang) => {
    setCurrentTranslationLanguage(lang);
    setShowMenu(false);
  };

  const getKeyByValue = (object, value) => {
    return Object.keys(object).find(key => object[key] === value);
  }

  const handleCloseMenu = () => {
    setShowMenu(false);
  };

  return (
    <>
      {!showMenu && <>
      <h1 className="title">Voice Language Translator</h1>
      <div className="container">
        <div className="box">
          {note ? <h2 className="title">Current Text</h2> : <h2 className="title">Talk</h2>}
          {isListening ? <span>🎙️</span> : <span>🛑🎙️</span>}
          <p>{note}</p>
          <button onClick={() => setShowMenu(!showMenu)}>Select Language for Translation</button>
          <button onClick={() => {setNote('');setTranslatedNote('');}}>Clear text</button>
          <button onClick={() => setIsListening(prevState => !prevState)}>
            Start/Stop
          </button>
          <button onClick={handleSaveNote} disabled={!note}>
            Translate
          </button>
        </div>
        <div className="box">
          <h2 className="title">Translation {currentTranslationLanguage}</h2>
          {isLoading && <p>Loading...</p>}
          <p>{translatedNote}</p>
          <button onClick={() => renderTTS(translatedNote)}>Hear translation</button>
        </div>
      </div>
      </>}
      {showMenu && <>
        <LanguagesMenu handleSelectLanguage={handleSelectLanguage} handleCloseMenu={handleCloseMenu}/>
      </>}
    </>
  )
}

export default App

