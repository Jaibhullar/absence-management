import { AbsencesTable } from "./components/AbsencesTable";
import { SectionContainer } from "./components/Container";
import { Header } from "./components/Header";

function App() {
  return (
    <SectionContainer>
      <Header title="Absence Management" description="Track and manage employee absences" />
      <AbsencesTable />
    </SectionContainer>
  );
}

export default App;
