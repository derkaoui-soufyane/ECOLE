import Acceuil from "./acceuil/acceuil";
import Connection from "./connecte/connection";
import Dashboard from "./Dashbord/Dashbord";

import Inscrire from "./inscrire/inscrire";

import {Route , Routes} from "react-router-dom" 
import Page_ontact from "./page_cantact/page_contact";
import Page_mission from "./mission&valeur/mission&valeur";
import Page_frais from "./frais_inscription/Page_frais";
import Presentation from "./presentation/presentation";
import Page_Lycee_Inscription from "./condition_inscription/cond";
import Dash from "./dash_ense/dashboard_ens/dash";
import Dash_etd from "./dashboard_etd/dash_etd";





function App() {
  return (
    <>
     

      <Routes>
        <Route path="/" element={<Acceuil/>} />
        {/* page ADMINE */}
        <Route path="/Dashboard" element={<Dashboard/>} />
        {/* page enseignement */}
        <Route path="/Dashboard_ense" element={<Dash/>} />
        {/* page Etudiant */}
        <Route path="/Dashboard_etd" element={<Dash_etd/>} />
        {/* PAGE */}
        <Route path="/frais inscription" element={<Page_frais/>} />
        <Route path="/condition inscription" element={<Page_Lycee_Inscription/>} />
        <Route path="/mission&valeur" element={<Page_mission/>} />
        <Route path="/presantation" element={<Presentation/>} />
        <Route path="/contact" element={<Page_ontact/>} />
        <Route path="/Connection" element={<Connection/>} />
        <Route path="/Inscrire" element={<Inscrire/>} />
        
      </Routes>
    </>
  );
}




export default App;
