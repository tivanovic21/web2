
# Book Explorer
Aplikacija dozvoljava korisnicima da pronađu po 10 knjiga iz nekoliko predodređenih žanrova te ih dodaju u favorite. 

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

