import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector) // Automaticky detekuje jazyk prohlížeče
  .use(initReactI18next) // Integrace s Reactem
  .init({
    resources: {
      en: {
        translation: {
          welcome: "Welcome to Journeo",
          description: "Your personal travel planner",
          login: "Log In",
          register: "Register",
          gotoDash: "Go to Dashboard", 
          planAdventure: "Plan Your Next Adventure",
          planAdventureDes: "With Journeo, you can easily create detailed itineraries, track expenses, and explore new destinations. Whether you're traveling for business or pleasure, Journeo has got you covered.",
          features: "Features",
          itineraryPlan: "Itinerary Planning",
          itineraryPlanDes: "Create and organize your trips with ease.",
          expenseTrack: "Expense Tracking",
          expenseTrackDes: "Keep an eye on your travel budget and spending.",
          map: "Map Integration",
          mapDes: "Visualize your routes and destinations with maps.",
          loginHead: "Log in to your account",
          email: "Email address",
          password: "Password",
          passwordConfirm: "Confirm Password",
          noAccount: "Don't have an account?",
          noAccountLink: "Register here",
          noAccountLinkLogin: "Log in here",
          continueW: "Or continue with",
          registerHead: "Register your account",
          about: "About",
          home: "Home",
          logout: "Logout",
          planTrip: "Plan a Trip",
          trips: "Trips",
          statistics: "Statistics",
          budgetTracking: "Budget Tracking",
          mapHead: "Map",
          accountInfo: "Account Info",
          myTrips: "My Trips",
          newTrip: "Plan a New Trip",
          tripName: "Trip Name",
          tripNameDes: "Enter the name of your trip",
          dateFromTo: "Date from - to",
          createTrip: "Create Trip",
          statsHead: "Travel Statistics",
          statsDistance: "Total distance traveled:",
          statsTime: "Total time spent traveling:",
          hours: "hours",
          construction: "Under construction...",
          tripsPast: "Past Trips",
          tripsOn: "Ongoing Trips",
          tripsUp: "Upcoming Trips",
          noActivities: "No specific activities",
          totalCost: "Total Overall Cost",
          budgetChart: "Choose Chart Type:",
          Doughnut: "Doughnut",
          Bar: "Bar",
          Pie: "Pie",
          Radar: "Radar",
          PolarArea: "Polar Area",
          Line: "Line",
          Transport: "Transport",
          Food: "Food",
          Activities: "Activities",
          Other: "Other",
          Accommodation: "Accommodation",
          accountOver: "Account Overview",
          noPic: "No profile picture",
          firstName: "First Name:",
          lastName: "Last Name:",
          fullName: "Full Name:",
          nickName: "Nickname:",
          noNick: "Nickname not set",
          save: "Save",
          cancel: "Cancel",
          editProfile: "Edit Profile",
          back: "Back",
          day: "Day",
          dailyActivity: "Daily Activity:",
          dailyActivityDes: "Description of Daily Activity...",
          dailyBudget: "Daily Budget:",
          BudgetDescription: "Description",
          addExpense: "Add Expense",
          totalDailyExpense: "Total Daily Expense:",
          option: "Choose an option:",
          location: "Location",
          enterLocation: "Enter location:",
          locationPlaceHolder: "e.g. London, Coventry...",
          route: "Route",
          enterRoute: "Enter route:",
          routePlaceHolderStart: "Starting point",
          routePlaceHolderStops: "Stop",
          routePlaceHolderEnd: "End point",
          previousDay: "Previous Day",
          nextDay: "Next Day",
          calendar: "Calendar",
          totalBudget: "Total Budget",
          accomodationCost: "Accommodation Cost:",
          savePlan: "Save Plan"
        },
      },
      cs: {
        translation: {
          welcome: "Vítejte v aplikaci Journeo",
          description: "Váš osobní plánovač výletů",
          login: "Přihlásit se",
          register: "Registrovat",
          gotoDash: "Přejít na Dashboard",
          planAdventure: "Plánujte své další dobrodružství",
          planAdventureDes: "S Journeo můžete snadno vytvářet podrobné itineráře, sledovat výdaje a objevovat nové destinace. Ať už cestujete z obchodních nebo osobních důvodů, Journeo vám pomůže.",
          features: "Funkce",
          itineraryPlan: "Plánování itineráře",
          itineraryPlanDes: "Vytvářejte a organizujte své výlety s lehkostí.",
          expenseTrack: "Sledování výdajů",
          expenseTrackDes: "Mějte na paměti svůj cestovní rozpočet a výdaje.",
          map: "Integrace map",
          mapDes: "Vizualizujte své trasy a destinace s mapami.",
          loginHead: "Přihlaste se do svého účtu",
          email: "Emailová adresa",
          password: "Heslo",
          passwordConfirm: "Potvrďte heslo",
          noAccount: "Nemáte účet?",
          noAccountLink: "Zaregistrujte se zde",
          noAccountLinkLogin: "Přihlaste se zde",
          continueW: "Nebo pokračujte pomocí",
          registerHead: "Zaregistrujte svůj účet",
          about: "O nás",
          home: "Domů",
          logout: "Odhlásit se",
          planTrip: "Plánování výletu",
          trips: "Výlety",
          statistics: "Statistiky",
          budgetTracking: "Sledování rozpočtu",
          mapHead: "Mapa",
          accountInfo: "Informace o účtu",
          myTrips: "Moje výlety",
          newTrip: "Plánovat nový výlet",
          tripName: "Název výletu",
          tripNameDes: "Zadejte název vašeho výletu",
          dateFromTo: "Datum od - do",
          createTrip: "Vytvořit výlet",
          statsHead: "Cestovní statistiky",
          statsDistance: "Celková ujetá vzdálenost:",
          statsTime: "Celkový čas strávený cestováním:",
          hours: "hodin",
          construction: "Ve výstavbě...",
          tripsPast: "Minulé výlety",
          tripsOn: "Probíhající výlety",
          tripsUp: "Nadcházející výlety",
          noActivities: "Žádné konkrétní aktivity",
          totalCost: "Celková cena",
          budgetChart: "Vyberte typ grafu:",
          Doughnut: "Koláčový graf",
          Bar: "Sloupcový graf",
          Pie: "Koláčový graf",
          Radar: "Radiální graf",
          PolarArea: "Polar graf",
          Line: "Čárový graf",
          Transport: "Doprava",
          Food: "Jídlo",
          Activities: "Aktivity",
          Other: "Ostatní",
          Accommodation: "Ubytování",
          accountOver: "Přehled účtu",
          noPic: "Žádný profilový obrázek",
          firstName: "Jméno:",
          lastName: "Příjmení:",
          fullName: "Celé jméno:",
          nickName: "Přezdívka:",
          noNick: "Přezdívka nenastavena",
          save: "Uložit",
          cancel: "Zrušit",
          editProfile: "Upravit profil",
          back: "Zpět",
          day: "Den",
          dailyActivity: "Denní aktivita:",
          dailyActivityDes: "Popis Denní aktivity...",
          dailyBudget: "Denní rozpočet:",
          BudgetDescription: "Popis",
          addExpense: "Přidat útratu",
          totalDailyExpense: "Celkový denní rozpočet:",
          option: "Zvolte možnost:",
          location: "Lokace",
          enterLocation: "Zadejte lokaci:",
          locationPlaceHolder: "Např. Praha, Český Krumlov...",
          route: "Trasa",
          enterRoute: "Zadejte trasu:",
          routePlaceHolderStart: "Startovní bod",
          routePlaceHolderStops: "Zastávka",
          routePlaceHolderEnd: "Cílový bod",
          previousDay: "Předchozí den",
          nextDay: "Další den",
          calendar: "Kalendář",
          totalBudget: "Celkový rozpočet",
          accomodationCost: "Náklady na ubytování:",
          savePlan: "Uložit plán"
        },
      },
    },
    fallbackLng: 'en', // Jazyk, na který přepne, pokud aktuální není dostupný
    interpolation: {
      escapeValue: false, // React už escapuje texty
    },
  });

export default i18n;
