import "./index.css";
import { ExchangeWidget } from "~/widgets";

function App() {
  return (
    <main>
      <ExchangeWidget
        className={
          "absolute left-1/2 top-1/2 m-auto flex w-full max-w-5xl -translate-x-1/2 -translate-y-1/2 flex-col gap-8 px-8"
        }
      />
    </main>
  );
}

export default App;
