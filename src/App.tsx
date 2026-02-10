import { AbsencesTable } from "./components/AbsencesTable";
import { Container } from "./components/Container";
import { Header } from "./components/Header";

function App() {
  return (
    <>
      <Header />
      <Container className="my-10">
        <AbsencesTable />
      </Container>
    </>
  );
}

export default App;
