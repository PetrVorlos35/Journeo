import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
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
          mapHead: "Friends",
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
          tripsOngoing: "Ongoing Trips",
          tripsUpcoming: "Upcoming Trips",
          noActivities: "No specific activities",
          totalCost: "Total Overall Cost",
          budgetChart: "Choose Chart Type:",
          Doughnut: "Doughnut",
          Bar: "Bar",
          Pie: "Pie",
          Radar: "Radar",
          PolarArea: "Polar Area",
          Line: "Line",
          transport: "Transport",
          food: "Food",
          activities: "Activities",
          other: "Other",
          accommodation: "Accommodation",
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
          accomodationCost: "Accommodation Cost",
          savePlan: "Save Plan",
          journeoAbout: "About Journeo",
          journeoAboutDes: "Journeo is your go-to platform for trip planning and itinerary management. Explore, plan, and enjoy hassle-free travels.",
          guickLinks: "Quick Links",
          followUs: "Follow Me",
          allRights: "All rights reserved",
          startAdventure: "Start Your Adventure Today!",
          ctaDes: "Join thousands of travelers who plan their trips with us. Click the button and start exploring!",
          deletedTripSuccess: "Trip successfully deleted!",
          deletedTripError: "Failed to delete the trip!",
          deletedExpenseSuccess: "Expense successfully deleted!",
          amount: "Amount",
          noTripsInCategory: "No trips in this category",
          tripOverview: "Trip Overview",
          saveAsPDF: "Save as PDF",
          stops: "Stops",
          copiedToClipboard: "Link copied to clipboard!",
          noActivity: "No activity",
          noExpenses: "No expenses",
          distance: "Distance",
          drivingTime: "Driving Time",
          openInMaps: "Open in Google Maps",
          getRoute: "Get Route",
          clickToGetRoute: "Click to get route",
          dailyPlan: "Daily Plans",
          summary: "Summary",
          budget: "Budget",
          noActivityPlanned: "No activity planned",
          noLocationOrRoute: "No location or route",
          mapOverview: "Map Overview",
          confetti: "Launch Confetti",
          noTripsFound: "No trips found",
          totalDistance: "Total Distance",
          totalTime: "Total Time",
          averageDistancePerTrip: "Average Distance Per Trip",
          longestTrip: "Longest Route",
          shortestTrip: "Shortest Route",
          totalTrips: "Total Trips",
          loading: "Loading...",
          shareTrip: "Share Trip",
          savedPlanSuccess: "Plan successfully saved!",
          inactive: "You are inactive! Do you want to continue?",
          logoutIn: "Logging out in",
          stayLoggedIn: "Yes, continue",
          AccommodationDescription: "Description of Accommodation",
          remove: "Remove",
          addAccommodation: "Add Accommodation",
          deletedAccommodationSuccess: "Accommodation successfully deleted!",
          dayTitlePlaceholder: "Day Title",
          confirmDeletion: "Are you sure you want to delete this day?",
          deleteDayWarning: "Warning: This will delete all activities and expenses for this day!",
          delete: "Delete",
          addDayStart: "Add first day",
          removeDayStart: "Remove first day",
          addDayEnd: "Add last day",
          removeDayEnd: "Remove last day",
          successTitle: "Successful Registration!",
          instructions: "Before you can log in, you must verify your email. Check your inbox and click the verification link.",
          redirectMessage: "Automatically redirecting to login in 5 seconds...",
          loginButton: "Go to Login",
          exit: "Exit",
          saveAndExit: "Save and Exit",
          confirmExit: "Are you sure you want to exit?",
          exitWarning: "Warning: This will discard all unsaved changes!",
          noDescription: "No description",
          NoDataAvailable: "No data available",
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
          mapHead: "Kamarádi",
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
          tripsOngoing: "Probíhající výlety",
          tripsUpcoming: "Nadcházející výlety",
          noActivities: "Žádné konkrétní aktivity",
          totalCost: "Celková cena",
          budgetChart: "Vyberte typ grafu:",
          Doughnut: "Prstencový graf",
          Bar: "Sloupcový graf",
          Pie: "Koláčový graf",
          Radar: "Radiální graf",
          PolarArea: "Polar graf",
          Line: "Čárový graf",
          transport: "Doprava",
          food: "Jídlo",
          activities: "Aktivity",
          other: "Ostatní",
          accommodation: "Ubytování",
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
          accomodationCost: "Náklady na ubytování",
          savePlan: "Uložit plán",
          journeoAbout: "O aplikaci Journeo",
          journeoAboutDes: "Journeo je vaší platformou pro plánování výletů a správu itinerářů. Prozkoumejte, plánujte a užívejte si bezstarostné cesty.",
          guickLinks: "Rychlé odkazy",
          followUs: "Sleduj mě",
          allRights: "Všechna práva vyhrazena",
          startAdventure: "Začněte své dobrodružství dnes!",
          ctaDes: "Připojte se k tisícům cestovatelů, kteří si plánují své výlety s námi. Klikněte na tlačítko a začněte objevovat!",
          deletedTripSuccess: "Výlet byl úspěšně smazán!",
          deletedTripError: "Nepodařilo se smazat výlet!",
          deletedExpenseSuccess: "Útrata byla úspěšně smazána!",
          amount: "Částka",
          noTripsInCategory: "V této kategorii nejsou žádné výlety",
          tripOverview: "Přehled výletu",
          saveAsPDF: "Uložit jako PDF",
          stops: "Zastávky",
          copiedToClipboard: "Odkaz zkopírován do schránky!",
          noActivity: "Žádná aktivita",
          noExpenses: "Žádné výdaje",
          distance: "Vzdálenost",
          drivingTime: "Doba jízdy",
          openInMaps: "Otevřít v Google Maps",
          getRoute: "Získat trasu",
          clickToGetRoute: "Klikněte pro získání trasy",
          dailyPlan: "Denní plány",
          summary: "Souhrn",
          budget: "Rozpočet",
          noActivityPlanned: "Žádná aktivita naplánována",
          noLocationOrRoute: "Žádná lokace nebo trasa",
          mapOverview: "Přehled mapy",
          confetti: "Spustit konfety",
          noTripsFound: "Nebyly nalezeny žádné výlety",
          totalDistance: "Celková vzdálenost",
          totalTime: "Celkový čas",
          averageDistancePerTrip: "Průměrná vzdálenost na výlet",
          longestTrip: "Nejdelší cesta",
          shortestTrip: "Nejkratší cesta",
          totalTrips: "Celkový počet výletů",
          loading: "Načítání...",
          shareTrip: "Sdílet výlet",
          savedPlanSuccess: "Plán byl úspěšně uložen!",
          inactive: "Jste neaktivní! Chcete pokračovat?",
          logoutIn: "Odhlášení za",
          stayLoggedIn: "Ano, pokračovat",
          AccommodationDescription: "Popis ubytování",
          remove: "Odebrat",
          addAccommodation: "Přidat ubytování",
          deletedAccommodationSuccess: "Ubytování bylo úspěšně smazáno!",
          dayTitlePlaceholder: "Název dne",
          confirmDeletion: "Opravdu chcete smazat tento den?",
          deleteDayWarning: "Varování: Tímto se smažou všechny aktivity a výdaje pro tento den!",
          delete: "Smazat",
          addDayStart: "Přidat první den",
          removeDayStart: "Odebrat první den",
          addDayEnd: "Přidat poslední den",
          removeDayEnd: "Odebrat poslední den",
          successTitle: "Úspěšná registrace!",
          instructions: "Než se můžeš přihlásit, musíš nejprve ověřit svůj e-mail. Podívej se do své schránky a klikni na ověřovací odkaz.",
          redirectMessage: "Automatické přesměrování na přihlášení za 5 sekund...",
          loginButton: "Přejít na přihlášení",
          exit: "Opustit", 
          saveAndExit: "Uložit a opustit", 
          confirmExit: "Opravdu chcete opustit?",
          exitWarning: "Varování: Tímto se zahodí všechny neuložené změny!",  
          noDescription: "Bez popisu",
          NoDataAvailable: "Žádná data k dispozici",
        },
      },
    },
    fallbackLng: 'en', 
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
