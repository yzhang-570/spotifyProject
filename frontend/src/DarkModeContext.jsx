import { useState, useEffect, createContext } from 'react';

const DarkModeContext = createContext(); // collection of states/values/functions that can be passed down
                                          // to all subtrees/children

// renders all child components + feeds values darkModeOn, toggleDarkMode to DarkModeContext
// and provides access to DarkModeContext to all children
// useContext(DarkModeContext) returns values
const DarkModeProvider = ({ children }) => {

  // todo: theme picker
  // todo: more interesting toggle;

  const [darkModeOn, setDarkModeOn] = useState(false);
  
  const toggleDarkMode = () => {
    setDarkModeOn(!darkModeOn);
  }

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--background-color', darkModeOn ? '#3b3b3b': '#ededed');
    root.style.setProperty('--secondary-background-color', darkModeOn ? '#4F4F4F': '#d9d9d9');
    root.style.setProperty('--primary-text-color', darkModeOn ? '#ffffff': '#2a2a2a');
    root.style.setProperty('--secondary-text-color', darkModeOn ? '#ffffff': '#4F4F4F');
    root.style.setProperty('--conversation-hover-color', darkModeOn ? '#3B3B3B': '#d9d9d9');
    root.style.setProperty('--inbox-border-color', darkModeOn ? '#4F4F4F': '#ededed');
    root.style.setProperty('--tab-inactive-color', darkModeOn ? '#ffffff79': '#2a2a2a79');
    root.style.setProperty('--accent-color', '#1ED760');
  }, [darkModeOn])

  return (
    <DarkModeContext className="color-configurations" value={{ darkModeOn, toggleDarkMode }}>
      {children}
    </DarkModeContext>
  )
}

export { DarkModeContext, DarkModeProvider };