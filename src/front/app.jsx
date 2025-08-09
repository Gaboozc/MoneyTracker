// src/front/App.jsx
import { DataProvider } from "./Context/DataContext";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";

function App() {
  return (
    <DataProvider>
      <RouterProvider router={router} />
    </DataProvider>
  );
}

export default App;