import React from 'react';
import { languageMenu } from './constants/Languages';

const LanguagesMenu = ({ handleSelectLanguage, handleCloseMenu }) => {
    return (
        <>
            <button onClick={handleCloseMenu}>Close</button>
            {languageMenu.map((lang) => (
                <div key={lang} className="menu-item" onClick={() => handleSelectLanguage(lang)}>
                    <p>{lang}</p>
                    <hr/>
                </div>
            ))}
        </>
    )
};

export default LanguagesMenu;