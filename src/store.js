let data = {
  korisnik: [
    {
      id: 1,
      ime: "Paolo",
      prezime: "Bursic",
      pozicija: "radnik",
    },
    {
      id: 2,
      ime: "Mihaela",
      prezime: "soldat",
      pozicija: "radnik",
    },
    {
      id: 3,
      ime: "John",
      prezime: "Doe",
      pozicija: "manager",
    },
  ],
  izvjestaj: [
    {
      id: 1,
      mjesec: "12.2023.",
      korisnik: {
        id: 3,
        ime: "John",
        prezime: "Doe",
        pozicija: "manager",
      },
      taskovi: [
        {
          id: 1,
          ime: "Login page",
          vrsta: "nova znacajka",
          broj_sati: 20,
          deadline: "21.12.2023",
          stanje: "aktivan",
        },
        {
          id: 2,
          ime: "Main page",
          vrsta: "nova znacajka",
          broj_sati: 25,
          deadline: "2.12.2023",
          stanje: "rijesen",
        },
      ],
    },
    {
      id: 2,
      mjesec: 12,
      korisnik: {
        id: 2,
        ime: "Mihaela",
        prezime: "soldat",
        pozicija: "radnik",
      },
      taskovi: [
        {
          id: 3,
          ime: "Sign up page",
          vrsta: "nova znacajka",
          broj_sati: 10,
          deadline: "16.12.2023",
          stanje: "aktivan",
        },
      ],
    },
  ],
  task: [
    {
      id: 1,
      ime: "Login page",
      vrsta: "nova znacajka",
      ocekivan_broj_sati: 20,
      deadline: "21.12.2023",
      stanje: "aktivan",
      utroseno_sati: 0,
      korisnik: {
        id: 1,
        ime: "Paolo",
        prezime: "Bursic",
        pozicija: "radnik",
      },
    },
    {
      id: 2,
      ime: "Main page",
      vrsta: "nova znacajka",
      ocekivan_broj_sati: 25,
      deadline: "2.12.2023",
      stanje: "zavrsen",
      utroseno_sati: 30,
      korisnik: {
        id: 1,
        ime: "Paolo",
        prezime: "Bursic",
        pozicija: "radnik",
      },
    },
    {
      id: 3,
      ime: "Sign up page",
      vrsta: "nova znacajka",
      ocekivan_broj_sati: 10,
      deadline: "16.12.2023",
      stanje: "zakasnjeli",
      utroseno_sati: 0,
      korisnik: {
        id: 3,
        ime: "John",
        prezime: "Doe",
        pozicija: "manager",
      },
    },
  ],
  projekt: [
    {
      id: 1,
      naziv: "ORGanize",
      taskovi: [
        {
          id: 1,
          ime: "Login page",
          vrsta: "nova znacajka",
          broj_sati: 20,
          deadline: "21.12.2023",
          stanje: "aktivan",
        },
        {
          id: 2,
          ime: "Main page",
          vrsta: "nova znacajka",
          broj_sati: 25,
          deadline: "2.12.2023",
          stanje: "rijesen",
        },
        {
          id: 3,
          ime: "Sign up page",
          vrsta: "nova znacajka",
          broj_sati: 10,
          deadline: "16.12.2023",
          stanje: "zakasnjeli",
        },
      ],
    },
    {
      id: 2,
      naziv: "fipugram",
      taskovi: [],
    },
  ],
};

export default data;
