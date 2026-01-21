# Book Explorer
Aplikacija dozvoljava korisnicima da pronađu po 10 knjiga iz nekoliko predodređenih žanrova te ih dodaju u favorite. 

## Pokretanje aplikacije

Iako sam ja radio aplikaciju koristeći `bun`, aplikacija bi se trebala najnormalnije pokrenuti i sa `npm` komandama. Samo treba pripaziti da se nalazite u `web2/lab5/lab-5/` direktoriju. 

```console
npm install
npm run dev
```

Ukoliko npm slučajno ne radi, bun se može preuzeti preko njihove [https://bun.com](web stranice). Komande za pokretanje su iste kao kod npm-a, samo se koristi ključna riječ bun.

```console
bun install
bun run dev
```

Ovo sve uzima u obzir `dev` način rada, na cloud-u aplikacija je pokrenuta u produkcijskoj okolini te se nalazi na sljedećoj [https://web2-vue-3lyo.onrender.com](poveznici).

## Zahtjevi aplikacije

Sve je implementirano. 

- [x] interpolation/one-way binding -> src/components/Card.vue
- [x] two-way binding -> src/views/SubjectView.vue
- [x] methods -> src/components/Card.vue
- [x] computed properties -> src/views/SubjectView.vue
- [x] barem jedan scoped style -> src/components/Card.vue
- [x] koristiti barem jedan lifecycle hook -> src/views/SubjectView.vue
- [x] routing (više stranica) -> src/router/index.js
- [x] aplikacija mora biti bookmarkable, tako da rade linkovi (ne samo na root, već i moj-web.com/stranica1, moj-web.com/stranica2) -> src/router/index.js
- [x] dinamičko usmjeravanje s 404 stranicom ("catch all") -> src/router/index.js & src/views/NotFound.vue
- [x] (barem) dvije komponente -> src/components/Card.vue & Grid.vue
- [x] komponenta bez stanja, koristiti properties -> src/components/Card.vue
- [x] komponenta sa stanjem -> src/components/Grid.vue
- [x] barem jedna komponenta mora emitirati barem jedan event -> src/components/Card.vue emitira event koji src/views/SubjectView.vue konzumira
- [x] store (Pinia) -> src/stores/favorites.js
- [x] asinkroni dohvat podataka s backenda, možete: koristiti Firebase ili Back4App, Mocky, itd. vlastiti storage, ili možete mock napraviti, držati podatke u memoriji, ali mora biti asinkroni poziv/upis ostvariti asinkrono -> src/views/SubjectView.vue (logika dohvata u src/hooks/useSubjectBooks.js)
- [x] (lazy, po potrebi) učitavanje nekog dijela aplikacije (stranice ili komponente) -> src/router/index.js (FavoritesView)

