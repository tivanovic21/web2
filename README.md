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

Svaka vježba pisana je na način da se pokretanje obavlja instaliranjem `node` paketa te pokretanjem putem komande `start`. Ukoliko neka od vježbi nije napisana na taj način, biti će posebno naznačeno u nastavku uz upute kako pokrenuti tu vježbu. Primjer standardnog načina:

```shell
npm install
npm start
```