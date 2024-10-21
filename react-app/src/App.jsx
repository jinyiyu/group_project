// import EmailForm from "./utils/EmailJs";
// import CountButton from "./utils/CountButton";
import GenerateTokenForm from "./components/GenerateTokenForm";
import Application from "./components/Application";
import "./App.css";

function App() {
  return (
    <>
      <div>
        {/* generate token  */}
        <GenerateTokenForm /> <br />
        {/* application component */}
        <Application /> <br />
        {/* Commented out for readability purposes */}
        {/* component to send email from HR */}
        {/* <EmailForm /> */}
        {/* component to show a redux example */}
        {/* <CountButton /> */}
      </div>
    </>
  );
}

export default App;
