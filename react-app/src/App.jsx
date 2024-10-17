import EmailForm from "./utils/EmailJs";
import CountButton from "./utils/CountButton";

function App() {
  return (
    <>
      <div>
        {/* component to send email from HR */}
        <EmailForm />

        {/* component to show a redux example */}
        <CountButton />
      </div>
    </>
  );
}

export default App;
