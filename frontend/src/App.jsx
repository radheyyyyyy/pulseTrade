import {BrowserRouter,Route, Routes} from "react-router-dom";
import Trade from "./Trade.jsx";
import {Market} from "./Market.jsx";

export function App(){
    return(
        <BrowserRouter>
            <Routes>
                <Route element={<Trade/>} path={'/trade'}/>
                <Route element={<Market/>} path={'/markets'}/>
            </Routes>
        </BrowserRouter>
    )
}