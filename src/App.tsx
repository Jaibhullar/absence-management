import { AbsencesTable } from "./components/AbsencesTable";
import { SectionContainer } from "./components/Container";
import { Header } from "./components/Header";
import { TooltipProvider } from "./components/ui/tooltip";

function App() {
  return (
    <TooltipProvider>
      <SectionContainer>
        <Header />
        <AbsencesTable />
      </SectionContainer>
    </TooltipProvider>
  );
}

export default App;
