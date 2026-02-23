import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import App from './App.tsx';

function Root() {
    const [fontsLoaded, setFontsLoaded] = useState(false);

    useEffect(() => {
        // Ждём загрузки шрифта Press Start 2P
        document.fonts.load("16px 'Press Start 2P'").then(() => setFontsLoaded(true));
    }, []);

    // Пока шрифты не загружены, возвращаем null или спиннер
    if (!fontsLoaded) {
        return null; // можно заменить на <LoadingSpinner /> если нужно
    }

    return <App />;
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Root />
    </StrictMode>
);