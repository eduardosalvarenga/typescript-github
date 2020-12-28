import {
  Navbar,
  Form,
  FormControl,
  Button,
  Card,
  ListGroup,
  ListGroupItem,
  Collapse,
  Table,
} from "react-bootstrap";
import api from "../../services/api";
import React, { useState } from "react";
import "./Search.css";
import moment from "moment";

interface UsuarioGit {
  login: string;
  email: string;
  company: string;
  avatar_url: string;
  url: string;
  html_url: string;
  bio: string;
  followers: number;
  following: number;
}

interface ReposGit {
  id: number;
  name: string;
  description: string;
  html_url: string;
  created_at: Date;
  updated_at: Date;
}

export default function NavBar() {
  const [usuario, setUsuario] = useState<string>("");
  const [usuarioGit, setUsuarioGit] = useState<UsuarioGit>();
  const [reposGit, setReposGit] = useState<ReposGit[]>([]);
  const [openRepos, setOpenRepos] = useState(false);

  //Pesquisar usuário
  async function searchUsers(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();
    await api
      .get(`${usuario}`)
      .then((usuarioList) => {
        setUsuarioGit(usuarioList.data);
        console.log(usuarioList.data);
        console.log(usuarioGit);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  //Pesquisar Repos
  async function searchRepos() {
    await api
      .get(`${usuario}/repos`)
      .then((reposList) => {
        setReposGit(reposList.data);
        console.log(reposGit);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  //Formatar a Data das APIs
  function formateDate(date: Date){
    return moment(date).format("DD/MM/YYYY")
  }

  return (
    <>
      <Navbar bg="dark" variant="dark" className="justify-content-between">
        <Navbar.Brand>Pesquisa Usuário Github</Navbar.Brand>
        <Form inline></Form>
        <Form inline>
          <FormControl
            type="text"
            placeholder="Usuário Github"
            className=" mr-sm-2"
            onChange={(event) => {
              setUsuario(event.target.value);
            }}
          />
          <Button variant="light" type="submit" onClick={searchUsers}>
            Pesquisar
          </Button>
        </Form>
      </Navbar>

      <div className="card">
        <Card border="dark" style={{ width: "18rem" }}>
          <Card.Img variant="top" src={usuarioGit?.avatar_url} />
          <Card.Body>
            <Card.Title>
              <a href={usuarioGit?.html_url} target="_blank" rel="noreferrer">
                {usuarioGit?.login}
              </a>
            </Card.Title>
            <Card.Text>{usuarioGit?.bio}</Card.Text>
          </Card.Body>
          <ListGroup className="list-group-flush">
            <ListGroupItem>Followers: {usuarioGit?.followers}</ListGroupItem>
            <ListGroupItem>Following: {usuarioGit?.following}</ListGroupItem>
          </ListGroup>
          <Card.Body>
            <Button
              variant="dark"
              type="submit"
              onClick={() => {
                searchRepos();
                setOpenRepos(!openRepos);
              }}
              aria-controls="collapse-repos"
              aria-expanded={openRepos}
            >
              Repos
            </Button>{" "}
          </Card.Body>
        </Card>
      </div>

      <div className="table-repos">
        <Collapse in={openRepos}>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>#</th>
                <th>Repositório</th>
                <th>Descrição</th>
                <th>Criado em</th>
                <th>Atualizado em</th>
              </tr>
            </thead>
            <tbody>
              {reposGit.map((repoList) => (
                <tr key={repoList.id}>
                  <td>{repoList.id}</td>
                  <td><a href={repoList.html_url}>{repoList.name}</a></td>
                  <td>
                    { repoList.description == null ? "O repositório não possui descrição" : repoList.description }
                    </td>
                  <td>{formateDate(repoList.created_at)}</td>
                  <td>{formateDate(repoList.updated_at)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Collapse>
      </div>
    </>
  );
}
