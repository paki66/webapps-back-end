let data = {
    korisnik: {
        data: [
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
    },
    mjesecni_izvjestaj: 
    { 
        data: [
            {
                id: 1,
                mjesec: "12.2023.",
                korisnik:
                {
                    id: 3,
                    ime: "John",
                    prezime: "Doe",
                    pozicija: "manager",
                },
                taskovi: 
                [
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
                korisnik:
                {
                    id: 2,
                    ime: "Mihaela",
                    prezime: "soldat",
                    pozicija: "radnik",
                },
                taskovi: 
                [
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
    },
    task: {
        data: [
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
    projekt: {
        data: [
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
                id:2,
                naziv: "fipugram",
                taskovi: [],
            },
        ],
    },
    pretragaIspita: {
        data: {
            datum: '01-05-2020',
            kolegij: {
                sifra: 'wapps',
                naziv: 'Web aplikacije',
                semestar: '3-ljetni',
            },
            ocjene: [
                {
                    ocjena: 4,
                    student: {
                        jmbag: '003512341234',
                        ime: 'Nikola',
                        prezime: 'Tanković',
                    },
                },
            ],
        },
    },
    ocjenaStudenta: {
        data: {
            datum: '01-05-2020',
            kolegij: {
                sifra: 'wapps',
                naziv: 'Web aplikacije',
                semestar: '3-ljetni',
            },
            ocjena: 4,
            student: {
                jmbag: '003512341234',
                ime: 'Nikola',
                prezime: 'Tanković',
            },
        },
    },
};

export default data;