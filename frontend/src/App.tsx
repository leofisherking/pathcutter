import {RouterProvider} from "react-router";
import {Toaster} from "./components/sonner";
import {router} from "./routes";

export default function App() {
    return (
        <>
            <RouterProvider router={router}/>
            <Toaster
                position="top-center"
                toastOptions={{
                    style: {
                        fontFamily: "'Press Start 2P', cursive",
                        fontSize: '8px',
                        background: '#111',
                        color: '#fff',
                        border: '1px solid #333',
                    },
                }}
            />
        </>
    );
}