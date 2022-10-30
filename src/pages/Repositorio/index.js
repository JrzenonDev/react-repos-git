import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import {
  BackButton,
  Container,
  IssuesList,
  Loading,
  Owner,
  PageActions,
  StateRepo,
} from "./styles";

export default function Repositorio() {
  const { repositorio } = useParams();

  const [repo, setRepo] = useState({});
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState([
    { state: "all", label: "Todas", active: true },
    { state: "open", label: "Aberta", active: false },
    { state: "closed", label: "Fechada", active: false },
  ]);
  const [filterIndex, setFilterIndex] = useState(0);

  useEffect(() => {
    async function load() {
      const nameRepo = repositorio;

      const [repoData, issuesData] = await Promise.all([
        api.get(`/repos/${nameRepo}`),
        api.get(`/repos/${nameRepo}/issues`, {
          params: {
            state: filters.find((f) => (f.active = filters)).state,
            per_page: 5,
          },
        }),
      ]);

      setRepo(repoData.data);
      setIssues(issuesData.data);
      setLoading(false);
    }

    load();
  }, [repositorio, filters]);

  useEffect(() => {
    async function loadIssue() {
      const nameRepo = repositorio;

      const response = await api.get(`/repos/${nameRepo}/issues`, {
        params: {
          state: filters.find((f) => (f.active = filters)).state,
          page: page,
          per_page: 5,
        },
      });

      setIssues(response.data);
    }

    loadIssue();
  }, [repositorio, page, filterIndex, filters]);

  function handlePage(action) {
    setPage(action === "back" ? page - 1 : page + 1);
  }

  function handleFilter(index) {
    setFilterIndex(index);
  }

  if (loading) {
    return (
      <Loading>
        <h1>Carregando...</h1>
      </Loading>
    );
  }

  return (
    <Container>
      <BackButton to="/">
        <FaArrowLeft color="#000" size={30} />
      </BackButton>

      <Owner>
        <img src={repo.owner.avatar_url} alt={repo.owner.login} />
        <h1>{repo.name}</h1>
        <p>{repo.description}</p>
      </Owner>

      <StateRepo active={filterIndex}>
        <h1>Estado da Issues</h1>
        <div>
          {filters.map((filter, index) => (
            <button
              type="button"
              onClick={() => handleFilter(index)}
              key={filter.label}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </StateRepo>

      <IssuesList>
        {issues.map((issue) => (
          <li key={String(issue.id)}>
            <img src={issue.user.avatar_url} alt={issue.user.login} />

            <div>
              <strong>
                <a href={issue.html_url} target="blank">
                  {issue.title}
                </a>
                {issue.labels.map((label) => (
                  <span key={String(label.id)}>{label.name}</span>
                ))}
              </strong>
              <p>{issue.user.login}</p>
            </div>
          </li>
        ))}
      </IssuesList>

      <PageActions>
        <button
          type="button"
          onClick={() => handlePage("back")}
          disabled={page < 2}
        >
          Voltar
        </button>
        <button type="button" onClick={() => handlePage("next")}>
          Avançar
        </button>
      </PageActions>
    </Container>
  );
}
