import { useCallback, useState } from "react";
import { FaBars, FaGithub, FaPlus, FaSpinner } from "react-icons/fa";
import { Container, Form, List, SubmitButton } from "./styles";

import api from "../../services/api";

export default function Main() {
  const [newRepo, setNewRepo] = useState("");
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      async function submit() {
        setLoading(true);

        try {
          const response = await api.get(`repos/${newRepo}`);

          const data = {
            name: response.data.full_name,
          };

          setRepos([...repos, data]);
          setNewRepo("");
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      }

      submit();

      console.log(repos);
    },
    [newRepo, repos]
  );

  function handleInputChange(e) {
    setNewRepo(e.target.value);
  }

  return (
    <Container>
      <h1>
        <FaGithub size={25} />
        Meus Repositórios
      </h1>

      <Form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Adicionar Respositorios"
          value={newRepo}
          onChange={handleInputChange}
        />
        <SubmitButton loading={loading ? 1 : 0}>
          {loading ? (
            <FaSpinner color="#fff" size={14} />
          ) : (
            <FaPlus color="#fff" size={14} />
          )}
        </SubmitButton>
      </Form>
      <List>
        {repos.map((repo) => (
          <li key={repo.name}>
            <span>{repo.name}</span>
            <a href="">
              <FaBars size={20} />
            </a>
          </li>
        ))}
      </List>
    </Container>
  );
}
