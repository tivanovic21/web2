# WEB 2 - LABORATORIJSKE VJEŽBE
Repozitorij za sve laboratorijske vježbe na predmetu `Napredni razvoj programske potpore za web`.

## STRUKTURA DIREKTORIJA
```
web2
│   README.md
│
└───lab1/
│   │   public/
│   │   package.json
│   │   ...
│   │
│   └───src/
│       │   api.ts
│       │   index.ts
│       │   ...
│   
└───lab2/
    │   public/
    │   ...
```

Svaka laboratorijska vježba sadrži svoj podfolder sa nazivom `lab` i brojem vježbe. 
Primjerice tako imamo `lab1`, `lab2`, itd.

U svakom podfolderu nalazi se izvorni kod za određenu laboratorijsku vježbu. 

## POKRETANJE LABORATORIJSKIH VJEŽBI
Da bi pokrenuli neku od vježbi potrebno je pozicionirati se u njen direktorij kako bi on postao root. Primjer komande:

```shell
cd lab1
```

Svaku vježbu bi u praksi trebalo biti moguće pokrenuti sa sljedećim komandama (jednu po jednu):

```shell
npm install
npm install typescript 
npm run build
npm run start
```

No kako je svaka vježba rađena za posluživanje na cloud-u gotovo je sigurno da će biti potrebno napraviti određene preinake kako bi vježba radila ispravno. Dodatno, moguće je da će trebati dodati i vlastiti `.env` file kako bi se podaci ispravno učitavali. Sve ovo biti će posebno naznačeno u potpoglavlju za određenu vježbu, ako se na nju to odnosi. 

`Nakon nekog vremena moguće je da poveznice na cloud više ne rade, odnosno da su projekti ugašeni!`


### POKRETANJE LAB1
~~[Poveznica na aplikaciju u cloud-u](https://web2-1oqm.onrender.com)~~ - aplikacija više nije hostana online

Da bi se aplikaciju pokrenulo lokalno potrebno je napraviti nekoliko izmjena. 

1) zakomentirati liniju za dns: 
```js
// dns.setDefaultResultOrder('ipv4first'); // supabase hosting fix
```

2) Promijeniti hostname u localhost
```js
const hostname = 'localhost';
```

3) Kreirati vlastiti `.env` dokument sa sljedećom strukturom: 

```shell
RENDER_EXTERNAL_URL='localhost'
PORT=3000

DB_USER='...'
DB_PASSWORD='...'
DB_NAME='...'
DB_HOST='...'
DB_PORT=1234
DB_SSL='false'

AUTH_AUDIENCE='...'
AUTH_ISSUER='...'
AUTH_CLIENT_ID='...'
AUTH_CLIENT_SECRET='...'
AUTH0_BASE_URL='...'
```

Nakon toga aplikacija bi se trebala pokrenuti na [[http://localhost:3000](http://localhost:3000)]. 


### POKRETANJE LAB2
[Poveznica na aplikaciju u cloud-u](https://web2-1oqm.onrender.com)

1) Kreirati vlastiti `.env` dokument sa sljedećom strukturom:

```shell
RENDER_EXTERNAL_URL='localhost'
PORT=3000

DB_USER='...'
DB_PASSWORD='...'
DB_NAME='...'
DB_HOST='...'
DB_PORT=...
DB_SSL='false'
```

2) Kreirati tablicu `korisnik` putem sljedeće komande jer aplikacija po defaultu sama dodaje testnog korisnika sa vjerodajnicama `test` | `test`:

```postgresql
CREATE TABLE korisnik (
	id SERIAL PRIMARY KEY,
	username VARCHAR(255) UNIQUE NOT NULL,
	password VARCHAR(255) NOT NULL,
	password_hash VARCHAR(255) NOT NULL,
	contact VARCHAR(255) NULL
)
```

Ostatak procesa provodi se standardno prema prije navedenim uputama oko pokretanja projekta.