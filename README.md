# CallAgent Backend (Next.js + Vapi)

Prosty backend, który bezpiecznie woła Vapi API po stronie serwera — omija problem CORS,
który blokował bezpośrednie wywołania z przeglądarki.

## Struktura

```
vapi-backend/
├── pages/
│   └── index.js          ← prosty formularz do testowania
├── api/
│   ├── call.js            ← POST /api/call { phoneNumber } → dzwoni przez Vapi
│   └── call-status.js     ← GET /api/call-status?callId=xxx → sprawdza status
├── package.json
└── README.md
```

## Jak wdrożyć na Vercel (z telefonu, bez komputera)

### Krok 1 — Wrzuć kod na GitHub
1. Załóż konto na **github.com** (jeśli nie masz)
2. Stwórz nowe repozytorium, np. `call-agent-backend`
3. Wgraj te pliki (przez przeglądarkę: "Add file" → "Upload files")

### Krok 2 — Połącz z Vercel
1. Wejdź na **vercel.com** → zaloguj się przez GitHub
2. "Add New Project" → wybierz swoje repozytorium
3. Kliknij **Deploy** (Vercel sam wykryje że to Next.js)

### Krok 3 — Dodaj zmienne środowiskowe (Twoje sekrety Vapi)
W Vercel: **Project → Settings → Environment Variables**, dodaj:

| Klucz | Wartość |
|---|---|
| `VAPI_PRIVATE_KEY` | Twój prywatny klucz z dashboard.vapi.ai/keys |
| `VAPI_ASSISTANT_ID` | ID Twojego asystenta (z zakładki Assistants w Vapi) |
| `VAPI_PHONE_NUMBER_ID` | ID Twojego numeru telefonu (z zakładki Phone Numbers) |

Po dodaniu zmiennych kliknij **"Redeploy"**, żeby się zastosowały.

### Krok 4 — Gotowe!
Twój backend będzie dostępny pod adresem typu:
```
https://call-agent-backend.vercel.app
```

Wejdź na tę stronę z telefonu — zobaczysz prosty formularz. Wpisz numer i kliknij "Zadzwoń" — agent zadzwoni naprawdę! 🎉

## Jak podłączyć do apki z Claude (opcjonalnie)

W aplikacji React, zamiast wołać `api.vapi.ai` bezpośrednio, wołaj swój backend:

```javascript
const res = await fetch("https://call-agent-backend.vercel.app/api/call", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ phoneNumber: "+48601234567" }),
});
const data = await res.json();
```

To zadziała bez CORS, bo Twój backend sam ustawia odpowiednie nagłówki i wykonuje żądanie do Vapi po stronie serwera.
