import { useNavigate } from "react-router-dom";
import PracticeEditPage from "./PracticeEditPage.jsx";

// Página para crear una nueva práctica reutilizando el editor modular
const PracticeCreatePage = () => {
  const navigate = useNavigate();
  // No se pasa initialPractice, así que PracticeEditPage arranca vacío
  return (
    <PracticeEditPage
      initialPractice={null}
      onClose={() => navigate("/admin")}
    />
  );
};

export default PracticeCreatePage;
