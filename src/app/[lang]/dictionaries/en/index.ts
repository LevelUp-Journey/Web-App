import admin from "./admin.json";
import auth from "./auth.json";
import challenges from "./challenges.json";
import community from "./community.json";
import dashboard from "./dashboard.json";
import guides from "./guides.json";
import help from "./help.json";
import landing from "./landing.json";
import leaderboard from "./leaderboard.json";
import legal from "./legal.json";
import profile from "./profile.json";
import shared from "./common.json";
import unauthorized from "./unauthorized.json";

const dictionary = {
    ...shared,
    ...help,
    ...community,
    ...auth,
    ...dashboard,
    ...challenges,
    ...leaderboard,
    ...guides,
    ...admin,
    ...profile,
    ...landing,
    ...legal,
    ...unauthorized,
};

export default dictionary;
