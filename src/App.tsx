import { AbsencesTable } from "./components/AbsencesTable";
import { Container } from "./components/Container";
import { Header } from "./components/Header";
import { TooltipProvider } from "./components/ui/tooltip";

function App() {
  return (
    <TooltipProvider>
      <Header />
      <Container className="my-10">
        <AbsencesTable />
      </Container>
    </TooltipProvider>
  );
}

export default App;
