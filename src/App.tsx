import { AbsencesTable } from "./components/AbsencesTable";
import { SectionContainer } from "./components/Container";
import { Header } from "./components/Header";

function App() {
  return (
    <SectionContainer>
      <Header />
      <AbsencesTable />
    </SectionContainer>
  );
}

export default App;
