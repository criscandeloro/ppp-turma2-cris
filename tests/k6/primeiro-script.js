import http from 'k6/http';
import { sleep, check, group } from 'k6';

export const options = {
  vus: 1,
  iterations: 1,
  //duration: '1s',
  thresholds: {
    'http_req_duration': ['p(90)<=2000'],
    'http_req_failed': ['rate<0.01']
  }
};

export default function () {
  let responseInstrutorLogin = '';

  group('Fazendo o login', () => {
    responseInstrutorLogin = http.post(
      'http://localhost:3000/instructors/login',
      JSON.stringify({
        email: "cris@teste.com.br",
        password: "123456"
      }),
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  });


  group('Criando a lição', () => {
    let responseLessons = http.post(
      'http://localhost:3000/lessons',
      JSON.stringify({
        title: "Aula Pós Graduação 2025 - Testes de Performance com K6",
        description: "Vou passar esta matéria - Amém"
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${responseInstrutorLogin.json('token')}`
        }
      }
    );


    check(responseLessons, {
      "status deve ser igual a 201": (r) => r.status === 201
    });
  });
  
  group('Simulando o Think Time', () => {
    sleep(1); // User Think Time
  });
}

